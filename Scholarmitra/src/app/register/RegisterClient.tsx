"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { useAuth, useToast } from "@/components/AppProviders";
import { EMAIL_RE } from "@/lib/utils";

const PERKS = [
  "Save unlimited scholarships to your dashboard",
  "Deadline countdowns & reminders",
  "Track every application in one place",
  "Eligibility pre-filled from your profile",
];

export default function RegisterClient() {
  const router = useRouter();
  const { refresh } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError("Please enter your full name.");
    if (!EMAIL_RE.test(form.email)) return setError("Please enter a valid email address.");
    if (form.password.length < 8 || !/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      return setError("Password must be at least 8 characters with letters and numbers.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed.");
      await refresh();
      toast(`Welcome to ScholarMitra, ${data.user.name.split(" ")[0]}!`, "success");
      router.push("/dashboard?tab=profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden px-4 py-14">
      <div className="pattern-grid absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/50 to-indigo-100/40 blur-3xl" />
      <div className="relative mx-auto grid max-w-4xl items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-blue-950">
            One free account.
            <br />
            <span className="text-gradient">Every scholarship organised.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            Your dream deserve support — let ScholarMitra keep track of the details while you focus
            on studying.
          </p>
          <ul className="mt-7 space-y-3.5">
            {PERKS.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm font-semibold text-slate-700"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                {p}
              </motion.li>
            ))}
          </ul>
          <p className="mt-8 flex items-center gap-2 rounded-2xl border border-blue-100 bg-white/70 px-4 py-3 text-xs font-semibold text-blue-800">
            <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
            Passwords are salted & hashed. We never share your data with anyone.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-2xl shadow-blue-950/10 sm:p-9"
        >
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/30">
              <GraduationCap className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-blue-950">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">Free forever. Takes under a minute.</p>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <div>
              <label htmlFor="rg-name" className="field-label">
                Full name
              </label>
              <div className="relative">
                <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="rg-name"
                  value={form.name}
                  onChange={set("name")}
                  autoComplete="name"
                  placeholder="e.g. Priya Verma"
                  className="field-input pl-10"
                />
              </div>
            </div>
            <div>
              <label htmlFor="rg-email" className="field-label">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="rg-email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="field-input pl-10"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="rg-pass" className="field-label">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="rg-pass"
                    type={show ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="new-password"
                    placeholder="8+ characters"
                    className="field-input pr-11 pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="rg-confirm" className="field-label">
                  Confirm password
                </label>
                <input
                  id="rg-confirm"
                  type={show ? "text" : "password"}
                  value={form.confirm}
                  onChange={set("confirm")}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  className="field-input"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" /> Creating account…
                </>
              ) : (
                <>
                  <UserPlus className="h-4.5 w-4.5" /> Register Free
                </>
              )}
            </button>

            <p className="text-center text-[11.5px] leading-relaxed text-slate-400">
              By registering you agree to our{" "}
              <Link href="/terms" className="font-semibold text-blue-600 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-700 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
