import type { Scholarship } from "@/db/schema";
import { NORTH_EAST_STATES } from "./constants";
import { formatINR } from "./utils";

export type StudentProfile = {
  state?: string | null;
  level?: string | null;
  stream?: string | null;
  percentage?: number | null;
  income?: number | null;
  group?: string | null;
  gender?: string | null;
};

export type MatchResult = {
  scholarship: Scholarship;
  score: number; // 0..100
  strength: "strong" | "good" | "possible";
  reasons: string[];
  cautions: string[];
};

export function userMatchesGroup(scholarship: Scholarship, profile: StudentProfile): boolean {
  const groups = scholarship.groups;
  if (groups.includes("all")) return true;
  if (!profile.group) {
    // Special implicit group: NER domicile for Ishan Uday style schemes
    if (groups.includes("ner") && profile.state && NORTH_EAST_STATES.includes(profile.state)) {
      return true;
    }
    return false;
  }
  if (groups.includes(profile.group)) return true;
  if (
    groups.includes("ner") &&
    profile.state &&
    NORTH_EAST_STATES.includes(profile.state)
  ) {
    return true;
  }
  return false;
}

export function matchScholarships(
  profile: StudentProfile,
  list: Scholarship[],
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const s of list) {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let score = 0;
    let disqualified = false;

    // Education level (hard)
    if (profile.level) {
      if (s.levels.includes(profile.level)) {
        score += 28;
        reasons.push("Matches your education level");
      } else {
        disqualified = true;
      }
    } else {
      cautions.push("Education level not specified");
    }

    // State (hard for state schemes)
    if (s.authority === "state") {
      if (profile.state && s.state === profile.state) {
        score += 16;
        reasons.push(`Open to students domiciled in ${s.state}`);
      } else if (profile.state) {
        disqualified = true;
      } else {
        cautions.push("Requires domicile of the scheme's state");
      }
    } else {
      score += 14;
      reasons.push("Open to students across India");
    }

    // Gender (hard)
    if (s.gender === "female") {
      if (profile.gender === "female") {
        score += 10;
        reasons.push("Scheme dedicated to girl students");
      } else if (profile.gender === "male") {
        disqualified = true;
      } else {
        cautions.push("This scheme is only for girl students");
      }
    } else {
      score += 4;
    }

    // Groups (hard unless open-to-all)
    if (!s.groups.includes("all")) {
      if (userMatchesGroup(s, profile)) {
        score += 16;
        reasons.push("Matches your category");
      } else if (!profile.group && !profile.state) {
        cautions.push("Category-specific scheme — check the guidelines");
      } else {
        disqualified = true;
      }
    } else {
      score += 8;
    }

    // Income (semi-hard)
    if (s.maxFamilyIncome != null) {
      if (profile.income != null) {
        if (profile.income <= s.maxFamilyIncome) {
          score += 18;
          reasons.push(`Family income is within the ${formatINR(s.maxFamilyIncome)} limit`);
        } else {
          disqualified = true;
        }
      } else {
        cautions.push(`Has a family income ceiling of ${formatINR(s.maxFamilyIncome)}`);
        score += 6;
      }
    } else {
      score += 8;
      reasons.push("No family income bar");
    }

    // Percentage (semi-hard)
    if (s.minPercentage != null) {
      if (profile.percentage != null) {
        if (profile.percentage >= s.minPercentage) {
          score += 16;
          reasons.push(`Meets the ${s.minPercentage}% academic requirement`);
        } else {
          disqualified = true;
        }
      } else {
        cautions.push(`Requires about ${s.minPercentage}% in the last exam`);
        score += 5;
      }
    } else {
      score += 8;
    }

    // Stream (soft)
    if (profile.stream && profile.stream !== "all") {
      if (s.streams.includes("all") || s.streams.includes(profile.stream)) {
        score += 6;
        reasons.push("Accepts your course stream");
      } else {
        score -= 14;
        cautions.push("Focused on specific course streams");
      }
    }

    if (disqualified) continue;

    const clamped = Math.max(30, Math.min(100, Math.round(score)));
    const strength: MatchResult["strength"] =
      clamped >= 82 && cautions.length === 0
        ? "strong"
        : clamped >= 62
          ? "good"
          : "possible";

    results.push({ scholarship: s, score: clamped, strength, reasons, cautions });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

export type SearchFilters = StudentProfile & { q?: string | null; kind?: string | null };

export function filterScholarships<T extends Scholarship>(filters: SearchFilters, list: T[]): T[] {
  const q = filters.q?.trim().toLowerCase();
  return list.filter((s) => {
    if (q) {
      const hay = `${s.name} ${s.provider} ${s.state ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.level && !s.levels.includes(filters.level)) return false;
    if (filters.kind && s.kind !== filters.kind) return false;
    if (filters.state) {
      if (s.authority === "state" && s.state !== filters.state) return false;
    }
    if (filters.stream && filters.stream !== "all") {
      if (!s.streams.includes("all") && !s.streams.includes(filters.stream)) return false;
    }
    if (filters.income != null && s.maxFamilyIncome != null && filters.income > s.maxFamilyIncome) {
      return false;
    }
    if (filters.percentage != null && s.minPercentage != null && filters.percentage < s.minPercentage) {
      return false;
    }
    if (filters.group && filters.group !== "general" && !s.groups.includes("all") && !s.groups.includes(filters.group)) {
      return false;
    }
    if (filters.gender && filters.gender !== "all" && s.gender !== "all" && s.gender !== filters.gender) {
      return false;
    }
    return true;
  });
}
