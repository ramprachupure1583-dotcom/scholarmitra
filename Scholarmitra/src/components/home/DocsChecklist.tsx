"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, FileCheck2, RotateCcw, ShieldQuestion } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { DOCUMENT_CHECKLIST } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sm_docs";

export default function DocsChecklist() {
  const [checked, setChecked] = useState<boolean[]>(() => DOCUMENT_CHECKLIST.map(() => false));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as boolean[];
        setChecked(DOCUMENT_CHECKLIST.map((_, i) => Boolean(arr[i])));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const reset = () => {
    setChecked(DOCUMENT_CHECKLIST.map(() => false));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / DOCUMENT_CHECKLIST.length) * 100);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-label="Document checklist">
      <div className="grid items-start gap-10 lg:grid-cols-5">
        <div className="lg:sticky lg:top-24 lg:col-span-2">
          <SectionHeading
            align="left"
            kicker="Be application-ready"
            title="Your document checklist"
            description="Most scholarship portals ask for the same core documents. Collect them once, tick them off here, and you'll fly through every application."
          />
          <div className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-extrabold text-blue-950">
                  {done}
                  <span className="text-lg text-slate-400">/{DOCUMENT_CHECKLIST.length}</span>
                </p>
                <p className="mt-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  documents ready
                </p>
              </div>
              <p className="text-2xl font-extrabold text-blue-600">{pct}%</p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <ShieldQuestion className="h-3.5 w-3.5" />
              {hydrated ? "Progress is saved on this device." : "Keeping your progress…"}
            </p>
            {done === DOCUMENT_CHECKLIST.length && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"
              >
                All set! You're ready to apply the moment a window opens.
              </motion.p>
            )}
            <button
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-blue-600"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset checklist
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ul className="space-y-3">
            {DOCUMENT_CHECKLIST.map((doc, i) => {
              const isDone = checked[i];
              return (
                <motion.li
                  key={doc.name}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => toggle(i)}
                    aria-pressed={isDone}
                    className={cn(
                      "group flex w-full items-start gap-4 rounded-2xl border p-4.5 text-left transition-all duration-200",
                      isDone
                        ? "border-blue-200 bg-blue-50/70 shadow-inner"
                        : "border-slate-200/80 bg-white shadow-sm hover:border-blue-200 hover:shadow-md",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all",
                        isDone
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white group-hover:border-blue-400",
                      )}
                    >
                      {isDone && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
                    </span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "text-[15px] font-extrabold tracking-tight",
                            isDone ? "text-blue-800" : "text-blue-950",
                          )}
                        >
                          {doc.name}
                        </span>
                        {doc.note && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-500 uppercase">
                            {doc.note}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">
                        {doc.hint}
                      </span>
                    </span>
                    <FileCheck2
                      className={cn(
                        "mt-1 h-5 w-5 shrink-0 transition",
                        isDone ? "text-blue-500" : "text-slate-200 group-hover:text-blue-300",
                      )}
                    />
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
