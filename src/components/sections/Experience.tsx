"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createExperience,
  deleteExperience,
  reorderExperience,
  updateExperience,
  type ExperienceInput,
} from "@/lib/actions/experience";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { RowControls } from "@/components/admin/RowControls";
import { GlassCard } from "@/components/ui/GlassCard";
import { TimelineNode } from "@/components/ui/TimelineNode";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDateRange, toDbDate, toMonthInput } from "@/lib/dateRange";
import type { ResolvedBackground } from "@/lib/backgrounds";
import type { Experience as ExperienceRow } from "@/lib/types/database";

function ExperienceForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: ExperienceInput;
  onSubmit: (v: ExperienceInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [company, setCompany] = useState(initial.company);
  const [startMonth, setStartMonth] = useState(toMonthInput(initial.start_date));
  const [endMonth, setEndMonth] = useState(toMonthInput(initial.end_date));
  const [isCurrent, setIsCurrent] = useState(initial.is_current);
  const [bullets, setBullets] = useState(initial.bullets.join("\n"));
  const [saving, setSaving] = useState(false);

  const field = "w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-400/60";

  return (
    <GlassCard className="space-y-3 p-6">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title" className={field} />
      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className={field} />
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
      <textarea
        value={bullets}
        onChange={(e) => setBullets(e.target.value)}
        placeholder="One responsibility per line"
        rows={4}
        className={field}
      />
      <div className="flex gap-2">
        <button
          disabled={saving || !title || !company || !startMonth}
          onClick={async () => {
            setSaving(true);
            try {
              await onSubmit({
                title,
                company,
                start_date: toDbDate(startMonth)!,
                end_date: isCurrent ? null : toDbDate(endMonth),
                is_current: isCurrent,
                bullets: bullets.split("\n").map((b) => b.trim()).filter(Boolean),
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

export function Experience({
  experience,
  background,
}: {
  experience: ExperienceRow[];
  background: ResolvedBackground;
}) {
  const { isAdmin } = useEditMode();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const items = [...experience].sort((a, b) => a.sort_order - b.sort_order);

  async function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((e) => e.id === id);
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderExperience(reordered.map((e) => e.id));
    } catch {
      toast.error("Couldn't reorder");
    }
  }

  return (
    <section id="experience" className="relative overflow-hidden py-24">
      <SectionBackdrop background={background} />
      <div className="relative mx-auto max-w-3xl px-6 sm:px-10">
        <SectionReveal>
          <SectionHeading eyebrow="Where I've worked" title="Experience" />
        </SectionReveal>

        <div>
        {items.map((exp, i) => (
          <TimelineNode key={exp.id} isLast={i === items.length - 1 && !adding}>
            {editingId === exp.id ? (
              <ExperienceForm
                initial={{
                  title: exp.title,
                  company: exp.company,
                  start_date: exp.start_date,
                  end_date: exp.end_date,
                  is_current: exp.is_current,
                  bullets: exp.bullets,
                }}
                onSubmit={async (v) => {
                  await updateExperience(exp.id, v);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <GlassCard className="group/row p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg text-ink-900">{exp.title}</h3>
                    <p className="text-sm text-gold-600">{exp.company}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-400">{formatDateRange(exp)}</p>
                  </div>
                  {isAdmin && (
                    <RowControls
                      className="opacity-0 transition-opacity group-hover/row:opacity-100"
                      onEdit={() => setEditingId(exp.id)}
                      onDelete={async () => {
                        try {
                          await deleteExperience(exp.id);
                        } catch {
                          toast.error("Couldn't delete");
                        }
                      }}
                      onMoveUp={i > 0 ? () => move(exp.id, -1) : undefined}
                      onMoveDown={i < items.length - 1 ? () => move(exp.id, 1) : undefined}
                    />
                  )}
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-2 text-sm leading-relaxed text-ink-700">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            )}
          </TimelineNode>
        ))}

        {isAdmin && (
          <TimelineNode isLast>
            {adding ? (
              <ExperienceForm
                initial={{ title: "", company: "", start_date: "", end_date: null, is_current: false, bullets: [] }}
                onSubmit={async (v) => {
                  await createExperience(v, items.length);
                  setAdding(false);
                }}
                onCancel={() => setAdding(false)}
              />
            ) : (
              <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-500">
                <Plus size={13} /> Add role
              </button>
            )}
          </TimelineNode>
        )}
        </div>
      </div>
    </section>
  );
}
