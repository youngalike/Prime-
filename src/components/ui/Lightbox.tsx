"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface LightboxProps {
  images: { url: string; caption: string | null }[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const image = images[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndexChange]);

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full glass-panel text-ivory-50 hover:text-gold-400"
        >
          <X size={18} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange((index - 1 + images.length) % images.length);
              }}
              aria-label="Previous"
              className="absolute left-3 sm:left-6 flex h-11 w-11 items-center justify-center rounded-full glass-panel text-ivory-50 hover:text-gold-400"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange((index + 1) % images.length);
              }}
              aria-label="Next"
              className="absolute right-3 sm:right-6 flex h-11 w-11 items-center justify-center rounded-full glass-panel text-ivory-50 hover:text-gold-400"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <motion.div
          key={image.url}
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="relative max-h-[80vh] max-w-4xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl glow-gold-lg">
            <Image src={image.url} alt={image.caption ?? ""} fill className="object-contain" sizes="90vw" />
          </div>
          {image.caption && (
            <p className="mt-4 text-center text-sm text-ivory-300">{image.caption}</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
