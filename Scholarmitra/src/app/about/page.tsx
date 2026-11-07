import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Compass,
  HeartHandshake,
  Landmark,
  ListChecks,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import PortalLinks from "@/components/home/PortalLinks";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ScholarMitra is an independent, student-first platform that helps Indian students discover verified government scholarships and apply on official portals.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified information only",
    text: "Every scheme we list is taken from an official notification or portal — NSP, state portals, AICTE, UGC and reputed foundations. Unverified listings never make it in.",
  },
  {
    icon: HeartHandshake,
    title: "Built for Indian students",
    text: "School student or PG scholar, General or SC/ST/OBC/minority, lakhs of schemes exist but hard to find. We flatten that into simple, honest guidance.",
  },
  {
    icon: Compass,
    title: "Guidance, not gatekeeping",
    text: "We never ask for money, never host application forms and never 'process' applications. We point you to the official portal — where applying is always free.",
  },
  {
    icon: ShieldAlert,
    title: "Against scholarship scams",
    text: "We actively warn about fake websites and agents that charge fees or promise guaranteed selection. When in doubt, students should trust only .gov.in and .nic.in portals.",
  },
];

const STEPS = [
  { icon: Compass, label: "Aggregate", text: "We compile scheme rules from official gazette notifications and portal guidelines." },
  { icon: ListChecks, label: "Structure", text: "Level, state, income ceiling, marks bar, category and gender are turned into clean, comparable data." },
  { icon: BadgeCheck, label: "Match", text: "Our eligibility engine ranks schemes against each student's profile with transparent reasons." },
  { icon: TrendingUp, label: "Track", text: "Dashboard reminders keep windows, documents and application statuses under control." },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pattern-grid absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/60 to-indigo-100/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
            <Users className="h-3.5 w-3.5" /> About ScholarMitra
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-balance text-blue-950 sm:text-5xl">
            Because <span className="text-gradient">no dream should pause</span> for lack of money.
          </h1>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-slate-600">
            ScholarMitra began with a simple frustration: India runs hundreds of scholarship schemes
            worth thousands of crores, yet millions of eligible students never apply — because the
            information is scattered across portals, PDFs and notice-board circulars. We bring it
            together, keep it honest, and make it effortless to act on.
          </p>
        </div>
      </div>

      {/* mission + how we work */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-600/20 lg:row-span-2">
            <Landmark className="h-8 w-8" />
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Our mission</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-blue-100">
              Every year, scholarships go unclaimed while students drop out for want of fees. Our
              mission is simple: make discovering and claiming legitimate financial aid as easy as
              ordering a book online — and push every application to the official, free-of-cost
              government channel.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { v: "25+", l: "Verified schemes" },
                { v: "17+", l: "Official portals linked" },
                { v: "₹0", l: "Charged to students" },
                { v: "100%", l: "Official links only" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <p className="text-2xl font-extrabold">{s.v}</p>
                  <p className="mt-1 text-[11px] font-semibold tracking-wide text-blue-200 uppercase">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-extrabold tracking-tight text-blue-950">How we work</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <div key={s.label} className="flex gap-4">
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <s.icon className="h-5 w-5" />
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white">
                      {i + 1}
                    </span>
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-blue-950">{s.label}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* values */}
        <h2 className="mt-16 text-2xl font-extrabold tracking-tight text-blue-950">
          What we stand for
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <v.icon className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 text-[15px] font-extrabold text-blue-950">{v.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{v.text}</p>
            </div>
          ))}
        </div>

        {/* honesty box */}
        <div className="mt-12 rounded-3xl border border-amber-200/80 bg-amber-50/80 p-7">
          <h3 className="flex items-center gap-2.5 text-base font-extrabold text-amber-900">
            <ShieldAlert className="h-5 w-5 text-amber-600" /> Our honesty promise
          </h3>
          <ul className="mt-4 grid gap-3 text-[13.5px] leading-relaxed font-medium text-amber-900/90 sm:grid-cols-2">
            <li>• ScholarMitra is independent — not a Government of India or state website.</li>
            <li>• We never invent scholarship amounts or fake deadlines.</li>
            <li>• Application windows are shown as tentative typical cycles, with links to the official source.</li>
            <li>• We never charge fees, never sell student data, never guarantee selection.</li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/eligibility"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-700"
          >
            Try the Eligibility Checker
          </Link>
        </div>
      </div>

      <PortalLinks />
    </div>
  );
}
