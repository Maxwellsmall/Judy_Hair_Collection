"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

type MediaItem = { type: "image" | "video"; url: string };

interface MediaGalleryProps {
  images: string[];
  videos: string[];
}

export default function MediaGallery({ images, videos }: MediaGalleryProps) {
  const mediaItems: MediaItem[] = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((url) => ({ type: "video" as const, url })),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = mediaItems[selectedIndex] ?? mediaItems[0];

  if (!selected) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main display */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
        {selected.type === "image" ? (
          <Image
            src={selected.url}
            alt="Product image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <video
            src={selected.url}
            controls
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Thumbnail strip — hidden when only 1 item */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mediaItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === selectedIndex
                  ? "border-neutral-900"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
              aria-label={`View ${item.type} ${i + 1}`}
            >
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                  <Play className="h-6 w-6 text-neutral-600" />
                </div>
              )}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
