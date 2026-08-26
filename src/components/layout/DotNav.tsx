"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

export function DotNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          className="group relative flex items-center justify-end"
        >
          <span
            className={cn(
              "pointer-events-none mr-3 whitespace-nowrap rounded-md glass-panel px-2.5 py-1 text-[11px] text-ivory-300 opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            {s.label}
          </span>
          <span
            className={cn(
              "h-2 w-2 rounded-full border transition-all duration-300",
              active === s.id
                ? "border-gold-400 bg-gold-400 shadow-[0_0_10px_rgba(242,201,76,0.7)] scale-125"
                : "border-ivory-300/30 bg-transparent group-hover:border-gold-400/60",
            )}
          />
        </a>
      ))}
    </nav>
  );
}
