import type { Metadata } from "next";
import { Suspense } from "react";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Scholarships",
  description:
    "Compare scholarships side by side — amount, eligibility, income limits, education levels, deadlines and benefits.",
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24">Loading…</div>}>
      <CompareClient />
    </Suspense>
  );
}
