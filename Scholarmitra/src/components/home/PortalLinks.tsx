"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Landmark, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { OFFICIAL_PORTALS } from "@/lib/constants";

export default function PortalLinks() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-label="Official portals">
      <SectionHeading
        kicker="Official links only"
        title={
          <>
            Apply on <span className="text-gradient">authentic government portals</span>
          </>
        }
        description="ScholarMitra never hosts application forms. Every listing routes you to the official government or trust portal where the entire process is free."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {OFFICIAL_PORTALS.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/10"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Landmark className="h-4.5 w-4.5" />
              </span>
              {p.state && (
                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                  {p.state}
                </span>
              )}
            </div>
            <h3 className="mt-4 text-[14.5px] font-extrabold tracking-tight text-blue-950 group-hover:text-blue-700">
              {p.name}
            </h3>
            <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-slate-500">
              {p.description}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
              Visit official portal
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </p>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-8 flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-5"
      >
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-[13px] leading-relaxed text-emerald-900">
          <strong>Safety rule:</strong> real government scholarships never charge fees and never
          guarantee selection. If anyone asks for money to secure a scholarship, walk away and apply
          directly on the official portal.
        </p>
      </motion.div>
    </section>
  );
}
