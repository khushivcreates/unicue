"use client";

import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";

const STARTERS = [
  "Do I need to submit the anti-ragging form?",
  "What is CAF and when is it due?",
  "Is the exam postponement rumor true?",
  "I'm a day scholar, do I need the bus pass renewal?",
];

export default function AskPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! I'm UniCue. Ask me anything about campus notices — deadlines, forms, jargon, whatever. I'll answer using the actual notices, not guesses.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "ask", query: question }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.answer,
          sources: data.sources || [],
          offline: data.mode === "offline",
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Something went wrong reaching UniCue. Try again in a moment.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 py-8 flex flex-col" style={{ minHeight: "calc(100vh - 65px)" }}>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-1">Ask UniCue</h1>
        <p className="text-sm text-ink/60 dark:text-cream/60 mb-6">
          Answers grounded in real notices, with a source cited every time.
        </p>

        <div className="flex-1 grid gap-4 mb-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] ${m.role === "user" ? "self-end" : "self-start"}`}
            >
              <div
                className={`rounded-chunky px-4 py-3 border-2 border-ink dark:border-cream text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-ink text-cream dark:bg-cream dark:text-ink"
                    : "card-surface"
                }`}
              >
                {m.text}
              </div>
              {m.offline && (
                <p className="text-xs text-ink/40 dark:text-cream/40 mt-1">
                  offline demo mode — add ANTHROPIC_API_KEY for live AI answers
                </p>
              )}
              {m.sources && m.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.sources.map((s) => (
                    <span
                      key={s.id}
                      title={s.title}
                      className="text-xs px-2 py-1 rounded-md border border-ink/30 dark:border-cream/30 text-ink/60 dark:text-cream/60"
                    >
                      📎 {s.source}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="self-start card-surface border-2 border-ink dark:border-cream rounded-chunky px-4 py-3 text-sm text-ink/50 dark:text-cream/50">
              Reading notices…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="focus-ring text-xs border-2 border-ink/30 dark:border-cream/30 hover:border-ink dark:hover:border-cream rounded-full px-3 py-1.5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2 sticky bottom-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any notice, form, or deadline…"
            className="focus-ring flex-1 card-surface border-2 border-ink dark:border-cream rounded-full px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="focus-ring bg-ink text-cream dark:bg-cream dark:text-ink font-display font-semibold px-5 py-3 rounded-full border-2 border-ink dark:border-cream disabled:opacity-40 shrink-0"
          >
            Send
          </button>
        </form>
      </main>
    </>
  );
}
