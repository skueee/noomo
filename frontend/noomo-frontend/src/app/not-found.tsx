import Link from "next/link";

const possibleSentences = [
  "Not the right page, mate",
  "You should not be here ?",
  "Hum, let's get back to home, shall we ?",
  "404, I'm not a teapot",
  "YOU ended up here. This is not MY fault. Or probably not",
];

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full h-full gap-3">
      <a className="kalnia-title text-[32px]">
        {
          possibleSentences[
            Math.floor(Math.random() * possibleSentences.length)
          ]
        }
      </a>
      <Link href={{ pathname: "/" }}>
        <button className="cursor-pointer items-center justify-center px-5 py-2 rounded-[20px] bg-foreground text-background kalnia-main text-[20px]">
          Back to home
        </button>
      </Link>
    </div>
  );
}
