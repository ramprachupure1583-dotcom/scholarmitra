import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
      <div className="pattern-grid absolute inset-0 opacity-60" />
      <div className="relative text-center">
        <p className="text-7xl font-extrabold tracking-tight text-blue-100 sm:text-8xl">404</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-blue-950">
          This page wandered off syllabus.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-slate-500">
          The page you're looking for doesn't exist — but thousands of students find their
          scholarships here every day.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
          >
            Back to Home
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-7 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            <Compass className="h-4 w-4" /> Explore Scholarships
          </Link>
        </div>
      </div>
    </div>
  );
}
