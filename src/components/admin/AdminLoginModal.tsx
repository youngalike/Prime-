"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useEditMode } from "./EditModeProvider";

export function AdminLoginModal() {
  const { showLogin, closeLogin } = useEditMode();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Incorrect password");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {showLogin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4"
          onClick={closeLogin}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel glow-gold w-full max-w-sm rounded-2xl p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-gold-300">
                <Lock size={17} />
                <h2 className="font-display text-lg">Admin access</h2>
              </div>
              <button
                onClick={closeLogin}
                aria-label="Close"
                className="text-ivory-300 hover:text-gold-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-gold-400/25 bg-navy-900/70 px-4 py-2.5 text-sm text-ivory-50 placeholder:text-ivory-300/40 outline-none focus:border-gold-400/60 focus:shadow-[0_0_0_3px_rgba(242,201,76,0.12)]"
              />
              {error && <p className="text-xs text-red-300">{error}</p>}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full rounded-lg bg-gradient-to-b from-gold-300 to-gold-500 py-2.5 text-sm font-medium text-navy-950 transition-opacity disabled:opacity-50"
              >
                {loading ? "Checking…" : "Unlock"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
