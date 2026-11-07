import { NextResponse } from "next/server";
import { db } from "@/db";
import { scholarships } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { matchScholarships, type StudentProfile } from "@/lib/match";
import { computeWindow, daysLeftLabel, formatDate } from "@/lib/deadlines";

export async function POST(req: Request) {
  try {
    await ensureSeeded();
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter the student's name." }, { status: 400 });
    }
    if (!body.state || typeof body.state !== "string") {
      return NextResponse.json({ error: "Please select your state." }, { status: 400 });
    }
    if (!body.level || typeof body.level !== "string") {
      return NextResponse.json({ error: "Please select your education level." }, { status: 400 });
    }

    const percentage =
      body.percentage === null || body.percentage === undefined || body.percentage === ""
        ? null
        : Number(body.percentage);
    const income =
      body.income === null || body.income === undefined || body.income === ""
        ? null
        : Number(body.income);

    if (percentage !== null && (!Number.isFinite(percentage) || percentage < 0 || percentage > 100)) {
      return NextResponse.json({ error: "Percentage must be between 0 and 100." }, { status: 400 });
    }
    if (income !== null && (!Number.isFinite(income) || income < 0)) {
      return NextResponse.json({ error: "Enter a valid annual family income." }, { status: 400 });
    }

    const profile: StudentProfile = {
      state: body.state,
      level: body.level,
      stream: typeof body.stream === "string" ? body.stream : null,
      percentage,
      income,
      group: typeof body.group === "string" ? body.group : null,
      gender: typeof body.gender === "string" ? body.gender : null,
    };

    const all = await db.select().from(scholarships);
    const matches = matchScholarships(profile, all);

    const now = new Date();
    return NextResponse.json({
      name,
      profile,
      total: matches.length,
      results: matches.map((m) => {
        const win = computeWindow(
          m.scholarship.winStartMonth,
          m.scholarship.winStartDay,
          m.scholarship.winEndMonth,
          m.scholarship.winEndDay,
          now,
        );
        return {
          ...m,
          scholarship: {
            ...m.scholarship,
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
      disclaimer:
        "These matches are indicative, generated from the details you entered. Final eligibility is always decided by the official scheme guidelines published by the scholarship provider — verify every detail on the official portal before applying.",
    });
  } catch (err) {
    console.error("eligibility error", err);
    return NextResponse.json({ error: "Failed to check eligibility." }, { status: 500 });
  }
}
