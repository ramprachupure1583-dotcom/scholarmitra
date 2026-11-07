import "server-only";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { scholarships } from "@/db/schema";
import { SEED_SCHOLARSHIPS } from "./scholarship-data";

let seedPromise: Promise<void> | null = null;

async function doSeed() {
  const rows = await db.select({ value: count() }).from(scholarships);
  if ((rows[0]?.value ?? 0) > 0) return;
  await db.insert(scholarships).values(
    SEED_SCHOLARSHIPS.map((s) => ({
      ...s,
      gender: s.gender ?? "all",
    })),
  );
}

/** Idempotently ensures the scholarship catalogue exists. */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = doSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}
