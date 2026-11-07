"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScholarshipCard from "@/components/ScholarshipCard";
import SectionHeading from "@/components/SectionHeading";
import { useScholarships } from "@/components/useScholarships";

export default function Featured() {
  const { data, loading } = useScholarships();
  const featured = data?.filter((s) => s.featured).slice(0, 6) ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-label="Featured scholarships">
      <SectionHeading
        kicker="Handpicked & verified"
        title={
          <>
            Featured scholarships <span className="text-gradient">worth your attention</span>
          </>
        }
        description="High-value national and state schemes with published guidelines — shortlist them, compare them, and apply on the official portal."
        action={
          <Link
            href="/explore"
            className="hidden items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 md:inline-flex"
          >
            View all scholarships <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white"
            />
          ))}
        {featured.map((s, i) => (
          <ScholarshipCard key={s.slug} scholarship={s} index={i} />
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25"
        >
          View all scholarships <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
