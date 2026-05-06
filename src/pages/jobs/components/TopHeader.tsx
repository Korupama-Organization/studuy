import { useState } from "react";
import FilterModal from "./FilterModal";

export default function TopHeader() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilter = (filters: any) => {
    console.log("Applied filters:", filters);
  };

  return (
    <>
      <header className="flex flex-col gap-3">
      <div className="flex items-center justify-end gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm hover:bg-slate-50 transition"
          type="button">
          <span className="material-symbols-outlined text-[18px]">
            notifications
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
          <img
            alt="User avatar"
            className="h-8 w-8 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&w=80&h=80"
          />
          <div>
            <p className="text-xs font-semibold text-slate-900">Evan Yates</p>
            <p className="text-[10px] text-slate-400">HR Manager</p>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-11 w-full items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_10px_24px_rgba(109,120,196,0.12)] lg:max-w-[440px]">
          <input
            className="w-full border-none bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
            placeholder="Search here..."
            type="text"
          />
          <span className="material-symbols-outlined text-slate-400">
            search
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex h-11 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
            type="button">
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
          <button
            className="flex h-11 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            type="button">
            Newest
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
          <button
            className="h-11 rounded-2xl bg-[#F758B1] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(247,88,177,0.35)] hover:bg-[#E73D9F] transition"
            type="button">
            + New
          </button>
        </div>
      </div>
    </header>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
      />
    </>
  );
}
