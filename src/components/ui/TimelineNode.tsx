"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface TimelineNodeProps {
  children: ReactNode;
  isLast?: boolean;
  delay?: number;
}

export function TimelineNode({ children, isLast, delay = 0 }: TimelineNodeProps) {
  return (
    <div className="relative flex gap-6 sm:gap-8">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay }}
          className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full bg-gold-400 shadow-[0_0_16px_rgba(242,201,76,0.7)]"
        >
          <span className="absolute inset-0 animate-glow-pulse rounded-full bg-gold-400 blur-[6px]" />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: delay + 0.1 }}
            style={{ transformOrigin: "top" }}
            className="w-px flex-1 bg-gradient-to-b from-gold-400/50 to-navy-700/40"
          />
        )}
      </div>
      <div className="flex-1 pb-10 sm:pb-12">{children}</div>
    </div>
  );
}
