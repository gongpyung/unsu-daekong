import { useEffect, useState } from "react";

const EMOJIS = ["⭐", "💖", "🍀", "✨", "🌸", "🎵", "💫", "🌈"];

interface Particle {
  id: number;
  emoji: string;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

const FloatingParticles = () => {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 14 + Math.random() * 16,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-float opacity-30"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingParticles;
