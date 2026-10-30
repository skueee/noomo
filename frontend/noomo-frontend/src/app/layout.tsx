// noomo - a llm predictions game
// Copyright (C) 2026  skueee

import type { Metadata } from "next";
import { Kalnia } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const kalnia = Kalnia({
  subsets: ["latin"],
  variable: "--font-kalnia",
});

export const metadata: Metadata = {
  title: "Noomo",
  description: "A game where you need to guess words that an LLM generates",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${kalnia.variable} ${kalnia.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-foreground selection:text-background">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
