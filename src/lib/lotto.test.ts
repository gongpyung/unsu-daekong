import { describe, expect, it } from "vitest";

import winningData from "@/data/winning_numbers.json";

import {
  calculateFrequencies,
  generateNumbers,
  getLottoErrorMessage,
  LottoError,
  type LottoErrorCode,
  parseNumbers,
} from "./lotto";

function expectLottoError(
  action: () => unknown,
  code: LottoErrorCode
): LottoError {
  try {
    action();
  } catch (error) {
    expect(error).toBeInstanceOf(LottoError);
    expect((error as LottoError).code).toBe(code);
    return error as LottoError;
  }

  throw new Error(`Expected LottoError with code ${code}`);
}

describe("parseNumbers", () => {
  it("parses comma-separated numbers", () => {
    expect(parseNumbers("7, 14, 21")).toEqual([7, 14, 21]);
  });

  it("parses space-separated numbers", () => {
    expect(parseNumbers("7 14 21")).toEqual([7, 14, 21]);
  });

  it("parses mixed separators", () => {
    expect(parseNumbers("7, 14 21")).toEqual([7, 14, 21]);
  });

  it("handles multiple delimiters", () => {
    expect(parseNumbers("7,,14,,21")).toEqual([7, 14, 21]);
  });

  it("returns empty array for empty input", () => {
    expect(parseNumbers("")).toEqual([]);
  });

  it("filters invalid numbers", () => {
    expect(parseNumbers("abc")).toEqual([]);
  });

  it("filters out-of-range numbers", () => {
    expect(parseNumbers("0, 46")).toEqual([]);
  });

  it("accepts boundary values", () => {
    expect(parseNumbers("1, 45")).toEqual([1, 45]);
  });
});

describe("calculateFrequencies", () => {
  it("calculates correct frequencies", () => {
    const data = ["1,2,3,4,5,6", "1,2,3,7,8,9"];
    const result = calculateFrequencies(data);
    const numberOne = result.find((entry) => entry.number === 1);
    const numberSeven = result.find((entry) => entry.number === 7);

    expect(numberOne?.count).toBe(2);
    expect(numberSeven?.count).toBe(1);
  });

  it("returns results sorted by frequency descending", () => {
    const data = ["1,2,3,4,5,6", "1,2,3,7,8,9", "1,10,11,12,13,14"];
    const result = calculateFrequencies(data);

    expect(result[0].number).toBe(1);
    expect(result[0].count).toBe(3);

    for (let index = 1; index < result.length; index++) {
      expect(result[index].count).toBeLessThanOrEqual(result[index - 1].count);
    }
  });

  it("handles empty input", () => {
    const result = calculateFrequencies([]);
    expect(result).toHaveLength(45);
    expect(result.every((entry) => entry.count === 0)).toBe(true);
  });
});

describe("generateNumbers", () => {
  const frequencyTable = calculateFrequencies(winningData);
  const hotPool = new Set(frequencyTable.slice(0, 20).map((entry) => entry.number));
  const coldPool = new Set(
    frequencyTable.slice(-20).map((entry) => entry.number)
  );

  it("returns 6 sorted numbers in range 1-45", () => {
    const result = generateNumbers("random", "", "");

    expect(result).toHaveLength(6);
    expect(new Set(result).size).toBe(6);
    expect(result.every((number) => number >= 1 && number <= 45)).toBe(true);

    for (let index = 1; index < result.length; index++) {
      expect(result[index]).toBeGreaterThanOrEqual(result[index - 1]);
    }
  });

  it("includes specified numbers", () => {
    const result = generateNumbers("random", "7, 14", "");
    expect(result).toContain(7);
    expect(result).toContain(14);
  });

  it("excludes specified numbers", () => {
    const result = generateNumbers("random", "", "7, 14");
    expect(result).not.toContain(7);
    expect(result).not.toContain(14);
  });

  it("keeps hot mode numbers inside the hot pool", () => {
    const result = generateNumbers("hot", "", "");
    expect(result).toHaveLength(6);
    expect(result.every((number) => hotPool.has(number))).toBe(true);
  });

  it("keeps cold mode numbers inside the cold pool", () => {
    const result = generateNumbers("cold", "", "");
    expect(result).toHaveLength(6);
    expect(result.every((number) => coldPool.has(number))).toBe(true);
  });

  it("throws a coded error when more than 6 include numbers are provided", () => {
    const error = expectLottoError(
      () => generateNumbers("random", "1,2,3,4,5,6,7", ""),
      "TOO_MANY_INCLUDED_NUMBERS"
    );

    expect(getLottoErrorMessage(error)).toMatch(/최대 6개/);
  });

  it("throws a coded error when include and exclude overlap", () => {
    const error = expectLottoError(
      () => generateNumbers("random", "7, 14", "14"),
      "OVERLAPPING_INCLUDE_EXCLUDE"
    );

    expect(error.details.overlappingNumbers).toEqual([14]);
    expect(getLottoErrorMessage(error)).toMatch(/동시에 넣을 수 없어요: 14/);
  });

  it("throws a coded error when fewer than 6 numbers remain", () => {
    const exclude = Array.from({ length: 40 }, (_, index) => index + 1).join(",");

    const error = expectLottoError(
      () => generateNumbers("random", "", exclude),
      "TOO_FEW_AVAILABLE_NUMBERS"
    );

    expect(getLottoErrorMessage(error)).toMatch(/6개 미만/);
  });

  it("throws a coded error when include numbers match a historical winning combo", () => {
    const error = expectLottoError(
      () => generateNumbers("random", winningData[0], ""),
      "HISTORICAL_WINNING_COMBINATION"
    );

    expect(getLottoErrorMessage(error)).toMatch(/과거 당첨번호/);
  });

  it("throws a coded error when hot mode pool is exhausted by exclusions", () => {
    const excludedHotNumbers = [...hotPool].slice(0, 18).join(",");

    const error = expectLottoError(
      () => generateNumbers("hot", "", excludedHotNumbers),
      "INSUFFICIENT_MODE_POOL"
    );

    expect(error.details.mode).toBe("hot");
    expect(getLottoErrorMessage(error)).toMatch(/핫번호/);
  });

  it("throws a coded error when only a historical winning combination remains", () => {
    const winningCombination = winningData[0].split(",").map(Number);
    const include = winningCombination.slice(0, 5).join(",");
    const exclude = Array.from({ length: 45 }, (_, index) => index + 1)
      .filter((number) => !winningCombination.includes(number))
      .join(",");

    const error = expectLottoError(
      () => generateNumbers("random", include, exclude),
      "NO_VALID_COMBINATION_FOUND"
    );

    expect(getLottoErrorMessage(error)).toMatch(/조건에 맞는 새 번호 조합/);
  });
});

describe("getLottoErrorMessage", () => {
  it("returns a fallback message for unknown errors", () => {
    expect(getLottoErrorMessage("bad")).toBe(
      "번호를 만드는 중 문제가 생겼어요. 다시 시도해 주세요."
    );
  });

  it("passes through generic Error messages", () => {
    expect(getLottoErrorMessage(new Error("plain failure"))).toBe(
      "plain failure"
    );
  });
});
