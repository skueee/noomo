// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// actions page

"use server";

// Call to the backend to get the words for the game
export async function getPredictions(input: string) {
  const isProduction =
    typeof process.env.NEXT_PUBLIC_VERCEL_ENV !== "undefined" &&
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  const response = await fetch("https://api.skue.hackclub.app/predict", {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      words_count: 10,
      sentence: input,
      prod: isProduction,
    }),
  });
  const json = await response.json();
  return json;
}
