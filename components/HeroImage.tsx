"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { AccentColor } from "@/types/calendar";

interface HeroImageProps {
  currentDate: Date;
  onColorExtracted?: (rgb: AccentColor) => void;
}

// Curated Unsplash image IDs — beautiful, thematic, consistent
const MONTHLY_IMAGES: Record<number, { url: string; alt: string; gradient: string }> = {
  0:  {
    url: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800&q=80&auto=format&fit=crop",
    alt: "Snowy winter forest", gradient: "from-blue-900/70 to-slate-900/90"
  },
  1:  {
    url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80&auto=format&fit=crop",
    alt: "Red roses for Valentine's", gradient: "from-rose-900/70 to-pink-900/90"
  },
  2:  {
    url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80&auto=format&fit=crop",
    alt: "Cherry blossoms in spring", gradient: "from-pink-800/70 to-emerald-900/90"
  },
  3:  {
    url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80&auto=format&fit=crop",
    alt: "Spring flower meadow", gradient: "from-green-800/70 to-yellow-900/80"
  },
  4:  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop",
    alt: "Ocean beach in May", gradient: "from-cyan-900/70 to-blue-900/90"
  },
  5:  {
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop",
    alt: "Sunflower field in June", gradient: "from-yellow-700/70 to-amber-900/90"
  },
  6:  {
    url: "https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b?w=800&q=80&auto=format&fit=crop",
    alt: "Fireworks for 4th of July", gradient: "from-indigo-900/70 to-purple-900/90"
  },
  7:  {
    url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80&auto=format&fit=crop",
    alt: "Beach sunset in August", gradient: "from-orange-700/70 to-rose-900/90"
  },
  8:  {
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80&auto=format&fit=crop",
    alt: "Autumn leaves in September", gradient: "from-orange-800/70 to-red-900/90"
  },
  9:  {
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80&auto=format&fit=crop",
    alt: "Halloween pumpkins in October", gradient: "from-orange-900/80 to-slate-900/95"
  },
  10: {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop",
    alt: "Misty mountains in November", gradient: "from-slate-800/70 to-stone-900/90"
  },
  11: {
    url: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80&auto=format&fit=crop",
    alt: "Christmas lights in December", gradient: "from-red-900/70 to-green-900/90"
  },
};

// Pre-computed fallback accent colours per month (dominant colours from each image)
const FALLBACK_ACCENTS: Record<number, AccentColor> = {
  0:  [96, 165, 250],   // blue
  1:  [244, 114, 182],  // pink
  2:  [236, 153, 186],  // blush
  3:  [134, 239, 172],  // green
  4:  [56, 189, 248],   // sky
  5:  [250, 204, 21],   // yellow
  6:  [167, 139, 250],  // violet
  7:  [251, 146, 60],   // orange
  8:  [249, 115, 22],   // deep orange
  9:  [251, 146, 60],   // amber
  10: [148, 163, 184],  // slate
  11: [248, 113, 113],  // red
};

export default function HeroImage({ currentDate, onColorExtracted }: HeroImageProps) {
  const month = currentDate.getMonth();
  const image = MONTHLY_IMAGES[month];
  const [loaded, setLoaded] = useState(false);
  const [key, setKey] = useState(month);

  // Reset on month change
  useEffect(() => {
    setLoaded(false);
    setKey(month);
    // Apply fallback accent immediately
    onColorExtracted?.(FALLBACK_ACCENTS[month]);
  }, [month, onColorExtracted]);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    const img = e.currentTarget;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 80, 80);
      const data = ctx.getImageData(0, 0, 80, 80).data;
      let r = 0, g = 0, b = 0;
      const pixels = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i + 1]; b += data[i + 2];
      }
      onColorExtracted?.([
        Math.round(r / pixels),
        Math.round(g / pixels),
        Math.round(b / pixels),
      ]);
    } catch {
      // CORS blocked — fallback already applied
    }
  }, [onColorExtracted]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ aspectRatio: "4/5", minHeight: 240, maxHeight: 500 }}
    >
      {/* Shimmer skeleton */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse rounded-2xl"
             style={{ background: "linear-gradient(135deg, rgb(var(--surface-2)), rgb(var(--border)))" }} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
            onLoad={handleLoad}
            referrerPolicy="no-referrer"
            loading="eager"
            style={{ display: loaded ? "block" : "block" }}
          />

          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${image.gradient}`}
            style={{ backdropFilter: "blur(0px)" }}
          />

          {/* Bottom text overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-5 sm:p-6"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">
              {format(currentDate, "yyyy")}
            </p>
            <h2
              className="text-white font-extrabold tracking-tight leading-none"
              style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}
            >
              {format(currentDate, "MMMM")}
            </h2>
            <p className="text-white/50 text-xs mt-2 italic">{image.alt}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl z-10"
        style={{ background: "rgb(var(--accent))" }}
      />
    </div>
  );
}
