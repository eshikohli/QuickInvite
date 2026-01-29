"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Style = "hangout" | "meeting" | "party";

const styles: { id: Style; label: string; description: string }[] = [
  { id: "hangout", label: "Hangout", description: "casual" },
  { id: "meeting", label: "Meeting", description: "formal" },
  { id: "party", label: "Party", description: "celebratory" },
];

export default function Home() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValid = selectedStyle !== null && description.trim().length > 0;

  const handleGenerate = async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: selectedStyle, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create invite");
      }

      const data = await response.json();
      router.push(`/host/${data.hostSlug}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={
        selectedStyle
          ? { backgroundImage: `url(/backgrounds/${selectedStyle}.jpg)` }
          : undefined
      }
    >
      <div
        className={`min-h-screen ${selectedStyle ? "bg-black/70" : "bg-zinc-50 dark:bg-zinc-950"}`}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <main className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                QuickInvite
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Generate a complete invitation from a short description.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Style
                </label>
                <div className="flex gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`flex-1 rounded-lg border-2 px-4 py-3 text-center transition-colors ${
                        selectedStyle === style.id
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                          : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:border-zinc-600"
                      }`}
                    >
                      <div className="font-medium">{style.label}</div>
                      <div
                        className={`text-xs ${
                          selectedStyle === style.id
                            ? "text-zinc-300 dark:text-zinc-600"
                            : "text-zinc-500 dark:text-zinc-400"
                        }`}
                      >
                        {style.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Event description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Game night at my place Friday at 7…"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!isValid || isLoading}
                className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
              >
                {isLoading ? "Generating..." : "Generate Invite"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
