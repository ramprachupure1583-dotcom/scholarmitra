import type { Scholarship, TrackedApplication } from "@/db/schema";

export type WindowData = {
  status: "open" | "opening-soon" | "closed";
  statusLabel: string;
  daysToStart: number;
  daysToEnd: number;
  progress: number;
  startLabel: string;
  endLabel: string;
  daysLabel: string;
};

export type ScholarshipDTO = Scholarship & { window: WindowData };

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  state: string | null;
  educationLevel: string | null;
  course: string | null;
  category: string | null;
  gender: string | null;
  percentage: number | null;
  familyIncome: number | null;
  createdAt: string | Date;
};

export type TrackedApplicationDTO = TrackedApplication & {
  scholarship: ScholarshipDTO;
};

export type MatchResultDTO = {
  scholarship: ScholarshipDTO;
  score: number;
  strength: "strong" | "good" | "possible";
  reasons: string[];
  cautions: string[];
};
