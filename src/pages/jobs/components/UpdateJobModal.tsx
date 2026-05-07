import { useEffect, useState } from "react";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import type { SaveJobPayload } from "../Index";

interface JobRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  locations: string[];
  workModel: string;
  level: string;
  jobType: string;
  headcount: number;
  roleType: string;
  requiredEducation: string;
  minMonthsExperience: number;
  createdAt: string;
  createdBy: string;
  status: string;
}

interface UpdateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: JobRow;
  onUpdate: (id: string, payload: SaveJobPayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const makeInitialForm = (job?: JobRow): SaveJobPayload => ({
  jobTitle: job?.title || "",
  jobDescription: job?.summary || "",
  shortDescription: job?.summary || "",
  location: job?.locations?.join(", ") || "",
  requiredEducation: job?.requiredEducation || "",
});

export default function UpdateJobModal({ isOpen, onClose, job, onUpdate, onDelete }: UpdateJobModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SaveJobPayload>(makeInitialForm(job));

  useEffect(() => {
    setFormData(makeInitialForm(job));
    setError("");
  }, [job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!job) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onUpdate(job.id, formData);
      onClose();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Cap nhat job that bai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!job) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onDelete(job.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Xoa job that bai.");
    } finally {
      setIsSubmitting(false);
    }
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
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
              disabled={isSubmitting}>
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6 p-6">
            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
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
                rows={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary || ""}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Client (Optional)</label>
              <input
                type="text"
                name="client"
                value={formData.client || ""}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-2xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                disabled={isSubmitting}>
                Delete
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-[#5B5BF6] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(91,91,246,0.3)] transition hover:bg-[#4A4AE6] disabled:opacity-50"
                disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
      />
    </>
  );
}
