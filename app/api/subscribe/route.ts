import { NextResponse } from "next/server";

// ponytail: per-instance memory, so the limit is soft on serverless; add a Vercel Firewall rate-limit rule for a hard cap
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_HITS;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
    }

    const { email } = await request.json();

    if (typeof email !== "string" || !email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (email.length > 254 || !EMAIL.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const apiKey = process.env.BUTTONDOWN_API_KEY;

    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${apiKey}`,
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok || response.status === 201) {
      return NextResponse.json({ success: true });
    }

    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData[0] || errorData.detail || "Failed to subscribe" },
      { status: response.status }
    );

  } catch (error) {
    console.error("Subscription API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again." },
      { status: 500 }
    );
  }
}