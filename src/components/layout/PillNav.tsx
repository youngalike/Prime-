"use client";

import { motion } from "framer-motion";
import { User, IdCard, Sparkles, GraduationCap, Briefcase, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "home", label: "Home", icon: User },
  { id: "about", label: "About", icon: IdCard },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "experience", label: "Experience", icon: GraduationCap },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

export function PillNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Section navigation"
      className="glass-pill glow-gold fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-full p-1.5 sm:bottom-6 sm:gap-1 sm:p-2"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={item.label}
            aria-current={isActive ? "true" : undefined}
            className="relative flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11"
          >
            {isActive && (
              <motion.span
                layoutId="pill-nav-active"
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className="absolute inset-0 overflow-hidden rounded-full bg-gradient-to-b from-gold-300 to-gold-500 shadow-[0_2px_18px_rgba(var(--glow-rgb),0.55),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.12)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/50 to-transparent"
                />
              </motion.span>
            )}
            <motion.span
              whileTap={{ scale: 0.86 }}
              whileHover={{ scale: 1.18, y: -5 }}
              transition={{ type: "spring", stiffness: 420, damping: 15 }}
              className={cn(
                "relative flex h-full w-full items-center justify-center rounded-full transition-colors duration-200",
                isActive
                  ? "text-navy-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
                  : "text-ink-700 hover:text-gold-600 hover:drop-shadow-[0_4px_6px_rgba(var(--glow-rgb),0.35)]",
              )}
            >
              <Icon size={18} strokeWidth={2} />
            </motion.span>
          </a>
        );
      })}
    </motion.nav>
  );
}
