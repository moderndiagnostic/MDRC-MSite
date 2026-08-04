// hooks/useIPO.ts
"use client";

import { useEffect, useState } from "react";
import { ipoService } from "@/services/ipoService";

export const useIPO = (category: string = "IPO") => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [other, setOther] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response: any = await ipoService.getDocuments(category);
        const data = response.data ?? response;

        setDocuments(
          (data?.ipos ?? []).map((item: any) => ({
            name: item.name,
            url: item.file,
            qr: item.qr || "",
          })),
        );

        setOther(data?.other ?? null);
      } catch (err) {
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [category]);

  return { documents, other, loading, error };
};
