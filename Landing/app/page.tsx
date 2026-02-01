import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { CodeExample } from "@/components/CodeExample";
import { CliDemo } from "@/components/CliDemo";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <ScanlineOverlay />
      <main className="relative z-10 flex flex-col items-center">
        <Hero />
        <Features />
        <HowItWorks />
        <CodeExample />
        <CliDemo />
      </main>
      <Footer />
    </div>
  );
}
