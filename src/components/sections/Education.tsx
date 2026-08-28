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
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDateRange, toDbDate, toMonthInput } from "@/lib/dateRange";
import type { ResolvedBackground } from "@/lib/backgrounds";
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
  const [startMonth, setStartMonth] = useState(toMonthInput(initial.start_date));
  const [endMonth, setEndMonth] = useState(toMonthInput(initial.end_date));
  const [isCurrent, setIsCurrent] = useState(initial.is_current);
  const [saving, setSaving] = useState(false);

  const field = "w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-400/60";

  return (
    <GlassCard className="space-y-3 p-6">
      <input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Degree / certificate" className={field} />
      <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School" className={field} />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className={field} />
      <div className="flex flex-wrap items-center gap-3">
        <input type="month" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className={`${field} w-auto`} />
        <label className="flex items-center gap-1.5 text-xs text-ink-700">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            className="accent-gold-500"
          />
          Till present
        </label>
        {!isCurrent && (
          <input type="month" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className={`${field} w-auto`} />
        )}
      </div>
      <div className="flex gap-2">
        <button
          disabled={saving || !degree || !school || !startMonth}
          onClick={async () => {
            setSaving(true);
            try {
              await onSubmit({
                degree,
                school,
                location: location || null,
                start_date: toDbDate(startMonth)!,
                end_date: isCurrent ? null : toDbDate(endMonth),
                is_current: isCurrent,
              });
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
    </GlassCard>
  );
}

export function Education({
  education,
  background,
}: {
  education: EducationRow[];
  background: ResolvedBackground;
}) {
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
    <section id="education" className="relative overflow-hidden py-24">
      <SectionBackdrop background={background} />
      <div className="relative mx-auto max-w-3xl px-6 sm:px-10">
        <SectionReveal>
          <SectionHeading eyebrow="How I got here" title="Education" />
        </SectionReveal>

        <div>
        {items.map((ed, i) => (
          <TimelineNode key={ed.id} isLast={i === items.length - 1 && !adding}>
            {editingId === ed.id ? (
              <EducationForm
                initial={{
                  degree: ed.degree,
                  school: ed.school,
                  location: ed.location,
                  start_date: ed.start_date,
                  end_date: ed.end_date,
                  is_current: ed.is_current,
                }}
                onSubmit={async (v) => {
                  await updateEducation(ed.id, v);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <GlassCard className="group/row flex items-start justify-between gap-3 p-6">
                <div>
                  <h3 className="font-display text-lg text-ink-900">{ed.degree}</h3>
                  <p className="text-sm text-gold-600">{ed.school}</p>
                  {ed.location && <p className="text-xs text-ink-400">{ed.location}</p>}
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-400">{formatDateRange(ed)}</p>
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
          <TimelineNode isLast>
            {adding ? (
              <EducationForm
                initial={{ degree: "", school: "", location: "", start_date: "", end_date: null, is_current: false }}
                onSubmit={async (v) => {
                  await createEducation(v, items.length);
                  setAdding(false);
                }}
                onCancel={() => setAdding(false)}
              />
            ) : (
              <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-500">
                <Plus size={13} /> Add education
              </button>
            )}
          </TimelineNode>
        )}
        </div>
      </div>
    </section>
  );
}
