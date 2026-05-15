import { useEffect, useState } from "react";
import FilterModal from "./FilterModal";
import CreateJobModal from "./CreateJobModal";
import type { SaveJobPayload } from "../Index";

interface TopHeaderProps {
  onCreateJob: (payload: SaveJobPayload) => Promise<void>;
  onSortChange: (sort: "newest" | "oldest") => void;
}

export default function TopHeader({ onCreateJob, onSortChange }: TopHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentUser, setCurrentUser] = useState<
    { fullName?: string; avatarUrl?: string; role?: string } | null
  >(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(
          JSON.parse(storedUser) as {
            fullName?: string;
            avatarUrl?: string;
            role?: string;
          },
        );
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const handleApplyFilter = (filters: unknown) => {
    console.log("Bộ lọc đã áp dụng:", filters);
  };

  const handleSortChange = (option: "newest" | "oldest") => {
    setSortBy(option);
    onSortChange(option);
    setIsSortOpen(false);
  };

  const displayName = currentUser?.fullName || "Nguyễn Văn A";
  const displayRole = currentUser?.role || "Quản lý nhân sự";

  const renderAvatar = () => {
    if (currentUser?.avatarUrl) {
      return (
        <img
          alt="Ảnh đại diện người dùng"
          className="h-8 w-8 rounded-full object-cover"
          src={currentUser.avatarUrl}
        />
      );
    }

    const initial = displayName.trim().charAt(0).toUpperCase() || "U";
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8EAFF] text-xs font-bold text-[#3f4cf7]">
        {initial}
      </div>
    );
  };

  return (
    <>
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-end gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm hover:bg-slate-50 transition"
            type="button">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
            {renderAvatar()}
            <div>
              <p className="text-xs font-semibold text-slate-900">{displayName}</p>
              <p className="text-[10px] text-slate-400">{displayRole}</p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-11 w-full items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_10px_24px_rgba(109,120,196,0.12)] lg:max-w-[440px]">
            <input
              className="w-full border-none bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
              placeholder="Tìm kiếm tại đây..."
              type="text"
            />
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex h-11 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
              type="button">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex h-11 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                type="button">
                {sortBy === "newest" ? "Mới nhất" : "Cũ nhất"}
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              {isSortOpen && (
                <div className="absolute right-0 top-12 z-40 w-48 rounded-2xl border border-slate-100 bg-white shadow-lg">
                  <button
                    onClick={() => handleSortChange("newest")}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold transition ${
                      sortBy === "newest"
                        ? "bg-[#EEF0FF] text-[#5B5BF6]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                    <span className="material-symbols-outlined text-[16px]">
                      {sortBy === "newest" ? "check" : ""}
                    </span>
                    Mới nhất
                  </button>
                  <button
                    onClick={() => handleSortChange("oldest")}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold transition ${
                      sortBy === "oldest"
                        ? "bg-[#EEF0FF] text-[#5B5BF6]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                    <span className="material-symbols-outlined text-[16px]">
                      {sortBy === "oldest" ? "check" : ""}
                    </span>
                    Cũ nhất
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCreateJobOpen(true)}
              className="h-11 rounded-2xl bg-[#F758B1] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(247,88,177,0.35)] hover:bg-[#E73D9F] transition"
              type="button">
              + Mới
            </button>
          </div>
        </div>
      </header>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
      />

      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onCreate={onCreateJob}
      />
    </>
  );
}
