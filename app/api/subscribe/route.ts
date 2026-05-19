import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Frontend se email nikalna
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const apiKey = process.env.BUTTONDOWN_API_KEY;

    // Backend se safely Buttondown API ko call karna
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${apiKey}`, // Token header me safely pass ho rha hai
      },
      body: JSON.stringify({ email }),
    });

    // Buttondown response check karna
    if (response.ok || response.status === 201) {
      return NextResponse.json({ success: true });
    }

    // Agar email pehle se subscribed hai ya koi aur issue hai
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