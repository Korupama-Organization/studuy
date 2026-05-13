import { useEffect, useState } from "react";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import type { Recruiter, UpdateProfilePayload } from "./Index";

interface UpdateRecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruiter?: Recruiter;
  onUpdate: (payload: UpdateProfilePayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const GENDER_OPTIONS = ["Nam", "Nữ", "Khác"];

const formatDateInputValue = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.includes("T") ? trimmed.split("T")[0] : trimmed;
};

const makeInitialForm = (r?: Recruiter): UpdateProfilePayload => ({
  fullName: r?.fullName || "",
  phone: r?.phone || "",
  linkedinUrl: r?.linkedinUrl || "",
  githubUrl: r?.githubUrl || "",
  facebookUrl: r?.facebookUrl || "",
  avatarUrl: r?.avatarUrl || "",
  gender: r?.gender || "",
  dateOfBirth: formatDateInputValue(r?.dateOfBirth),
  jobTitle: r?.jobTitle || "",
  membershipRole: r?.membershipRole || "",
});

export default function UpdateRecruiterModal({
  isOpen,
  onClose,
  recruiter,
  onUpdate,
  onDelete,
}: UpdateRecruiterModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<UpdateProfilePayload>(
    makeInitialForm(recruiter),
  );

  useEffect(() => {
    setFormData(makeInitialForm(recruiter));
    setError("");
  }, [recruiter]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recruiter) return;

    setError("");
    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Cap nhat recruiter that bai.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!recruiter || !recruiter._id) return;

    setError("");
    setIsSubmitting(true);
    try {
      await onDelete(recruiter._id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Xoa recruiter that bai.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !recruiter) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">Update Profile</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
              disabled={isSubmitting}>
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6 p-6">
            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <div className="mb-4 border-b border-slate-100 pb-4">
              <p className="text-sm font-semibold text-slate-500">Editing</p>
              <p className="text-base font-bold text-slate-900">
                {recruiter.fullName}
              </p>
              <p className="text-sm text-slate-500">{recruiter.email}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Email
              </label>
              <input
                type="email"
                value={recruiter.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none">
                  <option value="">--</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Avatar URL
              </label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Membership Role
                </label>
                <input
                  type="text"
                  name="membershipRole"
                  value={formData.membershipRole || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                LinkedIn URL
              </label>
              <input
                type="text"
                name="linkedinUrl"
                value={formData.linkedinUrl || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                GitHub URL
              </label>
              <input
                type="text"
                name="githubUrl"
                value={formData.githubUrl || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Facebook URL
              </label>
              <input
                type="text"
                name="facebookUrl"
                value={formData.facebookUrl || ""}
                onChange={handleChange}
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
                {isSubmitting ? "Updating..." : "Update Profile"}
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
