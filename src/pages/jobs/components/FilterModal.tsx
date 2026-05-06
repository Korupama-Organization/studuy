import { useState } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

interface FilterState {
  createdBy: string[];
  status: string[];
}

const createdByOptions = [
  { id: "oscar1", name: "Oscar Holloway", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&w=80&h=80" },
  { id: "oscar2", name: "Oscar Holloway", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&w=80&h=80" },
  { id: "oscar3", name: "Oscar Holloway", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&w=80&h=80" },
];

const statusOptions = ["Opening", "Closed"];

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    createdBy: ["oscar1"],
    status: ["Opening"],
  });
  const [showMoreCreatedBy, setShowMoreCreatedBy] = useState(false);

  const handleCreatedByChange = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      createdBy: prev.createdBy.includes(id)
        ? prev.createdBy.filter((item) => item !== id)
        : [...prev.createdBy, id],
    }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((item) => item !== status)
        : [...prev.status, status],
    }));
  };

  const handleClearFilter = () => {
    setFilters({
      createdBy: [],
      status: [],
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-500">Created By</h3>
            <div className="space-y-3">
              {createdByOptions
                .slice(0, showMoreCreatedBy ? createdByOptions.length : 3)
                .map((person) => (
                  <div key={person.id} onClick={() => handleCreatedByChange(person.id)} className="flex cursor-pointer items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                        filters.createdBy.includes(person.id)
                          ? "border-[#5B5BF6] bg-[#5B5BF6]"
                          : "border-slate-300 hover:border-slate-400"
                      }`}>
                      {filters.createdBy.includes(person.id) && (
                        <span className="text-white text-[12px]">✓</span>
                      )}
                    </div>
                    <img
                      alt={person.name}
                      className="h-6 w-6 rounded-full object-cover"
                      src={person.avatar}
                    />
                    <span className="text-sm text-slate-700">{person.name}</span>
                  </div>
                ))}
            </div>
            {createdByOptions.length > 3 && (
              <button
                onClick={() => setShowMoreCreatedBy(!showMoreCreatedBy)}
                className="mt-2 text-sm font-semibold text-[#5B5BF6] hover:underline">
                View more <span className="material-symbols-outlined inline text-[14px]">{showMoreCreatedBy ? "expand_less" : "expand_more"}</span>
              </button>
            )}
          </div>

          <div className="pt-2">
            <h3 className="mb-3 text-sm font-semibold text-slate-500">Status</h3>
            <div className="space-y-3">
              {statusOptions.map((status) => (
                <div key={status} onClick={() => handleStatusChange(status)} className="flex cursor-pointer items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                      filters.status.includes(status)
                        ? "border-[#5B5BF6] bg-[#5B5BF6]"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                    {filters.status.includes(status) && (
                      <span className="text-white text-[12px]">✓</span>
                    )}
                  </div>
                  <span className="text-sm text-slate-700">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClearFilter}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Clear Filter
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-2xl bg-[#5B5BF6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(91,91,246,0.3)] transition hover:bg-[#4A4AE6]">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
