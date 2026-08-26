"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  addPortfolioImage,
  deleteBrand,
  deletePortfolioImage,
  reorderPortfolioImages,
  setBrandCoverImage,
  updateBrand,
} from "@/lib/actions/portfolio";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { EditableField } from "@/components/admin/EditableField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Lightbox } from "@/components/ui/Lightbox";
import type { PortfolioBrandWithImages } from "@/lib/types/database";

export function PortfolioBrandModal({
  brand,
  onClose,
}: {
  brand: PortfolioBrandWithImages;
  onClose: () => void;
}) {
  const { isAdmin } = useEditMode();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = [...brand.images].sort((a, b) => a.sort_order - b.sort_order);

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
              <h3 className="font-display text-2xl text-ivory-50">
                <EditableField
                  value={brand.name}
                  onSave={(v) => updateBrand(brand.id, { name: v, description: brand.description })}
                  as="span"
                  className="font-display text-2xl"
                />
              </h3>
              <div className="mt-1 text-sm text-ivory-300">
                <EditableField
                  value={brand.description ?? ""}
                  onSave={(v) => updateBrand(brand.id, { name: brand.name, description: v || null })}
                  as="span"
                  placeholder="Add a short description…"
                />
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full glass-panel text-ivory-50 hover:text-gold-400"
            >
              <X size={17} />
            </button>
          </div>

          {images.length === 0 ? (
            <p className="py-10 text-center text-sm text-ivory-300/60">
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
