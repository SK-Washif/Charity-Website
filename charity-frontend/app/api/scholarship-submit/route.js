import { NextResponse } from "next/server";

// Set this in .env.local:
// GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/XXXXXXX/exec"
const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function POST(request) {
  if (!WEBHOOK_URL) {
    return NextResponse.json(
      { error: "GOOGLE_SHEETS_WEBHOOK_URL কনফিগার করা হয়নি" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const payload = {
      submittedAt: new Date().toISOString(),
      ...body,
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script redirects on success; follow it.
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Sheets webhook responded with ${res.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("scholarship-submit error:", err);
    return NextResponse.json(
      { error: "Google Sheets-এ ডেটা পাঠানো যায়নি" },
      { status: 502 }
    );
  }
}