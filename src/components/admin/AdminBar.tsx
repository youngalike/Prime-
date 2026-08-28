"use client";

import { LogOut, PenLine, Settings2 } from "lucide-react";
import { useState } from "react";
import { useEditMode } from "./EditModeProvider";
import { SettingsModal } from "./SettingsModal";
import type { Profile, SectionBackground } from "@/lib/types/database";

export function AdminBar({
  profile,
  sectionBackgrounds,
}: {
  profile: Profile;
  sectionBackgrounds: SectionBackground[];
}) {
  const { isAdmin } = useEditMode();
  const [loggingOut, setLoggingOut] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!isAdmin) return null;

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <>
      <div className="fixed right-5 top-20 z-[150] sm:right-8">
        <div className="glass-panel glow-gold flex items-center gap-3 rounded-full px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs font-medium leading-none text-gold-600">
            <PenLine size={13} />
            <span className="leading-none">Edit mode</span>
          </span>
          <span className="h-4 w-px bg-gold-400/20" />
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 text-xs leading-none text-ink-700 hover:text-gold-600"
          >
            <Settings2 size={13} />
            <span className="leading-none">Settings</span>
          </button>
          <span className="h-4 w-px bg-gold-400/20" />
          <button
            onClick={logout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 text-xs leading-none text-ink-700 hover:text-gold-600 disabled:opacity-50"
          >
            <LogOut size={13} />
            <span className="leading-none">Exit</span>
          </button>
        </div>
      </div>

      <SettingsModal
        profile={profile}
        sectionBackgrounds={sectionBackgrounds}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
