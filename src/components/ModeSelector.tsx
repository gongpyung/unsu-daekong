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
    <div className="flex gap-2 sm:gap-3 justify-center flex-wrap sm:flex-nowrap">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onModeChange(m.key)}
           className={cn(
            "px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-title text-xs sm:text-base transition-all duration-200 whitespace-nowrap",
            "border-2",
            mode === m.key
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
              : "bg-card text-card-foreground border-border hover:border-primary/50 hover:scale-102"
          )}
        >
           <span className="text-lg sm:text-xl mr-1">{m.emoji}</span>
          {m.label}
          <p className="text-[10px] sm:text-xs mt-1 opacity-70 font-body">{m.desc}</p>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
