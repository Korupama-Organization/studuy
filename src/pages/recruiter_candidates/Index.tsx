import { useEffect, useMemo, useState } from "react";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";

const candidatePhotoFallback =
  "https://www.figma.com/api/mcp/asset/1880ebb6-d692-4b48-8841-0be386f46699";
const linkedinIcon =
  "https://www.figma.com/api/mcp/asset/8fdfaf84-6ded-4c1c-840f-4c1db44b9e44";
const messengerIcon =
  "https://www.figma.com/api/mcp/asset/c057f064-eab4-4045-968b-4f8c38e411c2";
const instagramIcon =
  "https://www.figma.com/api/mcp/asset/e4f3174f-74d5-415e-8611-11f4dd20f468";
const aiScoreRing =
  "https://www.figma.com/api/mcp/asset/e973b280-e68b-4981-bf37-976a4d39207d";
const timelineIcon =
  "https://www.figma.com/api/mcp/asset/4df0bec7-ea83-41b4-96eb-901dff9c1b6f";
const timelineCheckIcon =
  "https://www.figma.com/api/mcp/asset/85781c1e-90ce-4fee-9368-bf50a26e334c";

interface CandidateItem {
  id: string;
  name: string;
  email: string;
  major: string;
  school: string;
  desiredRole: string;
  avatarUrl?: string;
}

interface CandidateDetail extends CandidateItem {
  positionApplied: string;
  university: string;
  gpa: string;
  aiScore: number;
  technicalScore: number;
  experienceScore: number;
  softScore: number;
  summary: string[];
  personalInfo: {
    gender: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
  };
  skills: { label: string; detail: string }[];
  timeline: { phase: string; date: string }[];
  socials: { label: string; href: string; icon: string }[];
}

const mockCandidates: CandidateItem[] = [
  {
    id: "cand-1",
    name: "Lenora Fowler",
    email: "eravi@foisictpro.com",
    major: "23",
    school: "Facebook",
    desiredRole: "React · Node.js · AWS",
  },
  {
    id: "cand-2",
    name: "Lenora Fowler",
    email: "eravi@foisictpro.com",
    major: "23",
    school: "Facebook",
    desiredRole: "React · Node.js · AWS",
  },
  {
    id: "cand-3",
    name: "Laney Sutton",
    email: "lsutton@example.com",
    major: "Sản phẩm",
    school: "Shopify",
    desiredRole: "React · UX · Sản phẩm",
  },
  {
    id: "cand-4",
    name: "Emil Ortega",
    email: "emil.ortega@example.com",
    major: "Di động",
    school: "Apple",
    desiredRole: "Swift · iOS · UIKit",
  },
  {
    id: "cand-5",
    name: "Dara Long",
    email: "dara.long@example.com",
    major: "Trí tuệ nhân tạo",
    school: "OpenAI",
    desiredRole: "Python · ML · LLMs",
  },
  {
    id: "cand-6",
    name: "Cody Payne",
    email: "cody.payne@example.com",
    major: "Đám mây",
    school: "AWS",
    desiredRole: "DevOps · AWS · Terraform",
  },
  {
    id: "cand-7",
    name: "Elisa Moran",
    email: "elisa.moran@example.com",
    major: "Backend",
    school: "Stripe",
    desiredRole: "Node.js · Thanh toán · API",
  },
  {
    id: "cand-8",
    name: "Ivy Sutton",
    email: "ivy.sutton@example.com",
    major: "Thiết kế",
    school: "Figma",
    desiredRole: "UX · Nghiên cứu · UI",
  },
];

const defaultSummary = [
  "Kỹ sư phần mềm với hơn 3 năm kinh nghiệm trong phát triển ứng dụng web và di động. Thành thạo trong việc thiết kế kiến trúc, tối ưu hiệu năng và triển khai các giải pháp công nghệ hiện đại. Có kinh nghiệm làm việc với nhiều khung phát triển như Django, FastAPI, Node.js, Flutter, và thành thạo với MySQL, PostgreSQL, Redis.",
  "Tinh thần chủ động, trách nhiệm cao và luôn học hỏi công nghệ mới để nâng cao hiệu quả công việc.",
];

const defaultSkills = [
  { label: "Danh mục 1", detail: "kỹ năng" },
  { label: "Danh mục 2", detail: "kỹ năng" },
  {
    label: "Danh mục 3",
    detail: "Làm tốt — bạn xử lý hiệu quả và chú ý đến chi tiết.",
  },
  {
    label: "Microsoft",
    detail: "Làm tốt — bạn xử lý hiệu quả và chú ý đến chi tiết.",
  },
  {
    label: "Microsoft",
    detail: "Làm tốt — bạn xử lý hiệu quả và chú ý đến chi tiết.",
  },
];

const defaultTimeline = [
  { phase: "Giai đoạn 1", date: "18/05" },
  { phase: "Giai đoạn 2", date: "18/05" },
  { phase: "Giai đoạn 3", date: "18/05" },
  { phase: "Giai đoạn 4", date: "18/05" },
  { phase: "Giai đoạn 5", date: "18/05" },
  { phase: "Giai đoạn 6", date: "18/05" },
];

const defaultSocials = [
  { label: "LinkedIn", href: "#", icon: linkedinIcon },
  { label: "Messenger", href: "#", icon: messengerIcon },
  { label: "Instagram", href: "#", icon: instagramIcon },
];

const makeCandidateDetail = (candidate: CandidateItem): CandidateDetail => ({
  ...candidate,
  positionApplied: candidate.desiredRole,
  university: candidate.school,
  gpa: "3.7/4.0",
  aiScore: 8,
  technicalScore: 8,
  experienceScore: 8,
  softScore: 8,
  summary: defaultSummary,
  personalInfo: {
    gender: "Nam",
    dob: "05/11/1999",
    email: candidate.email,
    phone: "039672432",
    address: "46 fjfkeow, fjfieow, iêiee",
  },
  skills: defaultSkills,
  timeline: defaultTimeline,
  socials: defaultSocials,
});

const candidateDetailOverrides: Record<string, Partial<CandidateDetail>> = {
  "cand-1": {
    positionApplied: "Kỹ sư Backend",
    major: "Python, Java, C#",
    university: "Tại chỗ",
    gpa: "3.8/4.0",
  },
};

interface CandidateDetailViewProps {
  detail: CandidateDetail;
  onBack: () => void;
}

function CandidateDetailView({ detail, onBack }: CandidateDetailViewProps) {
  const candidatePhoto = detail.avatarUrl || candidatePhotoFallback;
  const scoreToPercent = (score: number) =>
    Math.min(100, Math.max(0, Math.round(score * 10)));

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#3f4cf7]"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Danh sách ứng viên
      </button>

      <div className="rounded-[25px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 lg:max-w-[460px]">
            <div className="flex gap-4">
              <img
                src={candidatePhoto}
                alt={detail.name}
                className="h-[100px] w-[100px] rounded-[16px] object-cover"
              />
              <div className="flex flex-col gap-2">
                <p className="font-['Poppins'] text-[20px] font-medium text-black">
                  {detail.name}
                </p>
                <p className="text-[14px] text-[#64748b]">
                  Vị trí ứng tuyển: {detail.positionApplied}
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-[#e7eaf3]" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {detail.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[rgba(63,76,247,0.11)]"
                    aria-label={social.label}
                  >
                    <img src={social.icon} alt={social.label} className="h-6 w-6" />
                  </a>
                ))}
              </div>
              <button
                type="button"
                className="flex h-[35px] items-center justify-center rounded-full border border-[#3f4cf7] bg-[rgba(63,76,247,0.11)] px-6 text-[14px] font-medium text-[#3f4cf7]"
              >
                Tải CV
              </button>
            </div>
          </div>

          <div className="rounded-[16px] bg-[rgba(63,76,247,0.11)] p-6 lg:w-[430px]">
            <div className="space-y-4 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="font-['Poppins'] text-[#182940]">Chuyên ngành</span>
                <span className="font-['Poppins'] font-medium text-black">
                  {detail.major}
                </span>
              </div>
              <div className="h-px w-full bg-[#dde1f4]" />
              <div className="flex items-center justify-between">
                <span className="font-['Poppins'] text-[#182940]">Trường</span>
                <span className="font-['Poppins'] font-medium text-black">
                  {detail.university}
                </span>
              </div>
              <div className="h-px w-full bg-[#dde1f4]" />
              <div className="flex items-center justify-between">
                <span className="font-['Poppins'] text-[#182940]">GPA</span>
                <span className="font-['Poppins'] font-medium text-black">
                  {detail.gpa}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),448px]">
        <div className="rounded-[16px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[16px] font-bold text-black">Điểm AI</p>
              <div className="relative flex h-[145px] w-[145px] items-center justify-center">
                <img
                  src={aiScoreRing}
                  alt="Vòng điểm AI"
                  className="absolute inset-0 h-full w-full"
                />
                <span className="text-[18px] font-medium text-black">
                  {detail.aiScore}/10
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-4 rounded-[8px] bg-[#24273f] px-3 py-2 text-white">
                <span className="material-symbols-outlined text-[22px]">
                  workspace_premium
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase">Ứng viên nổi bật</p>
                  <p className="font-['Poppins'] text-[17px] font-bold">
                    #1 Phù hợp nhất
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-black">
                    Kỹ năng chuyên môn: {detail.technicalScore}/10
                  </p>
                  <div className="h-[14px] w-full max-w-[260px] rounded-full bg-[#d1d1d1]">
                    <div
                      className="h-[14px] rounded-full bg-[#59d945]"
                      style={{ width: `${scoreToPercent(detail.technicalScore)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-black">
                    Kinh nghiệm phù hợp: {detail.experienceScore}/10
                  </p>
                  <div className="h-[14px] w-full max-w-[260px] rounded-full bg-[#d1d1d1]">
                    <div
                      className="h-[14px] rounded-full bg-[#59d945]"
                      style={{ width: `${scoreToPercent(detail.experienceScore)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-black">
                    Kỹ năng mềm: {detail.softScore}/10
                  </p>
                  <div className="h-[14px] w-full max-w-[260px] rounded-full bg-[#d1d1d1]">
                    <div
                      className="h-[14px] rounded-full bg-[#59d945]"
                      style={{ width: `${scoreToPercent(detail.softScore)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
          <p className="text-[16px] font-semibold text-black">Tóm tắt AI</p>
          <div className="mt-3 space-y-2 text-[16px] text-black">
            {detail.summary.map((paragraph, index) => (
              <p key={`${detail.id}-summary-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),303px]">
        <div className="space-y-5">
          <div className="rounded-[25px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
            <p className="text-[16px] font-semibold text-black">Thông tin cá nhân</p>
            <div className="mt-4 space-y-4">
              {[
                {
                  label: "Giới tính",
                  value: detail.personalInfo.gender,
                  icon: "wc",
                },
                {
                  label: "Ngày sinh",
                  value: detail.personalInfo.dob,
                  icon: "event",
                },
                {
                  label: "Email",
                  value: detail.personalInfo.email,
                  icon: "mail",
                },
                {
                  label: "Số điện thoại",
                  value: detail.personalInfo.phone,
                  icon: "call",
                },
                {
                  label: "Địa chỉ",
                  value: detail.personalInfo.address,
                  icon: "location_on",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[16px] bg-[rgba(63,76,247,0.11)]">
                    <span className="material-symbols-outlined text-[22px] text-[#3f4cf7]">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#64748b]">{item.label}</p>
                    <p className="text-[16px] text-black">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[25px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-semibold text-black">Kỹ năng</p>
              <button
                type="button"
                className="text-[14px] text-[#3f4cf7]"
              >
                Xem thêm
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {detail.skills.map((skill, index) => (
                <div
                  key={`${detail.id}-skill-${index}`}
                  className={
                    index === detail.skills.length - 1
                      ? "space-y-2"
                      : "space-y-2 border-b border-[#e7eaf3] pb-4"
                  }
                >
                  <p className="text-[14px] text-[#64748b]">{skill.label}</p>
                  <p className="text-[14px] text-black">{skill.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
          <div className="flex items-center gap-3">
            <img src={timelineIcon} alt="Dòng thời gian" className="h-6 w-6" />
            <p className="text-[18px] font-medium text-black">
              Dòng thời gian hoạt động
            </p>
          </div>
          <div className="relative mt-6 pl-10">
            <span className="absolute left-[13px] top-2 h-full w-px bg-black" />
            <div className="space-y-6">
              {detail.timeline.map((item, index) => (
                <div key={`${detail.id}-timeline-${index}`} className="relative">
                  <div className="absolute -left-10 top-0 flex h-[29px] w-[29px] items-center justify-center rounded-full border-2 border-black bg-white">
                    <img
                      src={timelineCheckIcon}
                      alt="Hoàn thành"
                      className="h-[13px] w-[13px]"
                    />
                  </div>
                  <p className="text-[16px] text-black">{item.phase}</p>
                  <p className="text-[12px] text-[#64748b]">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecruiterCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState<
    { fullName?: string; avatarUrl?: string } | null
  >(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );

  const pageSize = 6;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser) as { fullName?: string; avatarUrl?: string });
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return mockCandidates;
    const q = searchQuery.trim().toLowerCase();
    return mockCandidates.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.desiredRole.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }).map((_, index) => index + 1),
    [totalPages],
  );

  const visibleCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCandidates.slice(start, start + pageSize);
  }, [currentPage, filteredCandidates]);

  const selectedCandidate = useMemo(() => {
    if (!selectedCandidateId) return null;
    return (
      mockCandidates.find((candidate) => candidate.id === selectedCandidateId) ||
      null
    );
  }, [selectedCandidateId]);

  const selectedDetail = useMemo(() => {
    if (!selectedCandidate) return null;
    const baseDetail = makeCandidateDetail(selectedCandidate);
    const override = candidateDetailOverrides[selectedCandidate.id];
    if (!override) return baseDetail;
    return {
      ...baseDetail,
      ...override,
      personalInfo: {
        ...baseDetail.personalInfo,
        ...override.personalInfo,
      },
      skills: override.skills ?? baseDetail.skills,
      timeline: override.timeline ?? baseDetail.timeline,
      socials: override.socials ?? baseDetail.socials,
      summary: override.summary ?? baseDetail.summary,
    };
  }, [selectedCandidate]);

  useEffect(() => {
    if (selectedCandidateId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedCandidateId]);

  const displayName = currentUser?.fullName || "Evan Yates";

  const renderAvatar = (candidate: CandidateItem) => {
    if (candidate.avatarUrl) {
      return (
        <img
          src={candidate.avatarUrl}
          alt={candidate.name}
          className="h-[50px] w-[50px] rounded-full object-cover"
        />
      );
    }

    const initial = candidate.name.trim().charAt(0).toUpperCase() || "U";
    return (
      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#E9EBFF] text-base font-bold text-[#3f4cf7]">
        {initial}
      </div>
    );
  };

  return (
    <div className="min-h-dvh bg-[#f2f2f7] font-['Nunito_Sans'] text-[#141515]">
      <div className="flex min-h-dvh">
        <RecruiterSidebar activePath="/recruiter/candidates" />

        <main className="flex-1 px-6 py-5 lg:px-8">
          <div className="flex items-center justify-end gap-5">
            <button
              type="button"
              className="relative flex h-12 w-12 items-center justify-center rounded-[14px] border border-[rgba(63,76,247,0.11)] bg-white shadow-[0_6px_58px_rgba(196,203,214,0.1)]"
              aria-label="Thông báo"
            >
              <span className="material-symbols-outlined text-[22px] text-[#0a1629]">
                notifications
              </span>
            </button>
            <button
              type="button"
              className="flex h-12 items-center gap-3 rounded-[14px] border border-[rgba(63,76,247,0.11)] bg-white px-3 shadow-[0_6px_29px_rgba(196,203,214,0.1)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8EAFF] text-sm font-bold text-[#3f4cf7]">
                {displayName.trim().charAt(0).toUpperCase()}
              </div>
              <span className="text-[16px] font-bold text-[#0a1629]">
                {displayName}
              </span>
              <span className="material-symbols-outlined text-[20px] text-[#0a1629]">
                expand_more
              </span>
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-5">
            {selectedDetail ? (
              <CandidateDetailView
                detail={selectedDetail}
                onBack={() => setSelectedCandidateId(null)}
              />
            ) : (
              <>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex h-[54px] w-full max-w-[578px] items-center justify-between rounded-[8px] border border-[rgba(63,76,247,0.11)] bg-white px-5">
                    <input
                      className="w-full border-none bg-transparent text-[16px] font-medium text-[#64748b] placeholder:text-[#64748b] focus:outline-none"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    <span className="material-symbols-outlined text-[22px] text-[#64748b]">
                      search
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex h-[54px] w-full max-w-[143px] items-center justify-between rounded-[12px] border border-[rgba(63,76,247,0.11)] bg-white px-4 shadow-[0_4px_6px_rgba(62,73,84,0.04)]"
                  >
                    <span className="text-[16px] font-medium text-[#141515]">
                      Mới nhất
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#141515]">
                      expand_more
                    </span>
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleCandidates.map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => setSelectedCandidateId(candidate.id)}
                      className="flex w-full flex-col gap-6 rounded-[8px] border border-[rgba(63,76,247,0.11)] bg-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(196,203,214,0.2)] lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {renderAvatar(candidate)}
                        <div>
                          <p className="text-[16px] font-bold text-[#0a1629]">
                            {candidate.name}
                          </p>
                          <p className="text-[14px] text-[#91929e]">
                            {candidate.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-wrap items-center gap-6 lg:gap-12">
                        <div>
                          <p className="text-[14px] text-[#91929e]">Chuyên ngành</p>
                          <p className="text-[16px] text-[#0a1629]">
                            {candidate.major}
                          </p>
                        </div>
                        <div>
                          <p className="text-[14px] text-[#91929e]">Trường</p>
                          <p className="text-[16px] text-[#0a1629]">
                            {candidate.school}
                          </p>
                        </div>
                        <div>
                          <p className="text-[14px] text-[#91929e]">
                            Vị trí mong muốn
                          </p>
                          <p className="text-[16px] text-[#0a1629]">
                            {candidate.desiredRole}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="flex h-[53px] items-center gap-3 rounded-[12px] bg-[#3f4cf7] px-6 text-[18px] font-medium text-white disabled:opacity-60"
                    disabled={currentPage === 1}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      keyboard_double_arrow_left
                    </span>
                    Trước
                  </button>

                  <div className="flex h-[53px] items-center gap-4 rounded-[12px] border border-[#3f4cf7] bg-white px-6 font-['Poppins']">
                    {pageNumbers.map((page) => {
                      const active = page === currentPage;
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`flex h-10 w-10 items-center justify-center rounded-[12px] text-[18px] ${
                            active
                              ? "bg-[#3f4cf7] text-white"
                              : "text-[#3f4cf7]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className="flex h-[53px] items-center gap-3 rounded-[12px] bg-[#3f4cf7] px-6 text-[18px] font-medium text-white disabled:opacity-60"
                    disabled={currentPage === totalPages}
                  >
                    Tiếp
                    <span className="material-symbols-outlined text-[22px]">
                      keyboard_double_arrow_right
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
