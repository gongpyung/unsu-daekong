import { Film, Zap } from "lucide-react";

interface AnimationToggleProps {
  enabled: boolean;
  onToggle: (next: boolean) => void;
  reducedMotionActive?: boolean;
}

const AnimationToggle = ({
  enabled,
  onToggle,
  reducedMotionActive = false,
}: AnimationToggleProps) => {
  const active = enabled && !reducedMotionActive;
  const label = reducedMotionActive
    ? "시스템 설정에 따라 애니메이션이 줄어드는 중"
    : active
      ? "애니메이션 끄기"
      : "애니메이션 켜기";

  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className="fixed top-16 right-4 z-50 rounded-full border border-border bg-card p-2.5 shadow-md transition-transform motion-reduce:transition-none hover:scale-110 active:scale-95"
      aria-label={label}
      aria-pressed={active}
      title={label}
    >
      {active ? <Film size={20} /> : <Zap size={20} />}
    </button>
  );
};

export default AnimationToggle;
