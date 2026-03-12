import type { GenerateMode } from "@/components/ModeSelector";
import winningData from "@/data/winning_numbers.json";

type FrequencyEntry = { number: number; count: number };

export type LottoErrorCode =
  | "TOO_MANY_INCLUDED_NUMBERS"
  | "OVERLAPPING_INCLUDE_EXCLUDE"
  | "TOO_FEW_AVAILABLE_NUMBERS"
  | "INSUFFICIENT_MODE_POOL"
  | "HISTORICAL_WINNING_COMBINATION"
  | "NO_VALID_COMBINATION_FOUND";

type LottoErrorDetails = {
  mode?: Exclude<GenerateMode, "random">;
  overlappingNumbers?: number[];
};

export class LottoError extends Error {
  readonly name = "LottoError";

  constructor(
    readonly code: LottoErrorCode,
    readonly details: LottoErrorDetails = {}
  ) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const ALL_NUMBERS = Array.from({ length: 45 }, (_, index) => index + 1);
const MODE_POOL_SIZE = 20;
const MAX_GENERATION_ATTEMPTS = 250;

export function calculateFrequencies(data: string[]): FrequencyEntry[] {
  const counts: Record<number, number> = {};
  for (const number of ALL_NUMBERS) {
    counts[number] = 0;
  }

  for (const combo of data) {
    const numbers = combo.split(",").map(Number);
    for (const number of numbers) {
      if (counts[number] !== undefined) {
        counts[number]++;
      }
    }
  }

  return Object.entries(counts)
    .map(([number, count]) => ({ number: Number(number), count }))
    .sort((left, right) => right.count - left.count);
}

const frequencyTable = calculateFrequencies(winningData);
const winningSet = new Set(winningData);

export function parseNumbers(input: string): number[] {
  return input
    .split(/[, ]+/)
    .map((value) => parseInt(value.trim(), 10))
    .filter((value) => !Number.isNaN(value) && value >= 1 && value <= 45);
}

function shuffleNumbers(numbers: number[]): number[] {
  const shuffled = [...numbers];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function getAvailableNumbers(exclude: Set<number>): number[] {
  return ALL_NUMBERS.filter((number) => !exclude.has(number));
}

function getModePool(mode: GenerateMode, exclude: Set<number>): number[] {
  if (mode === "hot") {
    return frequencyTable
      .slice(0, MODE_POOL_SIZE)
      .map((entry) => entry.number)
      .filter((number) => !exclude.has(number));
  }

  if (mode === "cold") {
    return frequencyTable
      .slice(-MODE_POOL_SIZE)
      .map((entry) => entry.number)
      .filter((number) => !exclude.has(number));
  }

  return getAvailableNumbers(exclude);
}

function getModeLabel(mode: Exclude<GenerateMode, "random">): string {
  return mode === "hot" ? "핫번호" : "콜드번호";
}

export function getLottoErrorMessage(error: unknown): string {
  if (!(error instanceof LottoError)) {
    return error instanceof Error
      ? error.message
      : "번호를 만드는 중 문제가 생겼어요. 다시 시도해 주세요.";
  }

  switch (error.code) {
    case "TOO_MANY_INCLUDED_NUMBERS":
      return "포함 번호는 최대 6개까지 입력할 수 있어요.";
    case "OVERLAPPING_INCLUDE_EXCLUDE":
      return `같은 번호를 포함/제외에 동시에 넣을 수 없어요: ${error.details.overlappingNumbers?.join(", ")}`;
    case "TOO_FEW_AVAILABLE_NUMBERS":
      return "선택 가능한 번호가 6개 미만이에요. 제외 번호를 줄여주세요.";
    case "INSUFFICIENT_MODE_POOL":
      return `${getModeLabel(
        error.details.mode ?? "hot"
      )} 모드에서 선택 가능한 번호가 부족해요. 제외 번호를 줄이거나 랜덤 모드를 사용해 주세요.`;
    case "HISTORICAL_WINNING_COMBINATION":
      return "포함 번호 조합이 과거 당첨번호와 같아요. 다른 번호를 선택해 주세요.";
    case "NO_VALID_COMBINATION_FOUND":
      return "조건에 맞는 새 번호 조합을 찾지 못했어요. 포함/제외 조건을 조금 완화해 주세요.";
    default:
      return "번호를 만드는 중 문제가 생겼어요. 다시 시도해 주세요.";
  }
}

export function generateNumbers(
  mode: GenerateMode,
  includeStr: string,
  excludeStr: string
): number[] {
  const include = [...new Set(parseNumbers(includeStr))];
  const exclude = new Set(parseNumbers(excludeStr));
  const overlappingNumbers = include.filter((number) => exclude.has(number));

  if (include.length > 6) {
    throw new LottoError("TOO_MANY_INCLUDED_NUMBERS");
  }

  if (overlappingNumbers.length > 0) {
    throw new LottoError("OVERLAPPING_INCLUDE_EXCLUDE", {
      overlappingNumbers,
    });
  }

  const availableNumbers = getAvailableNumbers(exclude);
  if (availableNumbers.length < 6) {
    throw new LottoError("TOO_FEW_AVAILABLE_NUMBERS");
  }

  const lockedNumbers = new Set(include);
  const remainingSlots = 6 - lockedNumbers.size;
  const pool = getModePool(mode, exclude);

  if (
    mode !== "random" &&
    pool.filter((number) => !lockedNumbers.has(number)).length < remainingSlots
  ) {
    throw new LottoError("INSUFFICIENT_MODE_POOL", { mode });
  }

  if (lockedNumbers.size === 6) {
    const result = [...lockedNumbers].sort((left, right) => left - right);
    if (winningSet.has(result.join(","))) {
      throw new LottoError("HISTORICAL_WINNING_COMBINATION");
    }

    return result;
  }

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const selected = new Set(lockedNumbers);

    for (const number of shuffleNumbers(pool)) {
      if (selected.size >= 6) {
        break;
      }

      selected.add(number);
    }

    if (selected.size < 6) {
      continue;
    }

    const result = [...selected].sort((left, right) => left - right);
    if (!winningSet.has(result.join(","))) {
      return result;
    }
  }

  throw new LottoError("NO_VALID_COMBINATION_FOUND");
}
