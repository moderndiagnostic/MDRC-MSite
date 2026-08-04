"use client";

import { useEffect, useState } from "react";
import { careerService } from "@/services/careerService";

export interface Job {
  id: string;
  title: string;
  posts: string;
  openTitle: string;
  description: string;
}

export interface CareerOther {
  heading: string;
  description: string;
  section_image: string;
  section_heading: string;
  section_description: string;
}

interface UseCareerOptions {
  initialData?: any; // optional server-side data
}

export const useCareer = ({ initialData }: UseCareerOptions = {}) => {
  const [jobs, setJobs] = useState<Job[]>(
    initialData?.jobList?.map((item: any) => ({
      id: item.id,
      title: item.title,
      posts: `${item.no_of_opening} Post`,
      openTitle: item.title?.toUpperCase()
        ? `WE'RE HIRING: ${item.title.toUpperCase()}`
        : "",
      description: item.description,
    })) || [],
  );

  const [other, setOther] = useState<CareerOther | null>(
    initialData?.other ?? null,
  );
  const [loading, setLoading] = useState(!initialData); // no loading if initialData exists
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) return; // skip fetch if server-side data exists

    const fetchCareer = async () => {
      setLoading(true);
      try {
        const response: any = await careerService.getCareerList();
        const data = response.data ?? response;

        setJobs(
          (data?.jobList ?? []).map((item: any) => ({
            id: item.id,
            title: item.title,
            posts: `${item.no_of_opening} Post`,
            openTitle: item.title?.toUpperCase()
              ? `WE'RE HIRING: ${item.title.toUpperCase()}`
              : "",
            description: item.description,
          })),
        );

        setOther(data?.other ?? null);
      } catch (err) {
        console.error("Career API error:", err);
        setError("Failed to load careers");
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [initialData]);

  return { jobs, other, loading, error };
};
