"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  CalendarClock,
  GitCompareArrows,
  GraduationCap,
  Landmark,
  MapPin,
  Wallet,
} from "lucide-react";
import type { ScholarshipDTO } from "@/lib/types";
import { cn, kindLabel, levelLabel } from "@/lib/utils";
import { useCompare, useSaved } from "./AppProviders";

const KIND_STYLES: Record<string, string> = {
  merit: "bg-violet-50 text-violet-700 ring-violet-200",
  need: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  mcm: "bg-blue-50 text-blue-700 ring-blue-200",
  special: "bg-amber-50 text-amber-700 ring-amber-200",
};

function WindowChip({ s }: { s: ScholarshipDTO }) {
  const w = s.window;
  const styles =
    w.status === "open"
      ? w.daysToEnd <= 21
        ? "bg-orange-50 text-orange-700 ring-orange-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : w.status === "opening-soon"
        ? "bg-blue-50 text-blue-700 ring-blue-200"
        : "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
        styles,
      )}
    >
      <CalendarClock className="h-3.5 w-3.5" />
      {w.daysLabel}
    </span>
  );
}

export default function ScholarshipCard({
  scholarship,
  index = 0,
  matchScore,
}: {
  scholarship: ScholarshipDTO;
  index?: number;
  matchScore?: number;
}) {
  const s = scholarship;
  const { savedIds, toggle } = useSaved();
  const { slugs: compareSlugs, toggle: toggleCompare } = useCompare();
  const isSaved = savedIds.has(s.id);
  const inCompare = compareSlugs.includes(s.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-blue-950/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
              KIND_STYLES[s.kind] ?? KIND_STYLES.merit,
            )}
          >
            {kindLabel(s.kind)}
          </span>
          <WindowChip s={s} />
        </div>
        {s.authority === "central" ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
            <Landmark className="h-3.5 w-3.5" /> Central
          </span>
        ) : s.authority === "state" ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
            <MapPin className="h-3.5 w-3.5" /> {s.state}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <BadgeCheck className="h-3.5 w-3.5" /> CSR / Trust
          </span>
        )}
      </div>

      <Link href={`/scholarships/${s.slug}`} className="mt-4 block">
        <h3 className="text-[17px] leading-snug font-extrabold tracking-tight text-blue-950 transition-colors group-hover:text-blue-700">
          {s.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
          {s.provider}
        </p>
      </Link>

      {typeof matchScore === "number" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Profile match</span>
            <span
              className={cn(
                matchScore >= 82
                  ? "text-emerald-600"
                  : matchScore >= 62
                    ? "text-blue-600"
                    : "text-amber-600",
              )}
            >
              {matchScore}%
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${matchScore}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className={cn(
                "h-full rounded-full",
                matchScore >= 82
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                  : matchScore >= 62
                    ? "bg-gradient-to-r from-blue-400 to-blue-600"
                    : "bg-gradient-to-r from-amber-400 to-orange-500",
              )}
            />
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-blue-50/70 p-3">
          <p className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-wider text-blue-500/80 uppercase">
            <Wallet className="h-3.5 w-3.5" /> Amount
          </p>
          <p className="mt-1 text-[13px] leading-snug font-bold text-blue-950">{s.amountText}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase">
            <GraduationCap className="h-3.5 w-3.5" /> Levels
          </p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug font-bold text-slate-800">
            {s.levels.slice(0, 3).map(levelLabel).join(" · ")}
            {s.levels.length > 3 ? ` +${s.levels.length - 3}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-5">
        <Link
          href={`/scholarships/${s.slug}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-[13px] font-bold text-white shadow-md shadow-blue-600/20 transition group-hover:bg-blue-700"
        >
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <button
          onClick={() => toggle({ id: s.id, slug: s.slug, name: s.name })}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save scholarship"}
          title={isSaved ? "Saved" : "Save scholarship"}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
            isSaved
              ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25"
              : "border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600",
          )}
        >
          <Bookmark className={cn("h-4.5 w-4.5", isSaved && "fill-current")} />
        </button>
        <button
          onClick={() => toggleCompare(s.slug)}
          aria-pressed={inCompare}
          aria-label={inCompare ? "Remove from comparison" : "Add to comparison"}
          title={inCompare ? "In compare list" : "Add to compare"}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
            inCompare
              ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600",
          )}
        >
          <GitCompareArrows className="h-4.5 w-4.5" />
        </button>
      </div>
    </motion.article>
  );
}
