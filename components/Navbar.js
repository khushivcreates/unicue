"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import StreakWidget from "./StreakWidget";

const LINKS = [
  { href: "/dashboard", label: "Feed" },
  { href: "/jargon", label: "Jargon Decoder" },
  { href: "/ask", label: "Ask UniCue" },
  { href: "/tracker", label: "Action Tracker" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink dark:border-cream bg-cream/95 dark:bg-ink/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="font-display font-bold text-xl tracking-tight shrink-0">
          Uni<span className="text-coral">Cue</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="focus-ring px-3 py-2 rounded-lg text-sm font-medium hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <StreakWidget />
          </div>
          <ThemeToggle />
          <button
            className="md:hidden focus-ring w-10 h-10 rounded-full border-2 border-ink dark:border-cream"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t-2 border-ink dark:border-cream px-5 py-3 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="focus-ring px-3 py-2 rounded-lg text-sm font-medium hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2">
            <StreakWidget />
          </div>
        </nav>
      )}
    </header>
  );
}
