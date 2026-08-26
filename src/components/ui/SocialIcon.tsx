import { Mail } from "lucide-react";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.5.5.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43C21.99 8.94 22 9.28 22 12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47C15.06 21.99 14.72 22 12 22s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53C6.09.28 6.82.11 7.88.06 8.94.01 9.28 0 12 0zm0 1.8c-2.67 0-2.99.01-4.04.06-.97.04-1.5.2-1.85.34-.46.18-.8.4-1.15.75-.35.35-.57.69-.75 1.15-.14.35-.3.88-.34 1.85C3.81 9.01 3.8 9.33 3.8 12s.01 2.99.06 4.04c.04.97.2 1.5.34 1.85.18.46.4.8.75 1.15.35.35.69.57 1.15.75.35.14.88.3 1.85.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.97-.04 1.5-.2 1.85-.34.46-.18.8-.4 1.15-.75.35-.35.57-.69.75-1.15.14-.35.3-.88.34-1.85.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.97-.2-1.5-.34-1.85a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.35-.14-.88-.3-1.85-.34C14.99 1.81 14.67 1.8 12 1.8zm0 4.5a5.7 5.7 0 1 1 0 11.4 5.7 5.7 0 0 1 0-11.4zm0 1.8a3.9 3.9 0 1 0 0 7.8 3.9 3.9 0 0 0 0-7.8zm5.9-2a1.33 1.33 0 1 1 0 2.66 1.33 1.33 0 0 1 0-2.66z" />
    </svg>
  );
}

function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.54-.14-2.82-.14C11.98 2 10 3.66 10 6.7v2.8H7v4h3V22h4z" />
    </svg>
  );
}

function XGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.6 10.6 20.4 2.7h-2l-5.8 6.8-4.7-6.8H2.6l7.1 10.4-7.1 8.2h2l6.2-7.2 4.9 7.2h5.3l-7.4-10.7Zm-2.2 2.6-.7-1L5 4.3h2.4l4.7 6.7.7 1 6.1 8.8h-2.4l-5-7.2Z" />
    </svg>
  );
}

function LinkedinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02zM7 8.5H3V21h4V8.5zm6.32 0H9.5V21h3.98v-6.44c0-3.59 4.66-3.89 4.66 0V21H22v-7.4c0-6.08-6.72-5.86-8.68-2.87V8.5z" />
    </svg>
  );
}

const GLYPHS = {
  instagram: InstagramGlyph,
  facebook: FacebookGlyph,
  twitter: XGlyph,
  linkedin: LinkedinGlyph,
};

export function SocialIcon({
  platform,
  href,
  className,
}: {
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "email";
  href: string;
  className?: string;
}) {
  const wrapperClass = cn(
    "glass-panel flex h-10 w-10 items-center justify-center rounded-full text-ivory-300 transition-all duration-300 hover:text-gold-400 hover:shadow-[0_0_18px_rgba(242,201,76,0.35)] hover:-translate-y-0.5",
    className,
  );

  const linkProps = {
    href,
    "aria-label": platform,
    className: wrapperClass,
    ...(platform === "email" ? {} : { target: "_blank", rel: "noreferrer" }),
  };

  if (platform === "email") {
    return (
      <a {...linkProps}>
        <Mail size={17} strokeWidth={1.75} />
      </a>
    );
  }

  const Glyph = GLYPHS[platform];
  if (!Glyph) return null;

  return (
    <a {...linkProps}>
      <Glyph width={15} height={15} />
    </a>
  );
}
