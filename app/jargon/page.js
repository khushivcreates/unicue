"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import jargon from "@/data/jargon.json";

function findLocalMatches(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return jargon.filter(
    (j) =>
      q.includes(j.term.toLowerCase()) ||
      j.term.toLowerCase().includes(q) ||
      j.expansion.toLowerCase().includes(q)
  );
}

export default function JargonPage() {
  const [query, setQuery] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const localMatches = useMemo(() => findLocalMatches(query), [query]);

  async function decode(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setError(null);
    setAiResult(null);

    if (localMatches.length > 0) return; // instant local answer is enough

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "jargon", query }),
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      setError("Couldn't reach the decoder right now. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 py-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">Jargon Decoder</h1>
        <p className="text-sm text-ink/60 dark:text-cream/60 mb-6">
          Paste a term, an acronym, or a whole notice. We'll translate campus-speak into
          plain English.
        </p>

        <form onSubmit={decode} className="mb-6">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'What is CAF?' or paste a whole notice you don't understand"
            rows={3}
            className="focus-ring w-full card-surface border-2 border-ink dark:border-cream rounded-chunky px-4 py-3 text-sm mb-3"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="focus-ring bg-ink text-cream dark:bg-cream dark:text-ink font-display font-semibold px-5 py-2.5 rounded-full border-2 border-ink dark:border-cream disabled:opacity-40"
          >
            {loading ? "Decoding…" : "Decode it"}
          </button>
        </form>

        {localMatches.length > 0 && (
          <div className="grid gap-3 mb-6">
            {localMatches.map((m) => (
              <div
                key={m.term}
                className="card-surface border-2 border-ink dark:border-cream rounded-chunky p-4 shadow-blockSm"
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display font-bold text-lg">{m.term}</span>
                  <span className="text-xs text-ink/50 dark:text-cream/50">{m.expansion}</span>
                </div>
                <p className="text-sm text-ink/80 dark:text-cream/80">{m.meaning}</p>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-coral text-sm mb-4">{error}</p>}

        {aiResult && (
          <div className="card-surface border-2 border-ink dark:border-cream rounded-chunky p-4 shadow-blockSm mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display font-semibold">AI explanation</span>
              {aiResult.mode === "offline" && (
                <span className="text-xs text-ink/40 dark:text-cream/40">
                  (offline demo mode — no API key set)
                </span>
              )}
            </div>
            <p className="text-sm text-ink/80 dark:text-cream/80 whitespace-pre-wrap">
              {aiResult.answer}
            </p>
          </div>
        )}

        <div>
          <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-ink/50 dark:text-cream/50 mb-3">
            Common campus acronyms
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {jargon.map((j) => (
              <button
                key={j.term}
                onClick={() => setQuery(j.term)}
                className="focus-ring text-left border-2 border-ink/20 dark:border-cream/20 hover:border-ink dark:hover:border-cream rounded-lg px-3 py-2 transition-colors"
              >
                <span className="font-display font-semibold text-sm">{j.term}</span>
                <span className="text-xs text-ink/50 dark:text-cream/50 block">
                  {j.expansion}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
