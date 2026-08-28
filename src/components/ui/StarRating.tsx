import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < value ? "fill-gold-400 text-gold-400" : "fill-transparent text-ink-200"}
        />
      ))}
    </div>
  );
}
