// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// winning page

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Word {
  word: string;
  prob: number;
  index: number;
}

const possibleSuccessSentence = [
  "Good job !",
  "Well done !",
  "Greaaat !",
  "Nicely done !",
  "I'm honestly impressed",
  "Wowieee !",
  "Not bad, not bad",
];

export default function SuccessPage() {
  const [sentence, setSentence] = useState<string>("");
  const [words, setWords] = useState<Word[]>([]);
  const [tries, setTries] = useState<number>(0);
  const [clues, setClues] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [successSentence, setSuccessSentence] = useState<string>("");

  useEffect(() => {
    const storedSentence = sessionStorage.getItem("sentence");
    const storedWords = sessionStorage.getItem("words");
    const storedTries = sessionStorage.getItem("tries");
    const storedClues = sessionStorage.getItem("clues");
    const storedDuration = sessionStorage.getItem("duration");

    if (storedSentence) {
      setSentence(storedSentence);
    }

    if (storedWords) {
      setWords(JSON.parse(storedWords));
    }

    if (storedTries) {
      setTries(Number(storedTries));
    }

    if (storedClues) {
      setClues(Number(storedClues));
    }

    if (storedDuration) {
      setDuration(Number(storedDuration));
    }

    setSuccessSentence(
      possibleSuccessSentence[
        Math.floor(Math.random() * possibleSuccessSentence.length)
      ],
    );
  }, []);

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="w-full grid grid-cols-2 md:grid-cols-3 items-center px-[75px] py-3">
        <Link
          href="/"
          className="cursor-pointer hover:underline hover:before:content-['_\2190'] kalnia-title text-[32px] justify-self-start"
        >
          Noomo
        </Link>
        <a className="kalnia-main text-[48px] justify-self-end md:justify-self-center text-center">
          {sentence}
        </a>
      </header>

      <main className="items-center justify-center px-[50px] pb-[40px] w-full flex flex-1">
        <div className="h-full rounded-[20px] flex flex-col items-center w-full border-[5px]">
          <div className="w-full rounded-b-[10px] border-b-[3px] px-[30px] h-[120px] items-center justify-between flex">
            <a className="kalnia-title text-[40px] md:text-[48px] text-green-600">
              {successSentence}
            </a>
            <a className="kalnia-main text-[40px] md:text-[48px]">10/10</a>
          </div>

          <div className="items-center justify-center flex flex-row flex-1 gap-10">
            <StatsView
              tries={tries}
              clues={clues}
              duration={duration}
            ></StatsView>
            <div className="w-[0px] border-[1px] h-[500px]" />
            <WordsView words={words}></WordsView>
          </div>
        </div>
      </main>
    </div>
  );
}

type StatsViewProps = {
  tries: number;
  clues: number;
  duration: number;
};

export function StatsView({ tries, clues, duration }: StatsViewProps) {
  const durationArray = getMinutesAndSeconds(duration);
  return (
    <div className="flex flex-col items-end justify-center">
      <a className="kalnia-title text-[36px] sm:text-[40px] md:text-[48px]">
        Stats
      </a>
      <a className="kalnia-main text-[24px] sm:text-[28px] md:text-[32px]">
        {tries} Tries
      </a>
      <a className="kalnia-main text-[24px] sm:text-[28px] md:text-[32px]">
        {clues} Clues
      </a>
      <a className="kalnia-main text-[24px] sm:text-[28px] md:text-[32px]">
        {durationArray.minutesStr}:{durationArray.secondsStr}
      </a>
    </div>
  );
}

type WordsViewProps = {
  words: Word[];
};

export function WordsView({ words }: WordsViewProps) {
  return (
    <div className="flex flex-col items-start justify-center">
      <a className="kalnia-title text-[36px] text-[40px] md:text-[48px]">
        Words
      </a>
      {words.map((word) => (
        <a
          key={word.index}
          className="kalnia-main text-[24px] sm:text-[28px] md:text-[32px]"
        >
          {word.index}. {word.word}
        </a>
      ))}
    </div>
  );
}

function getMinutesAndSeconds(duration: number) {
  const totalSeconds = Math.floor(duration / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let minutesStr: string;
  let secondsStr: string;

  if (minutes.toString().length < 2) {
    minutesStr = "0" + minutes.toString();
  } else {
    minutesStr = minutes.toString();
  }

  if (seconds.toString().length < 2) {
    secondsStr = "0" + seconds.toString();
  } else {
    secondsStr = seconds.toString();
  }

  return {
    minutes,
    minutesStr,
    seconds,
    secondsStr,
  };
}
