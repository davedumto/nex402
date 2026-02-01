"use client";

import { useEffect, useRef, useState } from "react";
import { TerminalWindow } from "./TerminalWindow";

interface TermLine {
  text: string;
  style: "cmd" | "output" | "success" | "json" | "blank";
}

const lines: TermLine[] = [
  { text: "$ npx buildx402 my-app", style: "cmd" },
  { text: "> Downloading template...", style: "output" },
  { text: "> Project setup complete!", style: "success" },
  { text: "", style: "blank" },
  { text: "$ npx buildx402 wallet create", style: "cmd" },
  { text: "> Address:  0xaaea...e6f4", style: "output" },
  { text: "> Private Key:  0x7b3f...9a21", style: "output" },
  { text: "", style: "blank" },
  {
    text: "$ npx buildx402 inspect https://my-app.vercel.app/api/fortune",
    style: "cmd",
  },
  { text: "> x402 Endpoint Detected!", style: "success" },
  { text: "> Price: 0.01 USDC", style: "output" },
  { text: "> Network: Aptos Testnet", style: "output" },
  { text: "", style: "blank" },
  {
    text: "$ npx buildx402 pay https://my-app.vercel.app/api/fortune",
    style: "cmd",
  },
  { text: "> Status: 200 OK", style: "success" },
  { text: '> { "fortune": "Your keys, your fortune." }', style: "json" },
];

export function CliDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (visibleCount >= lines.length) return;

    const currentLine = lines[visibleCount];
    const delay = currentLine.style === "cmd" ? 600 : currentLine.style === "blank" ? 300 : 150;

    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [started, visibleCount]);

  const styleMap: Record<TermLine["style"], string> = {
    cmd: "text-green-400",
    output: "text-green-500/60",
    success: "text-yellow-400",
    json: "text-green-300",
    blank: "",
  };

  return (
    <section id="cli" className="w-full max-w-3xl mx-auto px-6 py-24">
      <div ref={ref}>
        <p className="text-green-500/40 text-xs tracking-widest uppercase font-mono mb-2">
          // CLI_DEMO
        </p>
        <h2 className="text-2xl text-green-400 font-bold font-mono mb-12">
          {">"} Your terminal, your toolkit
        </h2>

        <TerminalWindow title="buildx402 — zsh">
          <div className="space-y-1 min-h-[280px]">
            {lines.slice(0, visibleCount).map((line, i) => (
              <div
                key={i}
                className={`${styleMap[line.style]} font-mono text-sm transition-opacity duration-300`}
              >
                {line.text || "\u00A0"}
              </div>
            ))}
            {visibleCount < lines.length && started && (
              <span className="cursor-blink inline-block w-2 h-4 bg-green-400" />
            )}
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
