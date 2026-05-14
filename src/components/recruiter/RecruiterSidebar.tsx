import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../../services/auth";

export interface RecruiterSidebarItem {
  label: string;
  icon: string;
  path: string;
}

interface RecruiterSidebarCompany {
  name?: string;
  shortName?: string;
  logoUrl?: string | null;
}

interface RecruiterSidebarProps {
  items?: RecruiterSidebarItem[];
  company?: RecruiterSidebarCompany | null;
  activePath?: string;
  onLogout?: () => void;
  showSearch?: boolean;
  className?: string;
}

const defaultItems: RecruiterSidebarItem[] = [
  { label: "Bảng điều khiển", icon: "grid_view", path: "/recruiter/dashboard" },
  { label: "Nhân viên", icon: "badge", path: "/recruiter/management" },
  { label: "Thông tin công ty", icon: "business", path: "/recruiter/company" },
  { label: "Việc làm", icon: "work", path: "/recruiter/jobs" },
  { label: "Ứng viên", icon: "person_search", path: "/recruiter/candidates" },
];

const COMPANY_STORAGE_KEY = "recruiterCompany";

const API_BASE_URL =
  (
    import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");

const readCachedCompany = (): RecruiterSidebarCompany | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COMPANY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RecruiterSidebarCompany;
  } catch {
    return null;
  }
};

const cacheCompany = (companyData: RecruiterSidebarCompany) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(companyData));
  } catch {
    // ignore cache errors
  }
};

export default function RecruiterSidebar({
  items = defaultItems,
  company,
  activePath,
  onLogout,
  showSearch = true,
  className = "",
}: RecruiterSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<RecruiterSidebarCompany | null>(
    company ?? readCachedCompany(),
  );

  const hasCompanyProp = Boolean(company);

  useEffect(() => {
    if (company) {
      setCompanyData(company);
      cacheCompany(company);
    }
  }, [company]);

  useEffect(() => {
    if (hasCompanyProp || companyData || !API_BASE_URL) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) return;

    const controller = new AbortController();

    const fetchCompany = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/companies/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) return;

        const payload = (await response.json()) as Record<string, unknown>;
        const rawCompany =
          (payload.company as Record<string, unknown>) || payload;

        const nextCompany = {
          name: typeof rawCompany.name === "string" ? rawCompany.name : undefined,
          shortName:
            typeof rawCompany.shortName === "string" ? rawCompany.shortName : undefined,
          logoUrl:
            typeof rawCompany.logoUrl === "string" ? rawCompany.logoUrl : null,
        } satisfies RecruiterSidebarCompany;

        if (nextCompany.name || nextCompany.shortName || nextCompany.logoUrl) {
          setCompanyData(nextCompany);
          cacheCompany(nextCompany);
        }
      } catch {
        // ignore fetch errors
      }
    };

    void fetchCompany();

    return () => controller.abort();
  }, [companyData, hasCompanyProp]);

  const currentPath = activePath || location.pathname;

  const isActive = (path: string) => {
    if (!path) return false;
    if (path === "/") return currentPath === "/";
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    clearAuthSession();
    navigate("/login");
  };

  const brandName = companyData?.shortName || companyData?.name || "SEeds";
  const brandInitial = brandName.trim().charAt(0).toUpperCase() || "S";

  return (
    <aside
      className={`hidden w-[288px] flex-shrink-0 flex-col border-r border-[#e5e7eb] bg-white shadow-[0_8px_10px_-6px_rgba(229,231,235,0.5),0_20px_25px_-5px_rgba(229,231,235,0.5)] md:flex sticky top-0 h-dvh self-start ${className}`}
    >
      <div className="px-6 pt-8">
        <div className="mb-8 flex items-center gap-3">
          {companyData?.logoUrl ? (
            <img
              src={companyData.logoUrl}
              alt="Company logo"
              className="h-11 w-11 rounded-3xl object-cover shadow-[0_4px_6px_-4px_rgba(99,102,241,0.3),0_10px_15px_-3px_rgba(99,102,241,0.3)]"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[#6366f1] text-lg font-black text-white shadow-[0_4px_6px_-4px_rgba(99,102,241,0.3),0_10px_15px_-3px_rgba(99,102,241,0.3)]">
              {brandInitial}
            </div>
          )}
          <div>
            <p className="text-xl font-black tracking-[-0.6px] text-[#111827]">
              {brandName}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6366f1]">
              Doanh nghiệp
            </p>
          </div>
        </div>

        {showSearch ? (
          <div className="mb-8 flex h-11 items-center gap-3 rounded-[20px] bg-[rgba(243,244,246,0.6)] px-4">
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              search
            </span>
            <input
              className="w-full border-none bg-transparent text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none"
              placeholder="Tìm kiếm..."
              type="text"
            />
          </div>
        ) : null}

        <nav className="flex flex-col gap-2">
          {items.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#6366f1] text-white shadow-[0_4px_6px_-4px_rgba(99,102,241,0.2),0_10px_15px_-3px_rgba(99,102,241,0.2)]"
                    : "text-[#6b7280] hover:bg-slate-100"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-[rgba(229,231,235,0.5)] px-6 py-8">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-[20px] px-4 py-2 text-sm font-semibold text-[#6b7280] hover:bg-slate-100 transition"
        >
          <span className="material-symbols-outlined text-[20px]">
            settings
          </span>
          Cài đặt
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-[20px] px-4 py-2 text-sm font-semibold text-[#ef4444] hover:bg-red-50 transition"
        >
          <span className="material-symbols-outlined text-[20px]">
            logout
          </span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
