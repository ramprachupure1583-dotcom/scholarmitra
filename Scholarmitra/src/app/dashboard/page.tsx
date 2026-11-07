import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Your saved scholarships, tracked applications, deadline reminders and profile.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard");
  return <DashboardClient userName={user.name} />;
}
