import { Entry } from "../types/entry";

const API_URL = "http://localhost:4000/entries";

export async function fetchEntries(): Promise<Entry[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  return res.json();
}

export async function createEntry(entry: Omit<Entry, "id">) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });

  if (!res.ok) {
    throw await res.json();
  }
}
