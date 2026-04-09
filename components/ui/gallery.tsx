"use client";

import { useMemo } from "react";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const defaultPhotos = [
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    alt: "Glowing circuit board",
    width: 900,
    height: 1100,
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    alt: "Dark workstation with neon reflections",
    width: 1100,
    height: 900,
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Team collaborating in a moody workspace",
    width: 1000,
    height: 1000,
  },
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    alt: "City lights at night",
    width: 1100,
    height: 900,
  },
  {
    src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
    alt: "Abstract light trail",
    width: 900,
    height: 1100,
  },
];

type GalleryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

interface PhotoGalleryProps {
  animationDelay?: number;
  photos?: GalleryPhoto[];
  className?: string;
}

export function PhotoGallery({
  animationDelay = 0.5,
  photos = defaultPhotos,
  className,
}: PhotoGalleryProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const spreadPhotos = useMemo(() => photos.slice(0, 5), [photos]);

  const positions = [
    { x: -280, y: 10, rotate: -12 },
    { x: -140, y: -40, rotate: -6 },
    { x: 0, y: 10, rotate: 0 },
    { x: 140, y: -24, rotate: 7 },
    { x: 280, y: 14, rotate: 12 },
  ];

  return (
    <section className={cn("w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-glitch">Gallery</p>
          <h2 className="text-3xl font-semibold tracking-tight text-light md:text-5xl">
            Cinematic memories in motion
          </h2>
          <p className="text-base leading-7 text-shadow md:text-lg">
            A spread-style gallery preview with a mobile-friendly fallback for tighter screens.
          </p>
        </div>

        <div className="hidden md:block">
          <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-glass-border bg-glass/30 p-8 backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_50%)]" />

            {spreadPhotos.map((photo, index) => (
              <Photo
                key={photo.src}
                {...photo}
                index={index}
                delay={animationDelay + index * 0.08}
                prefersReducedMotion={prefersReducedMotion}
                className="absolute left-1/2 top-1/2"
                position={positions[index]}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:hidden">
          {spreadPhotos.map((photo, index) => (
            <Photo
              key={photo.src}
              {...photo}
              index={index}
              delay={animationDelay + index * 0.08}
              prefersReducedMotion={prefersReducedMotion}
              position={{ x: 0, y: 0, rotate: 0 }}
              className="relative left-0 top-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type Direction = "left" | "right";

interface PhotoProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  index: number;
  delay: number;
  prefersReducedMotion: boolean;
  position: { x: number; y: number; rotate: number };
  className?: string;
  direction?: Direction;
}

export function Photo({
  src,
  alt,
  width,
  height,
  index,
  delay,
  prefersReducedMotion,
  position,
  className,
}: PhotoProps) {
  const initialX = prefersReducedMotion ? 0 : 0;
  const initialY = prefersReducedMotion ? 0 : 28;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY, scale: 0.92, rotate: 0 }}
      animate={{
        opacity: 1,
        x: position.x,
        y: position.y,
        scale: 1,
        rotate: position.rotate,
      }}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group z-10 w-[18rem] max-w-full overflow-hidden rounded-[1.5rem] border border-glass-border bg-glass/40 p-2 shadow-glass backdrop-blur-md transition-all duration-300 hover:z-20 hover:scale-[1.03] hover:border-glitch hover:shadow-glass-hover md:absolute md:-translate-x-1/2 md:-translate-y-1/2",
        className
      )}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.06, rotate: position.rotate + 1, zIndex: 30 }}
      drag={prefersReducedMotion ? false : true}
      dragElastic={0.14}
      dragMomentum={false}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="aspect-[4/5] h-full w-full rounded-[1.125rem] object-cover"
        loading={index === 0 ? "eager" : "lazy"}
      />
    </motion.div>
  );
}