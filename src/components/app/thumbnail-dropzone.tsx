import { Trash2, Upload } from "lucide-react";
import { type DropzoneState } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ThumbnailDropzoneProps {
  label: string;
  value: { url: string } | null | undefined;
  onRemove: () => void;
  getRootProps: DropzoneState["getRootProps"];
  getInputProps: DropzoneState["getInputProps"];
  isDragActive: boolean;
}

const SECTION_LABEL_CLASS =
  "mb-1.5 text-[11px] font-bold tracking-[0.06em] text-muted-foreground uppercase";

export function ThumbnailDropzone({
  label,
  value,
  onRemove,
  getRootProps,
  getInputProps,
  isDragActive,
}: Readonly<ThumbnailDropzoneProps>) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className={SECTION_LABEL_CLASS}>{label}</Label>
      {value ? (
        <div className="relative h-36 overflow-hidden rounded-xl border border-border">
          <img src={value.url} alt="" className="size-full object-cover" />
          <Button
            variant="outline"
            size="icon-sm"
            className="absolute top-2 right-2 bg-card"
            title="Remove thumbnail"
            onClick={onRemove}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps({
            className: cn(
              "flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-center transition",
              isDragActive
                ? "border-brand-teal bg-brand-teal/10"
                : "border-border bg-muted/50 hover:border-brand-teal hover:bg-brand-teal/8",
            ),
          })}
        >
          <input {...getInputProps()} />
          <Upload className="size-5 text-brand-teal-alt" />
          <span className="text-[13px] font-bold text-foreground">
            {isDragActive ? "Drop to upload" : "Upload a thumbnail"}
          </span>
          <span className="text-[11.5px] text-muted-foreground">
            Drag & drop or click to browse · ≤ 32 MB
          </span>
        </div>
      )}
    </div>
  );
}
