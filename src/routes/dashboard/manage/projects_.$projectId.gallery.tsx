import { PointerActivationConstraints } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent, PointerSensor } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { blake3 } from "hash-wasm";
import { ArrowLeft, Check, ImageIcon, Trash2, Upload, Video } from "lucide-react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/app/dashboard-events";
import { MediaLightbox } from "@/components/app/media-lightbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SIG_META,
  mediaArtwork,
  projectMediaQueryOptions,
  projectsQueryOptions,
} from "@/routes/dashboard/projects";
import {
  type CommitRequest,
  type MediaRecord,
  type MultipartUploadResponse,
  type SimpleUploadResponse,
} from "@/types/kanae.gen";

export const Route = createFileRoute("/dashboard/manage/projects_/$projectId/gallery")({
  component: ProjectGalleryPage,
  staticData: {
    area: "Manage",
    title: "Project gallery",
    sub: "Upload, reorder, and curate project media",
  },
  loader: async ({ context: { queryClient }, params: { projectId } }) => {
    await queryClient.prefetchQuery(projectsQueryOptions);
    await queryClient.prefetchQuery(projectMediaQueryOptions(projectId));
  },
});

/// Types and Interfaces

type UploadResponse = MediaRecord | SimpleUploadResponse | MultipartUploadResponse;


interface GalleryTileProps {
  item: MediaRecord;
  index: number;
  color: string;
  canReorder: boolean;
  onOpen: (event: SyntheticEvent<HTMLElement>) => void;
  onOpenKey: (event: KeyboardEvent<HTMLElement>) => void;
  onDelete: (event: MouseEvent<HTMLElement>) => void;
}

/// Constants - metadata
const DND_SENSORS = [
  PointerSensor.configure({
    activationConstraints: (event) =>
      event.pointerType === "touch"
        ? [new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 })]
        : [new PointerActivationConstraints.Distance({ value: 8 })],
  }),
];

/// Constants - regular

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const CARD_CLASS =
  "rounded-[18px] border border-border bg-card shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]";
const TEAL_BUTTON_CLASS = "bg-brand-teal font-bold text-primary hover:bg-brand-teal/85";

/// Helper functions

function mediaSrc(item: MediaRecord, color: string) {
  return item.url || mediaArtwork(item.hash, color);
}

/// Route components

const GalleryTile = memo(function GalleryTile({
  item,
  index,
  color,
  canReorder,
  onOpen,
  onOpenKey,
  onDelete,
}: GalleryTileProps) {
  const { ref, isDragging } = useSortable({ id: item.hash, index, disabled: !canReorder });
  return (
    // role="button" <div> is correct here
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      data-hash={item.hash}
      title={canReorder ? "Open · drag to reorder" : "Open"}
      onClick={onOpen}
      onKeyDown={onOpenKey}
      className={cn(
        "group relative h-fit cursor-pointer overflow-hidden rounded-xl border border-border bg-card outline-hidden transition focus-visible:ring-2 focus-visible:ring-brand-teal",
        isDragging && "opacity-40",
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={mediaSrc(item, color)}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition group-hover:scale-105"
        />
        {item.kind === "video" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Video className="size-7 text-white" />
          </span>
        )}
      </div>
      <Button
        variant="secondary"
        size="icon-sm"
        title="Delete media"
        data-hash={item.hash}
        onClick={onDelete}
        className="absolute top-2 right-2 opacity-0 transition group-hover:opacity-100"
      >
        <Trash2 className="text-destructive" />
      </Button>
    </div>
  );
});

/// Route

function ProjectGalleryPage() {
  const queryClient = useQueryClient();
  const { projectId } = Route.useParams();

  const { data: projects } = useQuery(projectsQueryOptions);
  const { data: media } = useQuery(projectMediaQueryOptions(projectId));

  const [lightboxIndex, setLightboxIndex] = useState<number>();
  const [items, setItems] = useState<MediaRecord[]>(media ?? []);
  const [dirty, setDirty] = useState(false);

  const project = projects?.find((item) => item.id === projectId);
  const color = project ? SIG_META[project.type].color : "#93a3b6";

  const { mutate: reorderMedia } = useMutation({
    mutationFn: async (ordered: MediaRecord[]) =>
      await axios.put(`${API_BASE_URL}/projects/${projectId}/media/positions`, {
        hashes: ordered.map((item) => item.hash),
      }),
    onMutate: (ordered) =>
      queryClient.setQueryData<MediaRecord[]>(
        projectMediaQueryOptions(projectId).queryKey,
        ordered,
      ),
    onSuccess: () => {
      setDirty(false);
    },
    onError: () => toast.error("Couldn't save the new order. Please try again."),
  });

  const reorderOnDrop = useCallback(
    (event: DragEndEvent) => {
      const order = items.map((item) => item.hash);
      const nextOrder = event.canceled ? order : move(order, event);

      if (nextOrder.every((hash, index) => hash === order[index])) return;

      const byHash = new Map(items.map((item) => [item.hash, item]));
      setItems(nextOrder.map((hash) => byHash.get(hash)).filter((item) => item !== undefined));
      setDirty(true);
    },
    [items],
  );

  const { mutate: deleteMedia } = useMutation({
    mutationFn: async (hash: string) => {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}/media/${hash}`);
    },
    onMutate: (hash) => {
      setItems((current) => current.filter((item) => item.hash !== hash));
      queryClient.setQueryData<MediaRecord[]>(
        projectMediaQueryOptions(projectId).queryKey,
        (old = []) => old.filter((item) => item.hash !== hash),
      );
    },
    onError: () => toast.error("Couldn't delete the media. Please try again."),
    onSuccess: () => toast.success("Media removed."),
  });

  const { mutate: uploadMedia } = useMutation({
    mutationFn: async (files: File[]) => {
      for (const file of files) {
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
          toast.error("Only images and videos can be uploaded.");
          continue;
        }
        const record: MediaRecord = {
          hash: await blake3(new Uint8Array(await file.arrayBuffer())),
          content_type: file.type,
          kind: file.type.startsWith("video/") ? "video" : "image",
          size: file.size,
          created_at: new Date().toISOString(),
          url: URL.createObjectURL(file),
        };
        setItems((current) => [...current, record]);
        queryClient.setQueryData<MediaRecord[]>(
          projectMediaQueryOptions(projectId).queryKey,
          (old = []) => [...old, record],
        );

        const body: CommitRequest = {
          hash: record.hash,
          content_type: record.content_type,
          size: record.size,
        };
        const { data: upload } = await axios.post<UploadResponse>(
          `${API_BASE_URL}/projects/${projectId}/media/upload`,
          body,
        );

        if ("kind" in upload) continue;

        if ("upload_id" in upload) {
          body.upload_id = upload.upload_id;
          body.chunks = [];
          let offset = 0;
          for (const { index, url, size } of upload.chunks) {
            // These are presigned S3 urls, so forcing auth breaks it
            const part = await axios.put(url, file.slice(offset, offset + size), {
              withCredentials: false,
            });
            body.chunks.push({
              number: index,
              etag: String(part.headers.etag).replaceAll('"', ""),
            });
            offset += size;
          }
        } else {
          await axios.put(upload.url, file, {
            headers: { "Content-Type": record.content_type },
            withCredentials: false,
          });
        }

        await axios.post(`${API_BASE_URL}/projects/${projectId}/media/commit`, body);
      }
    },
    onError: () => toast.error("Couldn't upload the media. Please try again."),
    onSuccess: () => toast.success("Media uploaded."),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);
  const onFilesPicked = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = [...(event.target.files ?? [])];
      event.target.value = "";
      if (files.length > 0) uploadMedia(files);
    },
    [uploadMedia],
  );

  const saveOrder = useCallback(() => {
    reorderMedia(items);
  }, [reorderMedia, items]);
  const discardOrder = useCallback(() => {
    setItems(media ?? []);
    setDirty(false);
  }, [media]);

  const askDeleteMedia = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      const { hash } = event.currentTarget.dataset;
      if (hash) deleteMedia(hash);
    },
    [deleteMedia],
  );

  const openLightbox = useCallback(
    (event: SyntheticEvent<HTMLElement>) => {
      const index = items.findIndex((item) => item.hash === event.currentTarget.dataset.hash);
      setLightboxIndex(index === -1 ? undefined : index);
    },
    [items],
  );
  const openLightboxKey = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(event);
    },
    [openLightbox],
  );

  const closeLightbox = useCallback(() => {
    setLightboxIndex(undefined);
  }, []);
  const lightboxSrc = useCallback((item: MediaRecord) => mediaSrc(item, color), [color]);

  const itemsPlural = items.length === 1 ? "" : "s";
  const canReorder = items.length > 1;
  const countSummary = `${String(items.length)} item${itemsPlural}${
    canReorder ? " · drag a tile to reorder" : ""
  }`;

  return (
    <div className="flex flex-col gap-5">
      <div className={cn(CARD_CLASS, "flex flex-wrap items-center justify-between gap-3 p-4")}>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            title="Back to projects"
            nativeButton={false}
            render={<Link to="/dashboard/manage/projects" />}
          >
            <ArrowLeft />
          </Button>
          <div>
            <div className="text-sm font-extrabold text-foreground">
              {project?.name ?? "Project"} · Gallery
            </div>
            <div className="text-[12.5px] text-brand-text-sub">
              {dirty ? "Unsaved order — save to publish the new arrangement" : countSummary}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {dirty && (
            <>
              <Button
                variant="ghost"
                className="font-bold text-brand-text-sub"
                onClick={discardOrder}
              >
                Discard
              </Button>
              <Button className={TEAL_BUTTON_CLASS} onClick={saveOrder}>
                <Check />
                Save order
              </Button>
            </>
          )}
          <Button variant="outline" className="font-bold" onClick={openFilePicker}>
            <Upload />
            Upload media
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={onFilesPicked}
          />
        </div>
      </div>

      <div className={cn(CARD_CLASS, "relative flex min-h-104 flex-col gap-4 p-4")}>
        <DragDropProvider sensors={DND_SENSORS} onDragEnd={reorderOnDrop}>
          <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(140px,1fr))] content-start gap-3 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {items.map((item, index) => (
              <GalleryTile
                key={item.hash}
                item={item}
                index={index}
                color={color}
                canReorder={canReorder}
                onOpen={openLightbox}
                onOpenKey={openLightboxKey}
                onDelete={askDeleteMedia}
              />
            ))}
          </div>
        </DragDropProvider>

        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <EmptyState
              icon={ImageIcon}
              title="No media yet"
              sub="Use “Upload media” to add images and videos."
            />
          </div>
        )}
      </div>

      <MediaLightbox
        items={items}
        index={lightboxIndex}
        srcFor={lightboxSrc}
        onIndexChange={setLightboxIndex}
        onClose={closeLightbox}
      />
    </div>
  );
}
