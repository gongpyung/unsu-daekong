import { useState, useCallback } from "react";
import FloatingParticles from "@/components/FloatingParticles";
import ThemeToggle from "@/components/ThemeToggle";
import LottoBall from "@/components/LottoBall";
import GenerateButton from "@/components/GenerateButton";
import ModeSelector, { type GenerateMode } from "@/components/ModeSelector";
import AdvancedSettings from "@/components/AdvancedSettings";
import HistoryCard, { type HistoryEntry } from "@/components/HistoryCard";
import { generateNumbers } from "@/lib/lotto";

const STORAGE_KEY = "lotto-history";

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

const Index = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [mode, setMode] = useState<GenerateMode>("random");
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState("");
  const [excludeNumbers, setExcludeNumbers] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setNumbers([]);
    setAnimKey((k) => k + 1);

    setTimeout(() => {
      const result = generateNumbers(mode, includeNumbers, excludeNumbers);
      setNumbers(result);
      setIsGenerating(false);

      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        numbers: result,
        mode,
        timestamp: Date.now()
      };
      const updated = [entry, ...history].slice(0, 20);
      setHistory(updated);
      saveHistory(updated);
    }, 800);
  }, [mode, includeNumbers, excludeNumbers, history]);

  const handleDeleteHistory = useCallback(
    (id: string) => {
      setRemovingId(id);
      setTimeout(() => {
        const updated = history.filter((e) => e.id !== id);
        setHistory(updated);
        saveHistory(updated);
        setRemovingId(null);
      }, 300);
    },
    [history]
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingParticles />
      <ThemeToggle />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-title text-5xl text-foreground mb-2 animate-bounce">
            🍀 운수대콩 🍀
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            귀여운 로또 번호 생성기 ✨
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <ModeSelector mode={mode} onModeChange={setMode} />
        </div>

        {/* Number Display */}
        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border mb-6 min-h-[120px] flex items-center justify-center">
          {numbers.length > 0 ?
          <div className="flex gap-3 flex-wrap justify-center" key={animKey}>
              {numbers.map((n, i) =>
            <LottoBall key={`${animKey}-${n}`} number={n} delay={i * 120} />
            )}
            </div> :

          <p className="text-muted-foreground font-body text-lg">
              {isGenerating ? "" : "버튼을 눌러 번호를 뽑아보세요! 🍀"}
            </p>
          }
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <GenerateButton onClick={handleGenerate} isGenerating={isGenerating} />
        </div>

        {/* Advanced Settings */}
        <div className="mb-8">
          <AdvancedSettings
            includeNumbers={includeNumbers}
            excludeNumbers={excludeNumbers}
            onIncludeChange={setIncludeNumbers}
            onExcludeChange={setExcludeNumbers} />
          
        </div>

        {/* History */}
        {history.length > 0 &&
        <div>
            <h2 className="font-title text-xl text-foreground mb-4 text-center">
              📋 최근 기록
            </h2>
            <div className="space-y-3">
              {history.map((entry) =>
            <HistoryCard
              key={entry.id}
              entry={entry}
              onDelete={handleDeleteHistory}
              removing={removingId === entry.id} />

            )}
            </div>
          </div>
        }
      </div>
    </div>);

};

export default Index;