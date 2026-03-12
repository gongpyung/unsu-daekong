import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  animate?: boolean;
}

const GenerateButton = ({
  onClick,
  isGenerating,
  animate = true,
}: GenerateButtonProps) => {
  const [wiggle, setWiggle] = useState(false);
  const wiggleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (wiggleTimeoutRef.current !== null) {
        window.clearTimeout(wiggleTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (isGenerating) {
      return;
    }

    if (animate) {
      setWiggle(true);
      if (wiggleTimeoutRef.current !== null) {
        window.clearTimeout(wiggleTimeoutRef.current);
      }
      wiggleTimeoutRef.current = window.setTimeout(() => setWiggle(false), 400);
    } else {
      setWiggle(false);
    }

    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isGenerating}
      className={cn(
        "relative rounded-full bg-primary px-10 py-5 font-title text-2xl text-primary-foreground shadow-xl transition-all duration-200 motion-reduce:transition-none",
        "hover:scale-105 hover:shadow-2xl active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-70",
        animate && wiggle && "animate-wiggle"
      )}
    >
      {isGenerating ? (
        <span className="flex items-center gap-3">
          <span className={cn("text-2xl", animate && "animate-spin")}>🎱</span>
          뽑는 중...
        </span>
      ) : (
        <span className="flex items-center gap-2">🎲 번호 뽑기</span>
      )}
      {!isGenerating && animate && (
        <>
          <span className="absolute -right-2 -top-2 animate-sparkle text-lg">✨</span>
          <span
            className="absolute -bottom-1 -left-2 animate-sparkle text-lg"
            style={{ animationDelay: "0.5s" }}
          >
            ✨
          </span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;
