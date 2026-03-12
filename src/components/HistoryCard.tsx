import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import LottoBall from "./LottoBall";

export interface HistoryEntry {
  id: string;
  numbers: number[];
  mode: string;
  timestamp: number;
}

interface HistoryCardProps {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
  removing?: boolean;
}

const HistoryCard = ({
  entry,
  onDelete,
  removing,
}: HistoryCardProps) => {
  const timeStr = new Date(entry.timestamp).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-md transition-all duration-300 motion-reduce:transition-none",
        removing && "animate-fade-out-down"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-body text-sm text-muted-foreground">
          {timeStr} · {entry.mode === "random" ? "🎲" : entry.mode === "hot" ? "🔥" : "❄️"}
        </span>
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          aria-label={`${timeStr} 기록 삭제`}
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {entry.numbers.map((number) => (
          <LottoBall key={`${entry.id}-${number}`} number={number} animate={false} />
        ))}
      </div>
    </div>
  );
};

export default HistoryCard;
