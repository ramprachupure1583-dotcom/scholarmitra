import type { Metadata } from "next";
import Categories from "@/components/home/Categories";

export const metadata: Metadata = {
  title: "Scholarship Categories",
  description:
    "Browse Indian scholarships by category — school, undergraduate, postgraduate, merit-based, need-based, state and central government schemes.",
};

export default function CategoriesPage() {
  return (
    <div className="bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pattern-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Scholarship Categories
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            Seven curated paths into India's scholarship ecosystem. Pick the one that matches your
            stage of education, community, and need — each card leads to a pre-filtered directory.
          </p>
        </div>
      </div>
      <div className="pb-4">
        <Categories />
      </div>
    </div>
  );
}
