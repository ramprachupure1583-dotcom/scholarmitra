import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { scholarships } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { computeWindow, daysLeftLabel, formatDate } from "@/lib/deadlines";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await ensureSeeded();
    const { slug } = await params;
    const rows = await db.select().from(scholarships).where(eq(scholarships.slug, slug)).limit(1);
    const s = rows[0];
    if (!s) return NextResponse.json({ error: "Scholarship not found." }, { status: 404 });
    const win = computeWindow(s.winStartMonth, s.winStartDay, s.winEndMonth, s.winEndDay);
    return NextResponse.json({
      scholarship: {
        ...s,
        window: {
          status: win.status,
          statusLabel: win.statusLabel,
          daysToStart: win.daysToStart,
          daysToEnd: win.daysToEnd,
          progress: win.progress,
          startLabel: formatDate(win.nextStart),
          endLabel: formatDate(win.nextEnd),
          daysLabel: daysLeftLabel(win),
        },
      },
    });
  } catch (err) {
    console.error("scholarship detail error", err);
    return NextResponse.json({ error: "Failed to load scholarship." }, { status: 500 });
  }
}
