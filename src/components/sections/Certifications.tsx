"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createCertification,
  deleteCertification,
  setCertificationImage,
  updateCertification,
  type CertificationInput,
} from "@/lib/actions/certifications";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RowControls } from "@/components/admin/RowControls";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lightbox } from "@/components/ui/Lightbox";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ResolvedBackground } from "@/lib/backgrounds";
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

  const field = "w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-400/60";

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
        <button onClick={onCancel} className="rounded-md border border-gold-400/25 px-3 py-1.5 text-xs text-ink-700">
          Cancel
        </button>
      </div>
    </GlassCard>
  );
}

export function Certifications({
  certifications,
  background,
}: {
  certifications: Certification[];
  background: ResolvedBackground;
}) {
  const { isAdmin } = useEditMode();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [lightboxCertId, setLightboxCertId] = useState<string | null>(null);

  const items = [...certifications].sort((a, b) => a.sort_order - b.sort_order);
  const lightboxCert = items.find((c) => c.id === lightboxCertId);

  return (
    <section id="certifications" className="relative overflow-hidden py-24">
      <SectionBackdrop background={background} />
      <div className="relative mx-auto max-w-5xl px-6 sm:px-10">
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
              <GlassCard className="group/row flex h-full flex-col justify-between overflow-hidden p-6">
                {cert.image_url && (
                  <button
                    onClick={() => setLightboxCertId(cert.id)}
                    className="relative -mx-6 -mt-6 mb-4 aspect-[16/10] w-[calc(100%+3rem)] overflow-hidden"
                    aria-label="View certificate proof"
                  >
                    <Image
                      src={cert.image_url}
                      alt={`${cert.title} certificate`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="360px"
                    />
                  </button>
                )}

                <div>
                  <p className="text-xs uppercase tracking-wide text-gold-400">{cert.issuer}</p>
                  <h3 className="mt-2 font-display text-base text-ink-900">{cert.title}</h3>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-gold-600 hover:text-gold-500"
                    >
                      Show credential <ExternalLink size={12} />
                    </a>
                  ) : cert.image_url ? (
                    <button
                      onClick={() => setLightboxCertId(cert.id)}
                      className="text-xs font-medium text-gold-600 hover:text-gold-500"
                    >
                      View proof
                    </button>
                  ) : (
                    <span className="text-xs text-ink-400">Physical certificate</span>
                  )}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover/row:opacity-100">
                      <ImageUploader
                        pathPrefix="certifications"
                        label=""
                        className="[&>button]:flex [&>button]:h-8 [&>button]:w-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border-solid [&>button]:p-0"
                        onUploaded={([url]) => setCertificationImage(cert.id, url)}
                      />
                      <RowControls
                        onEdit={() => setEditingId(cert.id)}
                        onDelete={async () => {
                          try {
                            await deleteCertification(cert.id);
                          } catch {
                            toast.error("Couldn't delete");
                          }
                        }}
                      />
                    </div>
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
              className="flex min-h-[140px] items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gold-400/25 text-xs text-gold-600 hover:border-gold-400/50 hover:bg-gold-400/5"
            >
              <Plus size={13} /> Add certification
            </button>
          ))}
        </div>
      </div>

      {lightboxCert?.image_url && (
        <Lightbox
          images={[{ url: lightboxCert.image_url, caption: `${lightboxCert.title} — ${lightboxCert.issuer}` }]}
          index={0}
          onClose={() => setLightboxCertId(null)}
          onIndexChange={() => {}}
        />
      )}
    </section>
  );
}
