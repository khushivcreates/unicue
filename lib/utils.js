// Small shared helpers used across UniCue pages/components.

// "Now" the demo is anchored to. Notices are seeded a few days around this,
// so countdowns look alive without needing a live clock synced to real time.
export const DEMO_NOW = new Date("2026-09-16T15:00:00");

export function getCountdown(deadlineIso) {
  if (!deadlineIso) return null;
  const deadline = new Date(deadlineIso);
  const diffMs = deadline.getTime() - DEMO_NOW.getTime();
  if (diffMs <= 0) return { expired: true, label: "Deadline passed" };

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let label;
  if (days > 0) label = `${days}d ${hours}h left`;
  else if (hours > 0) label = `${hours}h ${minutes}m left`;
  else label = `${minutes}m left`;

  let urgencyLevel = "chill";
  if (days === 0 && hours < 6) urgencyLevel = "critical";
  else if (days === 0) urgencyLevel = "urgent";
  else if (days <= 1) urgencyLevel = "soon";

  return { expired: false, label, urgencyLevel, days, hours, minutes };
}

export function formatPostedAt(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// Filters a list of notices by the current fresher profile.
// A notice matches a field if that field is "all"/["all"] or includes the profile value.
export function filterNotices(notices, profile) {
  const { branch, semester, hostelStatus } = profile;

  return notices.filter((n) => {
    const branchOk =
      n.branch.includes("all") || n.branch.includes(branch);
    const semesterOk =
      n.semester.includes("all") || n.semester.includes(semester);
    const hostelOk = n.hostelStatus === "all" || n.hostelStatus === hostelStatus;
    return branchOk && semesterOk && hostelOk;
  });
}

export function urgencyRank(urgency) {
  return { high: 0, medium: 1, low: 2 }[urgency] ?? 3;
}

// Sorts unresolved/urgent/verified notices first, so the top of the feed
// is always "what actually matters right now".
export function sortForFeed(notices) {
  return [...notices].sort((a, b) => {
    const aHasDeadline = a.deadline ? 0 : 1;
    const bHasDeadline = b.deadline ? 0 : 1;
    if (aHasDeadline !== bHasDeadline) return aHasDeadline - bHasDeadline;

    if (a.deadline && b.deadline) {
      const diff = new Date(a.deadline) - new Date(b.deadline);
      if (diff !== 0) return diff;
    }

    const urgencyDiff = urgencyRank(a.urgency) - urgencyRank(b.urgency);
    if (urgencyDiff !== 0) return urgencyDiff;

    return new Date(b.postedAt) - new Date(a.postedAt);
  });
}

export const BRANCHES = ["CSE", "IT", "ECE", "MECH", "CIVIL"];
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const HINDI_DICTIONARY_HINT =
  "Rewrite the following campus notice in simple, friendly Hindi (Devanagari script), " +
  "keeping any form names/acronyms (like CAF, OD) in English since students search for those exact terms.";

export function buildTranslationPrompt(text) {
  return `${HINDI_DICTIONARY_HINT}\n\nNotice:\n${text}`;
}
