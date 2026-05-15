import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./recruiter.css";

import { dashboardService } from "../../services/dashboardService";
import RecruiterSidebar from "./components/RecruiterSidebar";
import RecruiterTopBar from "./components/RecruiterTopBar";
import StatsCards from "./components/StatsCards";
import ApplicationsBarChart from "./components/ApplicationsBarChart";
import StatusDonutChart from "./components/StatusDonutChart";
import RecentApplicationsTable from "./components/RecentApplicationsTable";
import ActivityPanel from "./components/ActivityPanel";

const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recruiter-dashboard"],
    queryFn: () => dashboardService.getDashboard("week"),
    retry: 1,
  });

  // Handle 401 errors — redirect to login
  React.useEffect(() => {
    if (isError && error instanceof Error && error.message.includes("401")) {
      navigate("/login", { replace: true });
    }
  }, [isError, error, navigate]);

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="rd-layout">
        <RecruiterSidebar />
        <div className="rd-body">
          <div className="rd-content-area">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, minHeight: "80vh" }}>
              <div style={{ textAlign: "center", color: "#94a3b8" }}>
                <svg style={{ margin: "0 auto 1rem", display: "block", animation: "spin 1s linear infinite" }} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ fontSize: "0.9rem" }}>Đang tải dữ liệu...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (isError) {
    return (
      <div className="rd-layout">
        <RecruiterSidebar />
        <div className="rd-body">
          <div className="rd-content-area">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, minHeight: "80vh" }}>
              <div style={{ textAlign: "center", color: "#ef4444" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
                <p style={{ fontSize: "0.9rem" }}>
                  {error instanceof Error ? error.message : "Không thể tải dữ liệu bảng điều khiển."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Render Dashboard ── */
  return (
    <div className="rd-layout">
      <RecruiterSidebar activeItem="dashboard" />

      <div className="rd-body">
        <div className="rd-content-area">
          {/* Top Bar */}
          <RecruiterTopBar
            recruiter={data?.recruiter ?? null}
            company={data?.company ?? null}
          />

          {/* Main content */}
          <div className="rd-main">
            {/* Stats */}
            <StatsCards
              stats={data?.stats ?? {
                candidates: { value: 0, trend: "+0%" },
                positions: { value: 0 },
                cvsReceived: { value: 0 },
                hired: { value: 0 },
              }}
            />

            {/* Charts */}
            <div className="rd-charts-row">
              <ApplicationsBarChart data={data?.chartData ?? []} />
              <StatusDonutChart
                statusOverview={data?.statusOverview ?? { total: 0, items: [] }}
              />
            </div>

            {/* Recent Applications */}
            <RecentApplicationsTable
              applications={data?.recentApplications ?? []}
            />
          </div>
        </div>

        {/* Right Activity Panel */}
        <ActivityPanel
          notifications={data?.notifications ?? []}
          upcomingInterviews={data?.upcomingInterviews ?? []}
        />
      </div>
    </div>
  );
};

export default RecruiterDashboard;
