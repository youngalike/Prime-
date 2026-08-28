"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { updateProfile } from "@/lib/actions/profile";
import { EditableField } from "@/components/admin/EditableField";
import { getAvailability } from "@/lib/theme";
import type { Profile } from "@/lib/types/database";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Header({ profile }: { profile: Profile }) {
  const status = getAvailability(profile.availability_status);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center px-6 py-5 sm:px-10"
    >
      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("input, button, textarea")) return;
          document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
        }}
        role="link"
        aria-label="Go to top"
        className="glass-pill flex cursor-pointer items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-5 font-display text-sm text-gold-600"
      >
        <span
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-[2px]"
          style={{ boxShadow: `0 0 0 2px ${status.color}, 0 0 8px 1px ${status.glow}` }}
          title={status.label}
        >
          <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gold-400/15">
            {profile.photo_url ? (
              <Image src={profile.photo_url} alt="" fill className="object-cover" sizes="32px" />
            ) : (
              <span className="text-[10px] font-semibold leading-none text-gold-600">
                {initials(profile.full_name || "AK")}
              </span>
            )}
          </span>
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <EditableField
            value={profile.full_name}
            onSave={(v) => updateProfile({ full_name: v })}
            as="span"
            className="font-display text-sm leading-none text-gold-600"
          />
          <span className="mt-1 flex items-center gap-1.5 text-[10px] font-sans leading-none">
            <EditableField
              value={profile.title}
              onSave={(v) => updateProfile({ title: v })}
              as="span"
              className="max-w-[9rem] truncate text-ink-400"
            />
            <span aria-hidden className="text-ink-200">
              ·
            </span>
            <span className="shrink-0 font-medium" style={{ color: status.color }}>
              {status.label}
            </span>
          </span>
        </div>
      </div>
    </motion.header>
  );
}
