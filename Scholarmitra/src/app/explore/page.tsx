import type { Metadata } from "next";
import { Suspense } from "react";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore Scholarships",
  description:
    "Search verified Central & State Government scholarships with smart filters — state, education level, course, category, family income and academic percentage.",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24">Loading…</div>}>
      <ExploreClient />
    </Suspense>
  );
}
