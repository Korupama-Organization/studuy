import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../jobs/components/Sidebar";
import RecruiterTable from "./RecruiterTable";
import TopHeader from "./TopHeader";

export interface Recruiter {
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "inactive";
  avatarUrl?: string;
  createdAt: string;
}

export interface CreateRecruiterPayload {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "inactive";
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
  "http://localhost:3000";

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

const getResponseErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
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

const normalizeRecruiter = (raw: Record<string, unknown>): Recruiter => ({
  _id:
    typeof raw._id === "string"
      ? raw._id
      : typeof raw.id === "string"
        ? raw.id
        : undefined,
  fullName:
    typeof raw.fullName === "string"
      ? raw.fullName
      : typeof raw.fullname === "string"
        ? raw.fullname
        : typeof raw.name === "string"
          ? raw.name
          : "-",
  email: typeof raw.email === "string" ? raw.email : "-",
  phone: typeof raw.phone === "string" ? raw.phone : undefined,
  role: typeof raw.role === "string" ? raw.role : "recruiter",
  status: raw.status === "inactive" ? "inactive" : "active",
  avatarUrl:
    typeof raw.avatarUrl === "string"
      ? raw.avatarUrl
      : typeof raw.avatar === "string"
        ? raw.avatar
        : undefined,
  createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "-",
});

const extractRecruiters = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    if (Array.isArray(obj.recruiters))
      return obj.recruiters as Record<string, unknown>[];
    if (Array.isArray(obj.members))
      return obj.members as Record<string, unknown>[];
  }
  return [];
};

export default function RecruiterManagementPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadRecruiters = useCallback(
    async (sort: "newest" | "oldest" = "newest") => {
      setIsLoading(true);
      setError("");
      try {
        const url = new URL(`${API_BASE_URL}/api/company-members`);
        url.searchParams.set("sort", sort);
        url.searchParams.set("limit", "100");
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const payload = (await response.json()) as unknown;
        if (!response.ok) {
          throw new Error("Khong the tai danh sach recruiter.");
        }
        setRecruiters(extractRecruiters(payload).map(normalizeRecruiter));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Khong the tai danh sach recruiter.",
        );
        setRecruiters([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadRecruiters();
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
      const response = await fetch(`${API_BASE_URL}/api/company-members`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
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
    async (id: string, payload: CreateRecruiterPayload) => {
      const response = await fetch(
        `${API_BASE_URL}/api/company-members/${encodeURIComponent(id)}`,
        {
          method: "PUT",
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
        `${API_BASE_URL}/api/company-members/${encodeURIComponent(id)}`,
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
    <div className="min-h-dvh bg-[#F4F6FB] text-slate-900 font-['Inter']">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#E8E9FF] blur-[90px]"></div>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#EDEEFF] blur-[120px]"></div>
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1280px] gap-5 px-4 py-6 lg:px-6">
        <Sidebar />

        <main className="flex flex-1 flex-col gap-6">
          <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
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
        </main>
      </div>
    </div>
  );
}
