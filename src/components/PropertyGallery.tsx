"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

export default function PropertyGallery({ title, images, fallback }: { title: string; images: string[]; fallback: string }) {
  const photos = [...new Set(images.filter((url) => url.trim().length > 0))];
  const thumbnails = photos.slice(1, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const count = photos.length;
  const label = `${count} ${count === 1 ? "photo" : "photos"}`;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  function view(index: number) {
    if (!count) return;
    setActiveIndex(index);
    dialog.current?.showModal();
    setOpen(true);
  }
  const next = (direction: number) => setActiveIndex((index) => (index + direction + count) % count);

  return (
    <>
      <div aria-label="Property photos" className={`grid min-w-0 grid-cols-1 gap-3 ${count > 1 ? "lg:grid-cols-[2fr_1fr]" : ""} lg:h-[480px]`}>
        <div className="relative h-[250px] min-w-0 overflow-hidden rounded-3xl bg-neutral-200 sm:h-[400px] lg:h-full">
          <Image src={photos[0] ?? fallback} alt={count ? `${title} — photo 1` : `Photo unavailable for ${title}`} fill unoptimized priority sizes="(max-width: 1023px) 100vw, 66vw" className="object-cover" />
          {count ? (
            <>
              <button type="button" aria-label="Open property photo gallery" onClick={() => view(0)} className="absolute inset-0 focus-visible:outline-offset-[-4px]" />
              <button type="button" onClick={() => view(0)} className="absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-[#111812]/90 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md hover:bg-[#111812] sm:right-5 sm:bottom-5 sm:text-sm"><Images className="h-4 w-4" />View {label}</button>
            </>
          ) : <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-700">Photos coming soon</span>}
        </div>
        {thumbnails.length > 0 && (
          <div className={`grid min-w-0 gap-3 ${thumbnails.length > 2 ? "grid-cols-3 lg:grid-cols-2 lg:grid-rows-2" : thumbnails.length === 2 ? "grid-cols-2 lg:grid-cols-1 lg:grid-rows-2" : "grid-cols-1"}`}>
            {thumbnails.map((photo, index) => (
              <button type="button" key={photo} onClick={() => view(index + 1)} aria-label={`View property photo ${index + 2}`} className={`relative h-24 overflow-hidden rounded-2xl bg-neutral-200 sm:h-36 lg:h-auto ${thumbnails.length === 3 && index === 2 ? "lg:col-span-2" : ""}`}>
                <Image src={photo} alt={`${title} — photo ${index + 2}`} fill unoptimized sizes="(max-width: 1023px) 33vw, 25vw" className="object-cover transition-transform duration-300 hover:scale-105" />
                {index === thumbnails.length - 1 && count > 4 && <span className="absolute inset-0 flex items-center justify-center bg-black/45 px-3 text-sm font-semibold text-white backdrop-blur-[1px]">View all {label}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <dialog ref={dialog} aria-labelledby="gallery-title" onClose={() => setOpen(false)} onKeyDown={(event) => {
        if (event.key === "ArrowLeft" && count > 1) { event.preventDefault(); next(-1); }
        if (event.key === "ArrowRight" && count > 1) { event.preventDefault(); next(1); }
      }} className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-[#0c130e] p-4 text-white backdrop:bg-black sm:p-6">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4">
          <div className="flex min-w-0 shrink-0 items-center justify-between gap-4">
            <div className="min-w-0"><h2 id="gallery-title" className="truncate text-sm font-semibold sm:text-lg">{title}</h2><p aria-live="polite" className="mt-1 text-xs text-neutral-400">Photo {activeIndex + 1} of {count}</p></div>
            <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close photo gallery" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/15"><X className="h-5 w-5" /></button>
          </div>
          <div className="relative min-h-0 flex-1">
            {open && count > 0 && <Image src={photos[activeIndex] ?? photos[0]} alt={`${title} — photo ${activeIndex + 1} of ${count}`} fill unoptimized sizes="100vw" className="object-contain" />}
          </div>
          {count > 1 && <div className="flex shrink-0 items-center justify-center gap-5 pb-2">
            <button type="button" aria-label="Previous photo" onClick={() => next(-1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><ChevronLeft className="h-5 w-5" /></button>
            <span className="text-xs tabular-nums text-neutral-400">{activeIndex + 1} / {count}</span>
            <button type="button" aria-label="Next photo" onClick={() => next(1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><ChevronRight className="h-5 w-5" /></button>
          </div>}
        </div>
      </dialog>
    </>
  );
}
