// noomo - a llm predictions game
// Copyright (C) 2026  skueee

"use server";

export async function getPredictions(input: string) {
  const response = await fetch("https://api.skue.hackclub.app/predict", {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      words_count: 10,
      sentence: input,
      prod: false,
    }),
  });
  const json = await response.json();
  return json;
}
