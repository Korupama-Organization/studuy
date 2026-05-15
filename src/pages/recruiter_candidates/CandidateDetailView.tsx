import { useState } from "react";
import type { CandidateAppliedJob, CandidateDetail } from "./types";
import {
  aiScoreRing,
  candidatePhotoFallback,
  downloadCandidateCv,
  formatDateShort,
  getAppliedJobKey,
  getDefaultStatusAction,
  statusActionOptions,
  timelineCheckIcon,
  timelineIcon,
} from "./candidateData";

interface CandidateDetailViewProps {
  detail: CandidateDetail;
  onBack: () => void;
  jobIdParam: string;
  onUpdateStatus: (job: CandidateAppliedJob, nextStatus: string) => Promise<void>;
}

export default function CandidateDetailView({
  detail,
  onBack,
  jobIdParam,
  onUpdateStatus,
}: CandidateDetailViewProps) {
  const candidatePhoto = detail.avatarUrl || candidatePhotoFallback;
  const [isCvDownloading, setIsCvDownloading] = useState(false);
  const [cvDownloadError, setCvDownloadError] = useState("");
  const [selectedJobKey, setSelectedJobKey] = useState(
    detail.appliedJobs[0] ? getAppliedJobKey(detail.appliedJobs[0]) : "",
  );
  const [nextStatus, setNextStatus] = useState(
    getDefaultStatusAction(detail.appliedJobs[0]?.status),
  );
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);
  const [statusActionError, setStatusActionError] = useState("");
  const [statusActionMessage, setStatusActionMessage] = useState("");
  const scoreToPercent = (score: number | null) =>
    score === null ? 0 : Math.min(100, Math.max(0, Math.round(score * 10)));
  const formatScore = (score: number | null) =>
    score === null ? "Chưa có dữ liệu" : `${score}/10`;
  const hasAiScore = detail.aiScore !== null;
  const selectedJob =
    detail.appliedJobs.find((job) => getAppliedJobKey(job) === selectedJobKey) ||
    detail.appliedJobs[0];

  const handleDownloadCv = async () => {
    setCvDownloadError("");
    setIsCvDownloading(true);
    try {
      await downloadCandidateCv(detail, jobIdParam);
    } catch (downloadError) {
      setCvDownloadError(
        downloadError instanceof Error
          ? downloadError.message
          : "Không thể tải CV ứng viên.",
      );
    } finally {
      setIsCvDownloading(false);
    }
  };

  const handleStatusSubmit = async () => {
    if (!selectedJob) {
      setStatusActionError("Ứng viên này chưa có job ứng tuyển để xử lý trạng thái.");
      return;
    }

    setStatusActionError("");
    setStatusActionMessage("");
    setIsStatusSubmitting(true);
    try {
      await onUpdateStatus(selectedJob, nextStatus);
      setStatusActionMessage("Đã cập nhật trạng thái ứng viên.");
    } catch (statusError) {
      setStatusActionError(
        statusError instanceof Error
          ? statusError.message
          : "Không thể cập nhật trạng thái ứng viên.",
      );
    } finally {
      setIsStatusSubmitting(false);
    }
  };

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
                {detail.socials.length ? (
                  detail.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[rgba(63,76,247,0.11)]"
                      aria-label={social.label}
                    >
                      <img src={social.icon} alt={social.label} className="h-6 w-6" />
                    </a>
                  ))
                ) : (
                  <span className="text-[13px] text-[#64748b]">
                    Chưa có liên kết liên hệ
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={handleDownloadCv}
                  disabled={isCvDownloading}
                  className="flex h-[35px] items-center justify-center rounded-full border border-[#3f4cf7] bg-[rgba(63,76,247,0.11)] px-6 text-[14px] font-medium text-[#3f4cf7] transition hover:bg-[rgba(63,76,247,0.18)] disabled:cursor-wait disabled:opacity-60"
                >
                  {isCvDownloading ? "Đang tải..." : "Tải CV"}
                </button>
                {cvDownloadError ? (
                  <p className="max-w-[240px] text-right text-[12px] text-red-500">
                    {cvDownloadError}
                  </p>
                ) : null}
              </div>
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

      <div className="rounded-[16px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1">
            <p className="text-[16px] font-semibold text-black">Jobs đã ứng tuyển</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {detail.appliedJobs.length ? (
                detail.appliedJobs.map((job) => (
                  <div
                    key={getAppliedJobKey(job)}
                    className="rounded-[12px] border border-[#e7eaf3] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[15px] font-semibold text-[#0a1629]">
                          {job.title}
                        </p>
                        <p className="mt-1 text-[13px] text-[#64748b]">
                          {job.companyName || "Công ty chưa cập nhật"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[rgba(63,76,247,0.11)] px-3 py-1 text-[12px] font-semibold text-[#3f4cf7]">
                        {job.statusLabel}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-[#64748b]">
                      <span>{job.location || "Địa điểm chưa cập nhật"}</span>
                      <span>Ứng tuyển: {formatDateShort(job.appliedAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[14px] text-[#64748b]">
                  Chưa có dữ liệu job ứng tuyển từ API.
                </p>
              )}
            </div>
          </div>

          <div className="w-full rounded-[12px] border border-[rgba(63,76,247,0.11)] bg-[#f8f9ff] p-4 xl:max-w-[360px]">
            <p className="text-[15px] font-semibold text-[#0a1629]">
              Xử lý trạng thái
            </p>
            <div className="mt-4 space-y-3">
              <select
                value={selectedJob ? getAppliedJobKey(selectedJob) : ""}
                onChange={(event) => {
                  const job = detail.appliedJobs.find(
                    (item) => getAppliedJobKey(item) === event.target.value,
                  );
                  setSelectedJobKey(event.target.value);
                  setNextStatus(getDefaultStatusAction(job?.status));
                }}
                className="w-full rounded-[10px] border border-[#dbe1f4] bg-white px-3 py-2 text-[14px] text-[#0a1629] focus:outline-none"
                disabled={!detail.appliedJobs.length}
              >
                {detail.appliedJobs.length ? (
                  detail.appliedJobs.map((job) => (
                    <option key={getAppliedJobKey(job)} value={getAppliedJobKey(job)}>
                      {job.title}
                    </option>
                  ))
                ) : (
                  <option value="">Chưa có job</option>
                )}
              </select>
              <select
                value={nextStatus}
                onChange={(event) => setNextStatus(event.target.value)}
                className="w-full rounded-[10px] border border-[#dbe1f4] bg-white px-3 py-2 text-[14px] text-[#0a1629] focus:outline-none"
                disabled={!detail.appliedJobs.length}
              >
                {statusActionOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  void handleStatusSubmit();
                }}
                disabled={!detail.appliedJobs.length || isStatusSubmitting}
                className="flex h-[38px] w-full items-center justify-center rounded-full bg-[#3f4cf7] px-4 text-[14px] font-semibold text-white transition hover:bg-[#2f3de0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStatusSubmitting ? "Đang xử lý..." : "Xử lý trạng thái"}
              </button>
              {statusActionError ? (
                <p className="text-[12px] text-red-500">{statusActionError}</p>
              ) : null}
              {statusActionMessage ? (
                <p className="text-[12px] text-emerald-600">
                  {statusActionMessage}
                </p>
              ) : null}
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
                  {hasAiScore ? `${detail.aiScore}/10` : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-4 rounded-[8px] bg-[#24273f] px-3 py-2 text-white">
                <span className="material-symbols-outlined text-[22px]">
                  workspace_premium
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase">Đánh giá AI</p>
                  <p className="font-['Poppins'] text-[17px] font-bold">
                    {hasAiScore ? "Có dữ liệu sàng lọc" : "Chưa có dữ liệu đánh giá"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-black">
                    Kỹ năng chuyên môn: {formatScore(detail.technicalScore)}
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
                    Kinh nghiệm phù hợp: {formatScore(detail.experienceScore)}
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
                    Kỹ năng mềm: {formatScore(detail.softScore)}
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
                Xem them
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
