"use client";

import { cn } from "@/lib/utils";

interface FloatingOrbsProps {
  className?: string;
  variant?: "hero" | "subtle" | "auth";
}

export function FloatingOrbs({ className, variant = "hero" }: FloatingOrbsProps) {
  const configs = {
    hero: [
      { color: "bg-primary/15", size: "w-[500px] h-[500px]", position: "top-[-10%] left-[-5%]", animation: "animate-float-orb" },
      { color: "bg-secondary/10", size: "w-[400px] h-[400px]", position: "top-[20%] right-[-8%]", animation: "animate-float-orb-reverse" },
      { color: "bg-primary/8", size: "w-[350px] h-[350px]", position: "bottom-[-5%] left-[30%]", animation: "animate-float-orb" },
    ],
    subtle: [
      { color: "bg-primary/8", size: "w-[300px] h-[300px]", position: "top-[-5%] right-[10%]", animation: "animate-float-orb" },
      { color: "bg-secondary/6", size: "w-[250px] h-[250px]", position: "bottom-[10%] left-[-3%]", animation: "animate-float-orb-reverse" },
    ],
    auth: [
      { color: "bg-primary/12", size: "w-[400px] h-[400px]", position: "top-[10%] left-[-10%]", animation: "animate-float-orb" },
      { color: "bg-secondary/10", size: "w-[350px] h-[350px]", position: "bottom-[5%] right-[-8%]", animation: "animate-float-orb-reverse" },
    ],
  };

  const orbs = configs[variant];

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full blur-3xl",
            orb.color,
            orb.size,
            orb.position,
            orb.animation
          )}
        />
      ))}
    </div>
  );
}
