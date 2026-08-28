import Image from "next/image";
import type { ResolvedBackground } from "@/lib/backgrounds";

export function SectionBackdrop({ background }: { background: ResolvedBackground }) {
  if (!background.url) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" style={{ opacity: background.opacity }}>
      <Image src={background.url} alt="" fill className="object-cover" sizes="100vw" />
    </div>
  );
}
