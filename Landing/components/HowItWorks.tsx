import { AnimateOnScroll } from "./AnimateOnScroll";

const steps = [
  {
    num: "01",
    cmd: "$ npx buildx402 my-app",
    output: "> Scaffolds a Next.js project with x402 payment middleware pre-configured.",
    label: "Scaffold",
  },
  {
    num: "02",
    cmd: "$ npx buildx402 wallet create",
    output: "> Generates an Aptos Ed25519 wallet. Fund it with testnet USDC via the faucet.",
    label: "Configure",
  },
  {
    num: "03",
    cmd: "$ vercel deploy",
    output: "> Ship to production. Your API endpoints are now payment-gated.",
    label: "Deploy",
  },
  {
    num: "04",
    cmd: "$ npx buildx402 inspect <url>",
    output: "> Every request pays you USDC. Inspect and monitor endpoints in real time.",
    label: "Earn",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full max-w-3xl mx-auto px-6 py-24"
    >
      <AnimateOnScroll>
        <p className="text-green-500/40 text-xs tracking-widest uppercase font-mono mb-2">
          // HOW_IT_WORKS
        </p>
        <h2 className="text-2xl text-green-400 font-bold font-mono mb-12">
          {">"} Four steps to earning
        </h2>
      </AnimateOnScroll>

      <div>
        {steps.map((step, i) => (
          <AnimateOnScroll key={step.num} delay={i * 150}>
            <div className="pb-8">
              {/* Number + Label on the same row */}
              <div className="flex items-center gap-4 mb-3">
                <div className="border border-green-500/40 w-10 h-10 flex items-center justify-center text-green-400 font-bold text-sm font-mono shrink-0">
                  {step.num}
                </div>
                <span className="text-green-500/50 text-xs font-mono uppercase tracking-wider">
                  {step.label}
                </span>
              </div>

              {/* Connector line + command/output indented under the number */}
              <div className="flex gap-4">
                <div className="w-10 flex justify-center shrink-0">
                  {i < steps.length - 1 && (
                    <div className="w-px h-full bg-green-500/20" />
                  )}
                </div>
                <div>
                  <p className="text-green-400 font-mono text-sm">
                    {step.cmd}
                  </p>
                  <p className="text-green-500/50 font-mono text-sm mt-1">
                    {step.output}
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
