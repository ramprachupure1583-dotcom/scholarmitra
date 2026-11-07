// Deadline window logic. Scholarship application windows recur yearly, so we
// store a typical month/day window and always project the *next upcoming*
// dates — the UI never shows a stale, expired deadline.

export type WindowInfo = {
  status: "open" | "opening-soon" | "closed";
  statusLabel: string;
  nextStart: Date;
  nextEnd: Date;
  daysToStart: number;
  daysToEnd: number;
  progress: number; // 0..1 position of 'today' inside the open window
};

export function computeWindow(
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
  now = new Date(),
): WindowInfo {
  const y = now.getFullYear();

  const mk = (yy: number, m: number, d: number) => new Date(yy, m - 1, d);

  // Windows can wrap around the new year (e.g. Nov -> Jan).
  const wraps = startMonth > endMonth || (startMonth === endMonth && startDay > endDay);

  let start = mk(y, startMonth, startDay);
  let end = wraps ? mk(y + 1, endMonth, endDay) : mk(y, endMonth, endDay);

  // If this year's window is fully past, shift to next year's window.
  if (end.getTime() < now.getTime()) {
    start = mk(y + 1, startMonth, startDay);
    end = wraps ? mk(y + 2, endMonth, endDay) : mk(y + 1, endMonth, endDay);
  }

  // If the window is currently open, but 'start' is already past, keep it.
  const startsOpen = start.getTime() <= now.getTime() && end.getTime() >= now.getTime();
  if (!startsOpen) {
    // find the nearest upcoming start
    if (start.getTime() < now.getTime()) {
      start = mk(y + 1, startMonth, startDay);
      end = wraps ? mk(y + 2, endMonth, endDay) : mk(y + 1, endMonth, endDay);
    }
  } else if (start.getTime() > now.getTime()) {
    // current occurrence may have started last year (wrap case)
    const prevStart = mk(y - 1, startMonth, startDay);
    if (wraps && prevStart.getTime() <= now.getTime()) start = prevStart;
  }

  const dayMs = 1000 * 60 * 60 * 24;
  const daysToStart = Math.max(0, Math.ceil((start.getTime() - now.getTime()) / dayMs));
  const daysToEnd = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / dayMs));

  const isOpen = start.getTime() <= now.getTime() && end.getTime() >= now.getTime();
  let status: WindowInfo["status"] = "closed";
  if (isOpen) status = "open";
  else if (daysToStart <= 60) status = "opening-soon";

  const span = Math.max(1, end.getTime() - start.getTime());
  const progress = isOpen
    ? Math.min(1, Math.max(0, (now.getTime() - start.getTime()) / span))
    : 0;

  const statusLabel =
    status === "open"
      ? daysToEnd <= 21
        ? "Closing soon"
        : "Applications open"
      : status === "opening-soon"
        ? "Opening soon"
        : "Next cycle upcoming";

  return { status, statusLabel, nextStart: start, nextEnd: end, daysToStart, daysToEnd, progress };
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function daysLeftLabel(info: WindowInfo) {
  if (info.status === "open") {
    return info.daysToEnd === 0 ? "Closes today" : `${info.daysToEnd} day${info.daysToEnd === 1 ? "" : "s"} left`;
  }
  return `Opens in ${info.daysToStart} day${info.daysToStart === 1 ? "" : "s"}`;
}
