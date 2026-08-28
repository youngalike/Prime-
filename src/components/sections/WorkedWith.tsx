"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createClientBrand, deleteClientBrand } from "@/lib/actions/clientBrands";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useEditMode } from "@/components/admin/EditModeProvider";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ResolvedBackground } from "@/lib/backgrounds";
import type { ClientBrand } from "@/lib/types/database";

function AddClientBrandForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const field =
    "w-full rounded-lg border border-gold-400/25 bg-surface/70 px-3 py-2 text-xs text-ink-900 outline-none focus:border-gold-400/60";

  return (
    <div className="glass-panel mx-auto flex w-full max-w-xs flex-col gap-2 rounded-xl p-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Brand name" className={field} />
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        placeholder="Website (optional)"
        className={field}
      />

      {logoUrl ? (
        <div className="flex items-center gap-2">
          <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border border-gold-400/20 bg-surface/70 p-2">
            <Image src={logoUrl} alt="Logo preview" width={80} height={40} className="h-full w-full object-contain" />
          </div>
          <ImageUploader pathPrefix="client-brands" label="Change logo" onUploaded={([url]) => setLogoUrl(url)} />
        </div>
      ) : (
        <ImageUploader pathPrefix="client-brands" label="Upload logo" onUploaded={([url]) => setLogoUrl(url)} />
      )}

      <div className="flex gap-2">
        <button
          disabled={saving || !name || !logoUrl}
          onClick={async () => {
            setSaving(true);
            try {
              await createClientBrand({ name, logo_url: logoUrl!, website_url: website || null }, 0);
              onDone();
            } catch {
              toast.error("Couldn't add brand");
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

function BrandTile({ brand, isAdmin }: { brand: ClientBrand; isAdmin: boolean }) {
  const tile = (
    <div className="group/logo relative flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-gold-400/15 bg-surface/60 p-4 transition-all duration-300 hover:border-gold-400/40 hover:shadow-[0_0_20px_rgba(var(--glow-rgb),0.15)]">
      <Image
        src={brand.logo_url}
        alt={brand.name}
        width={100}
        height={40}
        className="h-full w-full object-contain grayscale transition-all duration-300 group-hover/logo:grayscale-0"
      />
      {isAdmin && (
        <button
          onClick={async (e) => {
            e.preventDefault();
            try {
              await deleteClientBrand(brand.id);
            } catch {
              toast.error("Couldn't delete");
            }
          }}
          aria-label={`Remove ${brand.name}`}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy-900/85 text-white opacity-0 transition-opacity group-hover/logo:opacity-100"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );

  return brand.website_url ? (
    <a href={brand.website_url} target="_blank" rel="noreferrer" title={brand.name}>
      {tile}
    </a>
  ) : (
    <div title={brand.name}>{tile}</div>
  );
}

export function WorkedWith({
  brands,
  background,
}: {
  brands: ClientBrand[];
  background: ResolvedBackground;
}) {
  const { isAdmin } = useEditMode();
  const [adding, setAdding] = useState(false);

  const items = [...brands].sort((a, b) => a.sort_order - b.sort_order);

  if (items.length === 0 && !isAdmin) return null;

  // Scrolling marquee once there are enough logos to make one worthwhile;
  // otherwise just a centered static row so a handful of brands don't look sparse.
  const useMarquee = items.length > 6;
  const duration = Math.max(items.length * 2.5, 18);

  return (
    <section className="relative overflow-hidden py-16">
      <SectionBackdrop background={background} />
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <SectionReveal>
          <SectionHeading eyebrow="Trusted by" title="Brands I've Worked With" align="center" />
        </SectionReveal>

        <SectionReveal delay={0.1}>
        {useMarquee ? (
          <div
            className="marquee-pause-on-hover relative overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}
          >
            <div
              className="marquee-track flex w-max items-center gap-4"
              style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
            >
              {[...items, ...items].map((brand, i) => (
                <BrandTile key={`${brand.id}-${i}`} brand={brand} isAdmin={isAdmin} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {items.map((brand) => (
              <BrandTile key={brand.id} brand={brand} isAdmin={isAdmin} />
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="mt-6 flex justify-center">
            {adding ? (
              <AddClientBrandForm onDone={() => setAdding(false)} />
            ) : (
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-500"
              >
                <Plus size={13} /> Add brand {items.length > 0 && `(${items.length})`}
              </button>
            )}
          </div>
        )}
        </SectionReveal>
      </div>
    </section>
  );
}
