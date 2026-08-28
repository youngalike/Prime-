import type { ReactNode } from "react";

interface TimelineNodeProps {
  children: ReactNode;
  isLast?: boolean;
}

export function TimelineNode({ children, isLast }: TimelineNodeProps) {
  return (
    <div className="relative flex gap-6 sm:gap-8">
      <div className="flex flex-col items-center">
        <div className="relative mt-1.5 h-3.5 w-3.5 shrink-0 animate-dot-bounce rounded-full bg-gold-400">
          <span className="absolute inset-0 animate-glow-pulse rounded-full bg-gold-400 blur-[6px]" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-gold-400/60 to-gold-400/10" />
        )}
      </div>
      <div className="flex-1 pb-10 sm:pb-12">{children}</div>
    </div>
  );
}
