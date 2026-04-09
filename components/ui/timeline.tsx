"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface TimelineItem {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TimelineItem[];
}

export function Timeline({ data, className, ...props }: TimelineProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-5xl px-4 sm:px-6", className)} {...props}>
      <div aria-hidden="true" className="absolute left-4 top-0 h-full w-px bg-glass-border/80 md:left-6" />

      <div className="space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={item.title + index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
            className="relative grid gap-6 py-8 md:grid-cols-[160px_minmax(0,1fr)] md:gap-8"
          >
            <div className="relative pl-8 md:pl-0 md:pr-8">
              <span className="absolute left-0 top-2 flex h-3 w-3 rounded-full bg-hologram shadow-hologram md:left-[calc(1.5rem-6px)]" />
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-glitch">{item.title}</p>
            </div>

            <div className="glass-surface glass-surface-hover p-5 md:p-6">{item.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}