import { useState } from "react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

const GenerateButton = ({ onClick, isGenerating }: GenerateButtonProps) => {
  const [wiggle, setWiggle] = useState(false);

  const handleClick = () => {
    if (isGenerating) return;
    setWiggle(true);
    setTimeout(() => setWiggle(false), 400);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isGenerating}
      className={cn(
        "relative px-10 py-5 rounded-full bg-primary text-primary-foreground font-title text-2xl",
        "shadow-xl hover:shadow-2xl transition-all duration-200",
        "hover:scale-105 active:scale-95",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        wiggle && "animate-wiggle"
      )}
    >
      {isGenerating ? (
        <span className="flex items-center gap-3">
          <span className="animate-spin text-2xl">🎱</span>
          뽑는 중...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          🎲 번호 뽑기!
        </span>
      )}
      {/* Sparkle effects */}
      {!isGenerating && (
        <>
          <span className="absolute -top-2 -right-2 animate-sparkle text-lg">✨</span>
          <span className="absolute -bottom-1 -left-2 animate-sparkle text-lg" style={{ animationDelay: "0.5s" }}>✨</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;
