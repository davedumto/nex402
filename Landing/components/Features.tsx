import { AnimateOnScroll } from "./AnimateOnScroll";

const features = [
  {
    cmd: "$ monetize",
    title: "Pay-Per-Request APIs",
    desc: "Gate any API endpoint behind USDC micropayments. No subscriptions, no API keys, no middlemen.",
  },
  {
    cmd: "$ buildx402",
    title: "CLI Toolkit",
    desc: "Scaffold, inspect, and pay x402 endpoints from your terminal. One command to start building.",
  },
  {
    cmd: "$ transact",
    title: "Aptos + USDC",
    desc: "Low-fee, high-speed payments on Aptos blockchain. USDC stablecoin for predictable pricing.",
  },
  {
    cmd: "$ init",
    title: "Instant Scaffolding",
    desc: "npx buildx402 my-app creates a production-ready Next.js app with payment middleware wired up.",
  },
  {
    cmd: "$ wallet",
    title: "Wallet Generation",
    desc: "Generate Aptos Ed25519 wallets from the CLI. No external tools or browser extensions needed.",
  },
  {
    cmd: "$ inspect",
    title: "Endpoint Inspection",
    desc: "Probe any x402 endpoint to see payment requirements, pricing, and network details before paying.",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full max-w-5xl mx-auto px-6 py-24">
      <AnimateOnScroll>
        <p className="text-green-500/40 text-xs tracking-widest uppercase font-mono mb-2">
          // FEATURES
        </p>
        <h2 className="text-2xl text-green-400 font-bold font-mono mb-12">
          {">"} What you get
        </h2>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <AnimateOnScroll key={feature.title} delay={i * 100}>
            <div className="border border-green-500/30 bg-green-950/10 p-6 hover:bg-green-950/40 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 h-full">
              <span className="text-yellow-400 text-xs font-mono block mb-3">
                {feature.cmd}
              </span>
              <h3 className="text-green-400 font-bold text-base font-mono mb-2">
                {feature.title}
              </h3>
              <p className="text-green-500/60 text-sm font-mono">
                {feature.desc}
              </p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
