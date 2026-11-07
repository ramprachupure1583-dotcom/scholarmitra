"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { FAQS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Faq({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = limit ? FAQS.slice(0, limit) : FAQS;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-label="FAQs">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeading
            align="left"
            kicker="Got questions?"
            title="Frequently asked questions"
            description="Straight answers about applying, eligibility rules, documents and official portals — no jargon, no myths."
          />
          <div className="mt-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <p className="text-sm font-extrabold text-blue-950">Still unsure about something?</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
              Our support team replies within 2 working days.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Ask a question <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ul className="space-y-3.5">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <motion.li
                  key={f.q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-white transition-colors",
                    isOpen ? "border-blue-200 shadow-md shadow-blue-600/5" : "border-slate-200/80",
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left sm:px-6"
                  >
                    <span className="text-[15px] font-extrabold tracking-tight text-blue-950">
                      {f.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                        isOpen
                          ? "rotate-180 bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 sm:px-6">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
