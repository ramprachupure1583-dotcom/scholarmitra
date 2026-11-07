"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GitCompareArrows, X } from "lucide-react";
import { useCompare } from "./AppProviders";

export default function CompareBar() {
  const { slugs, clear } = useCompare();
  const pathname = usePathname();

  if (pathname === "/compare") return null;

  return (
    <AnimatePresence>
      {slugs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
        >
          <div className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-blue-800/40 bg-blue-950/95 px-4 py-3 text-white shadow-2xl shadow-blue-950/40 backdrop-blur-md">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <GitCompareArrows className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                {slugs.length} scholarship{slugs.length > 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-blue-300">
                {slugs.length >= 2 ? "Ready to compare" : "Select 1–2 more to compare"}
              </p>
            </div>
            <button
              onClick={clear}
              aria-label="Clear comparison"
              className="rounded-lg p-2 text-blue-300 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <Link
              href="/compare"
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                slugs.length >= 2
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "cursor-not-allowed bg-white/10 text-blue-300"
              }`}
              onClick={(e) => {
                if (slugs.length < 2) e.preventDefault();
              }}
            >
              Compare
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
