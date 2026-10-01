import { handleLandingEnquiryPost } from "@/lib/landingEnquiryHttp";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    return await handleLandingEnquiryPost(request, (incoming) => {
      const clinic = String(incoming.get("clinic") || "").trim();
      const extra = String(incoming.get("message") || incoming.get("note") || "").trim();
      return {
        name: String(incoming.get("name") || ""),
        phone: String(incoming.get("phone") || ""),
        email: String(incoming.get("email") || ""),
        scan: String(incoming.get("scan") || incoming.get("interest") || "Chronic Endometritis Panel"),
        message: [clinic && `Clinic: ${clinic}`, extra].filter(Boolean).join("\n"),
        terms: "Yes",
      };
    });
  } catch {
    return Response.json({
      RESULT: "FAIL",
      error_msg: "Could not submit. Please try again.",
    });
  }
}
