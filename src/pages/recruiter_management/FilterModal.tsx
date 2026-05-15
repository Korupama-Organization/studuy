import { useState } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const statusOptions = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

const roleOptions = [
  { value: "recruiter", label: "Tuyển dụng" },
  { value: "hr_manager", label: "Quản lý nhân sự" },
  { value: "admin", label: "Quản trị" },
  { value: "interviewer", label: "Người phỏng vấn" },
];

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleClear = () => {
    setSelectedStatuses([]);
    setSelectedRoles([]);
  };

  const handleApply = () => {
    console.log("Filters:", { status: selectedStatuses, role: selectedRoles });
    onApply();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Bộ lọc</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-500">Trạng thái</h3>
            <div className="space-y-3">
              {statusOptions.map((status) => (
                <div
                  key={status.value}
                  onClick={() => toggleStatus(status.value)}
                  className="flex cursor-pointer items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                      selectedStatuses.includes(status.value)
                        ? "border-[#5B5BF6] bg-[#5B5BF6]"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                    {selectedStatuses.includes(status.value) && (
                      <span className="text-[12px] text-white">&#10003;</span>
                    )}
                  </div>
                  <span className="text-sm capitalize text-slate-700">{status.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-500">Vai trò</h3>
            <div className="space-y-3">
              {roleOptions.map((role) => (
                <div
                  key={role.value}
                  onClick={() => toggleRole(role.value)}
                  className="flex cursor-pointer items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                      selectedRoles.includes(role.value)
                        ? "border-[#5B5BF6] bg-[#5B5BF6]"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                    {selectedRoles.includes(role.value) && (
                      <span className="text-[12px] text-white">&#10003;</span>
                    )}
                  </div>
                  <span className="text-sm capitalize text-slate-700">{role.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClear}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Xóa bộ lọc
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-2xl bg-[#5B5BF6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(91,91,246,0.3)] transition hover:bg-[#4A4AE6]">
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
