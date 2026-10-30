// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// game page

"use client";

import { useState, useEffect } from "react";
import { getDailyChallenge, getPredictions } from "@/app/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AppRouterInstance = ReturnType<typeof useRouter>;

type WordStructure = {
  word: string;
  prob: number;
  index: number;
};

// Sentences that will be shown randomly in the input field
const inputPlaceholderSentences = [
  "Enter a word...",
  "Take a guess...",
  "Make a suppostition...",
  "Any idea ?",
  "Harder than you tought, uh ?",
];

export default function Game() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [words, setWords] = useState<WordStructure[]>([]);
  const [sentence, setSentence] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [wordsFound, setWordsFound] = useState<number[]>([]);
  const [tries, setTries] = useState<number>(0);
  const [cluesCount, setCluesCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(
    "Enter a word, then press enter",
  );
  const [maxClues, setMaxClues] = useState<number>(0);

  // The function that will handle pressing enter
  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      setTries(tries + 1);
      const result = checkWord(input.trim(), words, wordsFound);
      if (result.match) {
        setScore(score + 1);
        setWordsFound((prev) => [...prev, result.matchIndex]);
      }
      setInput("");
      setInputPlaceholder(
        inputPlaceholderSentences[
          Math.floor(Math.random() * inputPlaceholderSentences.length)
        ],
      );
    }
  };

  // Check if it needs to show words on screen or keep them empty
  const getWordToDisplay = (index: number, word: string) => {
    if (wordsFound.includes(Number(index))) {
      return word;
    } else {
      return getWordPlaceholder(word, cluesCount);
    }
  };

  // Helper to see if a word index is in the found list
  const isFound = (index: number) => {
    if (wordsFound.includes(index)) {
      return true;
    } else {
      return false;
    }
  };

  // Helper to add to the clue if there is clues left
  const getAClue = () => {
    if (cluesCount != maxClues) {
      setCluesCount(cluesCount + 1);
    }
  };

  useEffect(() => {
    async function getPredsAndStorage() {
      const storedSentence = sessionStorage.getItem("sentence");
      const storedCluesCount = sessionStorage.getItem("cluesCount");
      const storedWordsCount = sessionStorage.getItem("wordsCount");

      if (storedCluesCount) {
        setMaxClues(Number(storedCluesCount));
      }

      if (storedSentence && storedWordsCount) {
        const result = await getPredictions(
          storedSentence,
          Number(storedWordsCount),
        );
        setWords(result);
        setSentence(storedSentence);
      }
    }

    async function getChallenge() {
      const result = await getDailyChallenge();
      setWords(result.words);
      setSentence(result.sentence);
    }

    const gamemode = sessionStorage.getItem("gamemode");
    if (gamemode == "classic") {
      getPredsAndStorage();
    } else if (gamemode == "challenge") {
      getChallenge();
    }
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    // When winning, go to the win page :)
    if (words.length > 0 && score == words.length) {
      goToResult(words, tries, cluesCount, router, startTime);
    }
  }, [score, cluesCount, router, tries, words, startTime]);

  // Check if the words are populated, and, if not, shows the login screen
  if (words.length < 2) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-5">
        <div className="w-24 h-24 border-[7px] border-t-background rounded-full animate-spin" />
        <a className="kalnia-title text-[48px]">Loading</a>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="w-full grid grid-cols-2 md:grid-cols-3 items-center px-[15px] md:px-[75px] py-3">
        <Link
          href="/"
          className="hidden md:flex cursor-pointer hover:underline hover:before:content-['_\2190'] kalnia-title text-[32px] justify-self-start"
        >
          Noomo
        </Link>
        <a className="kalnia-main text-[28px] sm:text-[48px] justify-self-start md:justify-self-center text-center">
          {sentence}
        </a>
        <button
          onClick={getAClue}
          className="cursor-pointer hover:underline hover:rounded-[10px] kalnia-main text-[20px] sm:text-[32px] border-[2px] px-[10px] py-[2px] rounded-[20px] justify-self-end"
        >
          Clue {cluesCount}/{maxClues}
        </button>
      </header>

      <main className="items-center justify-center px-[50px] pb-[40px] w-full flex flex-1">
        <div className="h-full rounded-[20px] flex flex-col items-center w-full border-[5px]">
          <div className="w-full rounded-b-[10px] border-b-[3px] px-[30px] h-[120px] items-center flex">
            <input
              id="play-input"
              type="text"
              placeholder={inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInput}
              autoFocus
              className="kalnia-main text-[32px] w-full h-full py-2 px-3 rounded-lg focus:outline-none text-foreground -mt-1"
            />
            <a className="kalnia-main text-[48px]">{score}/{words.length}</a>
          </div>

          <div className="w-full h-full items-center justify-center flex p-6 overflow-hidden">
            <div
              className="grid grid-cols-1 md:grid-flow-col items-center justify-center gap-x-12 gap-y-2
                             xl:grid-rows-[repeat(5,_minmax(0,_auto))]
                             grid-rows-[repeat(10,_minmax(0,_auto))]"
            >
              {words.map((word) => (
                <WordLine
                  key={word.index}
                  numero={word.index}
                  word={getWordToDisplay(word.index, word.word)}
                  found={isFound(word.index)}
                ></WordLine>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// WordLine propreties
type WordLineProps = {
  numero: number;
  word: string;
  found: boolean;
};

// COmponent used to display words
export function WordLine({ numero, word, found }: WordLineProps) {
  const textColor = found ? "text-green-600" : "--foreground";
  const backgroundSelectionColor = found
    ? "selection:bg-green-600"
    : "selection:bg-foreground";

  return (
    <div
      className={`flex flex-line gap-[10px] ${textColor} ${backgroundSelectionColor}`}
    >
      <a className="kalnia-title text-[32px] sm:text-[48px]">{numero}.</a>
      <a className="kalnia-title text-[32px] sm:text-[48px]">{word}</a>
    </div>
  );
}

// Function to check if an input word is in the words to find
function checkWord(
  input: string, // the word to check
  words: WordStructure[], // the words to find
  wordsFound: number[], // the words already found
) {
  let match: boolean = false;
  let matchIndex: number = 0;

  for (let i = 0; i < words.length && !match; i++) {
    const wordToCheck = words[i].word;
    if (
      // Checks if the input is equal to the current word in the words array
      input.localeCompare(wordToCheck, undefined, { sensitivity: "base" }) ===
        0 &&
      !wordsFound.includes(words[i].index) // check if the word is not already found
    ) {
      match = true;
      matchIndex = words[i].index;
    }
  }

  return { match, matchIndex };
}

// gets a placeholder with a clue if needed
function getWordPlaceholder(word: string, clues: number) {
  let toReveal: number;
  if (word.length > clues) {
    toReveal = clues;
  } else {
    toReveal = word.length - 1;
  }

  return word.substring(0, toReveal) + "•".repeat(word.length - toReveal);
}

// Goes to the success page
function goToResult(
  words: WordStructure[],
  tries: number,
  clues: number,
  router: AppRouterInstance,
  startTime: number,
) {
  saveToStorage(words, tries, clues, startTime);
  router.push("/game/success");
}

// Saves the stats to the local storage for the success page
function saveToStorage(
  words: WordStructure[],
  tries: number,
  clues: number,
  startTime: number,
) {
  sessionStorage.setItem("words", JSON.stringify(words));
  sessionStorage.setItem("tries", tries.toString());
  sessionStorage.setItem("clues", clues.toString());
  sessionStorage.setItem("duration", (Date.now() - startTime).toString());
}
