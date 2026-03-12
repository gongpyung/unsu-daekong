import { useState, useRef, useEffect } from "react";

interface HistoryClearButtonProps {
  onClear: () => void;
}

const HistoryClearButton = ({ onClear }: HistoryClearButtonProps) => {
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (confirming) {
      onClear();
      setConfirming(false);
    } else {
      setConfirming(true);
      timeoutRef.current = window.setTimeout(() => {
        setConfirming(false);
        timeoutRef.current = null;
      }, 3000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={confirming ? "최근 기록 전체 삭제 확인" : "최근 기록 전체 삭제"}
      className={`rounded-xl bg-card border px-2.5 py-1 font-title text-xs transition-all duration-200 ${
        confirming
          ? "text-destructive border-destructive"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {confirming ? "정말요..? 🥺" : "비우기"}
    </button>
  );
};

export default HistoryClearButton;
