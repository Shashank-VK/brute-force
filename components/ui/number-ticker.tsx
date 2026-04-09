"use client";

import * as React from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  duration?: number;
  delay?: number;
  startValue?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

function formatNumber(value: number, decimalPlaces: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(value.toFixed(decimalPlaces)));
}

export function NumberTicker({
  value,
  duration = 1.5,
  delay = 0,
  startValue = 0,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  className,
  ...props
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(startValue);
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = React.useState(formatNumber(startValue, decimalPlaces));
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplayValue(formatNumber(latest, decimalPlaces));
  });

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    if (prefersReducedMotion) {
      setDisplayValue(formatNumber(value, decimalPlaces));
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      delay: delay + 0.3,
      ease: "easeOut",
    });

    return () => {
      controls.stop();
    };
  }, [decimalPlaces, delay, duration, mounted, motionValue, prefersReducedMotion, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...props}>
      {prefix}
      {prefersReducedMotion ? formatNumber(value, decimalPlaces) : displayValue}
      {suffix}
    </span>
  );
}