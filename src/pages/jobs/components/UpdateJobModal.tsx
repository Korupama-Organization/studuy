import { useEffect, useState } from "react";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import type { SaveJobPayload } from "../Index";

interface JobRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  shortDescription?: string;
  jobDescription?: string;
  locations: string[];
  workModel: string;
  level: string;
  jobType: string;
  headcount: number;
  roleType: string;
  requiredEducation: string;
  minMonthsExperience: number;
  skills: string[];
  salary?: string;
  client?: string;
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

interface SelectOption {
  value: string;
  label: string;
}

const WORK_MODEL_OPTIONS: SelectOption[] = [
  { value: "Remote", label: "Remote" },
  { value: "On-site", label: "On-site" },
  { value: "Hybrid", label: "Hybrid" },
];

const LEVEL_OPTIONS: SelectOption[] = [
  { value: "Intern", label: "Intern" },
  { value: "Fresher", label: "Fresher" },
  { value: "Junior", label: "Junior" },
  { value: "Middle", label: "Middle" },
  { value: "Senior", label: "Senior" },
  { value: "Lead", label: "Lead" },
  { value: "Manager", label: "Manager" },
];

const JOB_TYPE_OPTIONS: SelectOption[] = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Freelance", label: "Freelance" },
];

const ROLE_TYPE_OPTIONS: SelectOption[] = [
  { value: "Backend", label: "Backend" },
  { value: "Frontend", label: "Frontend" },
  { value: "Fullstack", label: "Fullstack" },
  { value: "Mobile", label: "Mobile" },
  { value: "DevOps", label: "DevOps" },
  { value: "Data", label: "Data" },
  { value: "Design", label: "Design" },
  { value: "QA", label: "QA" },
  { value: "PM", label: "PM" },
  { value: "BA", label: "BA" },
];

const makeInitialForm = (job?: JobRow): SaveJobPayload => ({
  jobTitle: job?.title || "",
  jobDescription: job?.jobDescription || job?.summary || "",
  shortDescription: job?.shortDescription || job?.summary || "",
  location: job?.locations?.join(", ") || "",
  requiredEducation: job?.requiredEducation || "",
  workModel: job?.workModel || "",
  level: job?.level || "",
  jobType: job?.jobType || "",
  headcount: job?.headcount || 1,
  roleType: job?.roleType || "",
  minMonthsExperience: job?.minMonthsExperience || 0,
  requiredSkills: job?.skills || [],
  preferredSkills: [],
  minGpa: 0,
  requiredLanguages: [],
  portfolioExpected: "",
});

const parseSkillsText = (value: string): string[] => {
  const uniqueSkills = new Set<string>();

  value.split(",").forEach((skill) => {
    const normalized = skill.trim().replace(/\s+/g, " ");
    if (normalized) {
      uniqueSkills.add(normalized);
    }
  });

  return [...uniqueSkills];
};

export default function UpdateJobModal({ isOpen, onClose, job, onUpdate, onDelete }: UpdateJobModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SaveJobPayload>(makeInitialForm(job));
  const [requiredSkillsText, setRequiredSkillsText] = useState(job?.skills?.join(", ") || "");
  const [preferredSkillsText, setPreferredSkillsText] = useState("");
  const [requiredLanguagesText, setRequiredLanguagesText] = useState("");

  useEffect(() => {
    setFormData(makeInitialForm(job));
    setRequiredSkillsText(job?.skills?.join(", ") || "");
    setPreferredSkillsText("");
    setRequiredLanguagesText("");
    setError("");
  }, [job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    const parsedRequiredSkills = parseSkillsText(requiredSkillsText);
    const parsedPreferredSkills = parseSkillsText(preferredSkillsText);
    const parsedRequiredLanguages = parseSkillsText(requiredLanguagesText);
    if (!parsedRequiredSkills.length) {
      setError("Vui lòng nhập ít nhất một skill.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdate(job.id, {
        ...formData,
        requiredSkills: parsedRequiredSkills,
        preferredSkills: parsedPreferredSkills,
        requiredLanguages: parsedRequiredLanguages,
      });
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Work Model <span className="text-red-500">*</span>
                </label>
                <select
                  name="workModel"
                  value={formData.workModel}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none"
                  required>
                  <option value="">Select work model</option>
                  {WORK_MODEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none"
                  required>
                  <option value="">Select level</option>
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none"
                  required>
                  <option value="">Select job type</option>
                  {JOB_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Role Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="roleType"
                  value={formData.roleType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none"
                  required>
                  <option value="">Select role type</option>
                  {ROLE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Headcount <span className="text-red-500">*</span>
                </label>
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Min Experience (months) <span className="text-red-500">*</span>
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Required Skills <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="requiredSkillsText"
                value={requiredSkillsText}
                onChange={(e) => setRequiredSkillsText(e.target.value)}
                placeholder="React, TypeScript, Node.js"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Preferred Skills
              </label>
              <input
                type="text"
                name="preferredSkillsText"
                value={preferredSkillsText}
                onChange={(e) => setPreferredSkillsText(e.target.value)}
                placeholder="Docker, GraphQL"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Min GPA</label>
                <input
                  type="number"
                  name="minGpa"
                  value={formData.minGpa}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFormData((prev) => ({ ...prev, minGpa: isNaN(val) ? 0 : val }));
                  }}
                  min={0}
                  step="0.01"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#5B5BF6] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Required Languages
                </label>
                <input
                  type="text"
                  name="requiredLanguagesText"
                  value={requiredLanguagesText}
                  onChange={(e) => setRequiredLanguagesText(e.target.value)}
                  placeholder="English, Japanese"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Portfolio Expected
              </label>
              <input
                type="text"
                name="portfolioExpected"
                value={formData.portfolioExpected || ""}
                onChange={handleInputChange}
                placeholder="GitHub, portfolio website, or project demo"
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
