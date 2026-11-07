"use client";

import { motion } from "framer-motion";
import { Bookmark, Compass, Send, Wand2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const STEPS = [
  {
    icon: Compass,
    title: "Discover",
    text: "Search verified Central & State schemes with smart filters for state, level, income and marks.",
  },
  {
    icon: Wand2,
    title: "Match",
    text: "Run the eligibility checker to see ranked matches with clear reasons and cautions.",
  },
  {
    icon: Bookmark,
    title: "Track",
    text: "Save scholarships, ready your documents and watch live deadline countdowns on your dashboard.",
  },
  {
    icon: Send,
    title: "Apply",
    text: "Submit on the official government portal — always free. Track the status back on ScholarMitra.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-label="How it works">
      <SectionHeading
        kicker="Simple by design"
        title={
          <>
            From confused to <span className="text-gradient">application-ready</span>
          </>
        }
        description="Four steps between you and the right scholarship."
      />
      <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute top-10 right-[12%] left-[12%] hidden border-t-2 border-dashed border-blue-200 lg:block" />
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm"
          >
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 rounded-3xl bg-blue-50 ring-1 ring-blue-100" />
              <s.icon className="relative h-7 w-7 text-blue-600" strokeWidth={1.9} />
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-extrabold text-white shadow-md shadow-blue-600/30">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-[15px] font-extrabold tracking-tight text-blue-950">
              {s.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
