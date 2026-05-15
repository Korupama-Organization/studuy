import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCurrentRecruiter } from "../../hooks/useCurrentRecruiter";
import { useRecruiterActivity } from "../../hooks/useRecruiterActivity";
import RecruiterSidebar from "../recruiter_dashboard/components/RecruiterSidebar";
import RecruiterTopBar from "../recruiter_dashboard/components/RecruiterTopBar";
import ActivityPanel from "../recruiter_dashboard/components/ActivityPanel";
import CandidateDetailView from "./CandidateDetailView";
import {
  buildApiUrl,
  buildCandidateDetailFallback,
  buildCandidateDetailFromProfile,
  enrichCandidatesWithNotifications,
  fetchCandidateDetailData,
  formatDateShort,
  getAppliedJobKey,
  getAppliedJobsLabel,
  getAuthHeaders,
  getStatusLabel,
  mapApplicantToItem,
  mapCandidateSummaryToItem,
  parseErrorMessage,
  sortCandidates,
  updateCandidateApplicationStatus,
} from "./candidateData";
import type {
  ApiCandidateSummary,
  ApiJobApplicant,
  CandidateAppliedJob,
  CandidateDetail,
  CandidateItem,
  PaginationData,
} from "./types";
import "../recruiter_dashboard/recruiter.css";

export default function RecruiterCandidatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId") || "";
  const jobTitleParam = searchParams.get("jobTitle") || "";

  const topbarRecruiter = useCurrentRecruiter();
  const recruiterActivity = useRecruiterActivity();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<CandidateDetail | null>(
    null,
  );
  const [statusRefreshKey, setStatusRefreshKey] = useState(0);

  const pageSize = 6;

  useEffect(() => {
    let isActive = true;

    void Promise.resolve().then(() => {
      if (!isActive) return;
      setCurrentPage(1);
      setSelectedCandidateId(null);
      setSelectedDetail(null);
    });

    return () => {
      isActive = false;
    };
  }, [searchQuery, jobIdParam, sortOrder]);

  useEffect(() => {
    let isActive = true;

    const loadCandidates = async () => {
      setIsLoading(true);
      setError("");

      try {
        const endpoint = jobIdParam
          ? `api/jobs/${encodeURIComponent(jobIdParam)}/applicants`
          : "api/jobs/candidates";
        const url = new URL(buildApiUrl(endpoint));
        url.searchParams.set("page", String(currentPage));
        url.searchParams.set("limit", String(pageSize));
        if (searchQuery.trim()) {
          url.searchParams.set("search", searchQuery.trim());
        }
        url.searchParams.set("sort", sortOrder);
        url.searchParams.set("includeJobs", "true");
        url.searchParams.set("includeApplications", "true");

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const payload = (await response
          .json()
          .catch(() => null)) as
          | {
              data?: unknown;
              pagination?: PaginationData;
              message?: string;
            }
          | null;

        if (!response.ok) {
          const fallback = jobIdParam
            ? "Không thể tải danh sách ứng viên theo job."
            : "Không thể tải danh sách ứng viên.";
          throw new Error(await parseErrorMessage(response, fallback));
        }

        const rawData = Array.isArray(payload?.data) ? payload?.data : [];
        const items = jobIdParam
          ? rawData
              .map((item) => mapApplicantToItem(item as ApiJobApplicant))
              .filter(Boolean)
          : rawData.map((item) => mapCandidateSummaryToItem(item as ApiCandidateSummary));

        const total = payload?.pagination?.total ?? items.length;
        const totalPages =
          payload?.pagination?.totalPages ??
          Math.max(1, Math.ceil(total / pageSize));

        if (!isActive) return;

        setCandidates(sortCandidates(items as CandidateItem[], sortOrder));
        setPagination({
          page: payload?.pagination?.page ?? currentPage,
          limit: payload?.pagination?.limit ?? pageSize,
          total,
          totalPages,
        });
      } catch (loadError) {
        if (!isActive) return;
        setCandidates([]);
        setPagination({ page: 1, limit: pageSize, total: 0, totalPages: 1 });
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải danh sách ứng viên.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCandidates();

    return () => {
      isActive = false;
    };
  }, [currentPage, jobIdParam, pageSize, searchQuery, sortOrder, statusRefreshKey]);

  const totalPages = Math.max(1, pagination.totalPages || 1);

  useEffect(() => {
    let isActive = true;

    void Promise.resolve().then(() => {
      if (!isActive) return;
      setCurrentPage((prev) => Math.min(prev, totalPages));
    });

    return () => {
      isActive = false;
    };
  }, [totalPages]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }).map((_, index) => index + 1),
    [totalPages],
  );

  const enrichedCandidates = useMemo(
    () =>
      sortCandidates(
        enrichCandidatesWithNotifications(
          candidates,
          recruiterActivity.notifications,
          recruiterActivity.recentApplications,
        ),
        sortOrder,
      ),
    [
      candidates,
      recruiterActivity.notifications,
      recruiterActivity.recentApplications,
      sortOrder,
    ],
  );

  const selectedCandidate = useMemo(() => {
    if (!selectedCandidateId) return null;
    return (
      enrichedCandidates.find((candidate) => candidate.id === selectedCandidateId) ||
      null
    );
  }, [enrichedCandidates, selectedCandidateId]);

  const handleSortChange = (nextSortOrder: "newest" | "oldest") => {
    setSortOrder(nextSortOrder);
    setIsSortOpen(false);
  };

  useEffect(() => {
    let isActive = true;

    const loadDetail = async () => {
      await Promise.resolve();
      if (!isActive) return;

      if (!selectedCandidate) {
        setSelectedDetail(null);
        setDetailError("");
        return;
      }

      const jobId = selectedCandidate.jobId || jobIdParam;
      const fallbackDetail = buildCandidateDetailFallback(selectedCandidate);

      setSelectedDetail(fallbackDetail);
      setIsDetailLoading(true);
      setDetailError("");

      try {
        const detailData = await fetchCandidateDetailData(selectedCandidate, jobId);

        if (!isActive) return;

        const profile = detailData.profile;
        const application = detailData.application;
        setSelectedDetail(
          buildCandidateDetailFromProfile(
            selectedCandidate,
            profile,
            application,
            detailData,
          ),
        );
      } catch (loadError) {
        if (!isActive) return;
        setDetailError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải hồ sơ ứng viên.",
        );
        setSelectedDetail(fallbackDetail);
      } finally {
        if (isActive) {
          setIsDetailLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      isActive = false;
    };
  }, [jobIdParam, selectedCandidate, statusRefreshKey]);

  useEffect(() => {
    if (selectedCandidateId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedCandidateId]);

  const handleUpdateCandidateStatus = useCallback(
    async (job: CandidateAppliedJob, nextStatus: string) => {
      if (!selectedDetail) return;

      await updateCandidateApplicationStatus(selectedDetail, job, nextStatus);

      const updatedJob = {
        ...job,
        status: nextStatus,
        statusLabel: getStatusLabel(nextStatus),
        updatedAt: new Date().toISOString(),
      };
      const updateJobs = (jobs: CandidateAppliedJob[]) =>
        jobs.map((item) =>
          getAppliedJobKey(item) === getAppliedJobKey(job) ? updatedJob : item,
        );

      setCandidates((items) =>
        items.map((candidate) =>
          candidate.id === selectedDetail.id
            ? {
                ...candidate,
                appliedJobs: updateJobs(candidate.appliedJobs),
              }
            : candidate,
        ),
      );
      setSelectedDetail((current) =>
        current
          ? {
              ...current,
              appliedJobs: updateJobs(current.appliedJobs),
              timeline: [
                ...current.timeline.filter(
                  (item) => item.phase !== getStatusLabel(nextStatus),
                ),
                {
                  phase: getStatusLabel(nextStatus),
                  date: formatDateShort(updatedJob.updatedAt),
                },
              ],
            }
          : current,
      );
      setStatusRefreshKey((key) => key + 1);
    },
    [selectedDetail],
  );

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

  const clearJobFilter = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("jobId");
    nextParams.delete("jobTitle");
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  return (
    <div className="rd-layout">
      <RecruiterSidebar activeItem="candidates" />

      <div className="rd-body">
        <div className="rd-content-area">
          <RecruiterTopBar
            recruiter={topbarRecruiter}
            company={null}
            notificationCount={recruiterActivity.notificationCount}
            isActivityPanelOpen={recruiterActivity.isActivityPanelOpen}
            onToggleActivityPanel={recruiterActivity.toggleActivityPanel}
          />

          <div className="rd-main">
            {selectedDetail ? (
              <>
                {detailError ? (
                  <p className="text-sm text-red-500">{detailError}</p>
                ) : null}
                {isDetailLoading ? (
                  <p className="text-sm text-slate-500">
                    Đang tải hồ sơ ứng viên...
                  </p>
                ) : null}
                <CandidateDetailView
                  key={`${selectedDetail.id}-${selectedDetail.appliedJobs
                    .map(getAppliedJobKey)
                    .join("|")}`}
                  detail={selectedDetail}
                  onBack={() => setSelectedCandidateId(null)}
                  jobIdParam={jobIdParam}
                  onUpdateStatus={handleUpdateCandidateStatus}
                />
              </>
            ) : (
              <>
                {jobIdParam ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[rgba(63,76,247,0.11)] bg-white px-4 py-3">
                    <div>
                      <p className="text-[12px] text-[#64748b]">Đang xem ứng viên</p>
                      <p className="text-[16px] font-semibold text-[#0a1629]">
                        {jobTitleParam || jobIdParam}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearJobFilter}
                      className="rounded-full border border-[#3f4cf7] px-4 py-2 text-[14px] font-medium text-[#3f4cf7]"
                    >
                      Xem tất cả
                    </button>
                  </div>
                ) : null}

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
                  <div className="relative w-full max-w-[143px]">
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isSortOpen}
                      onClick={() => setIsSortOpen((current) => !current)}
                      className="flex h-[54px] w-full items-center justify-between rounded-[12px] border border-[rgba(63,76,247,0.11)] bg-white px-4 shadow-[0_4px_6px_rgba(62,73,84,0.04)]"
                    >
                      <span className="text-[16px] font-medium text-[#141515]">
                        {sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-[#141515]">
                        expand_more
                      </span>
                    </button>

                    {isSortOpen ? (
                      <div
                        className="absolute right-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-[12px] border border-[rgba(63,76,247,0.11)] bg-white shadow-[0_12px_28px_rgba(62,73,84,0.14)]"
                        role="listbox"
                        aria-label="Sắp xếp ứng viên"
                      >
                        <button
                          type="button"
                          role="option"
                          aria-selected={sortOrder === "newest"}
                          onClick={() => handleSortChange("newest")}
                          className={`w-full px-4 py-3 text-left text-[14px] font-medium transition ${
                            sortOrder === "newest"
                              ? "bg-[rgba(63,76,247,0.11)] text-[#3f4cf7]"
                              : "text-[#141515] hover:bg-[#f8fafc]"
                          }`}
                        >
                          Mới nhất
                        </button>
                        <button
                          type="button"
                          role="option"
                          aria-selected={sortOrder === "oldest"}
                          onClick={() => handleSortChange("oldest")}
                          className={`w-full px-4 py-3 text-left text-[14px] font-medium transition ${
                            sortOrder === "oldest"
                              ? "bg-[rgba(63,76,247,0.11)] text-[#3f4cf7]"
                              : "text-[#141515] hover:bg-[#f8fafc]"
                          }`}
                        >
                          Cũ nhất
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                {isLoading ? (
                  <p className="text-sm text-slate-500">Đang tải ứng viên...</p>
                ) : null}

                {!isLoading && !enrichedCandidates.length ? (
                  <p className="text-sm text-slate-500">Chưa có ứng viên.</p>
                ) : (
                  <div className="space-y-4">
                    {enrichedCandidates.map((candidate) => (
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
                              Jobs đã nộp
                            </p>
                            <p className="max-w-[320px] text-[16px] text-[#0a1629]">
                              {getAppliedJobsLabel(candidate.appliedJobs)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[14px] text-[#91929e]">
                              Trạng thái mới nhất
                            </p>
                            <p className="text-[16px] text-[#0a1629]">
                              {candidate.appliedJobs[0]?.statusLabel || "Chưa xử lý"}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

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
        </div>

        {recruiterActivity.isActivityPanelOpen ? (
          <ActivityPanel
            notifications={recruiterActivity.notifications}
            upcomingInterviews={recruiterActivity.upcomingInterviews}
            isLoading={recruiterActivity.isActivityLoading}
            error={recruiterActivity.activityError}
            unreadCount={recruiterActivity.unreadNotificationCount}
            onMarkAllAsRead={recruiterActivity.markAllNotificationsAsRead}
            onClose={recruiterActivity.closeActivityPanel}
          />
        ) : null}
      </div>
    </div>
  );
}
