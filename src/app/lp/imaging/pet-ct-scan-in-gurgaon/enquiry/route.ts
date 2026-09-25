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
    const result = await submitLandingEnquiry(
      {
        name: String(incoming.get("name") || ""),
        phone: String(incoming.get("phone") || ""),
        email: String(incoming.get("email") || ""),
        scan: String(incoming.get("scan") || "PET-CT / Others"),
        message: String(incoming.get("message") || ""),
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
