"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Wand2 } from "lucide-react";

const POINTS = [
  "Tell us your state, level, marks & income",
  "See instant matches from 25+ verified schemes",
  "Get reasons & cautions for every match",
  "Save the best ones to your dashboard",
];

export default function EligibilityCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-8 sm:p-12 lg:p-16"
      >
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(40rem_20rem_at_90%_-10%,rgba(96,165,250,0.35),transparent_60%)]" />
        <div className="pattern-dots absolute inset-0 opacity-[0.07]" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-200 uppercase ring-1 ring-white/20">
              <Wand2 className="h-3.5 w-3.5" /> AI-assisted matching
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl">
              Not sure which scholarships fit you? Check in 30 seconds.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-blue-200/85">
              Our eligibility checker compares your profile against every scheme&rsquo;s published
              criteria — income limits, percentage bars, category and domicile rules — and ranks your
              best options.
            </p>
            <ul className="mt-6 space-y-3">
              {POINTS.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm font-semibold text-blue-100"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  {p}
                </motion.li>
              ))}
            </ul>
            <Link
              href="/eligibility"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-blue-800 shadow-xl transition hover:bg-blue-50"
            >
              Check My Eligibility
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <p className="mt-4 text-[11.5px] text-blue-300/70">
              Indicative only — final eligibility depends on official scheme guidelines.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="rounded-[2rem] bg-white/95 p-3 shadow-2xl">
              <Image
                src="/images/eligibility-check.png"
                alt="Student checking scholarship eligibility"
                width={800}
                height={660}
                className="h-auto w-full rounded-3xl"
              />
            </div>
            <div className="animate-float-slow absolute -top-4 -right-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Match strength
              </p>
              <p className="text-lg font-extrabold text-emerald-600">Strong · 92%</p>
            </div>
            <div className="animate-float-slower absolute -bottom-4 -left-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Schemes matched
              </p>
              <p className="text-lg font-extrabold text-blue-700">14 scholarships</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
