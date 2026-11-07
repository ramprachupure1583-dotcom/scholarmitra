import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompareBar from "@/components/CompareBar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ScholarMitra — Find the Right Scholarship for Your Future",
    template: "%s · ScholarMitra",
  },
  description:
    "ScholarMitra helps Indian students discover verified Central and State Government scholarships, check eligibility instantly, track deadlines and apply on official portals. Your dream deserves support.",
  keywords: [
    "scholarships India",
    "National Scholarship Portal",
    "state scholarships",
    "eligibility checker",
    "student financial aid",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 antialiased">
        <AppProviders>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CompareBar />
        </AppProviders>
      </body>
    </html>
  );
}
