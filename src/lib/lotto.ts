import type { GenerateMode } from "@/components/ModeSelector";

// Simulated "hot" numbers (frequently drawn)
const HOT_NUMBERS = [3, 7, 12, 17, 21, 27, 33, 34, 38, 40, 43, 45];
// Simulated "cold" numbers (rarely drawn)
const COLD_NUMBERS = [1, 5, 9, 13, 19, 22, 28, 31, 36, 39, 41, 44];

function parseNumbers(input: string): number[] {
  return input
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 45);
}

export function generateNumbers(
  mode: GenerateMode,
  includeStr: string,
  excludeStr: string
): number[] {
  const include = parseNumbers(includeStr);
  const exclude = new Set(parseNumbers(excludeStr));

  let pool: number[];

  if (mode === "hot") {
    pool = HOT_NUMBERS.filter((n) => !exclude.has(n));
  } else if (mode === "cold") {
    pool = COLD_NUMBERS.filter((n) => !exclude.has(n));
  } else {
    pool = Array.from({ length: 45 }, (_, i) => i + 1).filter(
      (n) => !exclude.has(n)
    );
  }

  const result = new Set<number>(include.filter((n) => !exclude.has(n)));

  // Fill remaining from pool
  const shuffled = pool.sort(() => Math.random() - 0.5);
  for (const n of shuffled) {
    if (result.size >= 6) break;
    result.add(n);
  }

  // If still not enough, fill from all available
  if (result.size < 6) {
    const all = Array.from({ length: 45 }, (_, i) => i + 1)
      .filter((n) => !exclude.has(n) && !result.has(n))
      .sort(() => Math.random() - 0.5);
    for (const n of all) {
      if (result.size >= 6) break;
      result.add(n);
    }
  }

  return Array.from(result).slice(0, 6).sort((a, b) => a - b);
}
