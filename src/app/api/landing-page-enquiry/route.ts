import { NextResponse } from "next/server";

const ENQUIRY_URL = "https://www.mdrcindia.com/scripts/ajax/index.php";

export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const payload = new FormData();
    payload.append("method", "landing_page_enquiry");
    payload.append("name", String(incoming.get("name") || "").trim());
    payload.append("phone", String(incoming.get("phone") || "").trim());
    payload.append("email", String(incoming.get("email") || "").trim());
    payload.append("scan", String(incoming.get("scan") || "MRI"));
    payload.append("message", String(incoming.get("message") || "").trim());
    payload.append("terms", "Yes");

    const response = await fetch(ENQUIRY_URL, {
      method: "POST",
      body: payload,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { RESULT: "FAIL", error_msg: "Could not submit. Please try again." },
      { status: 500 },
    );
  }
}
