"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  pathPrefix: string;
  multiple?: boolean;
  onUploaded: (urls: string[]) => void;
  className?: string;
  label?: string;
  accept?: string;
}

export function ImageUploader({
  pathPrefix,
  multiple = false,
  onUploaded,
  className,
  label = "Upload photo",
  accept = "image/*",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    const supabase = createClient();
    const urls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }

      onUploaded(urls);
    } catch {
      setError("Upload failed — try again");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-dashed border-gold-400/40 px-4 py-2.5 text-xs text-gold-600 hover:border-gold-400/70 hover:bg-gold-400/5 disabled:opacity-50",
        )}
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
        {uploading ? "Uploading…" : label}
      </button>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
