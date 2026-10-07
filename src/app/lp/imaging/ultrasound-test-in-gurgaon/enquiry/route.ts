import { handleLandingEnquiryPost } from "@/lib/landingEnquiryHttp";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    return await handleLandingEnquiryPost(request, (incoming) => ({
      name: String(incoming.get("name") || ""),
      phone: String(incoming.get("phone") || ""),
      email: String(incoming.get("email") || ""),
      scan: String(incoming.get("scan") || "Ultrasound"),
      message: String(incoming.get("message") || ""),
      terms: "Yes",
    }));
  } catch {
    return Response.json({
      RESULT: "FAIL",
      error_msg: "Could not submit. Please try again.",
    });
  }
}
