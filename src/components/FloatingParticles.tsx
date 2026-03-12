import { useState } from "react";

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

interface FloatingParticlesProps {
  enabled?: boolean;
}

const FloatingParticles = ({ enabled = true }: FloatingParticlesProps) => {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 12 }, (_, index) => ({
      id: index,
      emoji: EMOJIS[index % EMOJIS.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 14 + Math.random() * 16,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  );

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute opacity-30 motion-safe:animate-float"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            fontSize: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingParticles;
