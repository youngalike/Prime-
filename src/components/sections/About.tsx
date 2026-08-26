import { updateProfile } from "@/lib/actions/profile";
import { EditableField } from "@/components/admin/EditableField";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/lib/types/database";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-24 sm:px-10">
      <SectionReveal>
        <SectionHeading eyebrow="Get to know me" title="About Me" />
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <GlassCard className="p-8 sm:p-10">
          <EditableField
            value={profile.bio}
            onSave={(v) => updateProfile({ bio: v })}
            as="p"
            multiline
            className="text-sm leading-relaxed text-ivory-300 sm:text-base sm:leading-[1.9]"
          />
        </GlassCard>
      </SectionReveal>
    </section>
  );
}
