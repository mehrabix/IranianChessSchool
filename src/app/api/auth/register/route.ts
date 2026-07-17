import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

const { users } = await import("@/lib/db");

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is too short" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const normalized = email.toLowerCase();
    const existing = await db.select().from(users).where(eq(users.email, normalized)).get();
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const id = crypto.randomUUID();
    await db.insert(users).values({
      id,
      name,
      email: normalized,
      passwordHash: await hash(password, 10),
    });

    return NextResponse.json({ id, name, email: normalized });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
