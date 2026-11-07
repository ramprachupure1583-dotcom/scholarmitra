"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  BadgeIndianRupee,
  Bookmark,
  CalendarClock,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScholarships } from "@/components/useScholarships";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { data } = useScholarships();
  const total = data?.length ?? 28;
  const openNow = data?.filter((s) => s.window.status === "open").length ?? 12;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pattern-grid absolute inset-0 [mask-image:radial-gradient(75%_70%_at_50%_20%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/60 via-indigo-100/50 to-sky-100/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-28 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pt-24 lg:pb-36 lg:px-8">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% free · verified schemes · official links only
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-blue-950 sm:text-5xl lg:text-[3.4rem]"
          >
            Find the <span className="text-gradient">Right Scholarship</span> for Your Future.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mt-4 text-lg font-semibold text-blue-600 italic"
          >
            &ldquo;Your dream deserve support.&rdquo;
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease }}
            className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-slate-600"
          >
            Discover Central and State Government scholarships, check your eligibility in seconds,
            track deadlines and prepare your documents — then apply directly on official government
            portals. ScholarMitra never charges a rupee.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <Link
              href="/explore"
              className="animate-pulse-ring group inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-700"
            >
              Explore Scholarships
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-7 py-3.5 text-[15px] font-bold text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
            >
              <Wand2 className="h-4.5 w-4.5" />
              Check My Eligibility
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-10 grid max-w-md grid-cols-3 divide-x divide-blue-100 rounded-2xl border border-blue-100 bg-white/70 py-4 shadow-sm backdrop-blur"
          >
            {[
              { value: total, suffix: "+", label: "Verified schemes" },
              { value: 29, suffix: "", label: "States & regions" },
              { value: openNow, suffix: "", label: "Windows open" },
            ].map((s) => (
              <div key={s.label} className="px-4 text-center">
                <p className="text-2xl font-extrabold text-blue-950">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative mx-auto w-full max-w-[560px]"
        >
          <div className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-blue-100 via-indigo-50 to-sky-100" />
          <div className="pattern-dots absolute -top-6 -right-4 h-40 w-40 opacity-70" />
          <Image
            src="/images/hero-students.png"
            alt="Indian students celebrating scholarship opportunities"
            width={1120}
            height={800}
            priority
            className="relative z-10 h-auto w-full drop-shadow-2xl"
          />

          {/* floating cards */}
          <div className="animate-float-slow absolute top-[6%] -left-3 z-20 hidden rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-xl shadow-blue-950/10 backdrop-blur sm:block">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Bookmark className="h-4.5 w-4.5 fill-current" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-blue-950">Scholarship saved</p>
                <p className="text-[10px] font-semibold text-slate-500">Synced to your dashboard</p>
              </div>
            </div>
          </div>

          <div className="animate-float-slower absolute top-[42%] -right-2 z-20 hidden rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-xl shadow-blue-950/10 backdrop-blur sm:block">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <CalendarClock className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-blue-950">18 days left</p>
                <p className="text-[10px] font-semibold text-slate-500">NSP window — tentative</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 left-[8%] z-20 hidden rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-xl shadow-blue-950/10 backdrop-blur sm:block">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <BadgeIndianRupee className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-blue-950">92% eligibility match</p>
                <p className="text-[10px] font-semibold text-slate-500">Central Sector Scheme</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute top-6 right-10 z-20 text-blue-300"
          >
            <Sparkles className="h-6 w-6 animate-pulse" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
