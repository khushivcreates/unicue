"use client";

const KEY = "unicue-tracker";

export function getTrackerItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTrackerItems(items) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("unicue-tracker-updated"));
}

export function addTrackerItem(notice) {
  const items = getTrackerItems();
  if (items.some((i) => i.id === notice.id)) return items;
  const next = [
    ...items,
    {
      id: notice.id,
      title: notice.title,
      deadline: notice.deadline,
      category: notice.category,
      done: false,
      addedAt: new Date().toISOString(),
    },
  ];
  saveTrackerItems(next);
  return next;
}

export function toggleTrackerItem(id) {
  const items = getTrackerItems().map((i) =>
    i.id === id ? { ...i, done: !i.done } : i
  );
  saveTrackerItems(items);
  return items;
}

export function removeTrackerItem(id) {
  const items = getTrackerItems().filter((i) => i.id !== id);
  saveTrackerItems(items);
  return items;
}

export function isTracked(id) {
  return getTrackerItems().some((i) => i.id === id);
}
