interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessDialog({ isOpen, onClose }: SuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Job created successfully!
          </h2>
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
            <circle cx="100" cy="100" r="90" fill="#E8ECFF" opacity="0.5" />

            {/* Clipboard */}
            <rect
              x="50"
              y="60"
              width="45"
              height="70"
              rx="4"
              fill="#7FA3F0"
              opacity="0.8"
            />
            <rect x="55" y="65" width="35" height="5" fill="#5B5BF6" />
            <rect x="55" y="75" width="35" height="3" fill="#B0B9FF" />
            <rect x="55" y="82" width="35" height="3" fill="#B0B9FF" />
            <rect x="55" y="89" width="35" height="3" fill="#B0B9FF" />
            <circle cx="45" cy="50" r="4" fill="#5B5BF6" />
            <line
              x1="45"
              y1="54"
              x2="45"
              y2="65"
              stroke="#5B5BF6"
              strokeWidth="2"
            />

            {/* Person */}
            <circle cx="100" cy="45" r="12" fill="#FFB84D" />
            <ellipse cx="100" cy="80" rx="15" ry="20" fill="#FFB84D" />
            <rect x="85" y="90" width="30" height="20" rx="2" fill="#FDB22F" />
            <rect x="88" y="55" width="8" height="25" fill="#FFFFFF" />
            <rect x="104" y="55" width="8" height="25" fill="#FFFFFF" />

            {/* Document */}
            <rect x="110" y="60" width="45" height="70" rx="4" fill="#B0C4FF" />
            <line
              x1="115"
              y1="70"
              x2="150"
              y2="70"
              stroke="#5B5BF6"
              strokeWidth="2"
            />
            <line
              x1="115"
              y1="80"
              x2="150"
              y2="80"
              stroke="#B0B9FF"
              strokeWidth="1.5"
            />
            <line
              x1="115"
              y1="88"
              x2="140"
              y2="88"
              stroke="#B0B9FF"
              strokeWidth="1.5"
            />

            {/* Checkmark */}
            <circle cx="130" cy="50" r="10" fill="#4ADE80" />
            <path
              d="M125 50 L128 53 L135 46"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Decorative elements */}
            <circle cx="70" cy="35" r="2" fill="#FFB84D" />
            <circle cx="130" cy="140" r="2" fill="#7FA3F0" />
            <circle cx="60" cy="130" r="1.5" fill="#5B5BF6" />
          </svg>
        </div>

        <p className="text-center text-slate-600 mb-6 text-sm">
          The job has been created successfully. You can now share it on social
          media platforms.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Close
          </button>
          <button className="flex-1 rounded-2xl bg-[#5B5BF6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(91,91,246,0.3)] transition hover:bg-[#4A4AE6]">
            Share Now
          </button>
        </div>
      </div>
    </div>
  );
}
