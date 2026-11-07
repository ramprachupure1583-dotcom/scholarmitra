"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Bookmark, CheckCircle2, GitCompareArrows } from "lucide-react";
import { useAuth, useCompare, useSaved, useToast } from "@/components/AppProviders";
import { cn } from "@/lib/utils";

export default function DetailActions({
  id,
  slug,
  name,
  applyUrl,
  portal,
}: {
  id: number;
  slug: string;
  name: string;
  applyUrl: string;
  portal: string;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { savedIds, toggle } = useSaved();
  const { slugs, toggle: toggleCompare } = useCompare();
  const router = useRouter();
  const [tracking, setTracking] = useState(false);
  const isSaved = savedIds.has(id);
  const inCompare = slugs.includes(slug);

  const track = async () => {
    if (!user) {
      toast("Log in to track this application on your dashboard.", "info");
      router.push("/login?next=/scholarships/" + slug);
      return;
    }
    setTracking(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId: id, status: "in_progress" }),
      });
      if (!res.ok) throw new Error();
      toast("Added to your dashboard as “In progress”. Good luck!", "success");
      setTimeout(() => window.open(applyUrl, "_blank", "noopener"), 400);
    } catch {
      toast("Could not update the tracker. Try again.", "error");
    } finally {
      setTracking(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={track}
        disabled={tracking}
        className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 disabled:opacity-60"
      >
        {tracking ? (
          <>
            <ArrowUpRight className="h-4.5 w-4.5 animate-pulse" /> Opening portal…
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4.5 w-4.5" />
            Apply Now on {portal}
            <ArrowUpRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
      <button
        onClick={() => toggle({ id, slug, name })}
        aria-pressed={isSaved}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition",
          isSaved
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700",
        )}
      >
        <Bookmark className={cn("h-4.5 w-4.5", isSaved && "fill-current")} />
        {isSaved ? "Saved to Dashboard" : "Save Scholarship"}
      </button>
      <button
        onClick={() => toggleCompare(slug)}
        aria-pressed={inCompare}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition",
          inCompare
            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
            : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-700",
        )}
      >
        <GitCompareArrows className="h-4.5 w-4.5" />
        {inCompare ? "Added to Compare" : "Add to Compare"}
      </button>
    </div>
  );
}
