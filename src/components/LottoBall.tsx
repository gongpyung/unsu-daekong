import { cn } from "@/lib/utils";

interface LottoBallProps {
  number: number;
  delay?: number;
  animate?: boolean;
}

const getBallColor = (num: number): string => {
  if (num <= 10) return "bg-ball-pink";
  if (num <= 20) return "bg-ball-yellow";
  if (num <= 30) return "bg-ball-green";
  if (num <= 40) return "bg-ball-blue";
  return "bg-ball-purple";
};

const LottoBall = ({ number, delay = 0, animate = true }: LottoBallProps) => {
  return (
    <div
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-foreground font-title text-lg sm:text-xl font-bold shadow-lg flex-shrink-0",
        getBallColor(number),
        animate && "animate-pop-in opacity-0"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {number}
    </div>
  );
};

export default LottoBall;
