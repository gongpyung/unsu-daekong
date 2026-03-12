import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { generateNumbers } from "@/lib/lotto";

import Index from "./Index";

vi.mock("@/lib/lotto", async () => {
  const actual = await vi.importActual<typeof import("@/lib/lotto")>(
    "@/lib/lotto"
  );

  return {
    ...actual,
    generateNumbers: vi.fn(),
  };
});

const mockedGenerateNumbers = vi.mocked(generateNumbers);
const STORAGE_KEY = "lotto-history";
const ANIMATION_STORAGE_KEY = "useAnimation";

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    clear: () => {
      store.clear();
    },
    getItem: (key: string) => store.get(key) ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

function resetPageStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ANIMATION_STORAGE_KEY);
}

describe("Index", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const localStorageMock = createLocalStorageMock();
    vi.stubGlobal("localStorage", localStorageMock);
    resetPageStorage();
    mockedGenerateNumbers.mockReset();
    mockedGenerateNumbers.mockReturnValue([1, 2, 3, 4, 5, 6]);
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    resetPageStorage();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps a pending history removal when number generation starts", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "history-entry-1",
          numbers: [3, 7, 12, 18, 29, 41],
          mode: "random",
          timestamp: new Date("2026-03-12T11:00:00Z").getTime(),
        },
      ])
    );

    render(<Index />);

    fireEvent.click(screen.getByRole("button", { name: /기록 삭제/ }));

    act(() => {
      vi.advanceTimersByTime(150);
    });

    fireEvent.click(screen.getByRole("button", { name: /번호 뽑기/ }));

    act(() => {
      vi.advanceTimersByTime(149);
    });
    expect(screen.getByText("📋 최근 기록")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText("📋 최근 기록")).not.toBeInTheDocument();
  });

  it("keeps the generate button centered between the results panel and settings", () => {
    render(<Index />);

    const helperText = screen.getByText("버튼을 눌러 번호를 뽑아보세요! 🍀");
    const resultsPanel = helperText.parentElement;
    const resultsSection = resultsPanel?.parentElement;
    const generateButton = screen.getByRole("button", { name: /번호 뽑기/ });
    const buttonSection = generateButton.parentElement;
    const settingsTrigger = screen.getByRole("button", { name: /고급 설정/ });
    const settingsSection = buttonSection?.nextElementSibling;

    expect(resultsPanel).toHaveClass("rounded-3xl");
    expect(resultsSection).toHaveClass("mb-6");
    expect(resultsSection?.nextElementSibling).toBe(buttonSection);
    expect(buttonSection).toHaveClass("mb-6", "flex", "justify-center");
    expect(settingsSection).toContainElement(settingsTrigger);
  });
});
