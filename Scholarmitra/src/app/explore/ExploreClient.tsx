"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Compass,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ScholarshipCard from "@/components/ScholarshipCard";
import { useScholarships } from "@/components/useScholarships";
import { GROUPS, INCOME_PRESETS, KINDS, LEVELS, STATES, STREAMS } from "@/lib/constants";
import { filterScholarships } from "@/lib/match";
import { cn } from "@/lib/utils";

type Filters = {
  q: string;
  state: string;
  level: string;
  stream: string;
  kind: string;
  authority: string;
  income: string;
  percentage: string;
  group: string;
  school: boolean;
};

const EMPTY: Filters = {
  q: "",
  state: "",
  level: "",
  stream: "",
  kind: "",
  authority: "",
  income: "",
  percentage: "",
  group: "",
  school: false,
};

const SORTS = [
  { value: "relevance", label: "Featured first" },
  { value: "amount", label: "Highest amount" },
  { value: "deadline", label: "Deadline — soonest" },
];

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, loading, error } = useScholarships();
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState("relevance");
  const [mobileFilters, setMobileFilters] = useState(false);

  // Hydrate from URL once
  useEffect(() => {
    setFilters({
      q: searchParams.get("q") ?? "",
      state: searchParams.get("state") ?? "",
      level: searchParams.get("level") ?? "",
      stream: searchParams.get("stream") ?? "",
      kind: searchParams.get("kind") ?? "",
      authority: searchParams.get("authority") ?? "",
      income: searchParams.get("income") ?? "",
      percentage: searchParams.get("percentage") ?? "",
      group: searchParams.get("group") ?? "",
      school: searchParams.get("school") === "true",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect filters in URL (shareable) — debounced
  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams();
      for (const [k, v] of Object.entries(filters)) {
        if (typeof v === "string" ? v : v) p.set(k, String(v));
      }
      const qs = p.toString();
      router.replace(`/explore${qs ? `?${qs}` : ""}`, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [filters, router]);

  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));

  const results = useMemo(() => {
    if (!data) return null;
    let list = filterScholarships(
      {
        q: filters.q,
        state: filters.state || null,
        level: filters.level || null,
        stream: filters.stream || null,
        kind: filters.kind || null,
        income: filters.income ? Number(filters.income) : null,
        percentage: filters.percentage ? Number(filters.percentage) : null,
        group: filters.group || null,
        gender: null,
      },
      data,
    );
    if (filters.authority) list = list.filter((s) => s.authority === filters.authority);
    if (filters.school) list = list.filter((s) => s.schoolLevel);
    if (sort === "amount") {
      list = [...list].sort((a, b) => (b.amountMax ?? -1) - (a.amountMax ?? -1));
    } else if (sort === "deadline") {
      list = [...list].sort((a, b) => {
        const ka = a.window.status === "open" ? a.window.daysToEnd : 1000 + a.window.daysToStart;
        const kb = b.window.status === "open" ? b.window.daysToEnd : 1000 + b.window.daysToStart;
        return ka - kb;
      });
    }
    return list;
  }, [data, filters, sort]);

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => k !== "q" && v && v !== "",
  ).length + (filters.q ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-5">
      <div>
        <label htmlFor="fx-q" className="field-label">
          Scholarship Name
        </label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="fx-q"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Search by name or provider…"
            className="field-input pl-10"
          />
        </div>
      </div>
      <div>
        <label htmlFor="fx-state" className="field-label">
          State
        </label>
        <select id="fx-state" className="field-input" value={filters.state} onChange={(e) => set({ state: e.target.value })}>
          <option value="">All of India</option>
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fx-level" className="field-label">
          Education Level
        </label>
        <select id="fx-level" className="field-input" value={filters.level} onChange={(e) => set({ level: e.target.value })}>
          <option value="">Any level</option>
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fx-stream" className="field-label">
          Course / Stream
        </label>
        <select id="fx-stream" className="field-input" value={filters.stream} onChange={(e) => set({ stream: e.target.value })}>
          <option value="">Any stream</option>
          {STREAMS.filter((s) => s.value !== "all").map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fx-kind" className="field-label">
          Category
        </label>
        <select id="fx-kind" className="field-input" value={filters.kind} onChange={(e) => set({ kind: e.target.value })}>
          <option value="">All categories</option>
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fx-authority" className="field-label">
          Provider Type
        </label>
        <select id="fx-authority" className="field-input" value={filters.authority} onChange={(e) => set({ authority: e.target.value })}>
          <option value="">All providers</option>
          <option value="central">Central Government</option>
          <option value="state">State Government</option>
          <option value="private">Private / CSR Trust</option>
        </select>
      </div>
      <div>
        <label htmlFor="fx-group" className="field-label">
          Community / Group
        </label>
        <select id="fx-group" className="field-input" value={filters.group} onChange={(e) => set({ group: e.target.value })}>
          <option value="">All groups</option>
          {GROUPS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fx-income" className="field-label">
          Annual Family Income
        </label>
        <select id="fx-income" className="field-input" value={filters.income} onChange={(e) => set({ income: e.target.value })}>
          <option value="">Any income</option>
          {INCOME_PRESETS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fx-pct" className="field-label">
          Academic Percentage
        </label>
        <input
          id="fx-pct"
          type="number"
          min={0}
          max={100}
          step="0.1"
          value={filters.percentage}
          onChange={(e) => set({ percentage: e.target.value })}
          placeholder="e.g. 82"
          className="field-input"
        />
      </div>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3">
        <input
          type="checkbox"
          checked={filters.school}
          onChange={(e) => set({ school: e.target.checked })}
          className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 accent-blue-600"
        />
        <span className="text-[13px] font-bold text-slate-700">School-level schemes only</span>
      </label>
      <button
        type="button"
        onClick={() => setFilters(EMPTY)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
      >
        <RotateCcw className="h-4 w-4" /> Reset all filters
      </button>
    </div>
  );

  return (
    <div className="bg-[#f8fafc]">
      {/* header band */}
      <div className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pattern-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
            <Compass className="h-3.5 w-3.5" /> Scholarship directory
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Explore Scholarships
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            Every listing below is a real, officially notified scheme. Filter by what matters to you
            — results update instantly, and &ldquo;Apply Now&rdquo; always opens the official portal.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-extrabold tracking-wide text-blue-950 uppercase">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Filters
                </h2>
                {activeCount > 0 && (
                  <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </div>
              {FilterPanel}
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold text-slate-600">
                {loading ? (
                  "Loading verified schemes…"
                ) : error ? (
                  <span className="text-red-600">{error}</span>
                ) : (
                  <>
                    <span className="text-blue-700">{results?.length ?? 0}</span> scholarship
                    {(results?.length ?? 0) === 1 ? "" : "s"} found
                  </>
                )}
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setMobileFilters(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                  {activeCount > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] text-white">
                      {activeCount}
                    </span>
                  )}
                </button>
                <select
                  aria-label="Sort results"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-blue-500"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white" />
                ))}
              </div>
            )}

            {!loading && results && results.length === 0 && (
              <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-500">
                  <SearchX className="h-8 w-8" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-blue-950">No scholarships match</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Try loosening a filter — for example clear the income or percentage limit to see
                  more eligible schemes.
                </p>
                <button
                  onClick={() => setFilters(EMPTY)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
                >
                  <RotateCcw className="h-4 w-4" /> Clear all filters
                </button>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {results?.map((s, i) => (
                <ScholarshipCard key={s.slug} scholarship={s} index={i} />
              ))}
            </div>

            <p className="mt-10 flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-relaxed text-slate-600">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              Information is compiled from official scheme notifications. Application windows shown are
              typical periods from previous cycles (tentative). Always verify the latest details,
              amounts and dates on the official portal linked on every scholarship.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileFilters ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileFilters}
      >
        <div
          className={cn(
            "absolute inset-0 bg-blue-950/40 backdrop-blur-sm transition-opacity",
            mobileFilters ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileFilters(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
            mobileFilters ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-extrabold tracking-wide text-blue-950 uppercase">
              Filters
            </h2>
            <button
              onClick={() => setMobileFilters(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{FilterPanel}</div>
          <div className="border-t border-slate-100 p-4">
            <button
              onClick={() => setMobileFilters(false)}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white"
            >
              Show {results?.length ?? 0} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
