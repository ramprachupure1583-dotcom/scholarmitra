import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Register Free",
  description: "Create a free ScholarMitra student account to save scholarships, set deadline reminders and track applications.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
