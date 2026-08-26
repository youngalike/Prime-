"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

export function Header({ shortName }: { shortName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10">
        <a href="#home" className="glass-panel rounded-full px-4 py-2 font-display text-sm text-gold-300">
          {shortName}
        </a>

        <nav className="hidden items-center gap-7 glass-panel rounded-full px-6 py-2.5 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-xs font-medium tracking-wide text-ivory-300 transition-colors hover:text-gold-400"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="glass-panel flex h-10 w-10 items-center justify-center rounded-full text-ivory-50 md:hidden"
        >
          <Menu size={18} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-navy-950/95 backdrop-blur-lg md:hidden"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-6 top-5 glass-panel flex h-10 w-10 items-center justify-center rounded-full text-ivory-50"
            >
              <X size={18} />
            </button>
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-ivory-50 hover:text-gold-400"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
