'use client'

import { useState, useEffect } from 'react';
import { getPredictions } from '@/app/actions'
import { useSearchParams } from 'next/navigation'

export default function Game() {
  const [input, setInput] = useState('')
  const [words, setWords] = useState<any>(null)
  const searchParams = useSearchParams()
  const sentence = searchParams.get('sentence')
  const [score, setScore] = useState<number>(0)
  const [wordsFound, setWordsFound] = useState<number[]>([])

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const result = checkWord(input.trim(), words, wordsFound)
      if (result[0]) {
        setScore(score + 1)
        setWordsFound((prev) => [...prev, result[1]])
        console.log(wordsFound)
      }

      setInput('')
    }
  }

  const getWordToDisplay = (index: number, word: String) => {
    console.log(wordsFound)
    if (wordsFound.includes(Number(index))) {
      console.log("The word number " + index + " returns " + word)
      return word
    } else {
      console.log("The word number " + index + " returns ?")
      return "?"
    }
  }

  useEffect(() => {
    async function getPreds() {
      const result = await getPredictions(sentence)
      setWords(result)
    }

    getPreds()
  }, [])

  if (!words) {
      return <a>Loading</a>;
    }

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="w-full flex items-center justify-center px-6 py-3">
        <a className="kalnia-title text-[48px]">Noomo</a>
      </header>

      <main className="items-center justify-center px-[50px] pb-[40px] w-full flex flex-1">
        <div className="h-full rounded-[20px] flex flex-col items-center w-full border-[5px]">

          <div className="w-full rounded-b-[10px] border-b-[3px] px-[30px] h-[120px] items-center flex">
            <input
              id="play-input"
              type="text"
              placeholder="Enter word..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInput}
              className="kalnia-main text-[32px] w-full h-full py-2 px-3 rounded-lg focus:outline-none text-foreground -mt-1"
            />
            <a className="kalnia-main text-[48px]">{score}/10</a>
          </div>

          <div className="w-full h-full items-center justify-center flex px-150">
            <div className="w-full h-full items-center justify-center flex flex-col">
              {words.map((word) => (
                <WordLine key={word.index} numero={word.index} word={getWordToDisplay(word.index, word.word)}></WordLine>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

type WordLineProps = {
  numero: number;
  word: string;
};

export function WordLine({ numero, word }: WordLineProps) {
  return (
    <div className="flex flex-line gap-[10px]">
      <a className='kalnia-title text-[48px]'>{numero}.</a>
      <a className='kalnia-title text-[48px]'>{word}</a>
    </div>
  )
}

function checkWord(input: string, words, wordsFound: number[]) {

  let match: boolean = false
  let matchIndex: number = 0
  console.log(words)
  for (let i = 0; i < words.length && !match; i++) {
    const wordToCheck = words[i].word
    if (input.localeCompare(wordToCheck, undefined, {sensitivity: 'base'}) === 0 && !wordsFound.includes(words[i].index)) {
      match = true
      matchIndex = words[i].index
    }
  }
  console.log(matchIndex)
  return [match, matchIndex]
}
