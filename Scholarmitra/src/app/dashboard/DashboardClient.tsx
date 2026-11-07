"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BellRing,
  BookmarkCheck,
  CalendarClock,
  CheckCircle2,
  Compass,
  FileText,
  Loader2,
  Rocket,
  Send,
  Sparkles,
  Trash2,
  UserRound,
  Wallet,
} from "lucide-react";
import { useAuth, useSaved, useToast } from "@/components/AppProviders";
import { GROUPS, INCOME_PRESETS, LEVELS, STATES } from "@/lib/constants";
import type { ScholarshipDTO, TrackedApplicationDTO } from "@/lib/types";
import { cn, formatINR, levelLabel } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: Rocket },
  { id: "saved", label: "Saved Scholarships", icon: BookmarkCheck },
  { id: "applications", label: "Applications", icon: Send },
  { id: "profile", label: "Student Profile", icon: UserRound },
] as const;

const STATUS_META: Record<string, { label: string; chip: string; step: number }> = {
  planning: { label: "Planning to apply", chip: "bg-slate-100 text-slate-600", step: 15 },
  in_progress: { label: "Application in progress", chip: "bg-blue-50 text-blue-700", step: 40 },
  submitted: { label: "Submitted on portal", chip: "bg-indigo-50 text-indigo-700", step: 65 },
  under_review: { label: "Under verification", chip: "bg-amber-50 text-amber-700", step: 82 },
  selected: { label: "Selected / Awarded", chip: "bg-emerald-50 text-emerald-700", step: 100 },
  not_selected: { label: "Not selected", chip: "bg-red-50 text-red-600", step: 100 },
};

type SavedRow = { id: number; savedAt: string; scholarship: ScholarshipDTO };

export default function DashboardClient({ userName }: { userName: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const { toggle: toggleSaved } = useSaved();

  const [tab, setTab] = useState<string>("overview");
  const [saved, setSaved] = useState<SavedRow[] | null>(null);
  const [apps, setApps] = useState<TrackedApplicationDTO[] | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    state: "",
    educationLevel: "",
    course: "",
    category: "",
    gender: "",
    percentage: "",
    familyIncome: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => setTab(searchParams.get("tab") ?? "overview"), [searchParams]);

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name,
      state: user.state ?? "",
      educationLevel: user.educationLevel ?? "",
      course: user.course ?? "",
      category: user.category ?? "",
      gender: user.gender ?? "",
      percentage: user.percentage != null ? String(user.percentage) : "",
      familyIncome: user.familyIncome != null ? String(user.familyIncome) : "",
    });
  }, [user]);

  const loadAll = useCallback(async () => {
    const [s, a] = await Promise.all([
      fetch("/api/saved", { cache: "no-store" }).then((r) => (r.ok ? r.json() : { saved: [] })),
      fetch("/api/applications", { cache: "no-store" }).then((r) =>
        r.ok ? r.json() : { applications: [] },
      ),
    ]);
    setSaved(s.saved ?? []);
    setApps(a.applications ?? []);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const trackedIds = useMemo(() => new Set(apps?.map((a) => a.scholarshipId) ?? []), [apps]);

  const upcoming = useMemo(() => {
    const pool = new Map<number, ScholarshipDTO>();
    saved?.forEach((r) => pool.set(r.scholarship.id, r.scholarship));
    apps?.forEach((a) => pool.set(a.scholarship.id, a.scholarship as ScholarshipDTO));
    return [...pool.values()]
      .filter(
        (s) =>
          (s.window.status === "open" && s.window.daysToEnd <= 60) ||
          (s.window.status !== "open" && s.window.daysToStart <= 60),
      )
      .sort((a, b) => {
        const ka = a.window.status === "open" ? a.window.daysToEnd : 500 + a.window.daysToStart;
        const kb = b.window.status === "open" ? b.window.daysToEnd : 500 + b.window.daysToStart;
        return ka - kb;
      })
      .slice(0, 6);
  }, [saved, apps]);

  const pendingCount =
    apps?.filter((a) => ["planning", "in_progress"].includes(a.status)).length ?? 0;
  const appliedCount =
    apps?.filter((a) => ["submitted", "under_review", "selected"].includes(a.status)).length ?? 0;

  const progress = useMemo(() => {
    if (!apps || apps.length === 0) return 0;
    const total = apps.reduce((acc, a) => acc + (STATUS_META[a.status]?.step ?? 10), 0);
    return Math.round(total / apps.length);
  }, [apps]);

  const completeness = useMemo(() => {
    const fields = [
      profile.state,
      profile.educationLevel,
      profile.course,
      profile.category,
      profile.gender,
      profile.percentage,
      profile.familyIncome,
    ];
    return Math.round((fields.filter((f) => f !== "" && f != null).length / fields.length) * 100);
  }, [profile]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          state: profile.state || null,
          educationLevel: profile.educationLevel || null,
          course: profile.course || null,
          category: profile.category || null,
          gender: profile.gender || null,
          percentage: profile.percentage ? Number(profile.percentage) : null,
          familyIncome: profile.familyIncome ? Number(profile.familyIncome) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      await refresh();
      toast("Profile saved — your eligibility checks are now pre-filled.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateApp = async (id: number, patch: { status?: string; notes?: string }) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id, ...patch }),
      });
      if (!res.ok) throw new Error();
      await loadAll();
      if (patch.status) toast("Application status updated.", "success");
    } catch {
      toast("Could not update. Try again.", "error");
    }
  };

  const removeApp = async (id: number) => {
    try {
      await fetch(`/api/applications?applicationId=${id}`, { method: "DELETE" });
      await loadAll();
      toast("Removed from tracker.", "success");
    } catch {
      toast("Could not remove. Try again.", "error");
    }
  };

  const startTracking = async (scholarshipId: number) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId, status: "planning" }),
      });
      if (!res.ok) throw new Error();
      await loadAll();
      toast("Added to Applications — status: Planning to apply.", "success");
      setTab("applications");
      router.replace("/dashboard?tab=applications", { scroll: false });
    } catch {
      toast("Could not start tracking. Try again.", "error");
    }
  };

  const stats = [
    {
      label: "Saved Scholarships",
      value: saved?.length ?? "–",
      icon: BookmarkCheck,
      tint: "from-blue-500 to-indigo-600",
      onClick: () => setTab("saved"),
    },
    {
      label: "Pending Applications",
      value: apps == null ? "–" : pendingCount,
      icon: FileText,
      tint: "from-amber-400 to-orange-500",
      onClick: () => setTab("applications"),
    },
    {
      label: "Applied / Submitted",
      value: apps == null ? "–" : appliedCount,
      icon: Send,
      tint: "from-indigo-500 to-violet-600",
      onClick: () => setTab("applications"),
    },
    {
      label: "Upcoming Deadlines",
      value: saved == null && apps == null ? "–" : upcoming.length,
      icon: BellRing,
      tint: "from-rose-400 to-red-500",
      onClick: () => setTab("overview"),
    },
  ];

  return (
    <div className="bg-[#f8fafc]">
      <div className="relative overflow-hidden bg-blue-950 pb-24">
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(45rem_20rem_at_80%_0%,rgba(59,130,246,0.35),transparent_60%)]" />
        <div className="pattern-dots absolute inset-0 opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-bold tracking-widest text-blue-300 uppercase">
              Student dashboard
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Namaste, {userName.split(" ")[0]}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-200/80">
              Your scholarships, deadlines and applications — all organised in one place.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* stats */}
        <div className="-mt-14 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((st, i) => (
            <motion.button
              key={st.label}
              onClick={st.onClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-xl shadow-blue-950/5 transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${st.tint} text-white shadow-lg transition-transform group-hover:scale-105`}
              >
                <st.icon className="h-5.5 w-5.5" />
              </span>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-blue-950">{st.value}</p>
              <p className="mt-0.5 text-[11.5px] font-bold tracking-wider text-slate-500 uppercase">
                {st.label}
              </p>
            </motion.button>
          ))}
        </div>

        {/* tabs */}
        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white p-1.5 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                router.replace(`/dashboard?tab=${t.id}`, { scroll: false });
              }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold whitespace-nowrap transition",
                tab === t.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-500 hover:bg-slate-50 hover:text-blue-700",
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 pb-20">
          {/* ------------------------------ OVERVIEW ------------------------------ */}
          {tab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-base font-extrabold tracking-tight text-blue-950">
                    <Sparkles className="h-5 w-5 text-blue-600" /> Application progress
                  </h2>
                  <span className="text-2xl font-extrabold text-blue-700">{progress}%</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"
                    animate={{ width: `${Math.max(progress, apps && apps.length ? 6 : 0)}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 22 }}
                  />
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-slate-500">
                  Averages the stage of each tracked application — from planning to selection.
                </p>
                {(apps?.length ?? 0) === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-5 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      You haven't tracked any applications yet.
                    </p>
                    <Link
                      href="/explore"
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
                    >
                      <Compass className="h-4 w-4" /> Find scholarships
                    </Link>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-2.5">
                    {apps?.slice(0, 4).map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3"
                      >
                        <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-blue-950">
                          {a.scholarship.name}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold",
                            STATUS_META[a.status]?.chip,
                          )}
                        >
                          {STATUS_META[a.status]?.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-base font-extrabold tracking-tight text-blue-950">
                    <CalendarClock className="h-5 w-5 text-rose-500" /> Upcoming deadlines
                  </h2>
                  <button
                    onClick={() => setTab("profile")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Profile {completeness}% complete
                  </button>
                </div>
                {upcoming.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      Save or track scholarships to watch their deadlines here.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-2.5">
                    {upcoming.map((s) => {
                      const open = s.window.status === "open";
                      const urgent = open && s.window.daysToEnd <= 21;
                      return (
                        <li key={s.slug}>
                          <Link
                            href={`/scholarships/${s.slug}`}
                            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50"
                          >
                            <span
                              className={cn(
                                "flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl text-white",
                                urgent ? "bg-gradient-to-br from-rose-500 to-red-600" : "bg-gradient-to-br from-blue-500 to-indigo-600",
                              )}
                            >
                              <span className="text-sm leading-none font-extrabold">
                                {open ? s.window.daysToEnd : s.window.daysToStart}
                              </span>
                              <span className="text-[8px] font-bold uppercase">
                                {open ? "left" : "opens"}
                              </span>
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-bold text-blue-950">
                                {s.name}
                              </span>
                              <span className="block text-[11px] font-medium text-slate-500">
                                {open ? `Ends ${s.window.endLabel}` : `Opens ${s.window.startLabel}`} ·
                                tentative
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-5 flex items-start gap-2 rounded-2xl bg-blue-50/70 p-3.5 text-[11.5px] leading-relaxed text-blue-800">
                  <BellRing className="mt-0.5 h-4 w-4 shrink-0" />
                  Deadlines use each scheme's typical window. We'll always show the nearest upcoming
                  cycle — confirm exact dates on the official portal.
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------- SAVED -------------------------------- */}
          {tab === "saved" && (
            <div>
              {saved == null ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
                  ))}
                </div>
              ) : saved.length === 0 ? (
                <EmptyState
                  title="Nothing saved yet"
                  text="Tap the bookmark icon on any scholarship to keep it here."
                  cta="Explore scholarships"
                />
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {saved.map((r) => {
                    const s = r.scholarship;
                    const tracked = trackedIds.has(s.id);
                    return (
                      <div
                        key={s.slug}
                        className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10.5px] font-extrabold text-blue-700">
                            {s.window.daysLabel}
                          </span>
                          <button
                            onClick={async () => {
                              await toggleSaved({ id: s.id, slug: s.slug, name: s.name });
                              loadAll();
                            }}
                            aria-label="Remove from saved"
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <Link href={`/scholarships/${s.slug}`} className="mt-3 block">
                          <h3 className="text-[15.5px] leading-snug font-extrabold text-blue-950 hover:text-blue-700">
                            {s.name}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-500">
                            {s.provider}
                          </p>
                        </Link>
                        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-blue-50/70 px-3.5 py-2.5">
                          <Wallet className="h-4 w-4 shrink-0 text-blue-500" />
                          <p className="text-[12px] leading-snug font-bold text-blue-950">
                            {s.amountText}
                          </p>
                        </div>
                        <div className="mt-auto flex gap-2 pt-5">
                          <a
                            href={s.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-center text-[12.5px] font-bold text-white transition hover:bg-blue-700"
                          >
                            Apply Now
                          </a>
                          {tracked ? (
                            <span className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-[12.5px] font-bold text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" /> Tracked
                            </span>
                          ) : (
                            <button
                              onClick={() => startTracking(s.id)}
                              className="flex-1 rounded-xl border border-blue-200 px-3 py-2.5 text-[12.5px] font-bold text-blue-700 transition hover:bg-blue-50"
                            >
                              Mark as Applying
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ---------------------------- APPLICATIONS ---------------------------- */}
          {tab === "applications" && (
            <div>
              {apps == null ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white" />
                  ))}
                </div>
              ) : apps.length === 0 ? (
                <EmptyState
                  title="No applications tracked"
                  text="Open a scholarship and press “Apply Now”, or mark a saved scholarship as applying."
                  cta="Find a scholarship to apply for"
                />
              ) : (
                <div className="space-y-4">
                  {apps.map((a) => {
                    const s = a.scholarship;
                    return (
                      <div
                        key={a.id}
                        className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/scholarships/${s.slug}`}
                              className="text-[15.5px] font-extrabold text-blue-950 hover:text-blue-700"
                            >
                              {s.name}
                            </Link>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">
                              {s.portal} · {s.window.daysLabel} · tentative
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <select
                              value={a.status}
                              onChange={(e) => updateApp(a.id, { status: e.target.value })}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-bold text-slate-700 outline-none focus:border-blue-500"
                              aria-label="Application status"
                            >
                              {Object.entries(STATUS_META).map(([k, v]) => (
                                <option key={k} value={k}>
                                  {v.label}
                                </option>
                              ))}
                            </select>
                            <a
                              href={s.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-blue-600 px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-blue-700"
                            >
                              Open portal
                            </a>
                            <button
                              onClick={() => removeApp(a.id)}
                              aria-label="Remove from tracker"
                              className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                              style={{ width: `${STATUS_META[a.status]?.step ?? 10}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="sr-only" htmlFor={`notes-${a.id}`}>
                            Notes
                          </label>
                          <div className="flex gap-2">
                            <input
                              id={`notes-${a.id}`}
                              defaultValue={a.notes ?? ""}
                              placeholder="Add a note — application ID, portal login, next step…"
                              className="field-input flex-1"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  updateApp(a.id, { notes: (e.target as HTMLInputElement).value });
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = (
                                  e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement
                                );
                                updateApp(a.id, { notes: input?.value ?? "" });
                              }}
                              className="shrink-0 rounded-xl border border-slate-200 px-4 text-[12.5px] font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                              Save note
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------ PROFILE ------------------------------- */}
          {tab === "profile" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <form
                onSubmit={saveProfile}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-blue-950">
                  <UserRound className="h-5 w-5 text-blue-600" /> Student Profile
                </h2>
                <p className="mt-1 text-[13px] text-slate-500">
                  Completing your profile pre-fills the eligibility checker and improves matches.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="pf-name" className="field-label">
                      Full name
                    </label>
                    <input
                      id="pf-name"
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      className="field-input"
                      required
                      minLength={2}
                    />
                  </div>
                  <div>
                    <label htmlFor="pf-state" className="field-label">
                      State of domicile
                    </label>
                    <select
                      id="pf-state"
                      value={profile.state}
                      onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
                      className="field-input"
                    >
                      <option value="">Select state…</option>
                      {STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pf-level" className="field-label">
                      Education level
                    </label>
                    <select
                      id="pf-level"
                      value={profile.educationLevel}
                      onChange={(e) => setProfile((p) => ({ ...p, educationLevel: e.target.value }))}
                      className="field-input"
                    >
                      <option value="">Select level…</option>
                      {LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pf-course" className="field-label">
                      Current course
                    </label>
                    <input
                      id="pf-course"
                      value={profile.course}
                      onChange={(e) => setProfile((p) => ({ ...p, course: e.target.value }))}
                      placeholder="e.g. B.Tech CSE, BSc Physics"
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="pf-category" className="field-label">
                      Category
                    </label>
                    <select
                      id="pf-category"
                      value={profile.category}
                      onChange={(e) => setProfile((p) => ({ ...p, category: e.target.value }))}
                      className="field-input"
                    >
                      <option value="">Select category…</option>
                      {GROUPS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pf-gender" className="field-label">
                      Gender
                    </label>
                    <select
                      id="pf-gender"
                      value={profile.gender}
                      onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
                      className="field-input"
                    >
                      <option value="">Select…</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pf-pct" className="field-label">
                      Last exam percentage
                    </label>
                    <input
                      id="pf-pct"
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={profile.percentage}
                      onChange={(e) => setProfile((p) => ({ ...p, percentage: e.target.value }))}
                      placeholder="e.g. 86"
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="pf-income" className="field-label">
                      Annual family income
                    </label>
                    <select
                      id="pf-income"
                      value={profile.familyIncome}
                      onChange={(e) => setProfile((p) => ({ ...p, familyIncome: e.target.value }))}
                      className="field-input"
                    >
                      <option value="">Select range…</option>
                      {INCOME_PRESETS.map((i) => (
                        <option key={i.value} value={i.value}>
                          {i.label}
                        </option>
                      ))}
                    </select>
                    {profile.familyIncome && (
                      <p className="mt-1 text-[11px] font-semibold text-slate-400">
                        ≈ {formatINR(Number(profile.familyIncome))} per year
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4.5 w-4.5" /> Save profile
                    </>
                  )}
                </button>
              </form>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Profile completeness
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-blue-950">{completeness}%</p>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      animate={{ width: `${completeness}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
                    {completeness >= 80
                      ? "Great — your eligibility results will be precise."
                      : "Add your state, level, marks and income for accurate eligibility matches."}
                  </p>
                </div>
                {user?.educationLevel && (
                  <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                    <p className="text-xs font-bold tracking-widest text-blue-500 uppercase">
                      Currently studying
                    </p>
                    <p className="mt-2 text-lg font-extrabold text-blue-950">
                      {levelLabel(user.educationLevel)}
                    </p>
                    {user.course && (
                      <p className="mt-0.5 text-sm font-semibold text-slate-600">{user.course}</p>
                    )}
                    {user.state && (
                      <p className="mt-1 text-xs font-medium text-slate-500">{user.state}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, text, cta }: { title: string; text: string; cta: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-500">
        <BookmarkCheck className="h-8 w-8" />
      </span>
      <h3 className="mt-5 text-lg font-extrabold text-blue-950">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{text}</p>
      <Link
        href="/explore"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
      >
        <Compass className="h-4 w-4" /> {cta}
      </Link>
    </div>
  );
}
