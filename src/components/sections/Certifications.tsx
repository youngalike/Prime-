"use client";

import { useState } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createCertification,
  deleteCertification,
  updateCertification,
  type CertificationInput,
} from "@/lib/actions/certifications";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { RowControls } from "@/components/admin/RowControls";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Certification } from "@/lib/types/database";

function CertForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: CertificationInput;
  onSubmit: (v: CertificationInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [issuer, setIssuer] = useState(initial.issuer);
  const [title, setTitle] = useState(initial.title);
  const [url, setUrl] = useState(initial.credential_url ?? "");
  const [saving, setSaving] = useState(false);

  const field = "w-full rounded-lg border border-gold-400/25 bg-navy-900/70 px-3 py-2 text-sm text-ivory-50 outline-none focus:border-gold-400/60";

  return (
    <GlassCard className="space-y-3 p-6">
      <input value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Issuer, e.g. Meta" className={field} />
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Certificate title" className={field} />
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Credential URL (optional)" className={field} />
      <div className="flex gap-2">
        <button
          disabled={saving || !issuer || !title}
          onClick={async () => {
            setSaving(true);
            try {
              await onSubmit({ issuer, title, credential_url: url || null });
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

export function Certifications({ certifications }: { certifications: Certification[] }) {
  const { isAdmin } = useEditMode();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const items = [...certifications].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="certifications" className="mx-auto max-w-5xl px-6 py-24 sm:px-10">
      <SectionReveal>
        <SectionHeading eyebrow="Verified" title="Certifications" />
      </SectionReveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cert, i) =>
          editingId === cert.id ? (
            <CertForm
              key={cert.id}
              initial={{ issuer: cert.issuer, title: cert.title, credential_url: cert.credential_url }}
              onSubmit={async (v) => {
                await updateCertification(cert.id, v);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <SectionReveal key={cert.id} delay={i * 0.06}>
              <GlassCard className="group/row flex h-full flex-col justify-between p-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gold-400">{cert.issuer}</p>
                  <h3 className="mt-2 font-display text-base text-ivory-50">{cert.title}</h3>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-gold-300 hover:text-gold-400"
                    >
                      Show credential <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs text-ivory-300/50">Physical certificate</span>
                  )}
                  {isAdmin && (
                    <RowControls
                      className="opacity-0 transition-opacity group-hover/row:opacity-100"
                      onEdit={() => setEditingId(cert.id)}
                      onDelete={async () => {
                        try {
                          await deleteCertification(cert.id);
                        } catch {
                          toast.error("Couldn't delete");
                        }
                      }}
                    />
                  )}
                </div>
              </GlassCard>
            </SectionReveal>
          ),
        )}

        {isAdmin &&
          (adding ? (
            <CertForm
              initial={{ issuer: "", title: "", credential_url: "" }}
              onSubmit={async (v) => {
                await createCertification(v, items.length);
                setAdding(false);
              }}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex min-h-[140px] items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gold-400/25 text-xs text-gold-300 hover:border-gold-400/50 hover:bg-gold-400/5"
            >
              <Plus size={13} /> Add certification
            </button>
          ))}
      </div>
    </section>
  );
}
