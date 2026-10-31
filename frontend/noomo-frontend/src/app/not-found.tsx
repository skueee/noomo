// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// 404 page

import Link from "next/link";

const possibleSentences = [
  "404. Not the right page, mate",
  "404. You should not be here ?",
  "404. Hum, let's get back to home, shall we ?",
  "404, I'm not a teapot",
  "404. YOU ended up here. This is not MY fault. Or probably not",
  "404. This isn't the right place to go",
  "404. I mean, you are free to explore wherever you want to go...",
];

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full h-full gap-3">
      <h2 className="kalnia-title text-[32px]">
        {
          possibleSentences[
            Math.floor(Math.random() * possibleSentences.length) // eslint-disable-line react-hooks/purity
          ]
        }
      </h2>
      <Link href={{ pathname: "/" }}>
        <button className="cursor-pointer items-center justify-center px-5 py-2 rounded-[20px] bg-foreground text-background kalnia-main text-[20px]">
          Back to home
        </button>
      </Link>
    </div>
  );
}
