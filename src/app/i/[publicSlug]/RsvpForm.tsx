"use client";

import { useState } from "react";

export default function RsvpForm({ inviteId }: { inviteId: string }) {
  const [name, setName] = useState("");
  const [submitResult, setSubmitResult] = useState<{ updated: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRsvp(response: "YES" | "NO" | "MAYBE") {
    if (!name.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, name: name.trim(), response }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitResult({ updated: data.updated });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitResult) {
    return (
      <div className="border p-4 rounded">
        <p>{submitResult.updated ? "RSVP updated" : "RSVP recorded"}</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded space-y-2">
      <input
        className="border p-2 w-full"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitting}
      />
      <div className="flex gap-2">
        <button
          className="border px-3 py-1"
          onClick={() => handleRsvp("YES")}
          disabled={!name.trim() || submitting}
        >
          Yes
        </button>
        <button
          className="border px-3 py-1"
          onClick={() => handleRsvp("NO")}
          disabled={!name.trim() || submitting}
        >
          No
        </button>
        <button
          className="border px-3 py-1"
          onClick={() => handleRsvp("MAYBE")}
          disabled={!name.trim() || submitting}
        >
          Maybe
        </button>
      </div>
    </div>
  );
}
