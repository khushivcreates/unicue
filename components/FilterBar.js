"use client";

import { BRANCHES, SEMESTERS } from "@/lib/utils";

export default function FilterBar({ profile, setProfile, explainMode, setExplainMode }) {
  return (
    <div className="card-surface border-2 border-ink dark:border-cream rounded-chunky p-4 mb-6 shadow-blockSm">
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-display font-semibold text-xs uppercase tracking-wide text-ink/60 dark:text-cream/60">
            Branch
          </span>
          <select
            value={profile.branch}
            onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
            className="focus-ring bg-transparent border-2 border-ink dark:border-cream rounded-lg px-3 py-2"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-display font-semibold text-xs uppercase tracking-wide text-ink/60 dark:text-cream/60">
            Semester
          </span>
          <select
            value={profile.semester}
            onChange={(e) =>
              setProfile({ ...profile, semester: Number(e.target.value) })
            }
            className="focus-ring bg-transparent border-2 border-ink dark:border-cream rounded-lg px-3 py-2"
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-display font-semibold text-xs uppercase tracking-wide text-ink/60 dark:text-cream/60">
            Living
          </span>
          <select
            value={profile.hostelStatus}
            onChange={(e) =>
              setProfile({ ...profile, hostelStatus: e.target.value })
            }
            className="focus-ring bg-transparent border-2 border-ink dark:border-cream rounded-lg px-3 py-2"
          >
            <option value="hostel">Hostel resident</option>
            <option value="day-scholar">Day scholar</option>
          </select>
        </label>
      </div>

      <button
        onClick={() => setExplainMode(!explainMode)}
        className={`focus-ring w-full sm:w-auto text-sm font-display font-semibold px-4 py-2 rounded-full border-2 border-ink dark:border-cream transition-colors ${
          explainMode
            ? "bg-coral text-ink"
            : "bg-transparent hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink"
        }`}
      >
        {explainMode ? "🎓 Explain-Like-I'm-a-Fresher: ON" : "🎓 Explain Like I'm a Fresher"}
      </button>
    </div>
  );
}
