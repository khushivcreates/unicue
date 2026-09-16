"use client";

import { useEffect, useState } from "react";

// Bonus feature: a lightweight, honest streak counter.
// It counts distinct calendar days the browser has opened UniCue on,
// stored in localStorage — no fake numbers, just a real local tally.
export default function StreakWidget() {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const raw = window.localStorage.getItem("unicue-visits");
      const visits = raw ? JSON.parse(raw) : [];

      if (!visits.includes(todayKey)) {
        visits.push(todayKey);
      }
      const sorted = [...new Set(visits)].sort();
      window.localStorage.setItem("unicue-visits", JSON.stringify(sorted));

      // count the current consecutive-day run ending today
      let count = 0;
      let cursor = new Date();
      for (let i = sorted.length - 1; i >= 0; i--) {
        const cursorKey = cursor.toISOString().slice(0, 10);
        if (sorted[i] === cursorKey) {
          count += 1;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      }
      setStreak(Math.max(count, 1));
    } catch {
      setStreak(1);
    }
  }, []);

  return (
    <div className="sticker inline-flex items-center gap-2 bg-ink text-cream font-display font-semibold text-sm px-3 py-1.5 rounded-full border border-ink shadow-blockSm">
      <span>🔥</span>
      <span>{streak ?? 1}-day streak</span>
    </div>
  );
}
