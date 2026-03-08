import LottoBall from "./LottoBall";
import { X } from "lucide-react";

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

const HistoryCard = ({ entry, onDelete, removing }: HistoryCardProps) => {
  const timeStr = new Date(entry.timestamp).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`bg-card rounded-2xl p-4 shadow-md border border-border transition-all duration-300 ${
        removing ? "animate-fade-out-down" : "animate-slide-up"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-body">
          {timeStr} · {entry.mode === "random" ? "🎲" : entry.mode === "hot" ? "🔥" : "❄️"}
        </span>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-full hover:bg-muted"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        {entry.numbers.map((n, i) => (
          <LottoBall key={i} number={n} animate={false} />
        ))}
      </div>
    </div>
  );
};

export default HistoryCard;
