"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Info,
  Loader2,
  RotateCcw,
  Sparkles,
  User,
} from "lucide-react";
import { useAuth, useToast } from "@/components/AppProviders";
import ScholarshipCard from "@/components/ScholarshipCard";
import { GROUPS, INCOME_PRESETS, LEVELS, STATES, STREAMS } from "@/lib/constants";
import type { MatchResultDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  state: string;
  level: string;
  course: string;
  stream: string;
  percentage: string;
  income: string;
  group: string;
  gender: string;
};

type EligibilityResponse = {
  name: string;
  total: number;
  results: MatchResultDTO[];
  disclaimer: string;
};

const STRENGTH_STYLES: Record<string, { chip: string; label: string }> = {
  strong: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "Strong match" },
  good: { chip: "bg-blue-50 text-blue-700 ring-blue-200", label: "Good match" },
  possible: { chip: "bg-amber-50 text-amber-700 ring-amber-200", label: "Possible match" },
};

export default function EligibilityClient() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({
    name: "",
    state: "",
    level: "",
    course: "",
    stream: "",
    percentage: "",
    income: "",
    group: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EligibilityResponse | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  // Prefill from the logged-in profile
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name,
      state: f.state || user.state || "",
      level: f.level || user.educationLevel || "",
      course: f.course || user.course || "",
      group: f.group || user.category || "",
      gender: f.gender || user.gender || "",
      percentage: f.percentage || (user.percentage != null ? String(user.percentage) : ""),
      income: f.income || (user.familyIncome != null ? String(user.familyIncome) : ""),
    }));
  }, [user]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) er.name = "Enter the student's full name.";
    if (!form.state) er.state = "Select your state of domicile.";
    if (!form.level) er.level = "Select your current education level.";
    if (form.percentage) {
      const p = Number(form.percentage);
      if (!Number.isFinite(p) || p < 0 || p > 100) er.percentage = "Enter a value between 0 and 100.";
    }
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          state: form.state,
          level: form.level,
          stream: form.stream || null,
          percentage: form.percentage || null,
          income: form.income || null,
          group: form.group || null,
          gender: form.gender || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setResponse(data);
      toast(`Found ${data.total} potentially suitable scholarships for you.`, "success");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setForm({
      name: user?.name ?? "",
      state: "",
      level: "",
      course: "",
      stream: "",
      percentage: "",
      income: "",
      group: "",
      gender: "",
    });
    setResponse(null);
    setErrors({});
  };

  const strong = response?.results.filter((r) => r.strength === "strong").length ?? 0;

  return (
    <div className="bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pattern-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
            <Sparkles className="h-3.5 w-3.5" /> AI-assisted eligibility check
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Eligibility Checker
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            Tell us about the student and we'll instantly match you against every scheme's published
            criteria — income limits, marks, category and state domicile.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[420px_1fr]">
          {/* Form */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-blue-950">
              <User className="h-5 w-5 text-blue-600" /> Student details
            </h2>
            <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
              <div>
                <label htmlFor="el-name" className="field-label">
                  Student Name <span className="text-blue-600">*</span>
                </label>
                <input
                  id="el-name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Aisha Sharma"
                  className={cn("field-input", errors.name && "border-red-400 focus:ring-red-100")}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="mt-1 text-xs font-semibold text-red-600">{errors.name}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="el-state" className="field-label">
                    State <span className="text-blue-600">*</span>
                  </label>
                  <select
                    id="el-state"
                    value={form.state}
                    onChange={set("state")}
                    className={cn("field-input", errors.state && "border-red-400 focus:ring-red-100")}
                    aria-invalid={Boolean(errors.state)}
                  >
                    <option value="">Select state…</option>
                    {STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="el-level" className="field-label">
                    Education Level <span className="text-blue-600">*</span>
                  </label>
                  <select
                    id="el-level"
                    value={form.level}
                    onChange={set("level")}
                    className={cn("field-input", errors.level && "border-red-400 focus:ring-red-100")}
                    aria-invalid={Boolean(errors.level)}
                  >
                    <option value="">Select level…</option>
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                  {errors.level && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{errors.level}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="el-course" className="field-label">
                    Current Course
                  </label>
                  <input
                    id="el-course"
                    value={form.course}
                    onChange={set("course")}
                    placeholder="e.g. B.Tech, BA, Class 11…"
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="el-stream" className="field-label">
                    Stream
                  </label>
                  <select id="el-stream" value={form.stream} onChange={set("stream")} className="field-input">
                    <option value="">Select stream…</option>
                    {STREAMS.filter((s) => s.value !== "all").map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="el-pct" className="field-label">
                    Academic Percentage
                  </label>
                  <input
                    id="el-pct"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    step="0.1"
                    value={form.percentage}
                    onChange={set("percentage")}
                    placeholder="e.g. 86"
                    className={cn("field-input", errors.percentage && "border-red-400 focus:ring-red-100")}
                    aria-invalid={Boolean(errors.percentage)}
                  />
                  {errors.percentage && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{errors.percentage}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="el-income" className="field-label">
                    Annual Family Income
                  </label>
                  <select id="el-income" value={form.income} onChange={set("income")} className="field-input">
                    <option value="">Prefer not to say</option>
                    {INCOME_PRESETS.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="el-group" className="field-label">
                    Category
                  </label>
                  <select id="el-group" value={form.group} onChange={set("group")} className="field-input">
                    <option value="">Select category…</option>
                    {GROUPS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="el-gender" className="field-label">
                    Gender
                  </label>
                  <select id="el-gender" value={form.gender} onChange={set("gender")} className="field-input">
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" /> Checking…
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="h-4.5 w-4.5" /> Check My Eligibility
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>

              {user && (
                <p className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2.5 text-xs font-medium text-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Pre-filled from your ScholarMitra profile.
                </p>
              )}
            </form>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="scroll-mt-24">
            <AnimatePresence mode="wait">
              {!response ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-8 text-center"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                    <ClipboardCheck className="h-10 w-10" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold tracking-tight text-blue-950">
                    Your matches will appear here
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                    Fill in the student details and press <strong>Check My Eligibility</strong>. We
                    compare your answers with every scheme's published rules and rank them from
                    strongest to possible matches.
                  </p>
                  <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Info className="h-3.5 w-3.5" /> No data is stored unless you're logged in.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase">
                          Results for {response.name}
                        </p>
                        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-blue-950">
                          {response.total} scholarship{response.total === 1 ? "" : "s"} you could
                          pursue
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        {(["strong", "good", "possible"] as const).map((sKey) => (
                          <span
                            key={sKey}
                            className={cn(
                              "rounded-full px-3 py-1.5 ring-1",
                              STRENGTH_STYLES[sKey].chip,
                            )}
                          >
                            {response.results.filter((r) => r.strength === sKey).length}{" "}
                            {STRENGTH_STYLES[sKey].label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-200/70 bg-amber-50/80 p-4 text-[12.5px] leading-relaxed text-amber-900">
                      <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />
                      {response.disclaimer}
                    </div>
                  </div>

                  {strong > 0 && (
                    <p className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-700">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                      {strong} strong match{strong > 1 ? "es" : ""} — start with these.
                    </p>
                  )}

                  <div className="grid gap-6 xl:grid-cols-2">
                    {response.results.map((m, i) => (
                      <div key={m.scholarship.slug} className="relative">
                        <div className="flex h-full flex-col gap-3">
                          <ScholarshipCard scholarship={m.scholarship} index={Math.min(i, 6)} matchScore={m.score} />
                          {(m.reasons.length > 0 || m.cautions.length > 0) && (
                            <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-[12px] leading-relaxed">
                              <ul className="space-y-1">
                                {m.reasons.slice(0, 3).map((r) => (
                                  <li key={r} className="flex items-start gap-1.5 text-emerald-700">
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {r}
                                  </li>
                                ))}
                                {m.cautions.slice(0, 2).map((c) => (
                                  <li key={c} className="flex items-start gap-1.5 text-amber-600">
                                    <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Link
                      href="/explore"
                      className="text-sm font-bold text-blue-700 underline-offset-4 hover:underline"
                    >
                      Or browse the complete directory →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
