"use client";

import { Check, PenLine, X } from "lucide-react";
import { useState, type ElementType } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEditMode } from "./EditModeProvider";

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  multiline?: boolean;
  as?: ElementType;
  className?: string;
  placeholder?: string;
}

export function EditableField({
  value,
  onSave,
  multiline,
  as: As = "span",
  className,
  placeholder = "—",
}: EditableFieldProps) {
  const { isAdmin } = useEditMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const displayClass = cn(className, multiline && "whitespace-pre-line");

  if (!isAdmin) {
    return <As className={displayClass}>{value || placeholder}</As>;
  }

  if (!editing) {
    return (
      <span className="group/edit relative inline-flex items-start gap-2">
        <As className={displayClass}>{value || placeholder}</As>
        <button
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-surface/90 text-gold-600 opacity-0 transition-opacity group-hover/edit:opacity-100"
          aria-label="Edit"
        >
          <PenLine size={11} />
        </button>
      </span>
    );
  }

  async function save() {
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
  }

  const Field = multiline ? "textarea" : "input";

  return (
    <div className="w-full space-y-2">
      <Field
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={multiline ? Math.min(Math.max(5, draft.split("\n").length + Math.floor(draft.length / 80)), 20) : undefined}
        className={cn(
          "w-full rounded-lg border border-gold-400/30 bg-surface/80 px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-400/60",
          className,
        )}
      />
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving}
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
