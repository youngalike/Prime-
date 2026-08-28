"use client";

import Image from "next/image";
import { FolderPlus, Images, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createBrand } from "@/lib/actions/portfolio";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioBrandModal } from "./PortfolioBrandModal";
import type { ResolvedBackground } from "@/lib/backgrounds";
import type { PortfolioBrandWithImages, Skill } from "@/lib/types/database";

export function Portfolio({
  brands,
  skills,
  background,
}: {
  brands: PortfolioBrandWithImages[];
  skills: Skill[];
  background: ResolvedBackground;
}) {
  const { isAdmin } = useEditMode();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const items = [...brands].sort((a, b) => a.sort_order - b.sort_order);
  const selected = items.find((b) => b.id === selectedId) ?? null;

  return (
    <section id="portfolio" className="relative overflow-hidden py-24">
      <SectionBackdrop background={background} />
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <SectionReveal>
          <SectionHeading eyebrow="Selected work" title="Portfolio" />
        </SectionReveal>

        {items.length === 0 && !adding ? (
        <SectionReveal delay={0.1}>
          <GlassCard className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Images className="text-gold-400/60" size={30} />
            <p className="text-sm text-ink-700">
              {isAdmin
                ? "No project albums yet — add your first brand to start showcasing your work."
                : "Project galleries are on their way — check back soon."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setAdding(true)}
                className="mt-2 flex items-center gap-1.5 rounded-full bg-gradient-to-b from-gold-300 to-gold-500 px-5 py-2 text-sm font-medium text-navy-950"
              >
                <FolderPlus size={15} /> Add your first brand
              </button>
            )}
          </GlassCard>
        </SectionReveal>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((brand, i) => (
            <SectionReveal key={brand.id} delay={i * 0.07}>
              <button
                onClick={() => setSelectedId(brand.id)}
                className="group/card relative block aspect-[4/3] w-full overflow-hidden rounded-2xl glass-panel transition-all duration-300 hover:glow-gold hover:-translate-y-1"
              >
                {brand.cover_image_url ?? brand.images[0]?.image_url ? (
                  <Image
                    src={brand.cover_image_url ?? brand.images[0].image_url}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                    sizes="360px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy-800/60">
                    <Images className="text-gold-400/40" size={28} />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent p-5">
                  <p className="font-display text-lg text-ivory-50">{brand.name}</p>
                  <p className="text-xs text-ivory-300/70">
                    {brand.images.length} photo{brand.images.length === 1 ? "" : "s"}
                  </p>
                  {brand.tools.length > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      {brand.tools
                        .slice()
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .slice(0, 6)
                        .map((tool) => (
                          <div
                            key={tool.id}
                            title={tool.name ?? undefined}
                            className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded bg-ivory-50/95 p-0.5"
                          >
                            <Image
                              src={tool.icon_url}
                              alt={tool.name ?? "Tool used"}
                              width={16}
                              height={16}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ))}
                      {brand.tools.length > 6 && (
                        <span className="flex h-5 items-center rounded bg-ivory-50/95 px-1 text-[9px] font-medium text-navy-900">
                          +{brand.tools.length - 6}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            </SectionReveal>
          ))}

          {isAdmin &&
            (adding ? (
              <GlassCard className="flex aspect-[4/3] flex-col items-center justify-center gap-3 p-6">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Brand / client name"
                  className="w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-center text-sm text-ink-900 outline-none focus:border-gold-400/60"
                />
                <div className="flex gap-2">
                  <button
                    disabled={saving || !newName}
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const brand = await createBrand(newName, items.length);
                        setNewName("");
                        setAdding(false);
                        if (brand) setSelectedId(brand.id);
                      } catch {
                        toast.error("Couldn't create album");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-navy-950 disabled:opacity-50"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setAdding(false)}
                    className="rounded-md border border-gold-400/25 px-3 py-1.5 text-xs text-ink-700"
                  >
                    Cancel
                  </button>
                </div>
              </GlassCard>
            ) : (
              <button
                onClick={() => setAdding(true)}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold-400/40 text-gold-600 hover:border-gold-400/70 hover:bg-gold-400/5"
              >
                <Plus size={20} />
                <span className="text-xs">Add brand</span>
              </button>
            ))}
        </div>
        )}
      </div>

      {selected && (
        <PortfolioBrandModal brand={selected} skills={skills} onClose={() => setSelectedId(null)} />
      )}
    </section>
  );
}
