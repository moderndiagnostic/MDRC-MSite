import { NextResponse } from "next/server";

const ENQUIRY_URL = "https://www.mdrcindia.com/scripts/ajax/index.php";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "";
  return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "";
}

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

    const ip = getClientIp(request);
    if (ip) payload.set("ip", ip);

    const response = await fetch(ENQUIRY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
        ...(ip ? { "X-Forwarded-For": ip, "X-Real-IP": ip } : {}),
      },
      body: payload.toString(),
      cache: "no-store",
    });

    const text = await response.text();
    let data: Record<string, unknown> | null = null;
    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          data = JSON.parse(match[0]);
        } catch {
          data = null;
        }
      }
    }

    const result = String(data?.RESULT ?? data?.result ?? "").toUpperCase();
    if (response.ok && (result === "OK" || data?.id)) {
      return NextResponse.json({ RESULT: "OK", ...(data || {}) });
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
