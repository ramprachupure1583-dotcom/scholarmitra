import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { savedScholarships, scholarships } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { computeWindow, daysLeftLabel, formatDate } from "@/lib/deadlines";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const rows = await db
    .select({
      id: savedScholarships.id,
      savedAt: savedScholarships.createdAt,
      scholarship: scholarships,
    })
    .from(savedScholarships)
    .innerJoin(scholarships, eq(scholarships.id, savedScholarships.scholarshipId))
    .where(eq(savedScholarships.userId, user.id));

  const now = new Date();
  return NextResponse.json({
    saved: rows.map((r) => {
      const win = computeWindow(
        r.scholarship.winStartMonth,
        r.scholarship.winStartDay,
        r.scholarship.winEndMonth,
        r.scholarship.winEndDay,
        now,
      );
      return {
        id: r.id,
        savedAt: r.savedAt,
        scholarship: {
          ...r.scholarship,
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
      };
    }),
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = Number(body?.scholarshipId);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid scholarship." }, { status: 400 });
  }

  const existing = await db
    .select({ id: savedScholarships.id })
    .from(savedScholarships)
    .where(and(eq(savedScholarships.userId, user.id), eq(savedScholarships.scholarshipId, id)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(savedScholarships).values({ userId: user.id, scholarshipId: id });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const url = new URL(req.url);
  let id = Number(url.searchParams.get("scholarshipId"));
  if (!Number.isInteger(id)) {
    const body = await req.json().catch(() => null);
    id = Number(body?.scholarshipId);
  }
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid scholarship." }, { status: 400 });
  }

  await db
    .delete(savedScholarships)
    .where(and(eq(savedScholarships.userId, user.id), eq(savedScholarships.scholarshipId, id)));
  return NextResponse.json({ ok: true });
}
