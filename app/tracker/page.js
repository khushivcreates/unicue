"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Confetti from "@/components/Confetti";
import { CountdownChip } from "@/components/Badges";
import { getTrackerItems, toggleTrackerItem, removeTrackerItem } from "@/lib/tracker";
import { formatPostedAt } from "@/lib/utils";

function downloadIcs(item) {
  const dt = item.deadline ? new Date(item.deadline) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = (d) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
      d.getUTCHours()
    )}${pad(d.getUTCMinutes())}00Z`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UniCue//Action Tracker//EN",
    "BEGIN:VEVENT",
    `UID:${item.id}@unicue`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(dt)}`,
    `SUMMARY:${item.title}`,
    `DESCRIPTION:Deadline tracked via UniCue (${item.category})`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.id}-unicue.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TrackerPage() {
  const [items, setItems] = useState([]);
  const [burstId, setBurstId] = useState(null);

  function refresh() {
    setItems(getTrackerItems());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("unicue-tracker-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("unicue-tracker-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function handleToggle(id) {
    const updated = toggleTrackerItem(id);
    setItems(updated);
    const item = updated.find((i) => i.id === id);
    if (item?.done) {
      setBurstId(id);
      setTimeout(() => setBurstId(null), 900);
    }
  }

  const pending = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 py-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-1">Action Tracker</h1>
        <p className="text-sm text-ink/60 dark:text-cream/60 mb-6">
          Everything you've flagged from your feed, auto-pulled into one checklist.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-ink/30 dark:border-cream/30 rounded-chunky">
            <p className="font-display font-semibold text-lg mb-1">Nothing tracked yet</p>
            <p className="text-sm text-ink/60 dark:text-cream/60">
              Head to your feed and tap "+ Add to tracker" on anything that needs action.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pending.length > 0 && (
              <section>
                <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-ink/50 dark:text-cream/50 mb-3">
                  To do ({pending.length})
                </h2>
                <div className="grid gap-3">
                  {pending.map((item) => (
                    <div
                      key={item.id}
                      className="relative card-surface border-2 border-ink dark:border-cream rounded-chunky p-4 shadow-blockSm flex items-start gap-3 overflow-hidden"
                    >
                      <Confetti active={burstId === item.id} />
                      <button
                        onClick={() => handleToggle(item.id)}
                        aria-label="Mark done"
                        className="focus-ring shrink-0 w-6 h-6 mt-0.5 rounded-md border-2 border-ink dark:border-cream hover:bg-lime transition-colors"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-medium text-sm mb-1">{item.title}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-ink/50 dark:text-cream/50">
                            {item.category}
                          </span>
                          {item.deadline && <CountdownChip deadline={item.deadline} />}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        {item.deadline && (
                          <button
                            onClick={() => downloadIcs(item)}
                            className="focus-ring text-xs px-2 py-1 rounded-md border border-ink/30 dark:border-cream/30 hover:border-ink dark:hover:border-cream"
                            title="Add to calendar"
                          >
                            📅
                          </button>
                        )}
                        <button
                          onClick={() => setItems(removeTrackerItem(item.id))}
                          className="focus-ring text-xs px-2 py-1 rounded-md border border-ink/30 dark:border-cream/30 hover:border-coral hover:text-coral"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {done.length > 0 && (
              <section>
                <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-ink/50 dark:text-cream/50 mb-3">
                  Done ({done.length})
                </h2>
                <div className="grid gap-2">
                  {done.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-chunky border-2 border-ink/20 dark:border-cream/20 opacity-60"
                    >
                      <button
                        onClick={() => handleToggle(item.id)}
                        className="focus-ring shrink-0 w-5 h-5 rounded-md bg-lime border-2 border-ink flex items-center justify-center text-[10px]"
                      >
                        ✓
                      </button>
                      <p className="text-sm line-through flex-1">{item.title}</p>
                      <button
                        onClick={() => setItems(removeTrackerItem(item.id))}
                        className="focus-ring text-xs px-2 py-1"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}
