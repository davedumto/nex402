"use client";

import dynamic from "next/dynamic";
import { useTypewriter } from "@/hooks/useTypewriter";
import { BlinkingCursor } from "./BlinkingCursor";

const GridScan = dynamic(
  () => import("./GridScan").then((mod) => ({ default: mod.GridScan })),
  { ssr: false }
);

export function Hero() {
  const text = useTypewriter(
    ["buildx402", "Pay-Per-Request", "Aptos + USDC", "buildx402"],
    90,
    50,
    2500
  );

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* GridScan background */}
      <GridScan />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Version badge */}
        <div className="mb-8 border border-green-500/30 px-4 py-1.5 bg-black/60 backdrop-blur-sm">
          <span className="text-green-500/50 text-xs font-mono">
            [v3.0.0] :: buildx402
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-green-400 font-mono mb-6 text-center drop-shadow-[0_0_12px_rgba(74,222,128,0.3)]">
          {text}
          <BlinkingCursor />
        </h1>

        {/* Tagline */}
        <p className="text-green-500/60 text-sm md:text-base max-w-xl text-center font-mono mb-4">
          {"// The developer toolkit for payment-gated APIs on Aptos"}
        </p>

        {/* Subtitle */}
        <p className="text-green-300/80 text-lg font-mono mb-12">
          {">"} Scaffold. Configure. Deploy. Earn.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://www.npmjs.com/package/buildx402"
            target="_blank"
            rel="noopener noreferrer"
            className="glow-pulse border-2 border-green-500 bg-black/60 backdrop-blur-sm px-8 py-4 font-mono font-bold text-green-400 text-base hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200 text-center"
          >
            $ npx buildx402
          </a>
          <a
            href="https://github.com/davedumto/buildx402"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-500/40 bg-black/60 backdrop-blur-sm px-8 py-4 font-mono text-green-400/80 text-base hover:bg-green-950/40 hover:border-green-500/60 transition-all duration-200 text-center"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 z-10 animate-scroll-bounce">
        <span className="text-green-500/30 text-xs font-mono">
          $ scroll --down
        </span>
      </div>
    </section>
  );
}
