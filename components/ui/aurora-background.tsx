"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  children,
  className,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div className={cn("relative isolate overflow-hidden bg-void", className)} {...props}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-[-20%] animate-aurora bg-[radial-gradient(circle_at_20%_20%,rgba(230,0,126,0.22),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(0,240,255,0.14),transparent_26%),radial-gradient(circle_at_50%_0%,rgba(255,176,0,0.10),transparent_32%)] opacity-40 blur-3xl" />
        {showRadialGradient ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.09),transparent_55%)] opacity-30" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,5,20,0.18),rgba(10,5,20,0.84))]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};