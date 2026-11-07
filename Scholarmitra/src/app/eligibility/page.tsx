import type { Metadata } from "next";
import EligibilityClient from "./EligibilityClient";

export const metadata: Metadata = {
  title: "Eligibility Checker",
  description:
    "Check which Indian scholarships you may be eligible for — instant, indicative matching based on state, education level, income, marks, category and gender.",
};

export default function EligibilityPage() {
  return <EligibilityClient />;
}
