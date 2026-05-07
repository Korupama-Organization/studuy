interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-end">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          onClick={handlePrevious}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#5B5BF6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,91,246,0.35)] hover:bg-[#4A4AE6] transition disabled:opacity-50"
          type="button"
          disabled={currentPage === 1}>
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          Previous
        </button>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
          {Array.from({ length: totalPages }, (_, i) => String(i + 1)).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
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
          onClick={handleNext}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#5B5BF6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,91,246,0.35)] hover:bg-[#4A4AE6] transition disabled:opacity-50"
          type="button"
          disabled={currentPage === totalPages}>
          Next
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
