import { useState } from "react";
import SuccessDialog from "../jobs/components/SuccessDialog";
import type { CreateRecruiterPayload } from "./Index";

interface CreateRecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateRecruiterPayload) => Promise<void>;
}

const emptyForm: CreateRecruiterPayload = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  linkedinUrl: "",
  githubUrl: "",
  facebookUrl: "",
  avatarUrl: "",
  gender: "",
  dateOfBirth: "",
  jobTitle: "",
  membershipRole: "",
};

const GENDER_OPTIONS = ["Nam", "Nữ", "Khác"];

export default function CreateRecruiterModal({
  isOpen,
  onClose,
  onCreate,
}: CreateRecruiterModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState<CreateRecruiterPayload>(emptyForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onCreate(formData);
      setShowSuccess(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Tao recruiter that bai.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setFormData(emptyForm);
    onClose();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setError("");
    setFormData(emptyForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={handleClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">Create Member</h2>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
              disabled={isSubmitting}>
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyen Van A"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a temporary password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }>
                  <span className="material-symbols-outlined text-[20px]">
                    {isPasswordVisible ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
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
                placeholder="+84 123 456 789"
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
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
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
                placeholder="https://example.com/avatar.jpg"
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
                  placeholder="Senior Recruiter"
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
                  placeholder="recruiter"
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
                placeholder="https://linkedin.com/in/recruiter"
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
                placeholder="https://github.com/recruiter"
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
                placeholder="https://facebook.com/recruiter"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-[#5B5BF6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(91,91,246,0.3)] transition hover:bg-[#4A4AE6] disabled:opacity-50"
                disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Member"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessDialog isOpen={showSuccess} onClose={handleCloseSuccess} />
    </>
  );
}
