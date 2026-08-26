"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import { EditableField } from "@/components/admin/EditableField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GlowButton } from "@/components/ui/GlowButton";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { useEditMode } from "@/components/admin/EditModeProvider";
import type { Profile } from "@/lib/types/database";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

export function Hero({ profile }: { profile: Profile }) {
  const { isAdmin } = useEditMode();

  const socials = [
    profile.social_instagram && { platform: "instagram" as const, href: profile.social_instagram },
    profile.social_facebook && { platform: "facebook" as const, href: profile.social_facebook },
    profile.social_twitter && { platform: "twitter" as const, href: profile.social_twitter },
    profile.social_linkedin && { platform: "linkedin" as const, href: profile.social_linkedin },
    profile.email && { platform: "email" as const, href: `mailto:${profile.email}` },
  ].filter(Boolean) as { platform: "instagram" | "facebook" | "twitter" | "linkedin" | "email"; href: string }[];

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-28 pb-20 sm:px-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 lg:order-1">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-gold-400">
            Welcome to my portfolio
          </p>

          <h1 className="font-display text-4xl leading-[1.1] text-ivory-50 sm:text-5xl lg:text-6xl">
            <EditableField
              value={profile.full_name}
              onSave={(v) => updateProfile({ full_name: v })}
              as="span"
              className="font-display text-4xl sm:text-5xl lg:text-6xl"
            />
          </h1>

          <div className="mt-4 text-lg text-gold-300 sm:text-xl">
            <EditableField
              value={profile.title}
              onSave={(v) => updateProfile({ title: v })}
              as="span"
            />
          </div>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory-300 sm:text-base">
            {profile.bio.split(". ").slice(0, 2).join(". ")}.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <GlowButton onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}>
              View my work
            </GlowButton>
            <GlowButton
              variant="ghost"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get in touch
            </GlowButton>
          </div>

          {socials.length > 0 && (
            <div className="mt-10 flex gap-3">
              {socials.map((s) => (
                <SocialIcon key={s.platform} platform={s.platform} href={s.href} />
              ))}
            </div>
          )}
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 animate-glow-pulse rounded-full bg-gold-400/20 blur-3xl"
            />
            <div className="glass-panel glow-gold-lg relative h-64 w-64 overflow-hidden rounded-[2rem] sm:h-80 sm:w-80 animate-float">
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.full_name}
                  fill
                  priority
                  className="object-cover"
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-6xl text-gold-400/70">
                    {initials(profile.full_name || "AKC")}
                  </span>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="mt-4 flex justify-center">
                <ImageUploader
                  pathPrefix="profile"
                  label="Change photo"
                  onUploaded={([url]) => updateProfile({ photo_url: url })}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-400/70 hover:text-gold-400"
      >
        <ArrowDown className="animate-float" size={22} />
      </button>
    </section>
  );
}
