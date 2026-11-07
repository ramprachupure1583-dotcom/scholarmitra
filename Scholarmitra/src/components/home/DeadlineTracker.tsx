"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CalendarClock,
  CalendarPlus,
  Flame,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useScholarships } from "@/components/useScholarships";
import type { ScholarshipDTO } from "@/lib/types";

function TrackerItem({ s, accent }: { s: ScholarshipDTO; accent: string }) {
  return (
    <li>
      <Link
        href={`/scholarships/${s.slug}`}
        className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 transition hover:border-blue-200 hover:shadow-md hover:shadow-blue-600/5"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent} text-white`}
        >
          <CalendarClock className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-bold text-blue-950 group-hover:text-blue-700">
            {s.name}
          </span>
          <span className="block truncate text-[11.5px] font-medium text-slate-500">
            {s.portal} · tentatively ends {s.window.endLabel}
          </span>
        </span>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${
            s.window.status === "open"
              ? s.window.daysToEnd <= 21
                ? "bg-orange-50 text-orange-600"
                : "bg-emerald-50 text-emerald-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {s.window.status === "open" ? `${s.window.daysToEnd}d left` : `in ${s.window.daysToStart}d`}
        </span>
      </Link>
    </li>
  );
}

function TrackerColumn({
  title,
  subtitle,
  icon: Icon,
  accent,
  items,
  empty,
  delay,
}: {
  title: string;
  subtitle: string;
  icon: typeof Flame;
  accent: string;
  items: ScholarshipDTO[];
  empty: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
        >
          <Icon className="h-5.5 w-5.5" />
        </span>
        <div>
          <h3 className="text-[15px] font-extrabold tracking-tight text-blue-950">{title}</h3>
          <p className="text-[11.5px] font-medium text-slate-500">{subtitle}</p>
        </div>
      </div>
      <ul className="mt-5 flex-1 space-y-2.5">
        {items.length === 0 && (
          <li className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs font-medium text-slate-400">
            {empty}
          </li>
        )}
        {items.map((s) => (
          <TrackerItem key={s.slug} s={s} accent={accent.replace("from-", "from-").replace(" to-", " to-").split(" ")[0]} />
        ))}
      </ul>
    </motion.div>
  );
}

export default function DeadlineTracker() {
  const { data, loading } = useScholarships();

  const closingSoon =
    data
      ?.filter((s) => s.window.status === "open" && s.window.daysToEnd <= 45)
      .sort((a, b) => a.window.daysToEnd - b.window.daysToEnd)
      .slice(0, 4) ?? [];
  const openNow =
    data
      ?.filter((s) => s.window.status === "open")
      .sort((a, b) => a.window.daysToEnd - b.window.daysToEnd)
      .slice(0, 4) ?? [];
  const upcoming =
    data
      ?.filter((s) => s.window.status !== "open")
      .sort((a, b) => a.window.daysToStart - b.window.daysToStart)
      .slice(0, 4) ?? [];

  return (
    <section className="relative mt-24 overflow-hidden bg-blue-950 py-20" aria-label="Deadline tracker">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(50rem_26rem_at_15%_0%,rgba(37,99,235,0.3),transparent_60%),radial-gradient(40rem_22rem_at_95%_100%,rgba(14,165,233,0.2),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          kicker="Never miss a date"
          title="Scholarship deadline tracker"
          description="Live countdowns for every scheme's typical application window — closing soon, open now, and what's launching next. Track your own list on the dashboard with reminders."
          action={
            <Link
              href="/eligibility"
              className="hidden items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400 md:inline-flex"
            >
              <BellRing className="h-4 w-4" /> Set my reminders <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        {loading ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-white/10" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <TrackerColumn
              title="Closing Soon"
              subtitle="Apply before these windows shut"
              icon={Flame}
              accent="from-orange-500 to-red-500"
              items={closingSoon}
              empty="No deadlines in the next 45 days — check back soon."
              delay={0}
            />
            <TrackerColumn
              title="Open Right Now"
              subtitle="Portals currently accepting forms"
              icon={CalendarClock}
              accent="from-emerald-500 to-teal-600"
              items={openNow}
              empty="No portals currently in their typical window."
              delay={0.1}
            />
            <TrackerColumn
              title="Coming Up Next"
              subtitle="Recently announced & upcoming cycles"
              icon={CalendarPlus}
              accent="from-sky-500 to-blue-600"
              items={upcoming}
              empty="All tracked schemes are currently open."
              delay={0.2}
            />
          </div>
        )}

        <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-blue-300/80 sm:justify-center">
          <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Windows are typical periods from previous cycles and marked tentative — always confirm exact
          dates on the official scholarship portal before planning.
        </p>
      </div>
    </section>
  );
}
