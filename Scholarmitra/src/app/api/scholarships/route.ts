import { NextResponse } from "next/server";
import { db } from "@/db";
import { scholarships } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { filterScholarships } from "@/lib/match";
import { computeWindow, daysLeftLabel, formatDate } from "@/lib/deadlines";

function num(v: string | null): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: Request) {
  try {
    await ensureSeeded();
    const url = new URL(req.url);
    const p = url.searchParams;

    const all = await db.select().from(scholarships);

    // Support fetching by explicit slugs (for compare & dashboard hydration)
    const slugs = p.get("slugs");
    let rows = all;
    if (slugs) {
      const wanted = new Set(slugs.split(",").map((s) => s.trim()).filter(Boolean));
      rows = all.filter((s) => wanted.has(s.slug));
    } else {
      rows = filterScholarships(
        {
          q: p.get("q"),
          state: p.get("state"),
          level: p.get("level"),
          stream: p.get("stream"),
          kind: p.get("kind"),
          income: num(p.get("income")),
          percentage: num(p.get("percentage")),
          group: p.get("group"),
          gender: p.get("gender"),
        },
        all,
      );
    }

    const now = new Date();
    const items = rows.map((s) => {
      const win = computeWindow(s.winStartMonth, s.winStartDay, s.winEndMonth, s.winEndDay, now);
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
    });

    const sort = p.get("sort") ?? "relevance";
    if (sort === "amount") items.sort((a, b) => (b.amountMax ?? -1) - (a.amountMax ?? -1));
    else if (sort === "deadline") {
      items.sort((a, b) => {
        const ka = a.window.status === "open" ? a.window.daysToEnd : 1000 + a.window.daysToStart;
        const kb = b.window.status === "open" ? b.window.daysToEnd : 1000 + b.window.daysToStart;
        return ka - kb;
      });
    } else {
      items.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
    }

    return NextResponse.json({ scholarships: items, total: items.length });
  } catch (err) {
    console.error("scholarships error", err);
    return NextResponse.json({ error: "Failed to load scholarships." }, { status: 500 });
  }
}
