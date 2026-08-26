"use client";

import { ArrowDown, ArrowUp, PenLine, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

interface RowControlsProps {
  onEdit?: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  className?: string;
}

export function RowControls({ onEdit, onDelete, onMoveUp, onMoveDown, className }: RowControlsProps) {
  return (
    <div className={className ?? "flex items-center gap-1.5"}>
      {onMoveUp && (
        <IconButton onClick={onMoveUp} aria-label="Move up">
          <ArrowUp size={13} />
        </IconButton>
      )}
      {onMoveDown && (
        <IconButton onClick={onMoveDown} aria-label="Move down">
          <ArrowDown size={13} />
        </IconButton>
      )}
      {onEdit && (
        <IconButton onClick={onEdit} aria-label="Edit">
          <PenLine size={13} />
        </IconButton>
      )}
      <IconButton onClick={onDelete} tone="danger" aria-label="Delete">
        <Trash2 size={13} />
      </IconButton>
    </div>
  );
}
