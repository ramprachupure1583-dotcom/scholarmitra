import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import SmartSearch from "@/components/home/SmartSearch";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import HowItWorks from "@/components/home/HowItWorks";
import DeadlineTracker from "@/components/home/DeadlineTracker";
import EligibilityCTA from "@/components/home/EligibilityCTA";
import DocsChecklist from "@/components/home/DocsChecklist";
import Faq from "@/components/home/Faq";
import PortalLinks from "@/components/home/PortalLinks";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "ScholarMitra — AI Scholarship Portal for Indian Students",
  description:
    "Discover verified Central & State Government scholarships, check your eligibility instantly, compare schemes, track deadlines and apply on official portals. 100% free — your dream deserve support.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SmartSearch />
      <Categories />
      <Featured />
      <HowItWorks />
      <DeadlineTracker />
      <EligibilityCTA />
      <DocsChecklist />
      <PortalLinks />
      <Faq limit={6} />
      <FinalCTA />
    </>
  );
}
