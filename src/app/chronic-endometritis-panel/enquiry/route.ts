import { NextResponse } from "next/server";
import { submitLandingEnquiry } from "@/lib/submitLandingEnquiry";

export const dynamic = "force-dynamic";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "";
  return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "";
}

export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const clinic = String(incoming.get("clinic") || "").trim();
    const interest = String(incoming.get("scan") || incoming.get("interest") || "Chronic Endometritis Panel");
    const extra = String(incoming.get("message") || "").trim();
    const message = [clinic && `Clinic: ${clinic}`, extra].filter(Boolean).join("\n");

    const result = await submitLandingEnquiry(
      {
        name: String(incoming.get("name") || ""),
        phone: String(incoming.get("phone") || ""),
        email: String(incoming.get("email") || ""),
        scan: interest,
        message,
        terms: "Yes",
      },
      getClientIp(request),
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      RESULT: "FAIL",
      error_msg: "Could not submit. Please try again.",
    });
  }
}
