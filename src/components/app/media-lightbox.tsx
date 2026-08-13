import { ArrowLeft, ArrowRight, ExternalLink, Maximize, X } from "lucide-react";
import {
  type KeyboardEvent,
  type MouseEvent,
  type RefCallback,
  useCallback,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { type MediaRecord } from "@/types/kanae.gen";

interface MediaLightboxProps {
  items: MediaRecord[];
  index: number | undefined;
  srcFor: (item: MediaRecord) => string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const LIGHTBOX_BUTTON_CLASS = "size-9 rounded-full text-white hover:bg-white/15";
const LIGHTBOX_MEDIA_CLASS =
  "relative max-h-[86svh] w-auto max-w-full min-w-0 rounded-xl object-contain shadow-[0px_24px_64px_rgba(0,0,0,0.6)] xl:max-w-5xl";

export function MediaLightbox({
  items,
  index,
  srcFor,
  onIndexChange,
  onClose,
}: MediaLightboxProps) {
  const current = index === undefined ? undefined : items[index];

  // This is actually correct
  // oxlint-disable-next-line no-null
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const showPrev = useCallback(() => {
    if (index !== undefined) onIndexChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onIndexChange]);
  const showNext = useCallback(() => {
    if (index !== undefined) onIndexChange((index + 1) % items.length);
  }, [index, items.length, onIndexChange]);
  const openOriginal = useCallback(() => {
    if (current) globalThis.open(current.url, "_blank", "noopener,noreferrer");
  }, [current]);
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else container?.requestFullscreen().catch(() => {}); // Sonarcloud complains so...
  }, [container]);
  const focusBackdrop = useCallback<RefCallback<HTMLButtonElement>>((node) => {
    node?.focus();
  }, []);
  const keepFocus = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);

  const onLightboxKey = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      } else if (event.key === "ArrowLeft") showPrev();
      else if (event.key === "ArrowRight") showNext();
    },
    [onClose, showPrev, showNext],
  );

  const controls = [
    { title: "Close", onClick: onClose, icon: <X /> },
    { title: "Open original", onClick: openOriginal, icon: <ExternalLink /> },
    { title: "Fullscreen", onClick: toggleFullscreen, icon: <Maximize /> },
    { title: "Previous", onClick: showPrev, icon: <ArrowLeft /> },
    { title: "Next", onClick: showNext, icon: <ArrowRight /> },
  ];

  return (
    current && (
      <div
        ref={setContainer}
        aria-modal="true"
        aria-label="Media preview"
        className="fixed inset-0 z-100 flex items-center justify-center p-6"
      >
        <button
          ref={focusBackdrop}
          type="button"
          aria-label="Close preview"
          onClick={onClose}
          onKeyDown={onLightboxKey}
          className="absolute inset-0 cursor-default bg-black/55 outline-hidden backdrop-blur-sm"
        />
        {current.kind === "video" ? (
          <video src={srcFor(current)} controls autoPlay className={LIGHTBOX_MEDIA_CLASS}>
            <track default kind="captions" srcLang="en" label="Captions unavailable" />
          </video>
        ) : (
          <img src={srcFor(current)} alt="" decoding="async" className={LIGHTBOX_MEDIA_CLASS} />
        )}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/50 p-1 backdrop-blur-sm">
          {controls.map(({ title, onClick, icon }) => (
            <Button
              key={title}
              className={LIGHTBOX_BUTTON_CLASS}
              variant="ghost"
              title={title}
              onMouseDown={keepFocus}
              onClick={onClick}
            >
              {icon}
            </Button>
          ))}
        </div>
      </div>
    )
  );
}
