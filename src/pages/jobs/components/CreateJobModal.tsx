import { useState } from "react";
import SuccessDialog from "./SuccessDialog";
import type { SaveJobPayload } from "../Index";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: SaveJobPayload) => Promise<void>;
}

interface SelectOption {
  value: string;
  label: string;
}

const WORK_MODEL_OPTIONS: SelectOption[] = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

const LEVEL_OPTIONS: SelectOption[] = [
  { value: "intern", label: "Intern" },
  { value: "fresher", label: "Fresher" },
  { value: "junior", label: "Junior" },
  { value: "middle", label: "Middle" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
];

const JOB_TYPE_OPTIONS: SelectOption[] = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

const ROLE_TYPE_OPTIONS: SelectOption[] = [
  { value: "backend", label: "Backend" },
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "mobile", label: "Mobile" },
  { value: "devops", label: "DevOps" },
  { value: "data", label: "Data" },
  { value: "design", label: "Design" },
  { value: "qa", label: "QA" },
  { value: "pm", label: "PM" },
  { value: "ba", label: "BA" },
];

const emptyForm: SaveJobPayload = {
  jobTitle: "",
  jobDescription: "",
  shortDescription: "",
  location: "",
  requiredEducation: "",
  salary: "",
  client: "",
  workModel: "",
  level: "",
  jobType: "",
  headcount: 1,
  roleType: "",
  minMonthsExperience: 0,
};

export default function CreateJobModal({ isOpen, onClose, onCreate }: CreateJobModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SaveJobPayload>(emptyForm);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onCreate(formData);
      setShowSuccess(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Tao job that bai.");
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
    if (isSubmitting) {
      return;
    }

    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={handleClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">Create Job</h2>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
              disabled={isSubmitting}>
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                placeholder="Frontend Developer"
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
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="TP.HCM"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Required Education
              </label>
              <textarea
                name="requiredEducation"
                value={formData.requiredEducation}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Work Model</label>
                <select
                  name="workModel"
                  value={formData.workModel}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none">
                  <option value="">Select work model</option>
                  {WORK_MODEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none">
                  <option value="">Select level</option>
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none">
                  <option value="">Select job type</option>
                  {JOB_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Role Type</label>
                <select
                  name="roleType"
                  value={formData.roleType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none">
                  <option value="">Select role type</option>
                  {ROLE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Headcount</label>
                <input
                  type="number"
                  name="headcount"
                  value={formData.headcount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFormData((prev) => ({
                      ...prev,
                      headcount: isNaN(val) ? 0 : val,
                    }));
                  }}
                  min={1}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Min Experience (months)
                </label>
                <input
                  type="number"
                  name="minMonthsExperience"
                  value={formData.minMonthsExperience}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFormData((prev) => ({
                      ...prev,
                      minMonthsExperience: isNaN(val) ? 0 : val,
                    }));
                  }}
                  min={0}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 1000-1500 USD"
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
                  placeholder="Client name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                />
              </div>
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessDialog isOpen={showSuccess} onClose={handleCloseSuccess} />
    </>
  );
}
