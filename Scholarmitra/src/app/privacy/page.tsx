import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ScholarMitra collects, stores and protects student data.",
};

const SECTIONS = [
  {
    title: "Information we collect",
    body: "Account details you provide at registration (name, email, password — stored only as a salted hash) and optional profile information you choose to add (state, education level, course, category, gender, percentage and family-income range). We also store the scholarships you save and application notes you write, plus messages sent through our contact form.",
  },
  {
    title: "How we use it",
    body: "Your data powers exactly three things: signing you in, pre-filling the eligibility checker, and running your personal dashboard (saved schemes, tracked applications, deadline reminders). We do not use your information for advertising and we never send marketing spam.",
  },
  {
    title: "What we never do",
    body: "We never sell, rent or share your personal data with scholarship providers, advertisers or any third party. We never charge money. Eligibility checks made while logged out are not stored. Applications are always submitted by you, on official government or trust portals — ScholarMitra cannot see your official portal credentials and never asks for them.",
  },
  {
    title: "Cookies & sessions",
    body: "We use a single httpOnly session cookie to keep you logged in. Document-checklist progress and comparison selections are stored locally in your own browser (localStorage) and are never transmitted to us.",
  },
  {
    title: "Data security",
    body: "Passwords are hashed with salted scrypt and are unreadable to anyone, including us. Sessions expire after 30 days. You may delete saved items and tracked applications at any time from your dashboard; to delete your account entirely, write to support@scholarmitra.in.",
  },
  {
    title: "Updates",
    body: "If this policy changes materially, we will announce it on this page before the change takes effect. Continued use of ScholarMitra after an update means you accept the revised policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pattern-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Last updated: January 2026 · Plain language, because trust starts with clarity.
          </p>
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
