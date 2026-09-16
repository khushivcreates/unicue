import Link from "next/link";
import Navbar from "@/components/Navbar";

const PAINS = [
  {
    title: "10+ groups, one you",
    body: "Notices scatter across WhatsApp groups, email, the notice board, and the ERP portal — there's no single place to check.",
  },
  {
    title: "Jargon nobody explains",
    body: "CAF, OD, condonation, backlog — freshers are expected to just know what these mean. Most don't, until it's too late.",
  },
  {
    title: "Real deadlines, buried",
    body: "One actual deadline gets lost under dozens of memes and forwards in the same group, on the same day.",
  },
  {
    title: "Zero personalization",
    body: "Hostel updates flood day scholars. Senior-year notices reach freshers. Nobody sees only what's actually theirs.",
  },
];

const PIPELINE = [
  {
    n: "01",
    title: "Ingest",
    body: "Pulls messages from WhatsApp groups, ERP notices, email, and the college website into one pipeline.",
  },
  {
    n: "02",
    title: "Understand",
    body: "AI reads every notice, extracts deadlines & urgency, and decodes campus jargon into plain language.",
  },
  {
    n: "03",
    title: "Personalize",
    body: "Filters and ranks by branch, semester, hostel status & interests — freshers see only what matters.",
  },
  {
    n: "04",
    title: "Deliver",
    body: "A clean dashboard + WhatsApp digest, with deadlines auto-added to a calendar.",
  },
];

const CORE_FEATURES = [
  { icon: "🔤", title: "Jargon Decoder", body: "Paste any campus term or notice, get a plain-English explanation." },
  { icon: "✅", title: "Rumor vs. Reality Score", body: "Every notice is tagged Verified or Unconfirmed forward, at a glance." },
  { icon: "💬", title: "Ask UniCue", body: "A chat box grounded in real notices — with a source link for every answer." },
  { icon: "📋", title: "Auto Action-Tracker", body: "Every deadline and to-do, pulled out of messy notices into one checklist." },
  { icon: "📲", title: "WhatsApp onboarding", body: "Forward one notice to our bot and you're in — no app download required." },
  { icon: "🌐", title: "Regional Language Toggle", body: "One tap turns dense English notices into Hindi." },
];

const BONUS_FEATURES = [
  { icon: "🔥", title: "Vibe Meter / Streak", body: "A daily streak that nudges freshers to actually stay updated." },
  { icon: "⏰", title: "Deadline Countdown Chips", body: "Live, color-coded countdowns on every urgent notice." },
  { icon: "🎓", title: "Explain Like I'm a Fresher", body: "Rewrites any notice in ultra-simple, friendly language." },
  { icon: "👯", title: "Squad Digest", body: "Share a curated weekly digest with your hostel or friend group in one tap." },
  { icon: "💡", title: "Senior Tips Layer", body: "Crowd-sourced one-liners from seniors, attached to the notices they apply to." },
  { icon: "🎉", title: "Confetti on completion", body: "A small dopamine hit every time you clear an action item." },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-3xl">
          <span className="sticker inline-block bg-lime text-ink text-xs font-display font-semibold px-3 py-1 rounded-md border border-ink mb-6">
            Built for freshers, by people who survived being one
          </span>
          <h1 className="font-display font-bold text-5xl sm:text-7xl leading-[0.95] tracking-tight mb-6">
            One feed.
            <br />
            Zero chaos.
          </h1>
          <p className="text-lg sm:text-xl text-ink/70 dark:text-cream/70 mb-3 max-w-xl">
            UniCue turns scattered campus announcements — WhatsApp forwards, notice
            boards, ERP portals, emails — into one clear, personalized, action-ready
            feed.
          </p>
          <p className="text-sm text-ink/50 dark:text-cream/50 mb-8 italic">
            Sounds like unique. Built like it too.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="focus-ring bg-ink text-cream dark:bg-cream dark:text-ink font-display font-semibold px-6 py-3 rounded-full border-2 border-ink dark:border-cream shadow-block hover:-translate-y-0.5 transition-transform"
            >
              Get started →
            </Link>
            <Link
              href="/dashboard"
              className="focus-ring bg-transparent font-display font-semibold px-6 py-3 rounded-full border-2 border-ink dark:border-cream hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
            >
              Peek at the feed
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y-2 border-ink dark:border-cream bg-navy text-cream">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-10 max-w-lg">
            Freshers aren't missing deadlines because they're careless.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PAINS.map((p) => (
              <div key={p.title} className="border-2 border-cream/30 rounded-chunky p-5">
                <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-cream/70 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-5 py-16 sm:py-20">
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-2">
          How UniCue turns chaos into a checklist
        </h2>
        <p className="text-ink/60 dark:text-cream/60 mb-10 max-w-xl">
          Four steps, running quietly in the background every time a new notice drops.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PIPELINE.map((step) => (
            <div
              key={step.n}
              className="card-surface border-2 border-ink dark:border-cream rounded-chunky p-5 shadow-blockSm"
            >
              <span className="font-display font-bold text-3xl text-coral">{step.n}</span>
              <h3 className="font-display font-semibold text-lg mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-ink/70 dark:text-cream/70 leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core features */}
      <section className="border-y-2 border-ink dark:border-cream bg-lime/20 dark:bg-lime/5">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-10">
            What's actually in the demo
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_FEATURES.map((f) => (
              <div
                key={f.title}
                className="card-surface border-2 border-ink dark:border-cream rounded-chunky p-5 shadow-blockSm"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="font-display font-semibold text-base mt-2 mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-ink/70 dark:text-cream/70 leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus features */}
      <section className="max-w-6xl mx-auto px-5 py-16 sm:py-20">
        <span className="sticker inline-block bg-coral text-ink text-xs font-display font-semibold px-3 py-1 rounded-md border border-ink mb-4">
          Bonus features we added
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-10">
          Not in the original pitch deck. Added to make it stick.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BONUS_FEATURES.map((f) => (
            <div
              key={f.title}
              className="border-2 border-ink dark:border-cream rounded-chunky p-5 hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-display font-semibold text-base mt-2 mb-1">{f.title}</h3>
              <p className="text-sm opacity-70 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-2 border-ink dark:border-cream bg-ink text-cream">
        <div className="max-w-6xl mx-auto px-5 py-16 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-6">
            Your first notice is one forward away.
          </h2>
          <Link
            href="/onboarding"
            className="focus-ring inline-block bg-lime text-ink font-display font-semibold px-8 py-3 rounded-full border-2 border-lime hover:-translate-y-0.5 transition-transform"
          >
            Try the onboarding flow →
          </Link>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-5 py-8 text-center text-xs text-ink/40 dark:text-cream/40">
        UniCue — a hackathon prototype. Notices shown are seeded demo data, not real campus data.
      </footer>
    </>
  );
}
