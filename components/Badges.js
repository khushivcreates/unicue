"use client";

import { getCountdown } from "@/lib/utils";

export function VerifiedBadge({ verified }) {
  if (verified) {
    return (
      <span className="sticker inline-block bg-ink text-lime text-xs font-display font-semibold px-2.5 py-1 rounded-md border border-ink whitespace-nowrap">
        ✅ Verified
      </span>
    );
  }
  return (
    <span className="sticker inline-block bg-ink text-coral text-xs font-display font-semibold px-2.5 py-1 rounded-md border border-ink whitespace-nowrap">
      ⚠️ Unconfirmed forward
    </span>
  );
}

export function UrgencyBadge({ urgency }) {
  const styles = {
    high: "bg-coral text-ink",
    medium: "bg-lime text-ink",
    low: "bg-navy text-cream",
  };
  const label = { high: "URGENT", medium: "NEEDS ACTION", low: "FYI" }[urgency];
  return (
    <span
      className={`sticker inline-block text-xs font-display font-semibold px-2.5 py-1 rounded-md border border-ink whitespace-nowrap ${styles[urgency]}`}
    >
      {label}
    </span>
  );
}

export function CategoryTag({ category }) {
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-md border border-ink/30 text-ink/70 dark:text-cream/70 dark:border-cream/30 whitespace-nowrap">
      {category}
    </span>
  );
}

export function CountdownChip({ deadline }) {
  const countdown = getCountdown(deadline);
  if (!countdown) return null;

  const colors = {
    critical: "bg-coral text-ink animate-pulse",
    urgent: "bg-coral/80 text-ink",
    soon: "bg-lime text-ink",
    chill: "bg-ink/10 text-ink dark:bg-cream/10 dark:text-cream",
  };

  if (countdown.expired) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-display font-semibold px-2.5 py-1 rounded-md bg-ink/10 text-ink/50 dark:text-cream/50">
        Deadline passed
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-display font-semibold px-2.5 py-1 rounded-md ${colors[countdown.urgencyLevel]}`}
    >
      ⏰ {countdown.label}
    </span>
  );
}
