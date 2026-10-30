// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// Failure if load fails

import Link from "next/link";

const possibleSentences = [
  "Your request failed...",
  "The game won't launch..."
];

const possibleBodySentences = [
  "Please relaunch a game",
  "Please retry",
  "You can retry to launch a game"
]

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
      <span className="text-[20px]">
        {
          possibleSentences[
            Math.floor(Math.random() * possibleBodySentences.length) // eslint-disable-line react-hooks/purity
          ]
        }
      </span>
      <Link href={{ pathname: "/" }}>
        <button className="cursor-pointer items-center justify-center px-5 py-2 rounded-[20px] bg-foreground text-background kalnia-main text-[20px]">
          Back to home
        </button>
      </Link>
    </div>
  );
}
