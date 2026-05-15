import { useCallback, useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "../../services/auth";
import { useCurrentRecruiter } from "../../hooks/useCurrentRecruiter";
import { useRecruiterActivity } from "../../hooks/useRecruiterActivity";
import RecruiterSidebar from "../recruiter_dashboard/components/RecruiterSidebar";
import RecruiterTopBar from "../recruiter_dashboard/components/RecruiterTopBar";
import ActivityPanel from "../recruiter_dashboard/components/ActivityPanel";
import RecruiterTable from "./RecruiterTable";
import TopHeader from "./TopHeader";
import "../recruiter_dashboard/recruiter.css";

export interface Recruiter {
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  avatarUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  jobTitle?: string;
  membershipRole?: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CreateRecruiterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  avatarUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  jobTitle?: string;
  membershipRole?: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  avatarUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  jobTitle?: string;
  membershipRole?: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";
  if (!token) {
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const readJsonResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Không thể tải danh sách recruiter.");
  }

  return response.json() as Promise<unknown>;
};

const getResponseErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return fallback;
    }

    const payload = (await response.json()) as {
      message?: string;
      error?: string;
    };
    if (typeof payload.message === "string" && payload.message.trim())
      return payload.message;
    if (typeof payload.error === "string" && payload.error.trim())
      return payload.error;
  } catch {
    /* ignore */
  }
  return fallback;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined;

const readString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return undefined;
};

const toRawDateString = (value: unknown): string | undefined => {
  if (!value) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (isRecord(value)) {
    return toRawDateString(
      value.$date ??
        value.date ??
        value.value ??
        value.iso ??
        value.dateOfBirth ??
        value.birthDate ??
        value.dob,
    );
  }

  return undefined;
};

const readDateString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    const raw = toRawDateString(value);
    if (raw) return raw;
  }
  return undefined;
};

const getUserRecord = (
  raw: Record<string, unknown>,
): Record<string, unknown> | undefined =>
  asRecord(raw.userId) || asRecord(raw.user) || asRecord(raw.account);

const getProfileRecord = (
  raw: Record<string, unknown>,
  user?: Record<string, unknown>,
): Record<string, unknown> | undefined =>
  asRecord(raw.profile) || asRecord(raw.userProfile) || asRecord(user?.profile);

const normalizeRecruiter = (raw: Record<string, unknown>): Recruiter => {
  const user = getUserRecord(raw);
  const profile = getProfileRecord(raw, user);
  const contactInfo = asRecord(raw.contactInfo);
  const userContactInfo = asRecord(user?.contactInfo);
  const profileContactInfo = asRecord(profile?.contactInfo);

  return {
    _id: readString(raw._id, raw.id),
    fullName:
      readString(raw.fullName, raw.fullname, raw.name, user?.fullName, profile?.fullName) ||
      "-",
    email:
      readString(
        raw.email,
        contactInfo?.email,
        user?.email,
        userContactInfo?.email,
        profile?.email,
        profileContactInfo?.email,
      ) || "-",
    phone: readString(
      raw.phone,
      contactInfo?.phone,
      user?.phone,
      userContactInfo?.phone,
      profile?.phone,
      profileContactInfo?.phone,
    ),
    linkedinUrl: readString(
      raw.linkedinUrl,
      contactInfo?.linkedinUrl,
      user?.linkedinUrl,
      userContactInfo?.linkedinUrl,
      profile?.linkedinUrl,
      profileContactInfo?.linkedinUrl,
    ),
    githubUrl: readString(
      raw.githubUrl,
      contactInfo?.githubUrl,
      user?.githubUrl,
      userContactInfo?.githubUrl,
      profile?.githubUrl,
      profileContactInfo?.githubUrl,
    ),
    facebookUrl: readString(
      raw.facebookUrl,
      contactInfo?.facebookUrl,
      user?.facebookUrl,
      userContactInfo?.facebookUrl,
      profile?.facebookUrl,
      profileContactInfo?.facebookUrl,
    ),
    role: readString(
      raw.membershipRole,
      raw.role,
      user?.membershipRole,
      user?.role,
      profile?.membershipRole,
      profile?.role,
    ) || "recruiter",
    status: raw.status === "inactive" ? "inactive" : "active",
    avatarUrl: readString(raw.avatarUrl, raw.avatar, user?.avatarUrl, profile?.avatarUrl),
    gender: readString(user?.gender, profile?.gender, raw.gender),
    dateOfBirth: readDateString(
      user?.dateOfBirth,
      user?.birthDate,
      user?.dob,
      profile?.dateOfBirth,
      profile?.birthDate,
      profile?.dob,
      raw.dateOfBirth,
      raw.birthDate,
      raw.dob,
    ),
    jobTitle: readString(raw.jobTitle, user?.jobTitle, profile?.jobTitle),
    membershipRole: readString(
      raw.membershipRole,
      user?.membershipRole,
      profile?.membershipRole,
    ),
    createdAt: readString(raw.createdAt) || "-",
  };
};

const extractRecruiters = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    if (Array.isArray(obj.recruiters))
      return obj.recruiters as Record<string, unknown>[];
    if (Array.isArray(obj.members))
      return obj.members as Record<string, unknown>[];
    const data = asRecord(obj.data);
    if (Array.isArray(data?.members))
      return data.members as Record<string, unknown>[];
    if (Array.isArray(data?.recruiters))
      return data.recruiters as Record<string, unknown>[];
    if (Array.isArray(data?.items))
      return data.items as Record<string, unknown>[];
  }
  return [];
};

export default function RecruiterManagementPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const topbarRecruiter = useCurrentRecruiter();
  const recruiterActivity = useRecruiterActivity();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadRecruiters = useCallback(
    async (sort: "newest" | "oldest" = "newest") => {
      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ sort, limit: "100" });
        const response = await fetch(buildApiUrl(`/api/company-members?${params.toString()}`), {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(
            await getResponseErrorMessage(
              response,
              "Không thể tải danh sách recruiter.",
            ),
          );
        }
        const payload = await readJsonResponse(response);
        setRecruiters(extractRecruiters(payload).map(normalizeRecruiter));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải danh sách recruiter.",
        );
        setRecruiters([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRecruiters();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadRecruiters]);

  const filteredRecruiters = useMemo(() => {
    if (!searchQuery.trim()) return recruiters;
    const q = searchQuery.toLowerCase();
    return recruiters.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        (r.phone && r.phone.includes(q)),
    );
  }, [recruiters, searchQuery]);

  const handleCreateRecruiter = useCallback(
    async (payload: CreateRecruiterPayload) => {
      const response = await fetch(
        buildApiUrl("/api/company-members/create-member"),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Tao recruiter that bai."),
        );
      }
      await loadRecruiters();
    },
    [loadRecruiters],
  );

  const handleUpdateRecruiter = useCallback(
    async (payload: UpdateProfilePayload) => {
      const response = await fetch(
        buildApiUrl("/api/company-members/profile"),
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(
            response,
            "Cap nhat recruiter that bai.",
          ),
        );
      }
      await loadRecruiters();
    },
    [loadRecruiters],
  );

  const handleDeleteRecruiter = useCallback(
    async (id: string) => {
      const response = await fetch(
        buildApiUrl(`/api/company-members/${encodeURIComponent(id)}`),
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );
      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Xoa recruiter that bai."),
        );
      }
      await loadRecruiters();
    },
    [loadRecruiters],
  );

  return (
    <div className="rd-layout">
      <RecruiterSidebar activeItem="employees" />

      <div className="rd-body">
        <div className="rd-content-area">
          <RecruiterTopBar
            recruiter={topbarRecruiter}
            company={null}
            notificationCount={recruiterActivity.notificationCount}
            isActivityPanelOpen={recruiterActivity.isActivityPanelOpen}
            onToggleActivityPanel={recruiterActivity.toggleActivityPanel}
          />

          <div className="rd-main">
            <div className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 lg:px-6">
                <TopHeader
                  onCreateRecruiter={handleCreateRecruiter}
                  onSearchChange={setSearchQuery}
                />
              </div>
              {error ? (
                <p className="border-b border-slate-100 px-5 py-4 text-sm text-red-500 lg:px-6">
                  {error}
                </p>
              ) : null}
              {!error ? (
                <div className="px-5 py-5 lg:px-6">
                  <RecruiterTable
                    recruiters={filteredRecruiters}
                    isLoading={isLoading}
                    onUpdateRecruiter={handleUpdateRecruiter}
                    onDeleteRecruiter={handleDeleteRecruiter}
                  />
                </div>
              ) : null}
              <div className="border-t border-slate-100 px-5 py-4 lg:px-6">
                <p className="text-sm text-slate-500">
                  Hiển thị {filteredRecruiters.length} nhân viên
                </p>
              </div>
            </div>
          </div>
        </div>

        {recruiterActivity.isActivityPanelOpen ? (
          <ActivityPanel
            notifications={recruiterActivity.notifications}
            upcomingInterviews={recruiterActivity.upcomingInterviews}
            isLoading={recruiterActivity.isActivityLoading}
            error={recruiterActivity.activityError}
            unreadCount={recruiterActivity.unreadNotificationCount}
            onMarkAllAsRead={recruiterActivity.markAllNotificationsAsRead}
            onClose={recruiterActivity.closeActivityPanel}
          />
        ) : null}
      </div>
    </div>
  );
}
