"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createEducation,
  deleteEducation,
  reorderEducation,
  updateEducation,
  type EducationInput,
} from "@/lib/actions/education";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { RowControls } from "@/components/admin/RowControls";
import { GlassCard } from "@/components/ui/GlassCard";
import { TimelineNode } from "@/components/ui/TimelineNode";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Education as EducationRow } from "@/lib/types/database";

function EducationForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: EducationInput;
  onSubmit: (v: EducationInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [degree, setDegree] = useState(initial.degree);
  const [school, setSchool] = useState(initial.school);
  const [location, setLocation] = useState(initial.location ?? "");
  const [period, setPeriod] = useState(initial.period);
  const [saving, setSaving] = useState(false);

  const field = "w-full rounded-lg border border-gold-400/25 bg-navy-900/70 px-3 py-2 text-sm text-ivory-50 outline-none focus:border-gold-400/60";

  return (
    <GlassCard className="space-y-3 p-6">
      <input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Degree / certificate" className={field} />
      <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School" className={field} />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className={field} />
      <input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="Period, e.g. 2019 — Present" className={field} />
      <div className="flex gap-2">
        <button
          disabled={saving || !degree || !school}
          onClick={async () => {
            setSaving(true);
            try {
              await onSubmit({ degree, school, location: location || null, period });
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-navy-950 disabled:opacity-50"
        >
          Save
        </button>
        <button onClick={onCancel} className="rounded-md border border-gold-400/25 px-3 py-1.5 text-xs text-ivory-300">
          Cancel
        </button>
      </div>
    </GlassCard>
  );
}

export function Education({ education }: { education: EducationRow[] }) {
  const { isAdmin } = useEditMode();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const items = [...education].sort((a, b) => a.sort_order - b.sort_order);

  async function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((e) => e.id === id);
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderEducation(reordered.map((e) => e.id));
    } catch {
      toast.error("Couldn't reorder");
    }
  }

  return (
    <section id="education" className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
      <SectionReveal>
        <SectionHeading eyebrow="How I got here" title="Education" />
      </SectionReveal>

      <div>
        {items.map((ed, i) => (
          <TimelineNode key={ed.id} isLast={i === items.length - 1 && !adding} delay={i * 0.1}>
            {editingId === ed.id ? (
              <EducationForm
                initial={{ degree: ed.degree, school: ed.school, location: ed.location, period: ed.period }}
                onSubmit={async (v) => {
                  await updateEducation(ed.id, v);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <GlassCard className="group/row flex items-start justify-between gap-3 p-6">
                <div>
                  <h3 className="font-display text-lg text-ivory-50">{ed.degree}</h3>
                  <p className="text-sm text-gold-300">{ed.school}</p>
                  {ed.location && <p className="text-xs text-ivory-300/70">{ed.location}</p>}
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-ivory-300/60">{ed.period}</p>
                </div>
                {isAdmin && (
                  <RowControls
                    className="opacity-0 transition-opacity group-hover/row:opacity-100"
                    onEdit={() => setEditingId(ed.id)}
                    onDelete={async () => {
                      try {
                        await deleteEducation(ed.id);
                      } catch {
                        toast.error("Couldn't delete");
                      }
                    }}
                    onMoveUp={i > 0 ? () => move(ed.id, -1) : undefined}
                    onMoveDown={i < items.length - 1 ? () => move(ed.id, 1) : undefined}
                  />
                )}
              </GlassCard>
            )}
          </TimelineNode>
        ))}

        {isAdmin && (
          <TimelineNode isLast delay={items.length * 0.1}>
            {adding ? (
              <EducationForm
                initial={{ degree: "", school: "", location: "", period: "" }}
                onSubmit={async (v) => {
                  await createEducation(v, items.length);
                  setAdding(false);
                }}
                onCancel={() => setAdding(false)}
              />
            ) : (
              <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-400">
                <Plus size={13} /> Add education
              </button>
            )}
          </TimelineNode>
        )}
      </div>
    </section>
  );
}
