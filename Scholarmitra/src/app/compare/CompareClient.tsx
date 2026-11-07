"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  GitCompareArrows,
  IndianRupee,
  Search,
  Sparkles,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { useCompare } from "@/components/AppProviders";
import { useScholarships } from "@/components/useScholarships";
import type { ScholarshipDTO } from "@/lib/types";
import { cn, formatINR, kindLabel, levelLabel } from "@/lib/utils";

function Row({
  label,
  highlight,
  values,
}: {
  label: string;
  highlight?: "max" | "min";
  values: { text: string; num?: number | null }[];
}) {
  const nums = values.map((v) => v.num);
  const has = nums.filter((n) => n != null) as number[];
  const best =
    highlight && has.length > 1
      ? highlight === "max"
        ? Math.max(...has)
        : Math.min(...has)
      : null;
  return (
    <tr className="border-b border-slate-100 last:border-none">
      <th
        scope="row"
        className="sticky left-0 z-10 w-40 min-w-40 bg-white px-4 py-4 text-left align-top text-[11px] font-extrabold tracking-wider text-slate-400 uppercase sm:w-48 sm:px-6"
      >
        {label}
      </th>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn(
            "min-w-56 px-5 py-4 align-top text-[13.5px] leading-relaxed font-semibold",
            best != null && v.num === best
              ? "bg-emerald-50/60 text-emerald-800"
              : "text-slate-700",
          )}
        >
          {v.text}
          {best != null && v.num === best && (
            <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[9.5px] font-extrabold text-white uppercase">
              Best
            </span>
          )}
        </td>
      ))}
    </tr>
  );
}

export default function CompareClient() {
  const { slugs, toggle, clear } = useCompare();
  const { data, loading } = useScholarships();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const selected: ScholarshipDTO[] = useMemo(() => {
    if (!data) return [];
    return slugs
      .map((slug) => data.find((s) => s.slug === slug))
      .filter((s): s is ScholarshipDTO => Boolean(s));
  }, [data, slugs]);

  const suggestions = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data
      .filter((s) => !slugs.includes(s.slug))
      .filter((s) => !q || `${s.name} ${s.provider}`.toLowerCase().includes(q))
      .slice(0, 4);
  }, [data, slugs, search]);

  if (!mounted) return <div className="mx-auto max-w-7xl px-4 py-24" />;

  return (
    <div className="bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pattern-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
            <GitCompareArrows className="h-3.5 w-3.5" /> Side-by-side decisions
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Compare Scholarships
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            Pick up to three schemes and compare amounts, eligibility, income limits, deadlines and
            benefits. The best value in each row is highlighted.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* selector */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold tracking-wide text-blue-950 uppercase">
              Your comparison list ({slugs.length}/3)
            </h2>
            {slugs.length > 0 && (
              <button
                onClick={clear}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear all
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {selected.map((s) => (
              <span
                key={s.slug}
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 py-2 pr-2 pl-4 text-[13px] font-bold text-blue-800 ring-1 ring-blue-100"
              >
                <span className="max-w-56 truncate">{s.name}</span>
                <button
                  onClick={() => toggle(s.slug)}
                  aria-label={`Remove ${s.name}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {slugs.length < 3 && (
              <div className="relative">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Add a scholarship…"
                  className="field-input w-64 pl-10"
                />
              </div>
            )}
          </div>

          {search && suggestions.length > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => {
                    toggle(s.slug);
                    setSearch("");
                  }}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-bold text-blue-950">{s.name}</span>
                    <span className="block truncate text-[11px] text-slate-500">{s.provider}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white">
                    Add
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-8 h-96 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        ) : selected.length < 2 ? (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500">
              <GitCompareArrows className="h-8 w-8" />
            </span>
            <h3 className="mt-5 text-lg font-extrabold text-blue-950">
              {selected.length === 0 ? "No scholarships selected yet" : "Add at least one more"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {selected.length === 0
                ? "Search above or browse the directory and tap the compare icon on any scholarship."
                : "Comparisons need at least two schemes — add one more to unlock the table."}
            </p>
            <Link
              href="/explore"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
            >
              Browse scholarships <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 overflow-x-auto rounded-3xl border border-slate-200/80 bg-white shadow-sm"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="sticky left-0 z-10 w-40 min-w-40 bg-slate-50 px-4 py-5 text-left sm:w-48 sm:px-6" />
                  {selected.map((s) => (
                    <th key={s.slug} className="min-w-56 px-5 py-5 text-left align-top">
                      <Link
                        href={`/scholarships/${s.slug}`}
                        className="text-[15px] leading-snug font-extrabold tracking-tight text-blue-950 hover:text-blue-700"
                      >
                        {s.name}
                      </Link>
                      <p className="mt-1 text-[11.5px] font-medium text-slate-500">{s.provider}</p>
                      <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                        {kindLabel(s.kind)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row
                  label="Scholarship amount"
                  values={selected.map((s) => ({ text: s.amountText, num: s.amountMax }))}
                  highlight="max"
                />
                <Row
                  label="Income limit"
                  values={selected.map((s) => ({
                    text: s.maxFamilyIncome
                      ? `${formatINR(s.maxFamilyIncome)} per year`
                      : "No income bar",
                    num: s.maxFamilyIncome ?? 99999999,
                  }))}
                  highlight="max"
                />
                <Row
                  label="Minimum marks"
                  values={selected.map((s) => ({
                    text: s.minPercentage ? `${s.minPercentage}% required` : "No fixed cutoff",
                    num: s.minPercentage ? 100 - s.minPercentage : 200,
                  }))}
                  highlight="max"
                />
                <Row
                  label="Education level"
                  values={selected.map((s) => ({ text: s.levels.map(levelLabel).join(" · ") }))}
                />
                <Row
                  label="Who can apply"
                  values={selected.map((s) => ({
                    text:
                      (s.gender === "female" ? "Girls · " : "All genders · ") +
                      (s.groups.includes("all")
                        ? "open to all categories"
                        : s.groups.includes("ner")
                          ? "NE region students"
                          : s.groups.map((g) => g.toUpperCase()).join(", ")),
                  }))}
                />
                <tr className="border-b border-slate-100">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 w-40 min-w-40 bg-white px-4 py-4 text-left align-top text-[11px] font-extrabold tracking-wider text-slate-400 uppercase sm:w-48 sm:px-6"
                  >
                    <span className="flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-blue-500" /> Deadline
                    </span>
                  </th>
                  {selected.map((s) => {
                    const open = s.window.status === "open";
                    return (
                      <td key={s.slug} className="min-w-56 px-5 py-4 align-top">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold ring-1",
                            open
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              : "bg-blue-50 text-blue-700 ring-blue-200",
                          )}
                        >
                          <CalendarClock className="h-3.5 w-3.5" />
                          {open
                            ? `${s.window.daysToEnd} days left (ends ${s.window.endLabel})`
                            : `Opens ${s.window.startLabel}`}
                        </span>
                        <p className="mt-2 text-[11.5px] text-slate-500">
                          Tentative — {s.deadlineText}
                        </p>
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-slate-100">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 w-40 min-w-40 bg-white px-4 py-4 text-left align-top text-[11px] font-extrabold tracking-wider text-slate-400 uppercase sm:w-48 sm:px-6"
                  >
                    <span className="flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5 text-blue-500" /> Benefits
                    </span>
                  </th>
                  {selected.map((s) => (
                    <td
                      key={s.slug}
                      className="min-w-56 px-5 py-4 align-top text-[12.5px] leading-relaxed font-medium text-slate-600"
                    >
                      {s.benefits}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 w-40 min-w-40 bg-white px-4 py-5 text-left align-top sm:w-48 sm:px-6"
                  />
                  {selected.map((s) => (
                    <td key={s.slug} className="min-w-56 px-5 py-5 align-top">
                      <a
                        href={s.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                      >
                        Apply on {s.portal} <ArrowUpRight className="h-4 w-4" />
                      </a>
                      <p className="mt-2 text-[10.5px] font-medium text-slate-400">
                        Official portal · always free
                      </p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}

        <p className="mt-8 flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-relaxed text-slate-600">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <span>
            <IndianRupee className="mr-1 inline h-3.5 w-3.5 align-[-2px] text-blue-500" />
            Amounts and windows are taken from published scheme guidelines and previous cycles.
            Verify the current notification before you decide.
          </span>
        </p>
      </div>
    </div>
  );
}
