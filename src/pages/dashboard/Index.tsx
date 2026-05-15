import React from "react";
import { useQuery } from "@tanstack/react-query";
import "./dashboard.css";

import GlobalHeader from "../../components/GlobalHeader";
import WelcomeSection from "./components/WelcomeSection";
import JobMatchesSection from "./components/JobMatchesSection";
import AIReportsSection from "./components/AIReportsSection";
import RecentMockSection from "./components/RecentMockSection";
import Footer from "./components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
  (typeof window !== "undefined" ? window.location.origin : "");

const buildApiUrl = (path: string): string => {
  return new URL(
    path,
    API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`,
  ).toString();
};

const Dashboard: React.FC = () => {
  // Fetch dashboard data
  // Note: We use useQuery to fetch from the API. We mock the base URL depending on your setup.
  // The endpoint is /api/candidate-profiles/me/dashboard
  
  const fetchDashboardData = async () => {
    // Fetch dashboard data from the real API with Bearer token authentication
    const token = localStorage.getItem("accessToken") || "";
    
    if (!token) {
      throw new Error("Không tìm thấy token truy cập.");
    }
    
    const response = await fetch(buildApiUrl("api/candidate-profiles/me/dashboard"), {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu bảng điều khiển.");
    }

    const json = await response.json();
    return json.data;
  };

  const { data } = useQuery({
    queryKey: ['candidate-dashboard'],
    queryFn: fetchDashboardData,
    initialData: {
      profile: {
        id: "",
        fullName: "Ứng viên",
        avatarUrl: null,
        role: "candidate",
        hasProfile: false,
        completionPercentage: 0,
        status: "incomplete",
        nextRecommendedFields: []
      },
      quickStats: {
        appliedJobs: 0,
        matchedJobs: 0,
        profileCompletion: 0
      },
      jobMatches: []
    }
  });

  return (
    <div className="dashboard-container">
      <GlobalHeader userName={data?.profile?.fullName || "Ứng viên"} />
      
      <main className="dashboard-main">
        <div className="dashboard-content-wrapper">
          <WelcomeSection 
            profile={data?.profile || { fullName: "Ứng viên", avatarUrl: null, completionPercentage: 0 }} 
            stats={data?.quickStats || { appliedJobs: 0, matchedJobs: 0, profileCompletion: 0 }} 
          />
          
          <JobMatchesSection 
            jobs={data?.jobMatches || []} 
            firstName={data?.profile?.fullName?.split(" ").pop() || "ỨNG VIÊN"} 
            overallScore={84} // Hardcoded for design consistency, could be computed
          />
          
          <AIReportsSection reports={data?.aiInterviewReports || []} />
          
          <RecentMockSection mockData={data?.recentMockInterview || null} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
