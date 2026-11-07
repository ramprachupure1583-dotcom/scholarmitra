import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms governing the use of ScholarMitra.",
};

const SECTIONS = [
  {
    title: "1. What ScholarMitra is",
    body: "ScholarMitra is an independent scholarship discovery and information platform. It aggregates publicly notified scholarship schemes, provides indicative eligibility matching, and links to official application portals. It is not a government website, is not affiliated with any government body, and does not itself award scholarships.",
  },
  {
    title: "2. Accuracy & tentative dates",
    body: "We work hard to keep listings accurate and grounded in official notifications. Application windows displayed are typical cycles from previous years and are always labelled tentative. Scheme rules, amounts and dates can change at the provider's discretion; the official scheme notification always prevails over anything shown on ScholarMitra.",
  },
  {
    title: "3. No fees, ever",
    body: "ScholarMitra is free for students and will never ask for payment, 'processing fees' or banking credentials for scholarship applications. If any third party claims otherwise using our name, it is fraud — please report it via our contact page.",
  },
  {
    title: "4. Your responsibilities",
    body: "You agree to provide accurate information on your profile and eligibility checkers, to keep your account password confidential, and to apply only with truthful details on official portals. Misuse of the platform (scraping, fake accounts, uploading malicious content) may lead to account suspension.",
  },
  {
    title: "5. Eligibility is indicative",
    body: "Our eligibility checker produces indicative matches from the data you enter. Final eligibility, verification and selection are decided solely by the scholarship provider against the official scheme guidelines. ScholarMitra does not guarantee that you will receive any scholarship.",
  },
  {
    title: "6. External links",
    body: "Listing links point to official government or trust portals operated by their respective owners. Those sites have their own terms and privacy policies, and ScholarMitra is not responsible for their content or availability.",
  },
  {
    title: "7. Limitation of liability",
    body: "ScholarMitra is provided 'as is'. To the maximum extent permitted by law, we are not liable for missed deadlines, schema changes by providers, portal downtime, or decisions made by scholarship authorities.",
  },
  {
    title: "8. Contact",
    body: "Questions about these terms can be sent to support@scholarmitra.in or through the contact form. These terms are governed by the laws of India.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pattern-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: January 2026.</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-12 sm:px-6 lg:px-8">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm"
          >
            <h2 className="text-lg font-extrabold tracking-tight text-blue-950">{s.title}</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-600">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
