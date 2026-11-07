import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { EMAIL_RE } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (subject.length < 3 || subject.length > 200) {
      return NextResponse.json({ error: "Subject must be 3-200 characters." }, { status: 400 });
    }
    if (message.length < 10 || message.length > 4000) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    const inserted = await db
      .insert(contactMessages)
      .values({ name, email, subject, message })
      .returning({ id: contactMessages.id });

    return NextResponse.json({
      ok: true,
      referenceId: `SM-${String(inserted[0].id).padStart(6, "0")}`,
      message: "Thanks for reaching out! Our team usually responds within 2 working days.",
    });
  } catch (err) {
    console.error("contact error", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
