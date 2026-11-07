import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Student Login",
  description: "Log in to ScholarMitra to save scholarships, track deadlines and manage your applications.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-24">Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
