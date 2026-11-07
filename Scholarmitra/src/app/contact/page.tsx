import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import Faq from "@/components/home/Faq";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: "Reach the ScholarMitra support team — questions about scholarships, portals, documents and your account.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pattern-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Contact &amp; Support
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            Facing trouble with a portal link, a listing, or your ScholarMitra account? Send us a
            message — we usually reply within 2 working days.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <ContactForm />
      </div>
      <Faq />
    </div>
  );
}
