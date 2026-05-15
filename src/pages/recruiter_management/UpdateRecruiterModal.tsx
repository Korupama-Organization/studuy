import { useEffect, useState } from "react";
import { buildApiUrl } from "../../services/auth";
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined;

const readString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return undefined;
};

const toRawDateString = (value: unknown): string => {
  if (!value) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    return trimmed;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const nested =
      obj.$date ??
      obj.date ??
      obj.value ??
      obj.iso ??
      obj.dateOfBirth ??
      obj.birthDate ??
      obj.dob;
    return toRawDateString(nested);
  }

  return "";
};

const formatDateInputValue = (value?: string) => {
  const raw = toRawDateString(value);
  if (!raw) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw.includes("T") ? raw.split("T")[0] : raw;
  }

  return parsed.toISOString().slice(0, 10);
};

const readDateString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    const raw = toRawDateString(value);
    if (raw) return raw;
  }
  return undefined;
};

const normalizeGender = (value: unknown): string => {
  if (typeof value !== "string") return "";

  const raw = value.trim();
  if (!raw) return "";

  const lowered = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    lowered === "nam" ||
    lowered === "male" ||
    lowered === "man" ||
    lowered === "m"
  ) {
    return "Nam";
  }

  if (
    lowered === "nu" ||
    lowered === "female" ||
    lowered === "woman" ||
    lowered === "f"
  ) {
    return "Nữ";
  }

  if (
    lowered === "khac" ||
    lowered === "other" ||
    lowered === "others" ||
    lowered === "non-binary" ||
    lowered === "nb" ||
    lowered === "o"
  ) {
    return "Khác";
  }

  return GENDER_OPTIONS.includes(raw) ? raw : "";
};

const extractMemberFromPayload = (
  payload: Record<string, unknown>,
): Record<string, unknown> => {
  const data = asRecord(payload.data);

  return (
    asRecord(payload.member) ||
    asRecord(payload.companyMember) ||
    asRecord(payload.recruiter) ||
    asRecord(data?.member) ||
    asRecord(data?.companyMember) ||
    asRecord(data?.recruiter) ||
    data ||
    payload
  );
};

const getUserRecord = (
  member: Record<string, unknown>,
  payload: Record<string, unknown>,
): Record<string, unknown> | undefined => {
  const data = asRecord(payload.data);

  return (
    asRecord(member.userId) ||
    asRecord(member.user) ||
    asRecord(member.account) ||
    asRecord(payload.userId) ||
    asRecord(payload.user) ||
    asRecord(data?.userId) ||
    asRecord(data?.user)
  );
};

const getProfileRecord = (
  member: Record<string, unknown>,
  user?: Record<string, unknown>,
  payload?: Record<string, unknown>,
): Record<string, unknown> | undefined => {
  const data = asRecord(payload?.data);

  return (
    asRecord(member.profile) ||
    asRecord(member.userProfile) ||
    asRecord(user?.profile) ||
    asRecord(payload?.profile) ||
    asRecord(data?.profile)
  );
};

const getContactRecord = (
  member: Record<string, unknown>,
  user?: Record<string, unknown>,
  profile?: Record<string, unknown>,
): Record<string, unknown> | undefined =>
  asRecord(user?.contactInfo) ||
  asRecord(member.contactInfo) ||
  asRecord(profile?.contactInfo);

const makeInitialForm = (r?: Recruiter): UpdateProfilePayload => ({
  fullName: r?.fullName || "",
  phone: r?.phone || "",
  linkedinUrl: r?.linkedinUrl || "",
  githubUrl: r?.githubUrl || "",
  facebookUrl: r?.facebookUrl || "",
  avatarUrl: r?.avatarUrl || "",
  gender: normalizeGender(r?.gender),
  dateOfBirth: formatDateInputValue(r?.dateOfBirth),
  jobTitle: r?.jobTitle || "",
  membershipRole: r?.membershipRole || "",
});

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    const loadRecruiterDetail = async () => {
      await Promise.resolve();
      if (controller.signal.aborted) {
        return;
      }

      setFormData(makeInitialForm(recruiter));
      setError("");

      const recruiterId = recruiter?._id;
      if (!recruiterId) {
        return;
      }

      try {
        const response = await fetch(
          buildApiUrl(`/api/company-members/${encodeURIComponent(recruiterId)}`),
          {
            method: "GET",
            headers: getAuthHeaders(),
            signal: controller.signal,
          },
        );

        if (!response.ok) return;

        const payload = (await response.json()) as Record<string, unknown>;
        const member = extractMemberFromPayload(payload);
        const user = getUserRecord(member, payload);
        const profile = getProfileRecord(member, user, payload);
        const contact = getContactRecord(member, user, profile);

        const mergedRecruiter: Recruiter = {
          ...recruiter,
          fullName:
            readString(user?.fullName, member.fullName, profile?.fullName) ||
            recruiter.fullName,
          phone:
            readString(contact?.phone, user?.phone, member.phone, profile?.phone) ||
            recruiter.phone,
          linkedinUrl:
            readString(
              contact?.linkedinUrl,
              user?.linkedinUrl,
              member.linkedinUrl,
              profile?.linkedinUrl,
            ) ||
            recruiter.linkedinUrl,
          githubUrl:
            readString(
              contact?.githubUrl,
              user?.githubUrl,
              member.githubUrl,
              profile?.githubUrl,
            ) ||
            recruiter.githubUrl,
          facebookUrl:
            readString(
              contact?.facebookUrl,
              user?.facebookUrl,
              member.facebookUrl,
              profile?.facebookUrl,
            ) ||
            recruiter.facebookUrl,
          avatarUrl:
            readString(user?.avatarUrl, member.avatarUrl, profile?.avatarUrl) ||
            recruiter.avatarUrl,
          gender: (() => {
            const normalized =
              normalizeGender(user?.gender) ||
              normalizeGender(profile?.gender) ||
              normalizeGender(member.gender) ||
              normalizeGender(recruiter.gender);
            return normalized || recruiter.gender;
          })(),
          dateOfBirth: (() => {
            const resolved = readDateString(
              user?.dateOfBirth,
              user?.birthDate,
              user?.dob,
              profile?.dateOfBirth,
              profile?.birthDate,
              profile?.dob,
              member.dateOfBirth,
              member.birthDate,
              member.dob,
              recruiter.dateOfBirth,
            );
            return resolved || recruiter.dateOfBirth;
          })(),
          jobTitle:
            readString(member.jobTitle, user?.jobTitle, profile?.jobTitle) ||
            recruiter.jobTitle,
          membershipRole:
            readString(
              member.membershipRole,
              user?.membershipRole,
              profile?.membershipRole,
            ) ||
            recruiter.membershipRole,
        };

        setFormData(makeInitialForm(mergedRecruiter));
      } catch {
        // keep fallback data from current table row
      }
    };

    void loadRecruiterDetail();

    return () => controller.abort();
  }, [isOpen, recruiter]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recruiter) return;

    setError("");
    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      handleClose();
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
      <div className="fixed inset-0 z-40 bg-black/30" onClick={handleClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">Update Profile</h2>
            <button
              onClick={handleClose}
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
                  Ngày sinh
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
                URL ảnh đại diện
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
                  Chức danh
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
                  Vai trò thành viên
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
                URL LinkedIn
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
                onClick={handleClose}
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
