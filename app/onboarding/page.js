"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Confetti from "@/components/Confetti";
import { BRANCHES, SEMESTERS } from "@/lib/utils";

const SAMPLE_FORWARD =
  "🚨 CAF closes tomorrow!! everyone submit on ERP before midnight, portal will crash if you wait 🙏🙏";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [forwarded, setForwarded] = useState("");
  const [profile, setProfile] = useState({ branch: "CSE", semester: 1, hostelStatus: "hostel" });
  const [copied, setCopied] = useState(false);

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-5 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Get set up</h1>
        <p className="text-sm text-ink/60 dark:text-cream/60 mb-8">
          This is a simulated flow for the demo — forward one real notice to our WhatsApp
          bot and you're normally in, no app download needed.
        </p>

        <div className="flex gap-1.5 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-ink dark:bg-cream" : "bg-ink/15 dark:bg-cream/15"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="card-surface border-2 border-ink dark:border-cream rounded-chunky p-5 shadow-block">
            <h2 className="font-display font-semibold text-lg mb-3">
              Step 1 · Forward a notice
            </h2>
            <p className="text-sm text-ink/70 dark:text-cream/70 mb-4">
              In the real product, you'd forward a WhatsApp message to our bot number.
              Here, just paste (or use) a sample forward:
            </p>
            <textarea
              value={forwarded}
              onChange={(e) => setForwarded(e.target.value)}
              placeholder={SAMPLE_FORWARD}
              rows={3}
              className="focus-ring w-full border-2 border-ink dark:border-cream rounded-chunky px-4 py-3 text-sm mb-3 bg-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setForwarded(SAMPLE_FORWARD)}
                className="focus-ring text-xs font-medium px-3 py-2 rounded-full border-2 border-ink/30 dark:border-cream/30 hover:border-ink dark:hover:border-cream"
              >
                Use sample forward
              </button>
              <button
                onClick={() => forwarded.trim() && setStep(1)}
                disabled={!forwarded.trim()}
                className="focus-ring ml-auto bg-ink text-cream dark:bg-cream dark:text-ink font-display font-semibold px-5 py-2 rounded-full border-2 border-ink dark:border-cream disabled:opacity-40"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="card-surface border-2 border-ink dark:border-cream rounded-chunky p-5 shadow-block">
            <h2 className="font-display font-semibold text-lg mb-3">
              Step 2 · Tell us who you are
            </h2>
            <p className="text-sm text-ink/70 dark:text-cream/70 mb-4">
              So we only show you notices that are actually about you.
            </p>
            <div className="grid gap-3 mb-4">
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
                  onChange={(e) => setProfile({ ...profile, semester: Number(e.target.value) })}
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
                  onChange={(e) => setProfile({ ...profile, hostelStatus: e.target.value })}
                  className="focus-ring bg-transparent border-2 border-ink dark:border-cream rounded-lg px-3 py-2"
                >
                  <option value="hostel">Hostel resident</option>
                  <option value="day-scholar">Day scholar</option>
                </select>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="focus-ring text-xs font-medium px-3 py-2 rounded-full border-2 border-ink/30 dark:border-cream/30"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="focus-ring ml-auto bg-ink text-cream dark:bg-cream dark:text-ink font-display font-semibold px-5 py-2 rounded-full border-2 border-ink dark:border-cream"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="relative card-surface border-2 border-ink dark:border-cream rounded-chunky p-6 shadow-block text-center overflow-hidden">
            <Confetti active={true} />
            <span className="text-4xl block mb-3">🎉</span>
            <h2 className="font-display font-bold text-2xl mb-2">You're in!</h2>
            <p className="text-sm text-ink/70 dark:text-cream/70 mb-6">
              We decoded your forward, matched it to {profile.branch} · Sem {profile.semester}
              {" · "}
              {profile.hostelStatus === "hostel" ? "Hostel" : "Day scholar"}, and it's already
              waiting in your feed.
            </p>

            <div className="border-2 border-ink/20 dark:border-cream/20 rounded-chunky p-4 mb-6 text-left">
              <p className="font-display font-semibold text-sm mb-2">👯 Squad Digest</p>
              <p className="text-xs text-ink/60 dark:text-cream/60 mb-3">
                Share this week's curated digest with your hostel or friend group in one tap.
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText("https://unicue.app/squad/demo-batch-2026");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
                className="focus-ring w-full text-xs font-display font-semibold px-3 py-2 rounded-full border-2 border-ink dark:border-cream hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
              >
                {copied ? "Link copied ✓" : "Copy squad digest link"}
              </button>
            </div>

            <Link
              href="/dashboard"
              className="focus-ring inline-block bg-lime text-ink font-display font-semibold px-6 py-3 rounded-full border-2 border-ink"
            >
              Go to my feed →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
