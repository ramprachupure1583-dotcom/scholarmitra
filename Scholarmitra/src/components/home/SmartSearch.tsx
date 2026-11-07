"use client";

import { useRouter } from "next/navigation";
import { Building2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { GROUPS, INCOME_PRESETS, KINDS, LEVELS, STATES, STREAMS } from "@/lib/constants";

export default function SmartSearch() {
  const router = useRouter();
  const [form, setForm] = useState({
    q: "",
    state: "",
    level: "",
    stream: "",
    kind: "",
    income: "",
    percentage: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(form)) if (v) params.set(k, v);
    router.push(`/explore${params.size ? `?${params.toString()}` : ""}`);
  };

  const reset = () =>
    setForm({ q: "", state: "", level: "", stream: "", kind: "", income: "", percentage: "" });

  return (
    <section className="relative z-20 -mt-14 lg:-mt-20" aria-label="Scholarship search">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-2xl shadow-blue-950/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Search className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-blue-950">
                  Smart Scholarship Search
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  Filter by state, level, course, category, income &amp; marks
                </p>
              </div>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 sm:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" /> 7 smart filters
            </span>
          </div>

          <form onSubmit={submit} className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label htmlFor="hs-q" className="field-label">
                  Scholarship Name
                </label>
                <input
                  id="hs-q"
                  type="text"
                  value={form.q}
                  onChange={set("q")}
                  placeholder="e.g. INSPIRE, Pragati, Post Matric…"
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="hs-state" className="field-label">
                  State
                </label>
                <select id="hs-state" value={form.state} onChange={set("state")} className="field-input">
                  <option value="">All of India</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hs-level" className="field-label">
                  Education Level
                </label>
                <select id="hs-level" value={form.level} onChange={set("level")} className="field-input">
                  <option value="">Any level</option>
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hs-stream" className="field-label">
                  Course / Stream
                </label>
                <select id="hs-stream" value={form.stream} onChange={set("stream")} className="field-input">
                  {STREAMS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hs-kind" className="field-label">
                  Scholarship Category
                </label>
                <select id="hs-kind" value={form.kind} onChange={set("kind")} className="field-input">
                  <option value="">All categories</option>
                  {KINDS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hs-income" className="field-label">
                  Annual Family Income
                </label>
                <select id="hs-income" value={form.income} onChange={set("income")} className="field-input">
                  <option value="">Any income</option>
                  {INCOME_PRESETS.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hs-pct" className="field-label">
                  Academic Percentage
                </label>
                <input
                  id="hs-pct"
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={form.percentage}
                  onChange={set("percentage")}
                  placeholder="e.g. 82"
                  className="field-input"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                <Search className="h-4.5 w-4.5" />
                Search Scholarships
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <p className="ml-auto hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex">
                <Building2 className="h-3.5 w-3.5" />
                Results link only to official portals
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
