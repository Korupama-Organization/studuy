import React from "react";
import { useQuery } from "@tanstack/react-query";
import "./dashboard.css";

import GlobalHeader from "../../components/GlobalHeader";
import WelcomeSection from "./components/WelcomeSection";
import JobMatchesSection from "./components/JobMatchesSection";
import AIReportsSection from "./components/AIReportsSection";
import RecentMockSection from "./components/RecentMockSection";
import Footer from "./components/Footer";
import {
  getCandidateDashboard,
  type CandidateDashboardData,
} from "../../services/candidateProfile";

const fallbackDashboardData: CandidateDashboardData = {
  profile: {
    id: "",
    fullName: "Ứng viên",
    avatarUrl: null,
    role: "candidate",
    hasProfile: false,
    completionPercentage: 0,
    status: "incomplete",
    nextRecommendedFields: [],
  },
  quickStats: {
    appliedJobs: 0,
    matchedJobs: 0,
    profileCompletion: 0,
    interviews: 0,
    savedJobs: 0,
  },
  jobMatches: [],
  aiInterviewReports: [],
  recentMockInterview: null,
};

const CandidateDashboard: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["candidate-dashboard"],
    queryFn: () => getCandidateDashboard(),
    select: (res) => res.data,
    retry: 1,
  });

  const dashboardData = data ?? fallbackDashboardData;
  const profile = dashboardData.profile;
  const stats = dashboardData.quickStats;
  const jobMatches = dashboardData.jobMatches ?? [];
  const firstName = profile.fullName.split(" ").pop() || "ỨNG VIÊN";

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <GlobalHeader userName="Ứng viên" />
        <main className="dashboard-main">
          <div
            className="dashboard-content-wrapper"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
          >
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              <svg
                style={{ margin: "0 auto 1rem", display: "block", animation: "cd-spin 1s linear infinite" }}
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <style>{`@keyframes cd-spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: "0.9rem" }}>Đang tải dữ liệu...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-container">
        <GlobalHeader userName="Ứng viên" />
        <main className="dashboard-main">
          <div
            className="dashboard-content-wrapper"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
              <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>
                {error instanceof Error ? error.message : "Không thể tải dữ liệu bảng điều khiển."}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <GlobalHeader userName={profile.fullName} />

      <main className="dashboard-main">
        <div className="dashboard-content-wrapper">
          <WelcomeSection profile={profile} stats={stats} />

          <JobMatchesSection
            jobs={jobMatches}
            firstName={firstName}
            overallScore={stats.profileCompletion ?? profile.completionPercentage}
          />

          <AIReportsSection reports={dashboardData.aiInterviewReports ?? []} />

          <RecentMockSection mockData={dashboardData.recentMockInterview ?? null} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CandidateDashboard;
