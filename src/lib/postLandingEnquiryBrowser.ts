import requests from "@/lib/httpServices";

export type BrowserLandingEnquiry = {
  name: string;
  phone: string;
  email: string;
  scan: string;
  message: string;
  terms?: string;
};

const ALLOWED_SCANS = new Set([
  "MRI",
  "PET-CT",
  "PET-CT / SPECT-CT",
  "FDG Whole Body PET-CT",
  "FDG Triple Phase PET-CT",
  "PSMA Scan",
  "DOTA PET Scan",
  "DOPA Scan",
  "CT Scan",
  "NCCT Head",
  "CECT Whole Abdomen",
  "CECT Chest",
  "NCCT PNS",
  "NCCT KUB",
  "NCCT Orbit",
  "3D CT Pelvis",
  "CECT KUB",
  "CECT KUB / CT Urography",
  "Coronary CT Angiography",
  "Ultrasound",
  "Whole Abdomen Ultrasound",
  "KUB Ultrasound",
  "Pelvic Ultrasound",
  "Obstetric / Pregnancy Scan",
  "Color Doppler",
  "Breast Ultrasound",
  "Thyroid Ultrasound",
  "TVS (Transvaginal)",
  "Fetal Echocardiography",
  "CBCT",
  "Mammography",
  "X-Ray",
  "Others",
]);

export async function postEnquiryWithPlainForm(fields: BrowserLandingEnquiry) {
  const scan = ALLOWED_SCANS.has(fields.scan) ? fields.scan : "Others";
  const message =
    scan === fields.scan
      ? fields.message
      : [fields.scan, fields.message].filter(Boolean).join("\n");

  const fd = new FormData();
  fd.append("view", "landing_page_enquiry");
  fd.append("name", fields.name);
  fd.append("phone", fields.phone);
  fd.append("email", fields.email);
  fd.append("scan", scan);
  fd.append("message", message);
  fd.append("terms", fields.terms || "Yes");

  const result = await requests.post("/webApi/index.php", fd);
  return (
    String(result?.msgCode) === "1" ||
    String(result?.RESULT ?? result?.result ?? "").toUpperCase() === "OK" ||
    Boolean(result?.id)
  );
}
