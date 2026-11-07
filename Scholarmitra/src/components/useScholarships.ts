"use client";

import { useEffect, useState } from "react";
import type { ScholarshipDTO } from "@/lib/types";

let cache: ScholarshipDTO[] | null = null;
let inflight: Promise<ScholarshipDTO[]> | null = null;

async function load(): Promise<ScholarshipDTO[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/api/scholarships", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? "load failed");
        cache = d.scholarships as ScholarshipDTO[];
        return cache;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useScholarships() {
  const [data, setData] = useState<ScholarshipDTO[] | null>(cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) {
      setData(cache);
      return;
    }
    load()
      .then(setData)
      .catch(() => setError("Couldn't load scholarships right now. Please refresh."));
  }, []);

  return { data, error, loading: !data && !error };
}
