"use client";

import { useEffect, useRef, useState } from "react";
import FamilyService from "@/services/family.service";
import { getDeviceType } from "@/utils/device";
import { useUser } from "@/context/userContext";

export function useFamilyMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loadinRef = useRef(false);
  const { user } = useUser();

  const fetchMembers = async () => {
    if (loadinRef.current) return;
    loadinRef.current = true;
    if (!user?.userID) return;

    try {
      setLoading(true);
      setError("");

      const body = {
        view: "member_addedit",
        action: "memberList",
        userID: user?.userID,
        deviceType: getDeviceType(),
        userPhone: user?.userPhone,
      };

      const res = await FamilyService.getMemberList(body);

      if (res?.msgCode === "1") {
        setMembers(res?.result?.memberList || []);
      } else {
        setError(res?.msg || "Failed to load members");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
      loadinRef.current = false;
    }
  };

  useEffect(() => {
    if (!user?.userID) return;
    fetchMembers();
  }, [user?.userID]);

  return { members, loading, error, refetch: fetchMembers };
}
