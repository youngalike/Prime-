"use client";

import { useRef } from "react";
import { useEditMode } from "@/components/admin/EditModeProvider";
import type { Profile } from "@/lib/types/database";

export function Footer({ profile }: { profile: Profile }) {
  const { openLogin, isAdmin } = useEditMode();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onNameClick() {
    if (isAdmin) return;
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 3000);

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      openLogin();
    }
  }

  return (
    <footer className="border-t border-gold-400/10 px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <button
          onClick={onNameClick}
          className="select-none font-display text-sm text-ivory-300/70 transition-colors hover:text-gold-400"
        >
          &copy; {new Date().getFullYear()} {profile.full_name}
        </button>
        <p className="text-xs text-ivory-300/50">Designed &amp; built with care.</p>
      </div>
    </footer>
  );
}
