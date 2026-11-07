import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  state: varchar("state", { length: 60 }),
  educationLevel: varchar("education_level", { length: 60 }),
  course: varchar("course", { length: 120 }),
  category: varchar("category", { length: 40 }),
  gender: varchar("gender", { length: 20 }),
  percentage: integer("percentage"),
  familyIncome: integer("family_income"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sessions = pgTable("sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 220 }).notNull(),
  provider: varchar("provider", { length: 220 }).notNull(),
  authority: varchar("authority", { length: 20 }).notNull(), // central | state | private
  state: varchar("state", { length: 60 }),
  kind: varchar("kind", { length: 40 }).notNull(), // merit | need | mcm | special
  levels: text("levels").array().notNull(),
  streams: text("streams").array().notNull(),
  groups: text("groups").array().notNull(),
  gender: varchar("gender", { length: 20 }).notNull().default("all"),
  minPercentage: integer("min_percentage"),
  maxFamilyIncome: integer("max_family_income"),
  amountText: varchar("amount_text", { length: 260 }).notNull(),
  amountMin: integer("amount_min"),
  amountMax: integer("amount_max"),
  benefits: text("benefits").notNull(),
  eligibility: text("eligibility").notNull(),
  documents: text("documents").array().notNull(),
  deadlineText: varchar("deadline_text", { length: 200 }).notNull(),
  winStartMonth: integer("win_start_month").notNull(),
  winStartDay: integer("win_start_day").notNull(),
  winEndMonth: integer("win_end_month").notNull(),
  winEndDay: integer("win_end_day").notNull(),
  applyUrl: text("apply_url").notNull(),
  portal: varchar("portal", { length: 160 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  schoolLevel: boolean("school_level").notNull().default(false),
});

export const savedScholarships = pgTable(
  "saved_scholarships",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scholarshipId: integer("scholarship_id")
      .notNull()
      .references(() => scholarships.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("saved_user_scholarship_idx").on(t.userId, t.scholarshipId)],
);

export const trackedApplications = pgTable(
  "tracked_applications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scholarshipId: integer("scholarship_id")
      .notNull()
      .references(() => scholarships.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 30 }).notNull().default("planning"),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("tracked_user_scholarship_idx").on(t.userId, t.scholarshipId),
  ],
);

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Scholarship = typeof scholarships.$inferSelect;
export type User = typeof users.$inferSelect;
export type TrackedApplication = typeof trackedApplications.$inferSelect;
