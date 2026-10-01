import { insertLandingEnquiryMysql } from "@/lib/insertLandingEnquiryMysql";

export type LandingEnquiryFields = {
  name: string;
  phone: string;
  email: string;
  scan: string;
  message: string;
  terms?: string;
};

type EnquiryJson = {
  RESULT?: string;
  result?: string;
  id?: number;
  error_msg?: string;
  message?: string;
};

export function parseEnquiryJson(text: string): EnquiryJson | null {
  try {
    return JSON.parse(text) as EnquiryJson;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as EnquiryJson;
    } catch {
      return null;
    }
  }
}

export function isEnquirySuccess(data: EnquiryJson | null) {
  const result = String(data?.RESULT ?? data?.result ?? "").toUpperCase();
  return result === "OK" || Boolean(data?.id);
}

export async function submitLandingEnquiry(
  fields: LandingEnquiryFields,
  ip = "",
  page = "",
) {
  try {
    const row = await insertLandingEnquiryMysql(fields, ip, page);
    if (row) return row;
  } catch {
    // Table or MySQL login is not available on this machine.
  }
  return { RESULT: "FAIL" as const, error_msg: "Could not submit. Please try again." };
}
