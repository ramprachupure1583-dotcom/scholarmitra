import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser, publicUser } from "@/lib/auth";
import { STATES } from "@/lib/constants";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user: publicUser(user) });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: Record<string, string | number | null> = {};

  if ("name" in body) {
    const name = String(body.name ?? "").trim();
    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ error: "Name must be 2-120 characters." }, { status: 400 });
    }
    updates.name = name;
  }
  if ("state" in body) {
    const state = String(body.state ?? "");
    if (state !== "" && !STATES.includes(state as (typeof STATES)[number])) {
      return NextResponse.json({ error: "Select a valid state." }, { status: 400 });
    }
    updates.state = state || null;
  }
  if ("educationLevel" in body) {
    updates.educationLevel = String(body.educationLevel ?? "") || null;
  }
  if ("course" in body) {
    const course = String(body.course ?? "").trim().slice(0, 120);
    updates.course = course || null;
  }
  if ("category" in body) {
    updates.category = String(body.category ?? "") || null;
  }
  if ("gender" in body) {
    updates.gender = String(body.gender ?? "") || null;
  }
  if ("percentage" in body) {
    const pct = body.percentage === null || body.percentage === "" ? null : Number(body.percentage);
    if (pct !== null && (!Number.isFinite(pct) || pct < 0 || pct > 100)) {
      return NextResponse.json({ error: "Percentage must be between 0 and 100." }, { status: 400 });
    }
    updates.percentage = pct === null ? null : Math.round(pct);
  }
  if ("familyIncome" in body) {
    const income = body.familyIncome === null || body.familyIncome === "" ? null : Number(body.familyIncome);
    if (income !== null && (!Number.isFinite(income) || income < 0 || income > 1000000000)) {
      return NextResponse.json({ error: "Enter a valid annual family income in rupees." }, { status: 400 });
    }
    updates.familyIncome = income;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updated = await db.update(users).set(updates).where(eq(users.id, user.id)).returning();
  return NextResponse.json({ user: publicUser(updated[0]) });
}
