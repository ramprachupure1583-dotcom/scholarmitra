export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatINR(amount: number) {
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(1)} lakh`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function levelLabel(v: string) {
  const map: Record<string, string> = {
    "class-9-10": "Class 9–10",
    "class-11-12": "Class 11–12",
    diploma: "Diploma / ITI",
    ug: "Undergraduate",
    pg: "Postgraduate",
    phd: "Doctoral",
  };
  return map[v] ?? v;
}

export function kindLabel(v: string) {
  const map: Record<string, string> = {
    merit: "Merit-Based",
    need: "Need-Based",
    mcm: "Merit-cum-Means",
    special: "Special Category",
  };
  return map[v] ?? v;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
