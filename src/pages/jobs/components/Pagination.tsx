import { useState } from "react";

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(3);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <button
        className="flex items-center justify-center gap-2 rounded-2xl bg-[#5B5BF6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,91,246,0.35)] hover:bg-[#4A4AE6] transition disabled:opacity-50"
        type="button"
        disabled={currentPage === 1}>
        <span className="material-symbols-outlined text-[18px]">
          chevron_left
        </span>
        Previous
      </button>
      <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
        {["1", "2", "3", "4"].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(Number(page))}
            className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${
              currentPage === Number(page)
                ? "bg-[#5B5BF6] text-white shadow-[0_4px_12px_rgba(91,91,246,0.3)]"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            type="button">
            {page}
          </button>
        ))}
      </div>
      <button
        className="flex items-center justify-center gap-2 rounded-2xl bg-[#5B5BF6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,91,246,0.35)] hover:bg-[#4A4AE6] transition disabled:opacity-50"
        type="button"
        disabled={currentPage === 4}>
        Next
        <span className="material-symbols-outlined text-[18px]">
          chevron_right
        </span>
      </button>
    </div>
  );
}
