"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/hero/island.mp4";
const POSTER_SRC = "/hero/island-poster.jpg";

/**
 * Full-bleed looping background video. Falls back to the poster frame for
 * visitors who prefer reduced motion. Scrim is centred so the search widget,
 * not the footage, holds the eye.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) video.pause();
    else video.play().catch(() => {});
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-ink" aria-hidden="true">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Even darkening, heavier toward the centre band where the search sits */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_0%,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 to-transparent" />
    </div>
  );
}
