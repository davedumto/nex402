const links = [
  { label: "GitHub", href: "https://github.com/davedumto/buildx402" },
  { label: "npm", href: "https://www.npmjs.com/package/buildx402" },
  { label: "x402 Protocol", href: "https://www.x402.org/" },
  { label: "Aptos Docs", href: "https://aptos.dev" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-green-500/20 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left */}
        <div className="text-center md:text-left">
          <span className="text-green-400 font-bold text-lg font-mono">
            buildx402
          </span>
          <p className="text-green-500/40 text-xs font-mono mt-1">
            // Built by davedumto for the Aptos x x402 ecosystem
          </p>
        </div>

        {/* Right: links */}
        <nav className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500/60 hover:text-green-400 text-sm font-mono transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
