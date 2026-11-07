import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  FileText,
  GraduationCap,
  IndianRupee,
  Info,
  Layers,
  ListChecks,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { db } from "@/db";
import { scholarships as scholarshipsTable } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { computeWindow, daysLeftLabel, formatDate } from "@/lib/deadlines";
import { formatINR, kindLabel, levelLabel } from "@/lib/utils";
import DetailActions from "./DetailActions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await ensureSeeded();
    const { slug } = await params;
    const rows = await db
      .select({ name: scholarshipsTable.name, provider: scholarshipsTable.provider })
      .from(scholarshipsTable)
      .where(eq(scholarshipsTable.slug, slug))
      .limit(1);
    if (!rows[0]) return { title: "Scholarship not found" };
    return {
      title: rows[0].name,
      description: `${rows[0].name} — ${rows[0].provider}. Eligibility, amount, documents and official application link on ScholarMitra.`,
    };
  } catch {
    return { title: "Scholarship" };
  }
}

const AUTHORITY_LABEL: Record<string, string> = {
  central: "Central Government",
  state: "State Government",
  private: "Private / CSR",
};

export default async function ScholarshipDetailPage({ params }: Props) {
  await ensureSeeded();
  const { slug } = await params;
  const rows = await db
    .select()
    .from(scholarshipsTable)
    .where(eq(scholarshipsTable.slug, slug))
    .limit(1);
  const s = rows[0];
  if (!s) notFound();

  const win = computeWindow(s.winStartMonth, s.winStartDay, s.winEndMonth, s.winEndDay);
  const isOpen = win.status === "open";
  const related = await db.select().from(scholarshipsTable);
  const similar = related
    .filter(
      (r) =>
        r.slug !== s.slug &&
        (r.kind === s.kind || r.levels.some((l) => s.levels.includes(l))) &&
        (s.authority !== "state" || r.state === s.state || r.authority !== "state"),
    )
    .slice(0, 3);

  const meta = [
    { icon: Wallet, label: "Scholarship Amount", value: s.amountText },
    {
      icon: IndianRupee,
      label: "Family Income Limit",
      value: s.maxFamilyIncome ? `${formatINR(s.maxFamilyIncome)} / year` : "No income bar",
    },
    {
      icon: Sparkles,
      label: "Minimum Marks",
      value: s.minPercentage ? `${s.minPercentage}% in qualifying exam` : "No fixed cutoff",
    },
    { icon: GraduationCap, label: "Education Levels", value: s.levels.map(levelLabel).join(" · ") },
    {
      icon: Users,
      label: "Who can apply",
      value:
        (s.gender === "female" ? "Girl students · " : "All genders · ") +
        (s.groups.includes("all")
          ? "open to all categories"
          : s.groups.includes("ner")
            ? "North-Eastern Region domicile"
            : `${s.groups.map((g) => g.toUpperCase()).join(", ")} categories`),
    },
    {
      icon: BadgeCheck,
      label: "Provider Type",
      value: `${AUTHORITY_LABEL[s.authority]}${s.state ? ` — ${s.state}` : ""}`,
    },
  ];

  return (
    <div className="bg-[#f8fafc]">
      {/* header */}
      <div className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-indigo-50/60">
        <div className="pattern-dots absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 transition hover:text-blue-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all scholarships
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-600 px-3.5 py-1.5 text-[11px] font-bold text-white">
              {kindLabel(s.kind)}
            </span>
            <span className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-blue-800 ring-1 ring-blue-100">
              {AUTHORITY_LABEL[s.authority]}
            </span>
            {s.state && (
              <span className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-100">
                {s.state}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold ring-1 ${
                isOpen
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-slate-100 text-slate-600 ring-slate-200"
              }`}
            >
              <CalendarClock className="h-3.5 w-3.5" />
              {win.statusLabel} — {daysLeftLabel(win)}
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-balance text-blue-950 sm:text-4xl">
            {s.name}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] font-medium text-slate-600">{s.provider}</p>

          <div className="mt-7">
            <DetailActions
              id={s.id}
              slug={s.slug}
              name={s.name}
              applyUrl={s.applyUrl}
              portal={s.portal}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          {/* main column */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {meta.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-sm"
                >
                  <p className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase">
                    <m.icon className="h-3.5 w-3.5 text-blue-500" /> {m.label}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-snug font-bold text-blue-950">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-blue-950">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ListChecks className="h-5 w-5" />
                </span>
                Eligibility Criteria
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">{s.eligibility}</p>
            </section>

            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-blue-950">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Wallet className="h-5 w-5" />
                </span>
                Scholarship Benefits
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">{s.benefits}</p>
            </section>

            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-blue-950">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <FileText className="h-5 w-5" />
                </span>
                Required Documents
              </h2>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {s.documents.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 text-[13px] font-semibold text-slate-700"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                The official notification may ask for additional documents. Always prepare the items
                on the scheme's official checklist.
              </p>
            </section>
          </div>

          {/* sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div
                className={`p-6 ${
                  isOpen
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                    : "bg-gradient-to-br from-blue-600 to-indigo-700"
                } text-white`}
              >
                <p className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-90">
                  <CalendarClock className="h-4 w-4" /> Application window
                </p>
                <p className="mt-3 text-2xl font-extrabold">{daysLeftLabel(win)}</p>
                <p className="mt-1 text-sm opacity-90">
                  {isOpen ? (
                    <>
                      Tentative window: {formatDate(win.nextStart)} → {formatDate(win.nextEnd)}
                    </>
                  ) : (
                    <>Typically opens around {formatDate(win.nextStart)}</>
                  )}
                </p>
                {isOpen && (
                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-white/25">
                      <div
                        className="h-full rounded-full bg-white/90 transition-all"
                        style={{ width: `${Math.round(win.progress * 100)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] font-semibold opacity-80">
                      {Math.round(win.progress * 100)}% of the window elapsed
                    </p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-xs leading-relaxed font-medium text-slate-500">
                  {s.deadlineText}. ScholarMitra never invents dates — this window reflects the
                  scheme's typical cycle. Confirm the exact deadline on the official notification.
                </p>
                <a
                  href={s.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                >
                  Apply Now — {s.portal}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
                  Free to apply · official portal only
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-wide text-blue-950 uppercase">
                <Layers className="h-4 w-4 text-blue-600" /> Similar schemes
              </h3>
              <ul className="mt-4 space-y-3">
                {similar.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/scholarships/${r.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-bold text-blue-950 group-hover:text-blue-700">
                          {r.name}
                        </span>
                        <span className="block truncate text-[11px] font-medium text-slate-500">
                          {r.amountText}
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
