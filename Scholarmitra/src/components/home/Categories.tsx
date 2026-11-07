"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  BookOpenCheck,
  Flag,
  GraduationCap,
  HeartHandshake,
  Landmark,
  LibraryBig,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useScholarships } from "@/components/useScholarships";

const CATEGORIES = [
  {
    name: "School Scholarships",
    description: "Class 9–12 support incl. NMMS and state school schemes.",
    href: "/explore?school=true",
    icon: BookOpenCheck,
    gradient: "from-sky-500 to-blue-600",
    count: (list: { schoolLevel: boolean }[]) => list.filter((s) => s.schoolLevel).length,
  },
  {
    name: "Undergraduate Scholarships",
    description: "For first degrees — arts, science, engineering, medicine and more.",
    href: "/explore?level=ug",
    icon: GraduationCap,
    gradient: "from-blue-500 to-indigo-600",
    count: (list: { levels: string[] }[]) => list.filter((s) => s.levels.includes("ug")).length,
  },
  {
    name: "Postgraduate Scholarships",
    description: "PG, rank-holder and doctoral fellowships.",
    href: "/explore?level=pg",
    icon: LibraryBig,
    gradient: "from-indigo-500 to-violet-600",
    count: (list: { levels: string[] }[]) =>
      list.filter((s) => s.levels.includes("pg") || s.levels.includes("phd")).length,
  },
  {
    name: "Merit-Based Scholarships",
    description: "Rewarding top marks, ranks and board percentiles.",
    href: "/explore?kind=merit",
    icon: Award,
    gradient: "from-violet-500 to-purple-600",
    count: (list: { kind: string }[]) => list.filter((s) => s.kind === "merit").length,
  },
  {
    name: "Need-Based Scholarships",
    description: "Family-income linked support so money is never the barrier.",
    href: "/explore?kind=need",
    icon: HeartHandshake,
    gradient: "from-emerald-500 to-teal-600",
    count: (list: { kind: string }[]) => list.filter((s) => s.kind === "need").length,
  },
  {
    name: "State Government Schemes",
    description: "Portals of UP, Maharashtra, West Bengal, Karnataka & more.",
    href: "/explore?authority=state",
    icon: Landmark,
    gradient: "from-blue-600 to-indigo-700",
    count: (list: { authority: string }[]) => list.filter((s) => s.authority === "state").length,
  },
  {
    name: "Central Government Schemes",
    description: "NSP, UGC, AICTE and ministry-backed national schemes.",
    href: "/explore?authority=central",
    icon: Flag,
    gradient: "from-sky-600 to-blue-700",
    count: (list: { authority: string }[]) => list.filter((s) => s.authority === "central").length,
  },
] as const;

export default function Categories() {
  const { data } = useScholarships();

  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-label="Categories">
      <SectionHeading
        kicker="Browse by category"
        title={
          <>
            Every kind of support, <span className="text-gradient">one home</span>
          </>
        }
        description="From Class 9 to PhD, from merit rewards to income-linked aid — jump straight into the category that fits your journey."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={i === CATEGORIES.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}
          >
            <Link
              href={c.href}
              className="group relative flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/10"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
              >
                <c.icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-5 pr-6 text-[17px] font-extrabold tracking-tight text-blue-950">
                {c.name}
              </h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-500">
                {c.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {data ? c.count(data as never[]) : "…"} schemes
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
