import { useEffect, useState } from "react";
import { getStoredAccessToken } from "../services/auth";
import {
  dashboardService,
  type RecruiterInfo,
} from "../services/dashboardService";

const mapStoredUserToRecruiter = (): RecruiterInfo | null => {
  try {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return null;

    const user = JSON.parse(stored) as Record<string, unknown>;
    const contactInfo = user.contactInfo as Record<string, unknown> | undefined;

    return {
      id: typeof user._id === "string" ? user._id : "",
      fullName:
        typeof user.fullName === "string" && user.fullName.trim()
          ? user.fullName
          : "HR Manager",
      avatarUrl: typeof user.avatarUrl === "string" ? user.avatarUrl : null,
      role: typeof user.role === "string" ? user.role : "recruiter",
      email: typeof contactInfo?.email === "string" ? contactInfo.email : null,
      membershipRole:
        typeof user.membershipRole === "string"
          ? user.membershipRole
          : typeof user.role === "string"
            ? user.role
            : "recruiter",
      jobTitle:
        typeof user.jobTitle === "string" && user.jobTitle.trim()
          ? user.jobTitle
          : "Recruiter",
    };
  } catch {
    return null;
  }
};

export const useCurrentRecruiter = (): RecruiterInfo | null => {
  const [recruiter, setRecruiter] = useState<RecruiterInfo | null>(() =>
    mapStoredUserToRecruiter(),
  );

  useEffect(() => {
    let isActive = true;

    const token = getStoredAccessToken();
    if (!token) {
      return;
    }

    const loadFromDashboard = async () => {
      try {
        const dashboardData = await dashboardService.getDashboard("week");
        if (!isActive || !dashboardData?.recruiter) {
          return;
        }

        setRecruiter(dashboardData.recruiter);
      } catch {
        // Keep fallback from localStorage when dashboard endpoint is unavailable.
      }
    };

    void loadFromDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  return recruiter;
};