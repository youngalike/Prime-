"use client";

import { LogOut, PenLine } from "lucide-react";
import { useState } from "react";
import { useEditMode } from "./EditModeProvider";

export function AdminBar() {
  const { isAdmin } = useEditMode();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isAdmin) return null;

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-[150] -translate-x-1/2">
      <div className="glass-panel glow-gold flex items-center gap-3 rounded-full px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-xs font-medium text-gold-300">
          <PenLine size={13} />
          Edit mode
        </span>
        <span className="h-4 w-px bg-gold-400/20" />
        <button
          onClick={logout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 text-xs text-ivory-300 hover:text-gold-300 disabled:opacity-50"
        >
          <LogOut size={13} />
          Exit
        </button>
      </div>
    </div>
  );
}
