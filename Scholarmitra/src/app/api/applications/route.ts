import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { scholarships, trackedApplications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { computeWindow, daysLeftLabel, formatDate } from "@/lib/deadlines";

const STATUSES = ["planning", "in_progress", "submitted", "under_review", "selected", "not_selected"] as const;

function withWindow(s: typeof scholarships.$inferSelect) {
  const win = computeWindow(s.winStartMonth, s.winStartDay, s.winEndMonth, s.winEndDay);
  return {
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
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const rows = await db
    .select({ tracking: trackedApplications, scholarship: scholarships })
    .from(trackedApplications)
    .innerJoin(scholarships, eq(scholarships.id, trackedApplications.scholarshipId))
    .where(eq(trackedApplications.userId, user.id));

  return NextResponse.json({
    applications: rows.map((r) => ({
      ...r.tracking,
      scholarship: withWindow(r.scholarship),
    })),
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = Number(body?.scholarshipId);
  const status = typeof body?.status === "string" ? body.status : "planning";
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid scholarship." }, { status: 400 });
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const existing = await db
    .select({ id: trackedApplications.id })
    .from(trackedApplications)
    .where(and(eq(trackedApplications.userId, user.id), eq(trackedApplications.scholarshipId, id)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(trackedApplications).values({ userId: user.id, scholarshipId: id, status });
  } else {
    await db
      .update(trackedApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(trackedApplications.id, existing[0].id));
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = Number(body?.applicationId);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid application." }, { status: 400 });

  const updates: Record<string, string | Date> = { updatedAt: new Date() };
  if (typeof body?.status === "string") {
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    updates.status = body.status;
  }
  if (typeof body?.notes === "string") {
    updates.notes = body.notes.slice(0, 1000);
  }
  if (Object.keys(updates).length === 1) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const rows = await db
    .update(trackedApplications)
    .set(updates)
    .where(and(eq(trackedApplications.id, id), eq(trackedApplications.userId, user.id)))
    .returning({ id: trackedApplications.id });
  if (rows.length === 0) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const url = new URL(req.url);
  const id = Number(url.searchParams.get("applicationId"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid application." }, { status: 400 });

  await db
    .delete(trackedApplications)
    .where(and(eq(trackedApplications.id, id), eq(trackedApplications.userId, user.id)));
  return NextResponse.json({ ok: true });
}
