"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BentoGrid({ className, children, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface BentoGridItemProps {
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  
}: BentoGridItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-card transition-all duration-300 ease-out hover:border-primary/20 hover:shadow-card-hover hover:-translate-y-0.5",
        className
      )}
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-border">
          {header ?? (
            <div className="flex min-h-[6rem] items-center justify-center bg-gradient-to-br from-hover-bg via-base to-surface" />
          )}
        </div>
        <div className="flex items-center gap-3">
          {icon ? <div className="text-primary">{icon}</div> : null}
          <h3 className="text-lg font-semibold tracking-tight text-heading">{title}</h3>
        </div>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
    </motion.div>
  );
}