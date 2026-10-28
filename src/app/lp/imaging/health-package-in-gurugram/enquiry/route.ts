import { handleLandingEnquiryPost } from "@/lib/landingEnquiryHttp";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    return await handleLandingEnquiryPost(request, (incoming) => {
      const pkg = String(incoming.get("package") || "Help me choose a package");
      const message = String(incoming.get("message") || "").trim();
      return {
        name: String(incoming.get("name") || ""),
        phone: String(incoming.get("phone") || ""),
        email: String(incoming.get("email") || ""),
        scan: "Others",
        message: `Package: ${pkg}${message ? `\n${message}` : ""}`,
        terms: "Yes",
      };
    });
  } catch {
    return Response.json({ RESULT: "FAIL", error_msg: "Could not submit. Please try again." });
  }
}
