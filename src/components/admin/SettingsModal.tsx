"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ImageOff, Settings2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile";
import { clearSectionBackground, setSectionBackground } from "@/lib/actions/backgrounds";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ACCENTS, AVAILABILITY, FLOATING_ICON_SIZES, FONTS, PHOTO_SIZES, isValidHex } from "@/lib/theme";
import { SECTION_KEYS } from "@/lib/types/database";
import type { Profile, SectionBackground, SectionKey } from "@/lib/types/database";

const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  certifications: "Certifications",
  worked_with: "Worked With",
  portfolio: "Portfolio",
  contact: "Contact",
};

function OpacitySlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 w-full cursor-pointer accent-gold-500"
    />
  );
}

function SectionBackgroundRow({ sectionKey, background }: { sectionKey: SectionKey; background: SectionBackground | undefined }) {
  const [opacity, setOpacity] = useState(background?.opacity ?? 0.15);
  const [saving, setSaving] = useState(false);

  async function saveOpacity(v: number) {
    setOpacity(v);
    setSaving(true);
    try {
      await setSectionBackground(sectionKey, { opacity: v });
    } catch {
      toast.error("Couldn't save opacity");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="w-24 shrink-0 text-xs text-ink-700">{SECTION_LABELS[sectionKey]}</span>
      <OpacitySlider value={opacity} onChange={saveOpacity} />
      <ImageUploader
        pathPrefix={`section-backgrounds/${sectionKey}`}
        label=""
        className="shrink-0 [&>button]:flex [&>button]:h-7 [&>button]:w-7 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border-solid [&>button]:p-0"
        onUploaded={async ([url]) => {
          try {
            await setSectionBackground(sectionKey, { image_url: url });
          } catch {
            toast.error("Couldn't save background");
          }
        }}
      />
      {background?.image_url && (
        <button
          onClick={async () => {
            try {
              await clearSectionBackground(sectionKey);
            } catch {
              toast.error("Couldn't clear background");
            }
          }}
          aria-label={`Remove ${SECTION_LABELS[sectionKey]} background`}
          disabled={saving}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-300/50 text-red-500 hover:bg-red-400/10"
        >
          <ImageOff size={12} />
        </button>
      )}
    </div>
  );
}

export function SettingsModal({
  profile,
  sectionBackgrounds,
  open,
  onClose,
}: {
  profile: Profile;
  sectionBackgrounds: SectionBackground[];
  open: boolean;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState<string | null>(null);
  const [hexInput, setHexInput] = useState(profile.theme_accent_hex ?? "");
  const [generalOpacity, setGeneralOpacity] = useState(profile.background_opacity);
  const [googleFontInput, setGoogleFontInput] = useState(profile.google_font_name ?? "");
  const [bounceIntensity, setBounceIntensity] = useState(profile.bounce_intensity ?? 1);
  const [photoGlowHexInput, setPhotoGlowHexInput] = useState(profile.photo_glow_hex ?? "");
  const [photoGlowIntensity, setPhotoGlowIntensity] = useState(profile.photo_glow_intensity ?? 1);
  const [pageGlowIntensity, setPageGlowIntensity] = useState(profile.page_glow_intensity ?? 1);
  const colorWheelRef = useRef<HTMLInputElement>(null);
  const photoGlowWheelRef = useRef<HTMLInputElement>(null);

  async function setAccent(id: (typeof ACCENTS)[number]["id"]) {
    setSaving(id);
    try {
      await updateProfile({ theme_accent: id, theme_accent_hex: null });
      setHexInput("");
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save theme color");
    } finally {
      setSaving(null);
    }
  }

  async function saveHex(hex: string) {
    if (!isValidHex(hex)) {
      toast.error("Enter a valid hex color, e.g. #3b82f6");
      return;
    }
    setHexInput(hex);
    setSaving("hex");
    try {
      await updateProfile({ theme_accent_hex: hex });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save custom color");
    } finally {
      setSaving(null);
    }
  }

  // The color wheel is a native <input type="color"> overlaid on the swatch.
  // Its React onChange fires continuously while dragging, so the actual save
  // is committed on the native "change" event, which only fires once the
  // picker closes on the user's final choice.
  useEffect(() => {
    const el = colorWheelRef.current;
    if (!el) return;
    const handleCommit = (e: Event) => {
      saveHex((e.target as HTMLInputElement).value);
    };
    el.addEventListener("change", handleCommit);
    return () => el.removeEventListener("change", handleCommit);
  }, [open]);

  async function applyHex() {
    await saveHex(hexInput);
  }

  async function setFont(id: (typeof FONTS)[number]["id"]) {
    setSaving(id);
    try {
      await updateProfile({ theme_font: id, custom_font_url: null, google_font_name: null });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save font");
    } finally {
      setSaving(null);
    }
  }

  async function clearCustomFont() {
    try {
      await updateProfile({ custom_font_url: null });
    } catch {
      toast.error("Couldn't remove custom font");
    }
  }

  async function applyGoogleFont() {
    if (!googleFontInput.trim()) return;
    setSaving("google-font");
    try {
      await updateProfile({ google_font_name: googleFontInput.trim(), custom_font_url: null });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save Google Font");
    } finally {
      setSaving(null);
    }
  }

  async function clearGoogleFont() {
    setGoogleFontInput("");
    try {
      await updateProfile({ google_font_name: null });
    } catch {
      toast.error("Couldn't remove Google Font");
    }
  }

  async function setAvailability(id: (typeof AVAILABILITY)[number]["id"]) {
    setSaving(id);
    try {
      await updateProfile({ availability_status: id });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save availability");
    } finally {
      setSaving(null);
    }
  }

  async function setPhotoSize(id: (typeof PHOTO_SIZES)[number]["id"]) {
    setSaving(id);
    try {
      await updateProfile({ photo_size: id });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save photo size");
    } finally {
      setSaving(null);
    }
  }

  async function setFloatingIconSize(id: (typeof FLOATING_ICON_SIZES)[number]["id"]) {
    setSaving(id);
    try {
      await updateProfile({ floating_icon_size: id });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save icon size");
    } finally {
      setSaving(null);
    }
  }

  async function saveBounceIntensity(v: number) {
    setBounceIntensity(v);
    try {
      await updateProfile({ bounce_intensity: v });
    } catch {
      toast.error("Couldn't save bounce intensity");
    }
  }

  async function savePhotoGlowHex(hex: string) {
    if (!isValidHex(hex)) {
      toast.error("Enter a valid hex color, e.g. #3b82f6");
      return;
    }
    setPhotoGlowHexInput(hex);
    setSaving("photo-glow-hex");
    try {
      await updateProfile({ photo_glow_hex: hex });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't save glow color");
    } finally {
      setSaving(null);
    }
  }

  async function clearPhotoGlowColor() {
    setPhotoGlowHexInput("");
    setSaving("photo-glow-hex");
    try {
      await updateProfile({ photo_glow_hex: null });
      toast.success("Saved");
    } catch {
      toast.error("Couldn't reset glow color");
    } finally {
      setSaving(null);
    }
  }

  // Same native-color-input commit pattern as the theme color wheel above —
  // React's onChange fires continuously while dragging, so the save is
  // committed on the native "change" event (fires once, on release).
  useEffect(() => {
    const el = photoGlowWheelRef.current;
    if (!el) return;
    const handleCommit = (e: Event) => {
      savePhotoGlowHex((e.target as HTMLInputElement).value);
    };
    el.addEventListener("change", handleCommit);
    return () => el.removeEventListener("change", handleCommit);
  }, [open]);

  async function applyPhotoGlowHex() {
    await savePhotoGlowHex(photoGlowHexInput);
  }

  async function savePhotoGlowIntensity(v: number) {
    setPhotoGlowIntensity(v);
    try {
      await updateProfile({ photo_glow_intensity: v });
    } catch {
      toast.error("Couldn't save glow intensity");
    }
  }

  async function savePageGlowIntensity(v: number) {
    setPageGlowIntensity(v);
    try {
      await updateProfile({ page_glow_intensity: v });
    } catch {
      toast.error("Couldn't save page glow intensity");
    }
  }

  async function saveGeneralOpacity(v: number) {
    setGeneralOpacity(v);
    try {
      await updateProfile({ background_opacity: v });
    } catch {
      toast.error("Couldn't save opacity");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel glow-gold max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl p-7"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-gold-600">
                <Settings2 size={17} />
                <h2 className="font-display text-lg text-ink-900">Site settings</h2>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-ink-400 hover:text-gold-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Availability
                </p>
                <div className="flex gap-2">
                  {AVAILABILITY.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => setAvailability(status.id)}
                      disabled={saving === status.id}
                      className={`flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors disabled:opacity-50 ${
                        profile.availability_status === status.id
                          ? "border-gold-400/60 bg-gold-400/10 text-ink-900"
                          : "border-gold-400/15 text-ink-700 hover:border-gold-400/40"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: status.color, boxShadow: `0 0 6px 1px ${status.glow}` }}
                      />
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Photo size
                </p>
                <div className="flex gap-2">
                  {PHOTO_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setPhotoSize(size.id)}
                      disabled={saving === size.id}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition-colors disabled:opacity-50 ${
                        profile.photo_size === size.id
                          ? "border-gold-400/60 bg-gold-400/10 text-ink-900"
                          : "border-gold-400/15 text-ink-700 hover:border-gold-400/40"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Floating icon size
                </p>
                <div className="flex gap-2">
                  {FLOATING_ICON_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setFloatingIconSize(size.id)}
                      disabled={saving === size.id}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition-colors disabled:opacity-50 ${
                        profile.floating_icon_size === size.id
                          ? "border-gold-400/60 bg-gold-400/10 text-ink-900"
                          : "border-gold-400/15 text-ink-700 hover:border-gold-400/40"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Bounce intensity
                </p>
                <p className="mb-3 text-[11px] text-ink-400">
                  How much the profile photo and floating icons float and glow.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.5}
                    max={2.5}
                    step={0.1}
                    value={bounceIntensity}
                    onChange={(e) => saveBounceIntensity(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-gold-500"
                  />
                  <span className="w-9 shrink-0 text-right text-xs text-ink-400">
                    {bounceIntensity.toFixed(1)}×
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Photo &amp; icon glow color
                </p>
                <p className="mb-3 text-[11px] text-ink-400">
                  Overrides the glow color on the profile photo and floating icons only —
                  everything else keeps the theme color below.
                </p>
                <div className="flex flex-wrap gap-3">
                  {ACCENTS.map((accent) => (
                    <button
                      key={accent.id}
                      onClick={() => savePhotoGlowHex(accent.swatch)}
                      disabled={saving === "photo-glow-hex"}
                      aria-label={accent.label}
                      title={accent.label}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/60 transition-transform hover:scale-110 disabled:opacity-50"
                      style={{ backgroundColor: accent.swatch }}
                    >
                      {profile.photo_glow_hex?.toLowerCase() === accent.swatch.toLowerCase() && (
                        <Check size={16} className="text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  <div className="relative h-10 w-10">
                    <div
                      aria-hidden
                      className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/60"
                      style={{
                        background: profile.photo_glow_hex || "conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)",
                      }}
                    >
                      {profile.photo_glow_hex && <Check size={16} className="text-white drop-shadow" />}
                    </div>
                    <input
                      ref={photoGlowWheelRef}
                      type="color"
                      defaultValue={isValidHex(profile.photo_glow_hex ?? "") ? profile.photo_glow_hex! : "#f2c94c"}
                      onChange={(e) => setPhotoGlowHexInput(e.target.value)}
                      aria-label="Pick a custom glow color"
                      title="Custom color"
                      className="absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={photoGlowHexInput}
                    onChange={(e) => setPhotoGlowHexInput(e.target.value)}
                    placeholder="#3b82f6"
                    maxLength={7}
                    className="w-28 rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-1.5 font-mono text-xs text-ink-900 outline-none focus:border-gold-400/60"
                  />
                  <button
                    onClick={applyPhotoGlowHex}
                    disabled={saving === "photo-glow-hex" || !photoGlowHexInput}
                    className="rounded-lg bg-gold-400 px-3 py-1.5 text-xs font-medium text-navy-950 disabled:opacity-50"
                  >
                    Use hex
                  </button>
                  {profile.photo_glow_hex && (
                    <button
                      onClick={clearPhotoGlowColor}
                      disabled={saving === "photo-glow-hex"}
                      className="rounded-lg border border-gold-400/25 px-3 py-1.5 text-xs text-ink-700 hover:border-gold-400/40 disabled:opacity-50"
                    >
                      Match theme color
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Photo &amp; icon glow intensity
                </p>
                <p className="mb-3 text-[11px] text-ink-400">
                  How strong the profile photo and floating icon glow appears.
                </p>
                <OpacitySlider value={photoGlowIntensity} onChange={savePhotoGlowIntensity} />
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Theme color
                </p>
                <div className="flex flex-wrap gap-3">
                  {ACCENTS.map((accent) => (
                    <button
                      key={accent.id}
                      onClick={() => setAccent(accent.id)}
                      disabled={saving === accent.id}
                      aria-label={accent.label}
                      title={accent.label}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/60 transition-transform hover:scale-110 disabled:opacity-50"
                      style={{ backgroundColor: accent.swatch }}
                    >
                      {!profile.theme_accent_hex && profile.theme_accent === accent.id && (
                        <Check size={16} className="text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  <div className="relative h-10 w-10">
                    <div
                      aria-hidden
                      className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/60"
                      style={{
                        background: profile.theme_accent_hex || "conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)",
                      }}
                    >
                      {profile.theme_accent_hex && <Check size={16} className="text-white drop-shadow" />}
                    </div>
                    <input
                      ref={colorWheelRef}
                      type="color"
                      defaultValue={isValidHex(profile.theme_accent_hex ?? "") ? profile.theme_accent_hex! : "#f2c94c"}
                      onChange={(e) => setHexInput(e.target.value)}
                      aria-label="Pick a custom color"
                      title="Custom color"
                      className="absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
                    />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    placeholder="#3b82f6"
                    maxLength={7}
                    className="w-28 rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-1.5 font-mono text-xs text-ink-900 outline-none focus:border-gold-400/60"
                  />
                  <button
                    onClick={applyHex}
                    disabled={saving === "hex" || !hexInput}
                    className="rounded-lg bg-gold-400 px-3 py-1.5 text-xs font-medium text-navy-950 disabled:opacity-50"
                  >
                    Use hex
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Page glow intensity
                </p>
                <p className="mb-3 text-[11px] text-ink-400">
                  How strong glow effects appear across cards, buttons, and other UI
                  throughout the site (independent of the photo &amp; icon glow above).
                </p>
                <OpacitySlider value={pageGlowIntensity} onChange={savePageGlowIntensity} />
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Heading font
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setFont(font.id)}
                      disabled={saving === font.id}
                      className={`rounded-xl border px-3 py-2.5 text-left transition-colors disabled:opacity-50 ${
                        !profile.custom_font_url && !profile.google_font_name && profile.theme_font === font.id
                          ? "border-gold-400/60 bg-gold-400/10"
                          : "border-gold-400/15 hover:border-gold-400/40"
                      }`}
                    >
                      <span
                        className="block text-base text-ink-900"
                        style={{ fontFamily: font.headingVar }}
                      >
                        {font.preview}
                      </span>
                      <span className="text-[11px] text-ink-400">{font.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <ImageUploader
                    pathPrefix="fonts"
                    label={profile.custom_font_url ? "Change custom font" : "Upload your own font"}
                    accept=".woff,.woff2,.ttf,.otf"
                    className="[&>button]:w-full [&>button]:justify-center"
                    onUploaded={([url]) => updateProfile({ custom_font_url: url, google_font_name: null })}
                  />
                  {profile.custom_font_url && (
                    <button
                      onClick={clearCustomFont}
                      aria-label="Remove custom font"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-300/50 text-red-500 hover:bg-red-400/10"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {profile.custom_font_url && (
                  <p className="mt-1.5 text-[11px] text-gold-600">
                    Custom font active — overrides the presets above.
                  </p>
                )}

                <p className="mb-1.5 mt-4 text-[11px] text-ink-400">
                  Or use any font from Google Fonts by name:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    value={googleFontInput}
                    onChange={(e) => setGoogleFontInput(e.target.value)}
                    placeholder="e.g. Poppins"
                    className="w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-400/60"
                  />
                  <button
                    onClick={applyGoogleFont}
                    disabled={saving === "google-font" || !googleFontInput.trim()}
                    className="shrink-0 rounded-lg bg-gold-400 px-3 py-2 text-xs font-medium text-navy-950 disabled:opacity-50"
                  >
                    Use
                  </button>
                  {profile.google_font_name && (
                    <button
                      onClick={clearGoogleFont}
                      aria-label="Remove Google Font"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-300/50 text-red-500 hover:bg-red-400/10"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {profile.google_font_name && !profile.custom_font_url && (
                  <p className="mt-1.5 text-[11px] text-gold-600">
                    &ldquo;{profile.google_font_name}&rdquo; active — must be an exact Google Fonts name.
                  </p>
                )}
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Cover photo
                </p>
                <p className="mb-3 text-[11px] text-ink-400">
                  The banner image at the top of the page. Dark mode is optional — it falls back to the
                  light mode cover if not set.
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1.5 text-[11px] text-ink-400">Light mode</p>
                    <div className="flex items-center gap-2">
                      <ImageUploader
                        pathPrefix="profile"
                        label={profile.cover_image_url ? "Change" : "Upload"}
                        onUploaded={async ([url]) => {
                          try {
                            await updateProfile({ cover_image_url: url });
                          } catch {
                            toast.error("Couldn't save cover photo");
                          }
                        }}
                      />
                      {profile.cover_image_url && (
                        <button
                          onClick={async () => {
                            try {
                              await updateProfile({ cover_image_url: null });
                            } catch {
                              toast.error("Couldn't clear cover photo");
                            }
                          }}
                          aria-label="Remove light mode cover photo"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-300/50 text-red-500 hover:bg-red-400/10"
                        >
                          <ImageOff size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] text-ink-400">Dark mode</p>
                    <div className="flex items-center gap-2">
                      <ImageUploader
                        pathPrefix="profile"
                        label={profile.cover_image_url_dark ? "Change" : "Upload"}
                        onUploaded={async ([url]) => {
                          try {
                            await updateProfile({ cover_image_url_dark: url });
                          } catch {
                            toast.error("Couldn't save cover photo");
                          }
                        }}
                      />
                      {profile.cover_image_url_dark && (
                        <button
                          onClick={async () => {
                            try {
                              await updateProfile({ cover_image_url_dark: null });
                            } catch {
                              toast.error("Couldn't clear cover photo");
                            }
                          }}
                          aria-label="Remove dark mode cover photo"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-300/50 text-red-500 hover:bg-red-400/10"
                        >
                          <ImageOff size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-400">
                  General background
                </p>
                <p className="mb-3 text-[11px] text-ink-400">
                  Used on any section that doesn&apos;t have its own background below.
                </p>
                <div className="flex items-center gap-2">
                  <OpacitySlider value={generalOpacity} onChange={saveGeneralOpacity} />
                  <ImageUploader
                    pathPrefix="general-background"
                    label="Upload"
                    className="shrink-0"
                    onUploaded={async ([url]) => {
                      try {
                        await updateProfile({ background_image_url: url });
                      } catch {
                        toast.error("Couldn't save background");
                      }
                    }}
                  />
                  {profile.background_image_url && (
                    <button
                      onClick={async () => {
                        try {
                          await updateProfile({ background_image_url: null });
                        } catch {
                          toast.error("Couldn't clear background");
                        }
                      }}
                      aria-label="Remove general background"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-300/50 text-red-500 hover:bg-red-400/10"
                    >
                      <ImageOff size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Section backgrounds
                </p>
                <div className="divide-y divide-gold-400/10">
                  {SECTION_KEYS.map((key) => (
                    <SectionBackgroundRow
                      key={key}
                      sectionKey={key}
                      background={sectionBackgrounds.find((s) => s.section_key === key)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
