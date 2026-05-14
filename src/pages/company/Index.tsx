import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";
import "./company.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
  "http://localhost:3000";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkLocation {
  address: string;
  city: string;
  country: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface RecruitmentOption {
  label: string;
  useAI: boolean;
}

interface CompanyForm {
  name: string;
  shortName: string;
  logoUrl: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  workLocations: WorkLocation[];
  workType: string;
  techStack: string[];
  benefits: string[];
  socialLinks: SocialLink[];
  recruitmentPositions: string[];
  recruitmentLevels: RecruitmentOption[];
  partnerStatus: string;
}

const EMPTY_FORM: CompanyForm = {
  name: "",
  shortName: "",
  logoUrl: "",
  website: "",
  email: "",
  phone: "",
  address: "",
  description: "",
  workLocations: [{ address: "", city: "", country: "" }],
  workType: "",
  techStack: [],
  benefits: [],
  socialLinks: [{ platform: "", url: "" }],
  recruitmentPositions: [],
  recruitmentLevels: [],
  partnerStatus: "",
};

// ─── Tag Input ────────────────────────────────────────────────────────────────
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  buttonLabel?: string;
}
function TagInput({ tags, onChange, placeholder = "Thêm...", buttonLabel = "Thêm" }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="tag-input-wrapper">
      <div className="tag-list">
        {tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
            <button type="button" className="tag-remove" onClick={() => removeTag(tag)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="tag-add-row">
        <input
          type="text"
          className="company-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addTag(); }
          }}
        />
        <button type="button" className="btn-add-tag" onClick={addTag}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CompanyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Fetch company data ──────────────────────────────────────────────────────
  const fetchCompany = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/companies/me`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401 || res.status === 403) {
        navigate("/login", { replace: true });
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as Record<string, unknown>;
      const company = (data.company ?? data) as Record<string, unknown>;

      setForm({
        name: (company.name as string) ?? "",
        shortName: (company.shortName as string) ?? "",
        logoUrl: (company.logoUrl as string) ?? "",
        website: (company.website as string) ?? "",
        email: (company.email as string) ?? "",
        phone: (company.phone as string) ?? "",
        address: (company.address as string) ?? "",
        description: (company.description as string) ?? "",
        workLocations:
          Array.isArray(company.workLocations) && company.workLocations.length > 0
            ? (company.workLocations as WorkLocation[])
            : [{ address: "", city: "", country: "" }],
        workType: (company.workType as string) ?? "",
        techStack: Array.isArray(company.techStack) ? (company.techStack as string[]) : [],
        benefits: Array.isArray(company.benefits) ? (company.benefits as string[]) : [],
        socialLinks:
          Array.isArray(company.socialLinks) && company.socialLinks.length > 0
            ? (company.socialLinks as SocialLink[])
            : [{ platform: "", url: "" }],
        recruitmentPositions: Array.isArray(company.recruitmentPositions)
          ? (company.recruitmentPositions as string[])
          : [],
        recruitmentLevels: Array.isArray(company.recruitmentLevels)
          ? (company.recruitmentLevels as RecruitmentOption[])
          : [],
        partnerStatus: (company.partnerStatus as string) ?? "",
      });
    } catch {
      // silently fail
    }
  }, [navigate]);

  useEffect(() => {
    void fetchCompany();
  }, [fetchCompany]);

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/companies/me`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        let errorMsg = "Lưu thất bại";
        try {
          const payload = await res.json();
          if (payload && payload.message) errorMsg = payload.message;
        } catch {
          // Response is not JSON
        }
        throw new Error(errorMsg);
      }
      setSaveMsg({ type: "success", text: "Lưu thành công!" });
    } catch (e) {
      setSaveMsg({ type: "error", text: e instanceof Error ? e.message : "Lưu thất bại" });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Field helpers ─────────────────────────────────────────────────────────
  const set = (field: keyof CompanyForm, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Work locations
  const updateWorkLocation = (index: number, field: keyof WorkLocation, value: string) => {
    const updated = [...form.workLocations];
    updated[index] = { ...updated[index], [field]: value };
    set("workLocations", updated);
  };
  const addWorkLocation = () =>
    set("workLocations", [...form.workLocations, { address: "", city: "", country: "" }]);
  const removeWorkLocation = (index: number) =>
    set("workLocations", form.workLocations.filter((_, i) => i !== index));

  // Social links
  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...form.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    set("socialLinks", updated);
  };
  const addSocialLink = () =>
    set("socialLinks", [...form.socialLinks, { platform: "", url: "" }]);
  const removeSocialLink = (index: number) =>
    set("socialLinks", form.socialLinks.filter((_, i) => i !== index));

  // Recruitment levels
  const addRecruitmentLevel = () =>
    set("recruitmentLevels", [...form.recruitmentLevels, { label: "", useAI: false }]);
  const removeRecruitmentLevel = (index: number) =>
    set("recruitmentLevels", form.recruitmentLevels.filter((_, i) => i !== index));
  const updateRecruitmentLevel = (
    index: number,
    field: keyof RecruitmentOption,
    value: string | boolean
  ) => {
    const updated = [...form.recruitmentLevels];
    updated[index] = { ...updated[index], [field]: value };
    set("recruitmentLevels", updated);
  };

  return (
    <div className="company-page-root">
      {/* Ambient blobs */}
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />

      <div className="company-layout">
        <RecruiterSidebar activePath="/recruiter/company" />

        <main className="company-main">
          {/* ── Page header ── */}
          <div className="company-page-header">
            <div>
              <h1 className="page-title">Thông tin công ty</h1>
              <p className="page-subtitle">Chỉnh sửa thông tin quản trị viên</p>
            </div>
          </div>

          {/* ── 1. Thông tin cơ bản ── */}
          <section className="company-card">
            <h2 className="section-title">Thông tin cơ bản</h2>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">TÊN CÔNG TY</label>
                <input
                  className="company-input"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">TÊN VIẾT TẮT</label>
                <input
                  className="company-input"
                  value={form.shortName}
                  onChange={(e) => set("shortName", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row one-col">
              <div className="form-group">
                <label className="form-label">LOGO URL</label>
                <input
                  className="company-input"
                  placeholder="https://..."
                  value={form.logoUrl}
                  onChange={(e) => set("logoUrl", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">WEBSITE</label>
                <input
                  className="company-input"
                  placeholder="https://..."
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input
                  className="company-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">SỐ ĐIỆN THOẠI</label>
                <input
                  className="company-input"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ĐỊA CHỈ</label>
                <input
                  className="company-input"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row one-col">
              <div className="form-group">
                <label className="form-label">MÔ TẢ CÔNG TY</label>
                <textarea
                  className="company-textarea"
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ── 2. Địa điểm làm việc ── */}
          <section className="company-card">
            <div className="section-header-row">
              <h2 className="section-title">Địa điểm làm việc</h2>
              <button type="button" className="btn-section-add" onClick={addWorkLocation}>
                + Thêm
              </button>
            </div>

            {form.workLocations.map((loc, i) => (
              <div key={i} className="sub-card">
                <div className="form-row one-col">
                  <div className="form-group">
                    <label className="form-label">ĐỊA CHỈ</label>
                    <input
                      className="company-input"
                      value={loc.address}
                      onChange={(e) => updateWorkLocation(i, "address", e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row two-col">
                  <div className="form-group">
                    <label className="form-label">THÀNH PHỐ</label>
                    <input
                      className="company-input"
                      value={loc.city}
                      onChange={(e) => updateWorkLocation(i, "city", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">QUỐC GIA</label>
                    <input
                      className="company-input"
                      value={loc.country}
                      onChange={(e) => updateWorkLocation(i, "country", e.target.value)}
                    />
                  </div>
                </div>
                {form.workLocations.length > 1 && (
                  <div className="sub-card-actions">
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeWorkLocation(i)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* ── 3. Môi trường làm việc ── */}
          <section className="company-card">
            <h2 className="section-title">Môi trường làm việc</h2>

            <div className="form-row one-col">
              <div className="form-group">
                <label className="form-label">HÌNH THỨC LÀM VIỆC</label>
                <input
                  className="company-input"
                  placeholder="Remote / Onsite / Hybrid..."
                  value={form.workType}
                  onChange={(e) => set("workType", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">TECH STACK</label>
              <TagInput
                tags={form.techStack}
                onChange={(tags) => set("techStack", tags)}
                placeholder="Thêm công nghệ"
                buttonLabel="Thêm"
              />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">QUYỀN LỢI</label>
              <TagInput
                tags={form.benefits}
                onChange={(tags) => set("benefits", tags)}
                placeholder="Thêm quyền lợi"
                buttonLabel="Thêm"
              />
            </div>
          </section>

          {/* ── 4. Mạng xã hội ── */}
          <section className="company-card">
            <div className="section-header-row">
              <h2 className="section-title">Mạng xã hội</h2>
              <button type="button" className="btn-section-add" onClick={addSocialLink}>
                + Thêm
              </button>
            </div>

            {form.socialLinks.map((link, i) => (
              <div key={i} className="sub-card">
                <div className="form-row two-col">
                  <div className="form-group">
                    <label className="form-label">PLATFORM</label>
                    <input
                      className="company-input"
                      placeholder="LinkedIn, Facebook..."
                      value={link.platform}
                      onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL</label>
                    <input
                      className="company-input"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                    />
                  </div>
                </div>
                {form.socialLinks.length > 1 && (
                  <div className="sub-card-actions">
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeSocialLink(i)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* ── 5. Tùy chọn tuyển dụng ── */}
          <section className="company-card">
            <h2 className="section-title">Tùy chọn tuyển dụng</h2>

            <div className="form-group">
              <label className="form-label">VỊ TRÍ TUYỂN DỤNG</label>
              <TagInput
                tags={form.recruitmentPositions}
                onChange={(tags) => set("recruitmentPositions", tags)}
                placeholder="Thêm vị trí"
                buttonLabel="Thêm"
              />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <div className="section-header-row" style={{ marginBottom: "8px" }}>
                <label className="form-label" style={{ margin: 0 }}>CẤP ĐỘ TUYỂN DỤNG</label>
                <button
                  type="button"
                  className="btn-section-add"
                  onClick={addRecruitmentLevel}
                >
                  + Thêm
                </button>
              </div>

              {form.recruitmentLevels.map((lvl, i) => (
                <div key={i} className="recruitment-level-row">
                  <input
                    className="company-input"
                    placeholder="Tên cấp độ"
                    value={lvl.label}
                    onChange={(e) => updateRecruitmentLevel(i, "label", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={lvl.useAI}
                      onChange={(e) => updateRecruitmentLevel(i, "useAI", e.target.checked)}
                    />
                    <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                    <span className="toggle-text">
                      {lvl.useAI ? "Sử dụng phòng xét AI" : "Sử dụng phỏng vấn thủ công"}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeRecruitmentLevel(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── 6. Trạng thái đối tác ── */}
          <section className="company-card">
            <h2 className="section-title">Trạng thái đối tác</h2>
            <div className="form-row one-col">
              <div className="form-group">
                <label className="form-label">TRẠNG THÁI</label>
                <select
                  className="company-input"
                  value={form.partnerStatus}
                  onChange={(e) => set("partnerStatus", e.target.value)}
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Action bar ── */}
          <div className="action-bar">
            {saveMsg && (
              <span className={`save-msg ${saveMsg.type}`}>{saveMsg.text}</span>
            )}
            <button
              type="button"
              className="btn-cancel"
              onClick={() => void fetchCompany()}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn-save"
              disabled={isSaving}
              onClick={() => void handleSave()}
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
