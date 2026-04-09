"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, SpringOptions, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

type SpotlightFollowProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function SpotlightFollow({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: SpotlightFollowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current?.parentElement) {
      const parent = containerRef.current.parentElement;
      parent.style.position = "relative";
      parent.style.overflow = "hidden";
      setParentElement(parent);
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) {
        return;
      }

      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) {
      return;
    }

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parentElement.addEventListener("mousemove", handleMouseMove);
    parentElement.addEventListener("mouseenter", handleMouseEnter);
    parentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parentElement.removeEventListener("mousemove", handleMouseMove);
      parentElement.removeEventListener("mouseenter", handleMouseEnter);
      parentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, parentElement]);

  return (
    <div ref={containerRef} className={cn("pointer-events-none absolute inset-0", className)}>
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full blur-3xl"
        style={{
          left: spotlightLeft,
          top: spotlightTop,
          width: size,
          height: size,
          opacity: isHovered ? 1 : 0,
          background:
            "radial-gradient(circle, rgba(0, 240, 255, 0.32) 0%, rgba(0, 240, 255, 0.14) 40%, transparent 72%)",
        }}
      />
    </div>
  );
}