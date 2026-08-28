"use client";

import Image from "next/image";
import { updateProfile } from "@/lib/actions/profile";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useEditMode } from "@/components/admin/EditModeProvider";
import type { Profile } from "@/lib/types/database";

export function CoverBanner({ profile }: { profile: Profile }) {
  const { isAdmin } = useEditMode();

  return (
    <div className="relative z-0 h-48 w-full overflow-hidden sm:h-64 lg:h-80">
      {profile.cover_image_url ? (
        <Image
          src={profile.cover_image_url}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 100% at 30% 0%, rgba(var(--glow-rgb),0.22), transparent), radial-gradient(ellipse 70% 100% at 85% 20%, rgba(var(--glow-rgb),0.14), transparent), var(--color-paper-warm)",
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% via-paper/50 via-85% to-paper" />

      {isAdmin && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
          <ImageUploader
            pathPrefix="profile"
            label={profile.cover_image_url ? "Change cover" : "Add cover photo"}
            onUploaded={([url]) => updateProfile({ cover_image_url: url })}
            className="[&>button]:bg-surface/85"
          />
        </div>
      )}
    </div>
  );
}
