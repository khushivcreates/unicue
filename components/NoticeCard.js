"use client";

import { useEffect, useState } from "react";
import { VerifiedBadge, UrgencyBadge, CategoryTag, CountdownChip } from "./Badges";
import Confetti from "./Confetti";
import { formatPostedAt } from "@/lib/utils";
import { addTrackerItem, isTracked, toggleTrackerItem, getTrackerItems } from "@/lib/tracker";

export default function NoticeCard({ notice, explainMode }) {
  const [tracked, setTracked] = useState(false);
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState(false);
  const [hindi, setHindi] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [showHindi, setShowHindi] = useState(false);

  useEffect(() => {
    setTracked(isTracked(notice.id));
    const item = getTrackerItems().find((i) => i.id === notice.id);
    setDone(item?.done ?? false);
  }, [notice.id]);

  function handleTrack() {
    if (!tracked) {
      addTrackerItem(notice);
      setTracked(true);
      return;
    }
    const items = toggleTrackerItem(notice.id);
    const item = items.find((i) => i.id === notice.id);
    const nowDone = item?.done ?? false;
    setDone(nowDone);
    if (nowDone) {
      setBurst(true);
      setTimeout(() => setBurst(false), 900);
    }
  }

  async function handleTranslate() {
    if (hindi) {
      setShowHindi(!showHindi);
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "translate",
          targetLang: "Hindi",
          query: `${notice.title}. ${notice.summary}`,
        }),
      });
      const data = await res.json();
      setHindi(data.answer);
      setShowHindi(true);
    } catch {
      setHindi("Translation unavailable right now.");
      setShowHindi(true);
    } finally {
      setTranslating(false);
    }
  }

  const bodyText = explainMode ? notice.plainExplanation : notice.summary;

  return (
    <article className="relative card-surface border-2 border-ink dark:border-cream rounded-chunky p-5 shadow-block hover:-translate-y-0.5 transition-transform overflow-hidden">
      <Confetti active={burst} />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <VerifiedBadge verified={notice.verified} />
        <UrgencyBadge urgency={notice.urgency} />
        <CategoryTag category={notice.category} />
        {notice.deadline && <CountdownChip deadline={notice.deadline} />}
      </div>

      <h3 className="font-display font-semibold text-lg leading-snug mb-2">
        {notice.title}
      </h3>

      <p className="text-sm leading-relaxed text-ink/80 dark:text-cream/80 mb-1">
        {explainMode ? "🎓 " : ""}
        {bodyText}
      </p>

      <button
        onClick={handleTranslate}
        disabled={translating}
        className="focus-ring text-xs font-medium text-ink/50 dark:text-cream/50 hover:text-ink dark:hover:text-cream underline decoration-dotted mb-3 disabled:opacity-50"
      >
        {translating ? "Translating…" : showHindi ? "🌐 Show in English" : "🌐 हिंदी में देखें"}
      </button>

      {showHindi && hindi && (
        <p className="text-sm leading-relaxed text-ink/80 dark:text-cream/80 mb-3 bg-navy/5 dark:bg-cream/5 rounded-lg px-3 py-2">
          {hindi}
        </p>
      )}

      {notice.seniorTip && (
        <div className="mb-3 text-sm bg-lime/30 dark:bg-lime/10 border border-ink/20 dark:border-cream/20 rounded-lg px-3 py-2">
          <span className="font-display font-semibold">🎓 Senior tip: </span>
          {notice.seniorTip}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-ink/10 dark:border-cream/10">
        <span className="text-xs text-ink/50 dark:text-cream/50">
          {notice.source} · {formatPostedAt(notice.postedAt)}
        </span>

        <button
          onClick={handleTrack}
          className={`focus-ring text-xs font-display font-semibold px-3 py-1.5 rounded-full border-2 border-ink dark:border-cream transition-colors ${
            done
              ? "bg-lime text-ink"
              : tracked
              ? "bg-ink text-cream dark:bg-cream dark:text-ink"
              : "bg-transparent hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink"
          }`}
        >
          {done ? "✓ Done" : tracked ? "Mark done" : "+ Add to tracker"}
        </button>
      </div>
    </article>
  );
}
