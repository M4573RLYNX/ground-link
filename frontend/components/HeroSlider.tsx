"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface HeroSlideData {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
}

interface HeroSliderProps {
  slides: HeroSlideData[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop";

/** Full-bleed background slider. Scrim keeps overlaid type readable on any photo. */
export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const images = slides?.length
    ? slides.map((s) => ({ id: s._id, src: s.imageUrl, alt: s.title || "Property in the Solomon Islands" }))
    : [{ id: "fallback", src: FALLBACK_IMAGE, alt: "Solomon Islands coastline" }];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-ink">
      {images.map((img, index) => (
        <img
          key={img.id}
          src={img.src}
          alt={img.alt}
          className={cn(
            "absolute inset-0 size-full object-cover transition-[opacity,transform] ease-out",
            index === currentIndex
              ? "scale-105 opacity-100 duration-[1000ms,8000ms]"
              : "scale-100 opacity-0 duration-1000"
          )}
        />
      ))}

      {/* Scrim: darker at top for the nav, heavy at bottom-left for the headline */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/50" />
      <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent" />

      {images.length > 1 && (
        <div className="absolute right-5 bottom-8 z-20 flex gap-2 md:right-8">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === currentIndex ? "w-8 bg-primary" : "w-3 bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
