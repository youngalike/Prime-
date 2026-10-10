"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { ArrowDown, Check, PenLine, X } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile";
import { addFloatingIcon, deleteFloatingIcon } from "@/lib/actions/floatingIcons";
import { EditableField } from "@/components/admin/EditableField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GlowButton } from "@/components/ui/GlowButton";
import { Pill } from "@/components/ui/Pill";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { cn } from "@/lib/utils";
import { getFloatingIconSize, getPhotoSize } from "@/lib/theme";
import type { ResolvedBackground } from "@/lib/backgrounds";
import type { FloatingIcon, Profile, SocialLink } from "@/lib/types/database";

function SpecialtiesEditor({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (v: string) => Promise<void>;
}) {
  const { isAdmin } = useEditMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [saving, setSaving] = useState(false);

  const items = (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!isAdmin && items.length === 0) return null;

  if (editing) {
    return (
      <div className="mt-3 w-full max-w-md space-y-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Brand Strategy, E-commerce Design, WordPress Development"
          className="w-full rounded-lg border border-gold-400/30 bg-surface/80 px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-400/60"
        />
        <div className="flex gap-2">
          <button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(draft);
                setEditing(false);
                toast.success("Saved");
              } catch {
                toast.error("Couldn't save — try again");
              } finally {
                setSaving(false);
              }
            }}
            className="flex items-center gap-1 rounded-md bg-gold-400 px-2.5 py-1 text-xs font-medium text-navy-950 disabled:opacity-50"
          >
            <Check size={12} /> Save
          </button>
          <button
            onClick={() => setEditing(false)}
            disabled={saving}
            className="flex items-center gap-1 rounded-md border border-gold-400/25 px-2.5 py-1 text-xs text-ink-700"
          >
            <X size={12} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group/edit mt-3 flex flex-wrap items-center gap-2">
      {items.map((item, i) => (
        <Pill key={i}>{item}</Pill>
      ))}
      {isAdmin && (
        <button
          onClick={() => {
            setDraft(value ?? "");
            setEditing(true);
          }}
          aria-label="Edit specialties"
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border border-gold-400/30 bg-surface/90 text-gold-600 transition-opacity",
            items.length > 0 ? "opacity-0 group-hover/edit:opacity-100" : "opacity-100",
          )}
        >
          <PenLine size={11} />
        </button>
      )}
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

// The hero teaser follows the bio's own structure: the first paragraph the
// owner wrote, trimmed to its first two sentences.
function heroIntro(bio: string): string {
  const firstParagraph = bio.split(/\n\s*\n/)[0].trim();
  const sentences = firstParagraph.match(/[^.!?]+[.!?]+(\s|$)/g);
  return sentences ? sentences.slice(0, 2).join("").trim() : firstParagraph;
}

const ICON_POSITIONS = [
  "-top-6 -left-8",
  "-top-8 right-2",
  "top-1/3 -right-12",
  "bottom-8 -left-12",
  "-bottom-6 right-6",
  "top-2/3 -left-10",
];

export function Hero({
  profile,
  floatingIcons,
  socialLinks,
  background,
}: {
  profile: Profile;
  floatingIcons: FloatingIcon[];
  socialLinks: SocialLink[];
  background: ResolvedBackground;
}) {
  const { isAdmin } = useEditMode();
  const icons = [...floatingIcons].sort((a, b) => a.sort_order - b.sort_order);
  const socials = [...socialLinks].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[75svh] items-center px-6 pb-20 pt-4 sm:px-10 sm:pt-6"
    >
      <SectionBackdrop background={background} />
      <ThemeToggle />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 lg:order-1">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-gold-600">
            Welcome to my portfolio
          </p>

          <h1 className="font-display text-4xl leading-[1.1] text-ink-900 sm:text-5xl lg:text-6xl">
            <EditableField
              value={profile.full_name}
              onSave={(v) => updateProfile({ full_name: v })}
              as="span"
              className="font-display text-4xl sm:text-5xl lg:text-6xl"
            />
          </h1>

          <div className="mt-4 text-lg text-gold-600 sm:text-xl">
            <EditableField
              value={profile.title}
              onSave={(v) => updateProfile({ title: v })}
              as="span"
            />
          </div>

          <SpecialtiesEditor
            value={profile.specialties}
            onSave={(v) => updateProfile({ specialties: v || null })}
          />

          <div className="mt-6 max-w-lg">
            <EditableField
              value={profile.hero_intro?.trim() ? profile.hero_intro : heroIntro(profile.bio)}
              onSave={(v) => updateProfile({ hero_intro: v.trim() || null })}
              as="p"
              multiline
              placeholder="Add a short intro for the top of the page…"
              className="text-sm leading-relaxed text-ink-700 sm:text-base"
            />
          </div>

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

          {(socials.length > 0 || profile.email) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {socials.map((s) => (
                <SocialIcon key={s.id} href={s.url} iconUrl={s.icon_url} label={s.label} />
              ))}
              {profile.email && (
                <SocialIcon href={`mailto:${profile.email}`} label="Email" isEmail />
              )}
            </div>
          )}
        </div>

        <div
          className="relative z-10 order-1 -mt-20 flex justify-center sm:-mt-28 lg:order-2 lg:-mt-32"
          style={{ "--bounce-intensity": profile.bounce_intensity } as CSSProperties}
        >
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 animate-glow-pulse rounded-full bg-gold-400/20 blur-3xl"
            />
            <div
              className={cn(
                "relative animate-float",
                getPhotoSize(profile.photo_size).className,
                !profile.photo_url && "glass-panel glow-gold-lg rounded-[2rem]",
              )}
            >
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.full_name}
                  fill
                  priority
                  className="animate-photo-glow rounded-[2rem] object-cover"
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[2rem]">
                  <span className="font-display text-6xl text-gold-600/80">
                    {initials(profile.full_name || "AKC")}
                  </span>
                </div>
              )}
            </div>

            {icons.map((icon, i) => (
              <div
                key={icon.id}
                className={cn(
                  "group/icon animate-float absolute z-10 flex items-center justify-center rounded-2xl p-2.5",
                  getFloatingIconSize(profile.floating_icon_size).className,
                  ICON_POSITIONS[i % ICON_POSITIONS.length],
                )}
                style={{ animationDelay: `${(i % ICON_POSITIONS.length) * 0.7}s` }}
              >
                <Image
                  src={icon.image_url}
                  alt=""
                  width={40}
                  height={40}
                  className="animate-photo-glow h-full w-full object-contain"
                />
                {isAdmin && (
                  <button
                    onClick={async () => {
                      try {
                        await deleteFloatingIcon(icon.id);
                      } catch {
                        toast.error("Couldn't delete");
                      }
                    }}
                    aria-label="Remove icon"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-900/85 text-white opacity-0 transition-opacity group-hover/icon:opacity-100"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            ))}

            {isAdmin && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <ImageUploader
                  pathPrefix="profile"
                  label="Change photo"
                  onUploaded={([url]) => updateProfile({ photo_url: url })}
                />
                <ImageUploader
                  pathPrefix="floating-icons"
                  multiple
                  label="Add floating icon"
                  onUploaded={async (urls) => {
                    try {
                      await Promise.all(urls.map((url, i) => addFloatingIcon(url, icons.length + i)));
                    } catch {
                      toast.error("Couldn't add icon");
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll down"
        className="glass-pill absolute bottom-8 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full text-gold-600 transition-colors hover:text-gold-500 sm:h-10 sm:w-10"
      >
        <ArrowDown className="animate-float h-6 w-6 sm:h-5 sm:w-5" />
      </button>
    </section>
  );
}
