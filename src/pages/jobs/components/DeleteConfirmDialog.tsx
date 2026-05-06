interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm }: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Delete this job?</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          <svg
            className="h-40 w-40"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            {/* Background */}
            <rect x="20" y="40" width="160" height="120" rx="20" fill="#E3F2FD" opacity="0.6" />

            {/* Left plant */}
            <circle cx="45" cy="130" r="8" fill="#90CAF9" />
            <line x1="45" y1="130" x2="45" y2="100" stroke="#90CAF9" strokeWidth="2" />
            <circle cx="35" cy="115" r="6" fill="#64B5F6" />
            <circle cx="55" cy="115" r="6" fill="#64B5F6" />
            <circle cx="30" cy="100" r="5" fill="#42A5F5" />
            <circle cx="60" cy="100" r="5" fill="#42A5F5" />

            {/* Person */}
            <circle cx="100" cy="60" r="16" fill="#FFB74D" />
            <ellipse cx="100" cy="95" rx="18" ry="22" fill="#FFB74D" />
            <rect x="82" y="105" width="36" height="25" rx="3" fill="#1976D2" />
            <rect x="86" y="70" width="10" height="30" fill="#FFEB3B" />
            <rect x="104" y="70" width="10" height="30" fill="#FFEB3B" />

            {/* Right plant */}
            <circle cx="155" cy="130" r="8" fill="#90CAF9" />
            <line x1="155" y1="130" x2="155" y2="100" stroke="#90CAF9" strokeWidth="2" />
            <circle x1="155" y1="130" x2="155" y2="100" r="5" fill="#64B5F6" />
            <circle cx="145" cy="110" r="6" fill="#64B5F6" />
            <circle cx="165" cy="110" r="6" fill="#64B5F6" />
            <circle cx="155" cy="90" r="5" fill="#42A5F5" />

            {/* Decorative elements */}
            <line x1="50" y1="50" x2="70" y2="45" stroke="#FFEB3B" strokeWidth="2" strokeLinecap="round" />
            <line x1="150" y1="55" x2="170" y2="50" stroke="#FFEB3B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <p className="text-center text-slate-600 mb-6 text-sm">
          Are you sure you want to delete this job? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
