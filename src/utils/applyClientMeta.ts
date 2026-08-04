// utils/applyClientMeta.ts
export function applyClientMeta(meta: {
  title?: string;
  description?: string;
  keywords?: string;
  favicon?: string;
  schema?: any; // can be object OR string
  canonical?: string;
}) {
  if (typeof window === "undefined") return;

  /* ---------- TITLE ---------- */
  if (meta.title) {
    document.title = meta.title;
  }

  /* ---------- DESCRIPTION ---------- */
  if (meta.description) {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", meta.description);
  }

  /* ---------- KEYWORDS ---------- */
  if (meta.keywords) {
    let tag = document.querySelector('meta[name="keywords"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "keywords");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", meta.keywords);
  }

  /* ---------- FAVICON ---------- */
  if (meta.favicon) {
    let icon =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");

    icon.setAttribute("rel", "icon");
    icon.setAttribute("href", meta.favicon);
    document.head.appendChild(icon);
  }

  /* ---------- SCHEMA (JSON-LD) ---------- */
  if (meta.schema) {
    // Remove existing dynamic schema
    const existing = document.querySelector(
      'script[type="application/ld+json"][data-dynamic-schema]',
    );
    if (existing) existing.remove();

    let schemaObject = meta.schema;

    // If schema comes as string (with or without <script>)
    if (typeof meta.schema === "string") {
      try {
        const cleaned = meta.schema
          .replace(/<script[^>]*>/gi, "")
          .replace(/<\/script>/gi, "")
          .trim();

        schemaObject = JSON.parse(cleaned);
      } catch (error) {
        console.error("Invalid schema JSON-LD:", error);
        return;
      }
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-dynamic-schema", "true");
    script.text = JSON.stringify(schemaObject);

    document.head.appendChild(script);
  }

  /* ---------- FAVICON ---------- */
  if (meta.canonical) {
    let canonical =
      document.querySelector("link[rel*='canonical']") ||
      document.createElement("link");

    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", meta.canonical);
    document.head.appendChild(canonical);
  }
}
