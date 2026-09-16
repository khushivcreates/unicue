"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import NoticeCard from "@/components/NoticeCard";
import notices from "@/data/notices.json";
import { filterNotices, sortForFeed } from "@/lib/utils";

const CATEGORIES = ["All", ...new Set(notices.map((n) => n.category))];

export default function DashboardPage() {
  const [profile, setProfile] = useState({
    branch: "CSE",
    semester: 1,
    hostelStatus: "hostel",
  });
  const [explainMode, setExplainMode] = useState(false);
  const [category, setCategory] = useState("All");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const feed = useMemo(() => {
    let list = filterNotices(notices, profile);
    if (category !== "All") list = list.filter((n) => n.category === category);
    if (showVerifiedOnly) list = list.filter((n) => n.verified);
    return sortForFeed(list);
  }, [profile, category, showVerifiedOnly]);

  const urgentCount = feed.filter((n) => n.urgency === "high").length;

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-3xl sm:text-4xl mb-1">Your feed</h1>
          <p className="text-sm text-ink/60 dark:text-cream/60">
            {feed.length} notices for you
            {urgentCount > 0 && (
              <span className="text-coral font-medium"> · {urgentCount} urgent</span>
            )}
          </p>
        </div>

        <FilterBar
          profile={profile}
          setProfile={setProfile}
          explainMode={explainMode}
          setExplainMode={setExplainMode}
        />

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`focus-ring text-xs font-display font-medium px-3 py-1.5 rounded-full border-2 border-ink dark:border-cream transition-colors ${
                category === c
                  ? "bg-ink text-cream dark:bg-cream dark:text-ink"
                  : "bg-transparent hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className={`focus-ring text-xs font-display font-medium px-3 py-1.5 rounded-full border-2 border-ink dark:border-cream transition-colors ${
              showVerifiedOnly
                ? "bg-lime text-ink"
                : "bg-transparent hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink"
            }`}
          >
            ✅ Verified only
          </button>
        </div>

        {feed.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-ink/30 dark:border-cream/30 rounded-chunky">
            <p className="font-display font-semibold text-lg mb-1">All clear 🎉</p>
            <p className="text-sm text-ink/60 dark:text-cream/60">
              Nothing matches these filters right now — try widening them.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {feed.map((n) => (
              <NoticeCard key={n.id} notice={n} explainMode={explainMode} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
