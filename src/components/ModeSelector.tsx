import { cn } from "@/lib/utils";

export type GenerateMode = "random" | "hot" | "cold";

interface ModeSelectorProps {
  mode: GenerateMode;
  onModeChange: (mode: GenerateMode) => void;
}

const modes: { key: GenerateMode; label: string; emoji: string; desc: string }[] = [
  { key: "random", label: "랜덤", emoji: "🎲", desc: "완전 무작위" },
  { key: "hot", label: "핫번호", emoji: "🔥", desc: "자주 나오는 번호" },
  { key: "cold", label: "콜드번호", emoji: "❄️", desc: "안 나오는 번호" },
];

const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div
      role="group"
      aria-label="번호 생성 모드"
      className="flex w-full flex-wrap justify-center gap-2 sm:flex-nowrap sm:gap-3"
    >
      {modes.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onModeChange(option.key)}
          aria-pressed={mode === option.key}
          className={cn(
            "flex-1 whitespace-nowrap rounded-xl border-2 px-3 py-2 font-title text-xs transition-all duration-200 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base",
            mode === option.key
              ? "scale-105 border-primary bg-primary text-primary-foreground shadow-lg"
              : "border-border bg-card text-card-foreground hover:border-primary/50 hover:scale-102"
          )}
        >
          <span className="mr-1 text-lg sm:text-xl">{option.emoji}</span>
          <span>{option.label}</span>
          <span className="mt-1 block font-body text-[10px] opacity-70 sm:text-xs">
            {option.desc}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
