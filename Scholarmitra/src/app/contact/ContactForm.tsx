"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquareText,
  Send,
  ShieldCheck,
} from "lucide-react";
import { EMAIL_RE, cn } from "@/lib/utils";

const SUBJECTS = [
  "Question about a scholarship listing",
  "Wrong or outdated information",
  "Trouble with an official portal",
  "Suggest a scholarship to add",
  "Account or dashboard help",
  "Report a scam / fake website",
  "Something else",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ referenceId: string; message: string } | null>(null);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = "Please enter your name.";
    if (!EMAIL_RE.test(form.email)) er.email = "Enter a valid email.";
    if (!form.subject) er.subject = "Pick a subject.";
    if (form.message.trim().length < 10) er.message = "Please write at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setDone(data);
    } catch (err) {
      setErrors({ message: err instanceof Error ? err.message : "Failed to send." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm sm:p-9"
      >
        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-96 flex-col items-center justify-center text-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-blue-950">
              Message received!
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{done.message}</p>
            <p className="mt-4 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-extrabold text-blue-700">
              Reference: {done.referenceId}
            </p>
            <button
              onClick={() => {
                setDone(null);
                setForm({ name: "", email: "", subject: "", message: "" });
                setErrors({});
              }}
              className="mt-6 text-sm font-bold text-blue-700 hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <>
            <h2 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-blue-950">
              <MessageSquareText className="h-5.5 w-5.5 text-blue-600" /> Write to us
            </h2>
            <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="field-label">
                    Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    id="ct-name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your full name"
                    className={cn("field-input", errors.name && "border-red-400 focus:ring-red-100")}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="mt-1 text-xs font-semibold text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="ct-email" className="field-label">
                    Email <span className="text-blue-600">*</span>
                  </label>
                  <input
                    id="ct-email"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className={cn("field-input", errors.email && "border-red-400 focus:ring-red-100")}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="ct-subject" className="field-label">
                  Subject <span className="text-blue-600">*</span>
                </label>
                <select
                  id="ct-subject"
                  value={form.subject}
                  onChange={set("subject")}
                  className={cn("field-input", errors.subject && "border-red-400 focus:ring-red-100")}
                  aria-invalid={Boolean(errors.subject)}
                >
                  <option value="">Choose a topic…</option>
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.subject}</p>
                )}
              </div>
              <div>
                <label htmlFor="ct-message" className="field-label">
                  Message <span className="text-blue-600">*</span>
                </label>
                <textarea
                  id="ct-message"
                  rows={6}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Describe your question or issue. If it's about a specific scholarship, include its name…"
                  className={cn(
                    "field-input resize-none",
                    errors.message && "border-red-400 focus:ring-red-100",
                  )}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4.5 w-4.5" /> Send Message
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-5"
      >
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-extrabold tracking-wide text-blue-950 uppercase">
            Reach us directly
          </h3>
          <ul className="mt-4 space-y-3.5 text-sm font-medium text-slate-600">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Mail className="h-4 w-4" />
              </span>
              support@scholarmitra.in
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin className="h-4 w-4" />
              </span>
              New Delhi, India
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock className="h-4 w-4" />
              </span>
              Replies within 2 working days
            </li>
          </ul>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-600/20">
          <ShieldCheck className="h-7 w-7" />
          <h3 className="mt-3 text-base font-extrabold">Important</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-blue-100">
            For application status, login issues or correction requests of a specific scholarship,
            contact the scheme's official portal directly — ScholarMitra cannot process or modify
            government applications.
          </p>
        </div>
      </motion.aside>
    </div>
  );
}
