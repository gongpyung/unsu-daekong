import { useCallback, useEffect, useRef, useState } from "react";

import AdvancedSettings from "@/components/AdvancedSettings";
import AnimationToggle from "@/components/AnimationToggle";
import FloatingParticles from "@/components/FloatingParticles";
import GenerateButton from "@/components/GenerateButton";
import HistoryCard, { type HistoryEntry } from "@/components/HistoryCard";
import HistoryClearButton from "@/components/HistoryClearButton";
import LottoBall from "@/components/LottoBall";
import ModeSelector, { type GenerateMode } from "@/components/ModeSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { generateNumbers, getLottoErrorMessage } from "@/lib/lotto";

const STORAGE_KEY = "lotto-history";
const ANIMATION_STORAGE_KEY = "useAnimation";

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getStoredAnimationPreference() {
  if (typeof window === "undefined") {
    return true;
  }

  return localStorage.getItem(ANIMATION_STORAGE_KEY) !== "false";
}

const Index = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [mode, setMode] = useState<GenerateMode>("random");
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState("");
  const [excludeNumbers, setExcludeNumbers] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [useAnimation, setUseAnimation] = useState(getStoredAnimationPreference);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedWithAnimation, setGeneratedWithAnimation] = useState(false);

  const ballRefs = useRef<(HTMLDivElement | null)[]>([]);
  const generationIntervalsRef = useRef<number[]>([]);
  const generationTimeoutsRef = useRef<number[]>([]);
  const historyRemovalTimeoutsRef = useRef<number[]>([]);

  const animationsEnabled = useAnimation && !prefersReducedMotion;

  const resetGenerationTimers = useCallback(() => {
    generationIntervalsRef.current.forEach((intervalId) =>
      window.clearInterval(intervalId)
    );
    generationTimeoutsRef.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId)
    );
    generationIntervalsRef.current = [];
    generationTimeoutsRef.current = [];
  }, []);

  const resetHistoryRemovalTimers = useCallback(() => {
    historyRemovalTimeoutsRef.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId)
    );
    historyRemovalTimeoutsRef.current = [];
  }, []);

  const appendHistoryEntry = useCallback(
    (result: number[]) => {
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        numbers: result,
        mode,
        timestamp: Date.now(),
      };

      setHistory((previous) => {
        const updated = [entry, ...previous].slice(0, 20);
        saveHistory(updated);
        return updated;
      });
    },
    [mode]
  );

  const handleGenerationError = useCallback(
    (error: unknown) => {
      resetGenerationTimers();
      setNumbers([]);
      setIsGenerating(false);
      setGenerationError(getLottoErrorMessage(error));
    },
    [resetGenerationTimers]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(ANIMATION_STORAGE_KEY, String(useAnimation));
  }, [useAnimation]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (matches: boolean) => setPrefersReducedMotion(matches);

    updatePreference(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      updatePreference(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      resetGenerationTimers();
      resetHistoryRemovalTimers();
    };
  }, [resetGenerationTimers, resetHistoryRemovalTimers]);

  useEffect(() => {
    setGenerationError(null);
  }, [mode, includeNumbers, excludeNumbers]);

  const handleGenerate = useCallback(() => {
    setGenerationError(null);
    setIsGenerating(true);
    setAnimKey((key) => key + 1);
    setGeneratedWithAnimation(animationsEnabled);
    resetGenerationTimers();

    if (animationsEnabled) {
      try {
        const result = generateNumbers(mode, includeNumbers, excludeNumbers);
        setNumbers(result);

        result.forEach((finalNumber, index) => {
          const intervalId = window.setInterval(() => {
            const ref = ballRefs.current[index];
            if (ref) {
              ref.textContent = String(Math.floor(Math.random() * 45) + 1);
            }
          }, 50);
          generationIntervalsRef.current.push(intervalId);

          const timeoutId = window.setTimeout(() => {
            window.clearInterval(intervalId);
            const ref = ballRefs.current[index];
            if (ref) {
              ref.textContent = String(finalNumber);
            }

            if (index === result.length - 1) {
              setIsGenerating(false);
              appendHistoryEntry(result);
            }
          }, 600 + index * 400);
          generationTimeoutsRef.current.push(timeoutId);
        });
      } catch (error) {
        handleGenerationError(error);
      }

      return;
    }

    setNumbers([]);
    const timeoutId = window.setTimeout(() => {
      try {
        const result = generateNumbers(mode, includeNumbers, excludeNumbers);
        setNumbers(result);
        setIsGenerating(false);
        appendHistoryEntry(result);
      } catch (error) {
        handleGenerationError(error);
      }
    }, 100);

    generationTimeoutsRef.current.push(timeoutId);
  }, [
    animationsEnabled,
    appendHistoryEntry,
    excludeNumbers,
    handleGenerationError,
    includeNumbers,
    mode,
    resetGenerationTimers,
  ]);

  const handleDeleteHistory = useCallback(
    (id: string) => {
      setRemovingId(id);
      const timeoutId = window.setTimeout(() => {
        setHistory((previous) => {
          const updated = previous.filter((entry) => entry.id !== id);
          saveHistory(updated);
          return updated;
        });
        setRemovingId(null);
        historyRemovalTimeoutsRef.current = historyRemovalTimeoutsRef.current.filter(
          (scheduledId) => scheduledId !== timeoutId
        );
      }, 300);

      historyRemovalTimeoutsRef.current.push(timeoutId);
    },
    []
  );

  const handleClearAll = useCallback(() => {
    resetHistoryRemovalTimers();
    setRemovingId(null);
    setHistory([]);
    saveHistory([]);
  }, [resetHistoryRemovalTimers]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingParticles enabled={animationsEnabled} />
      <ThemeToggle />
      <AnimationToggle
        enabled={useAnimation}
        onToggle={setUseAnimation}
        reducedMotionActive={prefersReducedMotion}
      />

      <div className="relative z-10 mx-auto max-w-lg px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-title text-2xl text-foreground sm:text-3xl md:text-5xl">
            🍀 운수대콩 🍀
          </h1>
          <p className="font-body text-lg text-muted-foreground">
            귀여운 로또 번호 생성기 ✨
          </p>
          {prefersReducedMotion && (
            <p className="mt-2 font-body text-xs text-muted-foreground">
              시스템 설정에 따라 애니메이션을 줄여서 보여드리고 있어요.
            </p>
          )}
        </div>

        <div className="mb-6">
          <ModeSelector mode={mode} onModeChange={setMode} />
        </div>

        <div className="mb-6">
          <div className="flex min-h-[100px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-lg sm:min-h-[120px] sm:p-8">
            {numbers.length > 0 ? (
              <div
                key={animKey}
                className="flex w-full flex-wrap justify-center gap-1.5 sm:gap-3"
              >
                {numbers.map((number, index) => (
                  <LottoBall
                    key={`${animKey}-${index}`}
                    ref={(element) => {
                      ballRefs.current[index] = element;
                    }}
                    number={number}
                    delay={!generatedWithAnimation ? index * 120 : 0}
                    animate={!generatedWithAnimation}
                    rolling={isGenerating && generatedWithAnimation}
                  />
                ))}
              </div>
            ) : (
              <p className="px-2 text-center font-body text-sm text-muted-foreground sm:text-lg">
                {isGenerating ? "" : "버튼을 눌러 번호를 뽑아보세요! 🍀"}
              </p>
            )}
          </div>

          {generationError && (
            <p role="alert" className="mt-3 text-center font-body text-sm text-destructive">
              {generationError}
            </p>
          )}
        </div>

        <div className="mb-6 flex justify-center">
          <GenerateButton
            onClick={handleGenerate}
            isGenerating={isGenerating}
            animate={animationsEnabled}
          />
        </div>

        <div className="mb-8">
          <AdvancedSettings
            includeNumbers={includeNumbers}
            excludeNumbers={excludeNumbers}
            onIncludeChange={setIncludeNumbers}
            onExcludeChange={setExcludeNumbers}
          />
        </div>

        {history.length > 0 && (
          <div>
            <div className="relative mb-4">
              <h2 className="text-center font-title text-xl text-foreground">
                📋 최근 기록
              </h2>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <HistoryClearButton onClear={handleClearAll} />
              </div>
            </div>
            <div className="space-y-3">
              {history.map((entry) => (
                <HistoryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDeleteHistory}
                  removing={removingId === entry.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
