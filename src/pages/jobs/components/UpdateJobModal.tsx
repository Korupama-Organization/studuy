import { useState } from "react";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface UpdateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: {
    id: string;
    title: string;
    salary: string;
    createdAt: string;
    createdBy: string;
    status: string;
  };
}

export default function UpdateJobModal({ isOpen, onClose, job }: UpdateJobModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: job?.title || "",
    jobDescription: "",
    shortDescription: "",
    salary: job?.salary || "",
    client: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Job updated:", formData);
    onClose();
  };

  const handleDeleteConfirm = () => {
    console.log("Job deleted:", job?.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen || !job) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">Update</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6 p-6">
            <p className="text-sm text-slate-500">
              Aliquam nostrum excepteur et voluptate est consectetur lorem, in a cuss aspersies et cum
              dignissimos colegues voluptate expetis. Maxime tempore scena U - Possant autem pundem placstat
            </p>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="Middle Back End Developer (Java)"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Job description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                rows={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Middle Back End Developer (Java)"
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
                  required
                />
                <button
                  type="button"
                  className="absolute bottom-2.5 right-2.5 flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  AI Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Salary
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="1000 - 2000 USD"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Client (Optional)
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                placeholder="FPT Company (hpticlient@gmail.com)"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-2xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600">
                Delete
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-[#5B5BF6] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(91,91,246,0.3)] transition hover:bg-[#4A4AE6]">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
