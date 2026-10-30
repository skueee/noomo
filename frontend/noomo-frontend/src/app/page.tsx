// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// index page

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontalIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";

// Sentences that will be shown randomly at the bottom of the page
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
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
  const [cluesCount, setCluesCount] = useState<string>("5");
  const [wordsCount, setWordsCount] = useState<string>("10");

  // Set session storage and go to the game
  const goToGame = async () => {
    sessionStorage.setItem("sentence", sentence);
    sessionStorage.setItem("cluesCount", cluesCount);
    sessionStorage.setItem("wordsCount", wordsCount);
    router.push("/game");
  };

  useEffect(() => {
    sessionStorage.clear();

    // Set the random sentence in an effect to get no errors
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
                sessionStorage.setItem("gamemode", "classic");
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
                type="button"
                onClick={() => setIsSettingsPopupOpen(true)}
                className="cursor-pointer mt-1 mx-1 px-3 h-[70px] rounded-[15px] hover:bg-opacity-90 transition-colors flex items-center justify-center text-sm font-bold"
              >
                <SlidersHorizontalIcon size={45} />
              </button>

              <button
                type="submit"
                disabled={!sentence.trim()}
                aria-label="submit"
                className="disabled:opacity-80 disabled:cursor-default cursor-pointer mt-1 mx-auto inline-flex items-center justify-center gap-2 px-3 w-[70px] h-[70px] rounded-[15px] bg-foreground text-background hover:bg-opacity-90 transition-colors"
              >
                <ArrowRightIcon size={52} />
              </button>
            </form>

            {isSettingsPopupOpen && (
              <div
                onClick={() => setIsSettingsPopupOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm"
              >
                <div
                  className="bg-background border-foreground p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="kalnia-title text-2xl mb-2 text-foreground">
                    Game Settings
                  </h3>
                  <div className="flex flex-col w-full gap-4">
                    <div className="flex flex-col w-full gap-2">
                      <p className="kalnia-bold text-[18px]">Words count</p>
                      <ParamsOptionsSelect
                        options={[
                          { id: "5", label: "5" },
                          { id: "10", label: "10" },
                          { id: "20", label: "20" },
                        ]}
                        value={wordsCount}
                        onChange={(id) => setWordsCount(id)}
                      />
                    </div>
                    <div className="flex flex-col w-full gap-2">
                      <p className="kalnia-bold text-[18px]">Clues count</p>
                      <ParamsOptionsSelect
                        options={[
                          { id: "3", label: "3" },
                          { id: "5", label: "5" },
                          { id: "10", label: "10" },
                        ]}
                        value={cluesCount}
                        onChange={(id) => setCluesCount(id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                sessionStorage.setItem("gamemode", "challenge");
                goToGame();
              }}
              className="cursor-pointer challenge-rect flex items-center justify-center px-3 w-full max-w-[225px] h-[45px]"
            >
              <span className="kalnia-main text-[25px] text-background">
                Daily challenge
              </span>
            </button>
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
          &nbsp;- {goodLuckSentence}
        </p>
      </footer>
    </div>
  );
}

interface ParamsOptionsSelectPropsOption {
  id: string;
  label: string;
}

interface ParamsOptionsSelectProps {
  options: ParamsOptionsSelectPropsOption[];
  value: string;
  onChange: (id: string) => void;
}

export function ParamsOptionsSelect({
  options,
  value,
  onChange,
}: ParamsOptionsSelectProps) {
  return (
    <div className="flex flex-row gap-2 w-full">
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              isActive ? "bg-foreground text-background" : "outline-1"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
