"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { EditableField } from "@/components/admin/EditableField";
import { GlassCard } from "@/components/ui/GlassCard";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/lib/types/database";

export function Contact({ profile }: { profile: Profile }) {
  const { isAdmin } = useEditMode();

  const socialFields: {
    key: "social_instagram" | "social_facebook" | "social_twitter" | "social_linkedin";
    label: string;
  }[] = [
    { key: "social_instagram", label: "Instagram URL" },
    { key: "social_facebook", label: "Facebook URL" },
    { key: "social_twitter", label: "Twitter / X URL" },
    { key: "social_linkedin", label: "LinkedIn URL" },
  ];

  const socials = socialFields
    .map((f) => ({ platform: f.key.replace("social_", "") as "instagram" | "facebook" | "twitter" | "linkedin", url: profile[f.key] }))
    .filter((s) => s.url) as { platform: "instagram" | "facebook" | "twitter" | "linkedin"; url: string }[];

  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-24 sm:px-10">
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
                className="text-sm text-ivory-300"
                placeholder="Add your location"
              />
            </div>
            <div className="flex items-start gap-3">
              <Mail size={17} className="mt-0.5 shrink-0 text-gold-400" />
              <EditableField
                value={profile.email ?? ""}
                onSave={(v) => updateProfile({ email: v })}
                as="p"
                className="text-sm text-ivory-300"
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
                  className="text-sm text-ivory-300"
                  placeholder="Add a phone number"
                />
                {(profile.phone_secondary || isAdmin) && (
                  <EditableField
                    value={profile.phone_secondary ?? ""}
                    onSave={(v) => updateProfile({ phone_secondary: v })}
                    as="p"
                    className="text-sm text-ivory-300"
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
                  <SocialIcon key={s.platform} platform={s.platform} href={s.url} />
                ))}
                {profile.email && <SocialIcon platform="email" href={`mailto:${profile.email}`} />}
              </div>
            </div>

            {isAdmin && (
              <div className="space-y-2 border-t border-gold-400/10 pt-4">
                {socialFields.map((f) => (
                  <div key={f.key} className="flex items-center gap-2 text-xs">
                    <span className="w-24 shrink-0 text-ivory-300/60">{f.label}</span>
                    <EditableField
                      value={profile[f.key] ?? ""}
                      onSave={(v) => updateProfile({ [f.key]: v })}
                      as="span"
                      className="text-xs text-ivory-300"
                      placeholder="Not set"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </SectionReveal>
    </section>
  );
}
