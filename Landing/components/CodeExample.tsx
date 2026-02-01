import { AnimateOnScroll } from "./AnimateOnScroll";
import { TerminalWindow } from "./TerminalWindow";

export function CodeExample() {
  return (
    <section id="code" className="w-full max-w-3xl mx-auto px-6 py-24">
      <AnimateOnScroll>
        <p className="text-green-500/40 text-xs tracking-widest uppercase font-mono mb-2">
          // CODE_EXAMPLE
        </p>
        <h2 className="text-2xl text-green-400 font-bold font-mono mb-4">
          {"> It's just middleware"}
        </h2>
        <p className="text-green-500/50 text-sm font-mono mb-12 max-w-xl">
          Any route you build becomes a paid endpoint. Add it to the config,
          set your price, and the middleware handles the rest — payment
          verification, 402 responses, and USDC collection. No payment logic
          in your API code.
        </p>
      </AnimateOnScroll>

      <AnimateOnScroll delay={200}>
        <TerminalWindow title="middleware.ts">
          <pre className="text-sm leading-relaxed">
            <Line comment>{"// middleware.ts — gate any route, set any price"}</Line>
            <Line>
              <Kw>import</Kw> {"{ paymentProxy }"} <Kw>from</Kw>{" "}
              <Str>{'"@rvk_rishikesh/next"'}</Str>;
            </Line>
            <Line />
            <Line>
              <Kw>const</Kw> paymentRoutes = {"{"}
            </Line>
            <Line />
            <Line comment>{"  // A fortune endpoint — 0.01 USDC per request"}</Line>
            <Line>
              {"  "}
              <Str>{'"api/fortune"'}</Str>: {"{"}
            </Line>
            <Line>
              {"    accepts: [{ scheme: "}
              <Str>{'"exact"'}</Str>
              {", price: "}
              <Str>{'"0.01"'}</Str>
              {", ...opts }],"}{" "}
            </Line>
            <Line>{"  },"}</Line>
            <Line />
            <Line comment>{"  // A premium data feed — 0.50 USDC per request"}</Line>
            <Line>
              {"  "}
              <Str>{'"api/data"'}</Str>: {"{"}
            </Line>
            <Line>
              {"    accepts: [{ scheme: "}
              <Str>{'"exact"'}</Str>
              {", price: "}
              <Str>{'"0.50"'}</Str>
              {", ...opts }],"}{" "}
            </Line>
            <Line>{"  },"}</Line>
            <Line />
            <Line comment>{"  // An AI inference endpoint — 1.00 USDC per call"}</Line>
            <Line>
              {"  "}
              <Str>{'"api/generate"'}</Str>: {"{"}
            </Line>
            <Line>
              {"    accepts: [{ scheme: "}
              <Str>{'"exact"'}</Str>
              {", price: "}
              <Str>{'"1.00"'}</Str>
              {", ...opts }],"}{" "}
            </Line>
            <Line>{"  },"}</Line>
            <Line>{"};"}</Line>
            <Line />
            <Line comment>{"// That's it. The middleware intercepts requests,"}</Line>
            <Line comment>{"// returns 402 until paid, then forwards to your API."}</Line>
            <Line>
              <Kw>export</Kw> <Kw>async function</Kw>{" "}
              <span className="text-green-300">middleware</span>(request) {"{"}
            </Line>
            <Line>
              {"  "}
              <Kw>return</Kw> <Kw>await</Kw> proxy(request);
            </Line>
            <Line>{"}"}</Line>
          </pre>
        </TerminalWindow>
      </AnimateOnScroll>

      <AnimateOnScroll delay={400}>
        <div className="border border-green-500/20 bg-green-950/10 p-4 mt-6 font-mono text-xs space-y-1">
          <p className="text-green-500/50">
            {">"} Your API routes stay clean — just return data.
          </p>
          <p className="text-green-500/50">
            {">"} The middleware handles 402 negotiation, payment verification, and USDC settlement.
          </p>
          <p className="text-green-400">
            {">"} Add a route. Set a price. Ship it.
          </p>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

function Line({
  children,
  comment,
}: {
  children?: React.ReactNode;
  comment?: boolean;
}) {
  return (
    <div className={comment ? "text-green-500/40" : "text-green-400"}>
      {children || "\u00A0"}
    </div>
  );
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-yellow-400">{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-green-300">{children}</span>;
}

function Comment({ children }: { children: React.ReactNode }) {
  return <span className="text-green-500/40">{children}</span>;
}
