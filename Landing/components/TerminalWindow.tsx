import type { ReactNode } from "react";

export function TerminalWindow({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-2 border-green-500/40 bg-black shadow-lg shadow-green-500/10">
      {/* Title bar */}
      <div className="border-b border-green-500/30 px-4 py-2 flex items-center gap-2">
        <span className="w-3 h-3 border border-green-500/40 inline-block" />
        <span className="w-3 h-3 border border-green-500/40 inline-block" />
        <span className="w-3 h-3 border border-green-500/40 inline-block" />
        <span className="text-green-500/50 text-xs ml-2 font-mono">
          {title}
        </span>
      </div>
      {/* Body */}
      <div className="p-6 overflow-x-auto font-mono text-sm">{children}</div>
    </div>
  );
}
