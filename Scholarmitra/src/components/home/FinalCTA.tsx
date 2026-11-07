"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useAuth } from "@/components/AppProviders";

export default function FinalCTA() {
  const { user } = useAuth();
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-16 text-center sm:px-12"
      >
        <div className="pattern-dots absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/30">
            <GraduationCap className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-balance text-blue-950 sm:text-4xl">
            Your dream deserve support. Start today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600">
            Create a free ScholarMitra account to save scholarships, set deadline reminders, track
            your applications and keep your documents checklist in one safe place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-700"
            >
              {user ? "Open My Dashboard" : "Register Free"}
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="/explore"
              className="rounded-full border border-blue-200 bg-white px-8 py-3.5 text-[15px] font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
            >
              Browse Without an Account
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
