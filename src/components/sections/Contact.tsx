"use client";

import Image from "next/image";
import { Link2, Mail, MapPin, Phone, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile";
import {
  createSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
  updateSocialLink,
} from "@/lib/actions/socialLinks";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { EditableField } from "@/components/admin/EditableField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RowControls } from "@/components/admin/RowControls";
import { GlassCard } from "@/components/ui/GlassCard";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ResolvedBackground } from "@/lib/backgrounds";
import type { Profile, SocialLink } from "@/lib/types/database";

function AddSocialLinkForm({ onSubmit, onCancel }: { onSubmit: (v: { label: string; url: string }) => Promise<void>; onCancel: () => void }) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const field =
    "w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-xs text-ink-900 outline-none focus:border-gold-400/60";

  return (
    <div className="space-y-2">
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label, e.g. TikTok" className={field} />
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={field} />
      <div className="flex gap-2">
        <button
          disabled={saving || !label || !url}
          onClick={async () => {
            setSaving(true);
            try {
              await onSubmit({ label, url });
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-navy-950 disabled:opacity-50"
        >
          Add
        </button>
        <button onClick={onCancel} className="rounded-md border border-gold-400/25 px-3 py-1.5 text-xs text-ink-700">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function Contact({
  profile,
  socialLinks,
  background,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
  background: ResolvedBackground;
}) {
  const { isAdmin } = useEditMode();
  const [adding, setAdding] = useState(false);

  const socials = [...socialLinks].sort((a, b) => a.sort_order - b.sort_order);

  async function move(id: string, dir: -1 | 1) {
    const idx = socials.findIndex((s) => s.id === id);
    const target = idx + dir;
    if (target < 0 || target >= socials.length) return;
    const reordered = [...socials];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderSocialLinks(reordered.map((s) => s.id));
    } catch {
      toast.error("Couldn't reorder");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <SectionBackdrop background={background} />
      <div className="relative mx-auto max-w-4xl px-6 sm:px-10">
        <SectionReveal>
          <SectionHeading eyebrow="Let's work together" title="Contact" align="center" />
        </SectionReveal>

        <SectionReveal delay={0.1}>
        <GlassCard className="glow-gold grid gap-8 p-8 sm:grid-cols-2 sm:p-10">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-gold-400" />
              <EditableField
                value={profile.location ?? ""}
                onSave={(v) => updateProfile({ location: v })}
                as="p"
                className="text-sm text-ink-700"
                placeholder="Add your location"
              />
            </div>
            <div className="flex items-start gap-3">
              <Mail size={17} className="mt-0.5 shrink-0 text-gold-400" />
              <EditableField
                value={profile.email ?? ""}
                onSave={(v) => updateProfile({ email: v })}
                as="p"
                className="text-sm text-ink-700"
                placeholder="Add your email"
              />
            </div>
            <div className="flex items-start gap-3">
              <Phone size={17} className="mt-0.5 shrink-0 text-gold-400" />
              <div className="space-y-1">
                <EditableField
                  value={profile.phone_primary ?? ""}
                  onSave={(v) => updateProfile({ phone_primary: v })}
                  as="p"
                  className="text-sm text-ink-700"
                  placeholder="Add a phone number"
                />
                {(profile.phone_secondary || isAdmin) && (
                  <EditableField
                    value={profile.phone_secondary ?? ""}
                    onSave={(v) => updateProfile({ phone_secondary: v })}
                    as="p"
                    className="text-sm text-ink-700"
                    placeholder="Add a second phone number"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-400">Find me online</p>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <SocialIcon key={s.id} href={s.url} iconUrl={s.icon_url} label={s.label} />
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="space-y-3 border-t border-gold-400/10 pt-4">
                {socials.map((s, i) => (
                  <div key={s.id} className="group/row flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-400/25 bg-surface/70">
                      {s.icon_url ? (
                        <Image src={s.icon_url} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                      ) : (
                        <Link2 size={12} className="text-ink-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <EditableField
                        value={s.label}
                        onSave={(v) => updateSocialLink(s.id, { label: v, url: s.url, icon_url: s.icon_url })}
                        as="p"
                        className="text-xs font-medium text-ink-900"
                      />
                      <EditableField
                        value={s.url}
                        onSave={(v) => updateSocialLink(s.id, { label: s.label, url: v, icon_url: s.icon_url })}
                        as="p"
                        className="max-w-[160px] truncate text-[11px] text-ink-400"
                      />
                    </div>
                    <ImageUploader
                      pathPrefix="social-icons"
                      label="Icon"
                      className="shrink-0 [&>button]:px-2 [&>button]:py-1"
                      onUploaded={([url]) =>
                        updateSocialLink(s.id, { label: s.label, url: s.url, icon_url: url })
                      }
                    />
                    <RowControls
                      className="shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100"
                      onDelete={async () => {
                        try {
                          await deleteSocialLink(s.id);
                        } catch {
                          toast.error("Couldn't delete");
                        }
                      }}
                      onMoveUp={i > 0 ? () => move(s.id, -1) : undefined}
                      onMoveDown={i < socials.length - 1 ? () => move(s.id, 1) : undefined}
                    />
                  </div>
                ))}

                {adding ? (
                  <AddSocialLinkForm
                    onSubmit={async (v) => {
                      await createSocialLink({ ...v, icon_url: null }, socials.length);
                      setAdding(false);
                    }}
                    onCancel={() => setAdding(false)}
                  />
                ) : (
                  <button
                    onClick={() => setAdding(true)}
                    className="flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-500"
                  >
                    <Plus size={13} /> Add social link
                  </button>
                )}
              </div>
            )}
          </div>
        </GlassCard>
        </SectionReveal>
      </div>
    </section>
  );
}
