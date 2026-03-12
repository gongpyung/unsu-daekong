import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface LottoBallProps {
  number: number;
  delay?: number;
  animate?: boolean;
  rolling?: boolean;
}

const getBallColor = (number: number): string => {
  if (number <= 10) return "bg-ball-pink";
  if (number <= 20) return "bg-ball-yellow";
  if (number <= 30) return "bg-ball-green";
  if (number <= 40) return "bg-ball-blue";
  return "bg-ball-purple";
};

const LottoBall = forwardRef<HTMLDivElement, LottoBallProps>(
  ({ number, delay = 0, animate = true, rolling = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-base font-bold text-foreground shadow-lg font-title sm:h-14 sm:w-14 sm:text-xl",
          getBallColor(number),
          animate && "animate-pop-in opacity-0 motion-reduce:animate-none motion-reduce:opacity-100"
        )}
        style={{ animationDelay: `${delay}ms` }}
        role="img"
        aria-label={rolling ? "번호 추첨 중" : `${number}번`}
      >
        {rolling ? "?" : number}
      </div>
    );
  }
);

LottoBall.displayName = "LottoBall";

export default LottoBall;
