"use client";

const COLORS = ["#C6F135", "#FF6B4A", "#161B33", "#F6F3EC"];

export default function Confetti({ active }) {
  if (!active) return null;

  const pieces = Array.from({ length: 14 }, (_, i) => {
    const left = 5 + Math.random() * 90;
    const delay = Math.random() * 0.15;
    const color = COLORS[i % COLORS.length];
    const size = 6 + Math.random() * 5;
    return (
      <span
        key={i}
        className="confetti-piece"
        style={{
          left: `${left}%`,
          top: "-4px",
          backgroundColor: color,
          animationDelay: `${delay}s`,
          width: size,
          height: size,
          borderRadius: i % 2 === 0 ? "9999px" : "2px",
        }}
      />
    );
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces}
    </div>
  );
}
