import { useState } from "react";
import CreateRecruiterModal from "./CreateRecruiterModal";
import type { CreateRecruiterPayload } from "./Index";

interface TopHeaderProps {
  onCreateRecruiter: (payload: CreateRecruiterPayload) => Promise<void>;
  onSearchChange: (query: string) => void;
}

export default function TopHeader({
  onCreateRecruiter,
  onSearchChange,
}: TopHeaderProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-11 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:max-w-[360px]">
          <span className="material-symbols-outlined text-slate-400">
            search
          </span>
          <input
            className="w-full border-none bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
            placeholder="Tìm kiếm nhân viên..."
            type="text"
            value={searchValue}
            onChange={handleSearchInput}
          />
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="h-11 rounded-2xl bg-[#5B5BF6] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,91,246,0.35)] transition hover:bg-[#4A4AE6]"
          type="button">
          + Thêm nhân viên
        </button>
      </div>

      <CreateRecruiterModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={onCreateRecruiter}
      />
    </>
  );
}
