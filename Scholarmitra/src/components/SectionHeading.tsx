"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  dark = false,
  action,
}: {
  kicker: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        Boolean(action) && "md:flex-row md:items-end md:justify-between md:text-left",
      )}
    >
      <div className={cn(align === "center" && !action && "max-w-2xl")}>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-widest uppercase",
            dark
              ? "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30"
              : "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {kicker}
        </span>
        <h2
          className={cn(
            "mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl",
            dark ? "text-white" : "text-blue-950",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 text-base leading-relaxed text-pretty",
              dark ? "text-blue-200/80" : "text-slate-600",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
