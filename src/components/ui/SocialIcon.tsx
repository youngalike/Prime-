import Image from "next/image";
import { Link2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function SocialIcon({
  href,
  iconUrl,
  label,
  isEmail,
  className,
}: {
  href: string;
  iconUrl?: string | null;
  label: string;
  isEmail?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noreferrer"}
      aria-label={label}
      title={label}
      className={cn(
        "glass-panel flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-ink-700 transition-all duration-300 hover:text-gold-600 hover:shadow-[0_0_18px_rgba(var(--glow-rgb),0.35)] hover:-translate-y-0.5",
        className,
      )}
    >
      {isEmail ? (
        <Mail size={17} strokeWidth={1.75} />
      ) : iconUrl ? (
        <Image src={iconUrl} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
      ) : (
        <Link2 size={17} strokeWidth={1.75} />
      )}
    </a>
  );
}
