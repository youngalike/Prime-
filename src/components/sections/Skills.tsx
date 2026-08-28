"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Star, X } from "lucide-react";
import { toast } from "sonner";
import {
  createSkill,
  deleteSkill,
  reorderSkills,
  updateSkill,
  type SkillInput,
} from "@/lib/actions/skills";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RowControls } from "@/components/admin/RowControls";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pill } from "@/components/ui/Pill";
import { StarRating } from "@/components/ui/StarRating";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { ResolvedBackground } from "@/lib/backgrounds";
import type { Skill, SkillCategory } from "@/lib/types/database";

const GROUPS: { key: SkillCategory; label: string; rated: boolean }[] = [
  { key: "pc_mac", label: "On PC or Mac", rated: true },
  { key: "mobile", label: "On Mobile", rated: true },
  { key: "soft", label: "Core Strengths", rated: false },
];

function RatedForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: SkillInput;
  onSubmit: (v: SkillInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [stars, setStars] = useState(initial.stars ?? 3);
  const [years, setYears] = useState(initial.years_label ?? "");
  const [iconUrl, setIconUrl] = useState(initial.icon_url);
  const [saving, setSaving] = useState(false);

  return (
    <div className="glass-panel space-y-3 rounded-xl p-4">
      <div className="flex items-center gap-2">
        {iconUrl && (
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-gold-400/20 bg-surface/70">
            <Image src={iconUrl} alt="" fill className="object-contain p-1" sizes="36px" />
          </div>
        )}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Skill name"
          className="w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-400/60"
        />
      </div>
      <div className="flex items-center gap-2">
        <ImageUploader
          pathPrefix="skill-icons"
          label={iconUrl ? "Change icon" : "Add icon (optional)"}
          accept="image/*"
          onUploaded={([url]) => setIconUrl(url)}
        />
        {iconUrl && (
          <button
            onClick={() => setIconUrl(null)}
            aria-label="Remove icon"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-300/50 text-red-500 hover:bg-red-400/10"
          >
            <X size={13} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => setStars(i + 1)}>
              <Star
                size={16}
                className={i < stars ? "fill-gold-400 text-gold-400" : "fill-transparent text-ink-200"}
              />
            </button>
          ))}
        </div>
        <input
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="e.g. 3+ years"
          className="flex-1 rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-xs text-ink-900 outline-none focus:border-gold-400/60"
        />
      </div>
      <div className="flex gap-2">
        <button
          disabled={saving || !name}
          onClick={async () => {
            setSaving(true);
            try {
              await onSubmit({ name, category: initial.category, stars, years_label: years || null, icon_url: iconUrl });
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-navy-950 disabled:opacity-50"
        >
          Save
        </button>
        <button onClick={onCancel} className="rounded-md border border-gold-400/25 px-3 py-1.5 text-xs text-ink-700">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function Skills({ skills, background }: { skills: Skill[]; background: ResolvedBackground }) {
  const { isAdmin } = useEditMode();
  const [addingIn, setAddingIn] = useState<SkillCategory | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function move(list: Skill[], id: string, dir: -1 | 1) {
    const idx = list.findIndex((s) => s.id === id);
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    const reordered = [...list];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderSkills(reordered.map((s) => s.id));
    } catch {
      toast.error("Couldn't reorder");
    }
  }

  return (
    <section id="skills" className="relative overflow-hidden py-24">
      <SectionBackdrop background={background} />
      <div className="relative mx-auto max-w-5xl px-6 sm:px-10">
        <SectionReveal>
          <SectionHeading eyebrow="What I bring" title="Skills & Expertise" />
        </SectionReveal>

        <div className="grid gap-6 md:grid-cols-3">
        {GROUPS.map((group, gi) => {
          const items = skills
            .filter((s) => s.category === group.key)
            .sort((a, b) => a.sort_order - b.sort_order);

          return (
            <SectionReveal key={group.key} delay={gi * 0.08}>
              <GlassCard className={cn("h-full p-6", !group.rated && "md:col-span-1")}>
                <h3 className="mb-5 font-display text-lg text-gold-600">{group.label}</h3>

                {group.rated ? (
                  <ul className="space-y-4">
                    {items.map((skill, i) => (
                      <li key={skill.id}>
                        {editingId === skill.id ? (
                          <RatedForm
                            initial={{
                              name: skill.name,
                              category: skill.category,
                              stars: skill.stars,
                              years_label: skill.years_label,
                              icon_url: skill.icon_url,
                            }}
                            onSubmit={async (v) => {
                              await updateSkill(skill.id, v);
                              setEditingId(null);
                            }}
                            onCancel={() => setEditingId(null)}
                          />
                        ) : (
                          <div className="group/row flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              {skill.icon_url && (
                                <div className="relative h-7 w-7 shrink-0">
                                  <Image src={skill.icon_url} alt="" fill className="object-contain" sizes="28px" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-ink-900">{skill.name}</p>
                                <div className="mt-1 flex items-center gap-2">
                                  <StarRating value={skill.stars ?? 0} />
                                  {skill.years_label && (
                                    <span className="text-xs text-ink-400">{skill.years_label}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {isAdmin && (
                              <RowControls
                                className="opacity-0 transition-opacity group-hover/row:opacity-100"
                                onEdit={() => setEditingId(skill.id)}
                                onDelete={async () => {
                                  try {
                                    await deleteSkill(skill.id);
                                  } catch {
                                    toast.error("Couldn't delete");
                                  }
                                }}
                                onMoveUp={i > 0 ? () => move(items, skill.id, -1) : undefined}
                                onMoveDown={i < items.length - 1 ? () => move(items, skill.id, 1) : undefined}
                              />
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <Pill key={skill.id} className={isAdmin ? "pr-1.5" : undefined}>
                        {skill.name}
                        {isAdmin && (
                          <button
                            onClick={async () => {
                              try {
                                await deleteSkill(skill.id);
                              } catch {
                                toast.error("Couldn't delete");
                              }
                            }}
                            className="ml-1.5 text-ink-400 hover:text-red-300"
                            aria-label={`Remove ${skill.name}`}
                          >
                            <X size={11} />
                          </button>
                        )}
                      </Pill>
                    ))}
                  </div>
                )}

                {isAdmin && (
                  <div className="mt-5">
                    {addingIn === group.key ? (
                      group.rated ? (
                        <RatedForm
                          initial={{ name: "", category: group.key, stars: 3, years_label: "", icon_url: null }}
                          onSubmit={async (v) => {
                            await createSkill(v, items.length);
                            setAddingIn(null);
                          }}
                          onCancel={() => setAddingIn(null)}
                        />
                      ) : (
                        <SoftSkillQuickAdd
                          onSubmit={async (name) => {
                            await createSkill(
                              { name, category: "soft", stars: null, years_label: null, icon_url: null },
                              items.length,
                            );
                            setAddingIn(null);
                          }}
                          onCancel={() => setAddingIn(null)}
                        />
                      )
                    ) : (
                      <button
                        onClick={() => setAddingIn(group.key)}
                        className="flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-500"
                      >
                        <Plus size={13} /> Add skill
                      </button>
                    )}
                  </div>
                )}
              </GlassCard>
            </SectionReveal>
          );
        })}
        </div>
      </div>
    </section>
  );
}

function SoftSkillQuickAdd({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="flex gap-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Team Leadership"
        className="flex-1 rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-1.5 text-xs text-ink-900 outline-none focus:border-gold-400/60"
      />
      <button
        disabled={saving || !name}
        onClick={async () => {
          setSaving(true);
          try {
            await onSubmit(name);
          } finally {
            setSaving(false);
          }
        }}
        className="rounded-md bg-gold-400 px-2.5 py-1 text-xs font-medium text-navy-950 disabled:opacity-50"
      >
        Add
      </button>
      <button onClick={onCancel} className="rounded-md border border-gold-400/25 px-2.5 py-1 text-xs text-ink-700">
        <X size={12} />
      </button>
    </div>
  );
}
