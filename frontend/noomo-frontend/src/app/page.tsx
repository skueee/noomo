// noomo - a llm predictions game
// Copyright (C) 2026  skueee

import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-5 max-w-md w-full p-0">

        <h1 className="kalnia-title">Noomo</h1>

        <div className="flex flex-col items-center gap-3 max-w-md w-full p-0">


          <div className="play-rect flex flex-row w-[520px] h-[92px] px-1" style={{ boxShadow: "inset 0px -6px 0px 0px #251d09" }}>

            <input
              id="play-input"
              type="text"
              placeholder="Enter text..."
              className="kalnia-main w-full h-full py-2 px-3 rounded-lg focus:outline-none text-foreground -mt-1"
            />

            <button className="cursor-pointer mt-1 mx-auto inline-flex items-center justify-center gap-2 px-3 w-[70px] h-[70px] rounded-[15px] bg-foreground text-background hover:bg-opacity-90 transition-colors">
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
              </svg></button>
          </div>


          <div className="challenge-rect flex flex-row px-3 w-[500px] h-[54px]">
            <label className="kalnia-main text-background w-full h-full">Daily challenge</label>

            <button className="cursor-pointer mx-auto inline-flex items-center justify-center gap-2 px-1 w-[50px] h-[50px] rounded-[15px] text-background hover:bg-opacity-90 transition-colors">
              <svg
                width="50"
                height="50"
                viewBox="0 0 44 31"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1.25 15.7541H42.75M24.75 29.7541L42.75 15.7541L24.75 1.75412" />
              </svg></button>
          </div>
        </div>
      </div>
    </main>
  );
}
