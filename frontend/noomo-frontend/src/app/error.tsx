// noomo - a llm predictions game
// Copyright (C) 2026  skueee

// error page

"use client";

const Error = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="kalnia-title text-[32px]">
        Hum, something is not right ?
      </h2>
      <p className="kalnia-main text-[28px]">Error : {error.message}</p>
      <p className="kalnia-main text-[10px]">
        Don&apos;t worry, it&apos;s probably a feature and totally not a bug
      </p>
    </div>
  );
};

export default Error;
