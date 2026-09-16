// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// actions page

"use server";

// Change this if you run the backend locally
const backend = "https://api.skue.hackclub.app/";

// Call to the backend to get the words for the game
export async function getPredictions(input: string) {
  const isProduction =
    typeof process.env.NEXT_PUBLIC_VERCEL_ENV !== "undefined" &&
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  const response = await fetch(backend + "/predict", {
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

// Call to get today's challenge
export async function getChallenge(input: string) {
  const response = await fetch(backend + "/daily-challenge", {
    cache: "no-store",
    method: "GET",
  });
  const json = await response.json();
  return json;
}
