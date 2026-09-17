import { NextResponse } from "next/server";

const ENQUIRY_URL = "https://www.mdrcindia.com/scripts/ajax/index.php";

export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const payload = new URLSearchParams();
    payload.set("method", "landing_page_enquiry");
    payload.set("name", String(incoming.get("name") || "").trim());
    payload.set("phone", String(incoming.get("phone") || "").trim());
    payload.set("email", String(incoming.get("email") || "").trim());
    payload.set("scan", String(incoming.get("scan") || "MRI"));
    payload.set("message", String(incoming.get("message") || "").trim());
    payload.set("terms", "Yes");

    const response = await fetch(ENQUIRY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: payload.toString(),
    });

    const text = await response.text();
    let data: Record<string, unknown> | null = null;
    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) data = JSON.parse(match[0]);
    }

    const result = String(data?.RESULT ?? data?.result ?? "").toUpperCase();
    if (result === "OK" || data?.id) {
      return NextResponse.json({ RESULT: "OK", ...data });
    }

    return NextResponse.json({
      RESULT: "FAIL",
      error_msg:
        (data?.error_msg as string) ||
        (data?.message as string) ||
        "Could not submit. Please try again.",
    });
  } catch {
    return NextResponse.json({
      RESULT: "FAIL",
      error_msg: "Could not submit. Please try again.",
    });
  }
}
