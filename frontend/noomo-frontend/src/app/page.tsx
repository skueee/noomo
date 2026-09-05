// noomo - a llm predictions game
// Copyright (C) 2026  skueee

import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 max-w-md w-full p-8">
        <h1 className="kalnia-title">Noomo</h1>
        <div className="play-rect w-[520px] h-[92px]" style={{ boxShadow: "inset 0px -6px 0px 0px #251d09" }} />
        <div className="challenge-rect w-[500px] h-[54px]"/>
      </div>
    </main>
  );
}
