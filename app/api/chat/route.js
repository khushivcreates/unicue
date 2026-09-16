import notices from "@/data/notices.json";
import jargon from "@/data/jargon.json";

// Uses the Anthropic Messages API when ANTHROPIC_API_KEY is set (Vercel env var).
// Without a key, everything still works end-to-end via a local, offline
// retrieval fallback — so the demo never looks broken if a key isn't configured.
const MODEL = "claude-haiku-4-5-20251001";

function scoreNotice(notice, queryWords) {
  const haystack = (
    notice.title +
    " " +
    notice.summary +
    " " +
    notice.plainExplanation +
    " " +
    notice.tags.join(" ")
  ).toLowerCase();

  let score = 0;
  for (const w of queryWords) {
    if (w.length < 3) continue;
    if (haystack.includes(w)) score += 1;
  }
  return score;
}

function retrieveNotices(query, limit = 4) {
  const queryWords = query.toLowerCase().split(/\W+/).filter(Boolean);
  const scored = notices
    .map((n) => ({ notice: n, score: scoreNotice(n, queryWords) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    // no keyword overlap — fall back to the most urgent unresolved notices
    return sortByUrgencyFallback().slice(0, limit);
  }
  return scored.slice(0, limit).map((s) => s.notice);
}

function sortByUrgencyFallback() {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...notices].sort((a, b) => rank[a.urgency] - rank[b.urgency]);
}

function offlineAskAnswer(query, matches) {
  if (matches.length === 0) {
    return "I couldn't find a notice matching that in the current feed. Try asking about a specific form, deadline, or acronym like CAF, OD, or condonation.";
  }
  const lines = matches.map((n) => {
    const status = n.verified ? "Verified" : "Unconfirmed forward";
    return `• ${n.title} (${status}, source: ${n.source})${
      n.deadline ? ` — deadline ${new Date(n.deadline).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : ""
    }\n  ${n.plainExplanation}`;
  });
  return `Here's what I found in your notices:\n\n${lines.join("\n\n")}`;
}

function offlineJargonAnswer(query) {
  const q = query.toLowerCase();
  const match = jargon.find(
    (j) => q.includes(j.term.toLowerCase()) || j.term.toLowerCase().includes(q)
  );
  if (match) {
    return `${match.term} = ${match.expansion}. ${match.meaning}`;
  }
  return "I don't have that term in the local dictionary yet, and live AI decoding needs an ANTHROPIC_API_KEY set in your deployment's environment variables. Try one of the common acronyms below in the meantime.";
}

async function callClaude(system, userMessage) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("Anthropic API error", res.status, errText);
    return null;
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n")
    .trim();
  return text || null;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { mode, query } = body || {};
  if (!query || typeof query !== "string") {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  if (mode === "jargon") {
    const matches = retrieveNotices(query, 2);
    const context = matches
      .map((n) => `- ${n.title}: ${n.plainExplanation}`)
      .join("\n");
    const jargonList = jargon.map((j) => `${j.term} = ${j.expansion}`).join(", ");

    const system = `You are UniCue's Jargon Decoder for Indian college freshers. Explain the given campus term, acronym, or notice in plain, friendly, ultra-simple English (2-4 sentences max). Known campus acronyms: ${jargonList}. Related notices for context:\n${context}\nIf you don't recognize the term, say so honestly and suggest checking with the class coordinator.`;

    const aiAnswer = await callClaude(system, query);
    if (aiAnswer) {
      return Response.json({ mode: "live", answer: aiAnswer });
    }
    return Response.json({ mode: "offline", answer: offlineJargonAnswer(query) });
  }

  if (mode === "translate") {
    const targetLang = body.targetLang || "Hindi";
    const system = `Translate the given campus notice into simple, friendly ${targetLang}. Keep form names and acronyms (like CAF, OD, ERP) in English since students search for those exact terms. Return only the translation, no preamble.`;
    const aiAnswer = await callClaude(system, query);
    if (aiAnswer) {
      return Response.json({ mode: "live", answer: aiAnswer });
    }
    return Response.json({
      mode: "offline",
      answer:
        "Live translation needs an ANTHROPIC_API_KEY set in your deployment's environment variables. Once set, this button translates any notice into Hindi (or another language) on demand.",
    });
  }

  // default: "ask" mode — RAG-style Q&A grounded in seeded notices
  const matches = retrieveNotices(query, 4);
  const context = matches
    .map(
      (n) =>
        `[${n.id}] ${n.title}\nStatus: ${n.verified ? "Verified" : "Unconfirmed forward"}\nSource: ${n.source}\nDeadline: ${n.deadline || "none"}\nDetails: ${n.plainExplanation}`
    )
    .join("\n\n");

  const system = `You are Ask UniCue, a chat assistant for Indian college freshers. Answer ONLY using the notices provided below — never invent deadlines, forms, or facts that aren't in them. If the notices don't cover the question, say so plainly and suggest checking the ERP portal or asking a coordinator. Keep answers short (3-5 sentences), warm, and direct — like a helpful senior, not a formal notice. If a notice is "Unconfirmed forward", clearly flag it as unverified rather than stating it as fact.\n\nNotices:\n${context}`;

  const aiAnswer = await callClaude(system, query);
  const sources = matches.map((n) => ({ id: n.id, title: n.title, source: n.source }));

  if (aiAnswer) {
    return Response.json({ mode: "live", answer: aiAnswer, sources });
  }
  return Response.json({
    mode: "offline",
    answer: offlineAskAnswer(query, matches),
    sources,
  });
}
