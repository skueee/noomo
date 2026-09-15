// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// index page

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const possibleGoodLuckSentences = [
  "Good Luck !",
  "You can do it !",
  "It's not thaaat hard, you know...",
  "Give it a try !",
];

export default function Home() {
  const router = useRouter();
  const [sentence, setSentence] = useState("");
  const [goodLuckSentence, setGoodLuckSentence] = useState<string>("");

  const goToGame = async () => {
    sessionStorage.setItem("sentence", sentence);
    router.push("/game");
  };

  useEffect(() => {
    sessionStorage.clear();
    setGoodLuckSentence(
      possibleGoodLuckSentences[
        Math.floor(Math.random() * possibleGoodLuckSentences.length)
      ],
    );
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="w-full flex items-center justify-center px-6 py-4">
        <nav className="flex items-center gap-4">
          <a
            href="https://github.com/skueee/noomo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline kalnia-main text-[22px]"
          >
            Source
          </a>
          <a
            href="https://stardance.hackclub.com/projects/52704"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline kalnia-main text-[22px]"
          >
            Stardance
          </a>
        </nav>
      </header>

      <main className="w-full flex flex-1 items-center justify-center p-4">
        <div className="flex flex-col items-center gap-5 max-w-md w-full p-0">
          <h1 className="kalnia-title text-[50px] sm:text-[65px] md:text-[75px]">
            Noomo
          </h1>

          <div className="flex flex-col items-center gap-3 max-w-md w-full p-0">
            <form
              action={() => {
                goToGame();
              }}
              className="play-rect flex flex-row w-full max-w-[520px] h-[92px] px-1"
              style={{ boxShadow: "inset 0px -6px 0px 0px #251d09" }}
            >
              <input
                id="play-input"
                type="text"
                placeholder="Enter text..."
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="kalnia-main text-[32px] flex-1 h-full py-2 px-3 rounded-lg focus:outline-none text-foreground -mt-1 min-w-0"
              />

              <button
                type="submit"
                aria-label="submit"
                className="cursor-pointer mt-1 mx-auto inline-flex items-center justify-center gap-2 px-3 w-[70px] h-[70px] rounded-[15px] bg-foreground text-background hover:bg-opacity-90 transition-colors"
              >
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 44 31"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1.25 15.7541H42.75M24.75 29.7541L42.75 15.7541L24.75 1.75412" />
                </svg>
              </button>
            </form>
            <p className="text-[22px]">{goodLuckSentence}</p>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center py-[10px]">
        <p>
          Made with 🤎 by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/skueee"
            className="hover:font-[541] underline"
          >
            skue
          </a>
        </p>
      </footer>
    </div>
  );
}
