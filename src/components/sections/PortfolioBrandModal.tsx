"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  addBrandTool,
  addPhaseImage,
  addPortfolioImage,
  createPhase,
  deleteBrand,
  deleteBrandTool,
  deletePhase,
  deletePhaseImage,
  deletePortfolioImage,
  reorderBrandTools,
  reorderPhaseImages,
  reorderPhases,
  reorderPortfolioImages,
  setBrandCoverImage,
  updateBrand,
  updatePhase,
  type PhaseInput,
} from "@/lib/actions/portfolio";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { EditableField } from "@/components/admin/EditableField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RowControls } from "@/components/admin/RowControls";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lightbox } from "@/components/ui/Lightbox";
import { TimelineNode } from "@/components/ui/TimelineNode";
import type { PortfolioBrandWithImages, PortfolioPhaseWithImages, Skill } from "@/lib/types/database";

function PhaseImages({ phase, isAdmin }: { phase: PortfolioPhaseWithImages; isAdmin: boolean }) {
  const images = [...phase.images].sort((a, b) => a.sort_order - b.sort_order);

  async function move(id: string, dir: -1 | 1) {
    const idx = images.findIndex((im) => im.id === id);
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const reordered = [...images];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderPhaseImages(reordered.map((im) => im.id));
    } catch {
      toast.error("Couldn't reorder");
    }
  }

  if (images.length === 0 && !isAdmin) return null;

  return (
    <div className="mt-3">
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group/pimg relative aspect-square overflow-hidden rounded-lg">
              <Image src={img.image_url} alt={phase.title} fill className="object-cover" sizes="120px" />
              {isAdmin && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-navy-950/90 to-transparent p-1 opacity-0 transition-opacity group-hover/pimg:opacity-100">
                  <div className="flex gap-1">
                    <button onClick={() => move(img.id, -1)} className="rounded bg-navy-900/80 px-1 py-0.5 text-[9px] text-gold-300">
                      ←
                    </button>
                    <button onClick={() => move(img.id, 1)} className="rounded bg-navy-900/80 px-1 py-0.5 text-[9px] text-gold-300">
                      →
                    </button>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await deletePhaseImage(img.id);
                      } catch {
                        toast.error("Couldn't delete");
                      }
                    }}
                    className="rounded bg-navy-900/80 p-1 text-red-300"
                    aria-label="Delete image"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {isAdmin && (
        <ImageUploader
          pathPrefix={`portfolio-phases/${phase.id}`}
          multiple
          label="Add photos"
          className="mt-2"
          onUploaded={async (urls) => {
            try {
              await Promise.all(urls.map((url, i) => addPhaseImage(phase.id, url, images.length + i)));
            } catch {
              toast.error("Upload saved failed");
            }
          }}
        />
      )}
    </div>
  );
}

function AddBrandToolForm({
  brandId,
  sortOrder,
  skills,
  existingIconUrls,
  onDone,
}: {
  brandId: string;
  sortOrder: number;
  skills: Skill[];
  existingIconUrls: string[];
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const field =
    "w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-xs text-ink-900 outline-none focus:border-gold-400/60";

  const pickableSkills = skills.filter((s): s is Skill & { icon_url: string } => !!s.icon_url);

  return (
    <div className="glass-panel flex w-full max-w-xs flex-col gap-3 rounded-xl p-4">
      {pickableSkills.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-400">
            From your skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pickableSkills.map((skill) => {
              const alreadyAdded = existingIconUrls.includes(skill.icon_url);
              const selected = iconUrl === skill.icon_url;
              return (
                <button
                  key={skill.id}
                  type="button"
                  title={skill.name}
                  onClick={() => {
                    setIconUrl(skill.icon_url);
                    if (!name) setName(skill.name);
                  }}
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border p-1.5 transition-colors ${
                    selected
                      ? "border-gold-400 bg-gold-400/10"
                      : "border-gold-400/15 bg-surface/70 hover:border-gold-400/40"
                  } ${alreadyAdded && !selected ? "opacity-40" : ""}`}
                >
                  <Image
                    src={skill.icon_url}
                    alt={skill.name}
                    width={28}
                    height={28}
                    className="h-full w-full object-contain"
                  />
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-wide text-ink-400">or add a new one</p>
        </div>
      )}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tool name, e.g. Figma (optional)"
        className={field}
      />

      {iconUrl ? (
        <div className="flex items-center gap-2">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-gold-400/20 bg-surface/70 p-2">
            <Image
              src={iconUrl}
              alt="Icon preview"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </div>
          <ImageUploader
            pathPrefix={`portfolio-tools/${brandId}`}
            label="Change icon"
            onUploaded={([url]) => setIconUrl(url)}
          />
        </div>
      ) : (
        <ImageUploader
          pathPrefix={`portfolio-tools/${brandId}`}
          label="Upload icon"
          onUploaded={([url]) => setIconUrl(url)}
        />
      )}

      <div className="flex gap-2">
        <button
          disabled={saving || !iconUrl}
          onClick={async () => {
            setSaving(true);
            try {
              await addBrandTool(brandId, iconUrl!, name || null, sortOrder);
              onDone();
            } catch {
              toast.error("Couldn't add tool");
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-navy-950 disabled:opacity-50"
        >
          Save
        </button>
        <button onClick={onDone} className="rounded-md border border-gold-400/25 px-3 py-1.5 text-xs text-ink-700">
          Cancel
        </button>
      </div>
    </div>
  );
}

function BrandTools({
  brand,
  isAdmin,
  skills,
}: {
  brand: PortfolioBrandWithImages;
  isAdmin: boolean;
  skills: Skill[];
}) {
  const [adding, setAdding] = useState(false);
  const tools = [...brand.tools].sort((a, b) => a.sort_order - b.sort_order);

  async function move(id: string, dir: -1 | 1) {
    const idx = tools.findIndex((t) => t.id === id);
    const target = idx + dir;
    if (target < 0 || target >= tools.length) return;
    const reordered = [...tools];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderBrandTools(reordered.map((t) => t.id));
    } catch {
      toast.error("Couldn't reorder");
    }
  }

  if (tools.length === 0 && !isAdmin) return null;

  return (
    <div className="mb-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">Tools &amp; Software Used</p>

      {tools.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {tools.map((tool, i) => (
            <div
              key={tool.id}
              title={tool.name ?? undefined}
              className="group/tool relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-gold-400/15 bg-surface/60 p-2"
            >
              <Image
                src={tool.icon_url}
                alt={tool.name ?? "Tool icon"}
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
              {isAdmin && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-0.5 bg-gradient-to-t from-navy-950/90 to-transparent p-0.5 opacity-0 transition-opacity group-hover/tool:opacity-100">
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => move(tool.id, -1)}
                      disabled={i === 0}
                      className="rounded bg-navy-900/80 px-1 py-0.5 text-[9px] text-gold-300 disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => move(tool.id, 1)}
                      disabled={i === tools.length - 1}
                      className="rounded bg-navy-900/80 px-1 py-0.5 text-[9px] text-gold-300 disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await deleteBrandTool(tool.id);
                      } catch {
                        toast.error("Couldn't delete");
                      }
                    }}
                    className="rounded bg-navy-900/80 p-0.5 text-red-300"
                    aria-label="Delete tool"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="mt-3">
          {adding ? (
            <AddBrandToolForm
              brandId={brand.id}
              sortOrder={tools.length}
              skills={skills}
              existingIconUrls={tools.map((t) => t.icon_url)}
              onDone={() => setAdding(false)}
            />
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-500"
            >
              <Plus size={13} /> Add tool
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PhaseForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: PhaseInput;
  onSubmit: (v: PhaseInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description ?? "");
  const [saving, setSaving] = useState(false);

  const field =
    "w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-400/60";

  return (
    <GlassCard className="space-y-3 p-5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Phase title, e.g. Research & Discovery"
        className={field}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What happened in this phase…"
        rows={3}
        className={field}
      />
      <div className="flex gap-2">
        <button
          disabled={saving || !title}
          onClick={async () => {
            setSaving(true);
            try {
              await onSubmit({ title, description: description || null });
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

export function PortfolioBrandModal({
  brand,
  skills,
  onClose,
}: {
  brand: PortfolioBrandWithImages;
  skills: Skill[];
  onClose: () => void;
}) {
  const { isAdmin } = useEditMode();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [addingPhase, setAddingPhase] = useState(false);

  const images = [...brand.images].sort((a, b) => a.sort_order - b.sort_order);
  const phases = [...brand.phases].sort((a, b) => a.sort_order - b.sort_order);

  async function move(id: string, dir: -1 | 1) {
    const idx = images.findIndex((im) => im.id === id);
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const reordered = [...images];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderPortfolioImages(reordered.map((im) => im.id));
    } catch {
      toast.error("Couldn't reorder");
    }
  }

  async function movePhase(id: string, dir: -1 | 1) {
    const idx = phases.findIndex((p) => p.id === id);
    const target = idx + dir;
    if (target < 0 || target >= phases.length) return;
    const reordered = [...phases];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    try {
      await reorderPhases(reordered.map((p) => p.id));
    } catch {
      toast.error("Couldn't reorder");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-navy-950/85 backdrop-blur-md p-4 py-10 sm:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel glow-gold-lg w-full max-w-4xl rounded-2xl p-6 sm:p-8"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-display text-2xl text-ink-900">
                <EditableField
                  value={brand.name}
                  onSave={(v) => updateBrand(brand.id, { name: v, description: brand.description })}
                  as="span"
                  className="font-display text-2xl"
                />
              </h3>
              <div className="mt-1 text-sm text-ink-700">
                <EditableField
                  value={brand.description ?? ""}
                  onSave={(v) => updateBrand(brand.id, { name: brand.name, description: v || null })}
                  as="span"
                  placeholder="Add a short tagline…"
                />
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full glass-panel text-ink-900 hover:text-gold-600"
            >
              <X size={17} />
            </button>
          </div>

          {(brand.overview || isAdmin) && (
            <div className="mb-8">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Overview</p>
              <EditableField
                value={brand.overview ?? ""}
                onSave={(v) =>
                  updateBrand(brand.id, { name: brand.name, description: brand.description, overview: v || null })
                }
                as="p"
                multiline
                placeholder="What was this project about, and what did you do? Give the brief, your role, and the outcome…"
                className="text-sm leading-relaxed text-ink-700 sm:leading-[1.8]"
              />
            </div>
          )}

          <BrandTools brand={brand} isAdmin={isAdmin} skills={skills} />

          {(phases.length > 0 || isAdmin) && (
            <div className="mb-8">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-400">Process</p>
              <div>
                {phases.map((phase, i) => (
                  <TimelineNode key={phase.id} isLast={i === phases.length - 1 && !addingPhase}>
                    {editingPhaseId === phase.id ? (
                      <PhaseForm
                        initial={{ title: phase.title, description: phase.description }}
                        onSubmit={async (v) => {
                          await updatePhase(phase.id, v);
                          setEditingPhaseId(null);
                        }}
                        onCancel={() => setEditingPhaseId(null)}
                      />
                    ) : (
                      <GlassCard className="group/row p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-display text-base text-ink-900">{phase.title}</h4>
                          {isAdmin && (
                            <RowControls
                              className="opacity-0 transition-opacity group-hover/row:opacity-100"
                              onEdit={() => setEditingPhaseId(phase.id)}
                              onDelete={async () => {
                                try {
                                  await deletePhase(phase.id);
                                } catch {
                                  toast.error("Couldn't delete");
                                }
                              }}
                              onMoveUp={i > 0 ? () => movePhase(phase.id, -1) : undefined}
                              onMoveDown={i < phases.length - 1 ? () => movePhase(phase.id, 1) : undefined}
                            />
                          )}
                        </div>
                        {phase.description && (
                          <p className="mt-2 text-sm leading-relaxed text-ink-700">{phase.description}</p>
                        )}
                        <PhaseImages phase={phase} isAdmin={isAdmin} />
                      </GlassCard>
                    )}
                  </TimelineNode>
                ))}

                {isAdmin && (
                  <TimelineNode isLast>
                    {addingPhase ? (
                      <PhaseForm
                        initial={{ title: "", description: "" }}
                        onSubmit={async (v) => {
                          await createPhase(brand.id, v, phases.length);
                          setAddingPhase(false);
                        }}
                        onCancel={() => setAddingPhase(false)}
                      />
                    ) : (
                      <button
                        onClick={() => setAddingPhase(true)}
                        className="flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-500"
                      >
                        <Plus size={13} /> Add phase
                      </button>
                    )}
                  </TimelineNode>
                )}
              </div>
            </div>
          )}

          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">Gallery</p>

          {images.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-400">
              No photos yet{isAdmin ? " — upload the first one below." : "."}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img, i) => (
                <div key={img.id} className="group/img relative aspect-square overflow-hidden rounded-xl">
                  <button
                    className="absolute inset-0"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={img.caption ?? "View image"}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.caption ?? brand.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/img:scale-105"
                      sizes="200px"
                    />
                  </button>

                  {isAdmin && (
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-navy-950/90 to-transparent p-2 opacity-0 transition-opacity group-hover/img:opacity-100">
                      <div className="flex gap-1">
                        <button
                          onClick={() => move(img.id, -1)}
                          disabled={i === 0}
                          className="rounded bg-navy-900/80 px-1.5 py-0.5 text-[10px] text-gold-300 disabled:opacity-30"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => move(img.id, 1)}
                          disabled={i === images.length - 1}
                          className="rounded bg-navy-900/80 px-1.5 py-0.5 text-[10px] text-gold-300 disabled:opacity-30"
                        >
                          →
                        </button>
                        <button
                          onClick={() => setBrandCoverImage(brand.id, img.image_url)}
                          className="rounded bg-navy-900/80 px-1.5 py-0.5 text-[10px] text-gold-300"
                        >
                          Set cover
                        </button>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await deletePortfolioImage(img.id);
                          } catch {
                            toast.error("Couldn't delete");
                          }
                        }}
                        className="rounded bg-navy-900/80 p-1 text-red-300"
                        aria-label="Delete image"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {isAdmin && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gold-400/10 pt-5">
              <ImageUploader
                pathPrefix={`portfolio/${brand.id}`}
                multiple
                label="Add photos"
                onUploaded={async (urls) => {
                  try {
                    await Promise.all(
                      urls.map((url, i) => addPortfolioImage(brand.id, url, images.length + i)),
                    );
                  } catch {
                    toast.error("Upload saved failed");
                  }
                }}
              />
              <button
                onClick={async () => {
                  if (!confirm(`Delete the "${brand.name}" album and all its photos?`)) return;
                  try {
                    await deleteBrand(brand.id);
                    onClose();
                  } catch {
                    toast.error("Couldn't delete");
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200"
              >
                <Trash2 size={13} /> Delete album
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images.map((im) => ({ url: im.image_url, caption: im.caption }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </AnimatePresence>
  );
}
