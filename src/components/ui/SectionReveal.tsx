import type { CSSProperties, ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// A mount-triggered CSS animation, not a scroll-triggered one: Framer
// Motion's whileInView was unreliable here (content could get stuck at
// opacity 0 for sections the observer never caught, e.g. after a fast
// scroll), so this uses a plain animation that always runs once mounted.
export function SectionReveal({ children, delay = 0, className }: SectionRevealProps) {
  return (
    <div className={`reveal-up ${className ?? ""}`} style={{ animationDelay: `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}
