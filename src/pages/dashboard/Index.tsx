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
    // In a real app, you would have an interceptor to add the Bearer token.
    // For this UI demo, we will check if there's a token or just mock the request if it fails.
    const token = localStorage.getItem("token") || ""; // Adjust based on your auth implementation
    
    const response = await fetch(buildApiUrl("api/candidate-profiles/me/dashboard"), {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const json = await response.json();
    return json.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidate-dashboard'],
    queryFn: fetchDashboardData,
    // Add some fallback data if the API is not ready or user is not logged in properly during UI review
    initialData: {
      profile: {
        fullName: "Nguyễn Văn A",
        avatarUrl: null,
        completionPercentage: 45,
      },
      quickStats: {
        appliedJobs: 10,
        matchedJobs: 3,
        profileCompletion: 45,
        interviews: 2,
        savedJobs: 5
      },
      jobMatches: [
        {
          jobId: "1",
          title: "Senior Backend Engineer (Python)",
          company: { name: "CodeQuest Solutions", logoUrl: null },
          location: "Hanoi, Vietnam",
          matchScore: 85
        },
        {
          jobId: "2",
          title: "Full Stack Developer",
          company: { name: "TechVision Inc.", logoUrl: null },
          location: "Ho Chi Minh City, Vietnam",
          matchScore: 78
        },
        {
          jobId: "3",
          title: "DevOps Engineer",
          company: { name: "CloudNine Systems", logoUrl: null },
          location: "Da Nang, Vietnam",
          matchScore: 72
        }
      ],
      aiInterviewReports: [
        { id: "APP-2024-001", comment: "Excellent problem-solving skills and strong technical knowledge.", status: "Passed", videoUrl: null },
        { id: "APP-2024-002", comment: "Demonstrates potential but lacks depth in advanced algorithms.", status: "Pending", videoUrl: null }
      ],
      recentMockInterview: {
        id: "mock-1",
        overallScore: 84,
        scores: {
          "Experience": 8.5,
          "Technical": 9.0,
          "Domain": 7.5,
          "Problem solving": 8.0,
          "Communication": 7.0,
          "Motivation": 9.0
        },
        summary: "The candidate demonstrates strong technical proficiency and exceptional motivation for the role."
      }
    }
  });

  return (
    <div className="dashboard-container">
      <GlobalHeader userName={data?.profile?.fullName || "Candidate"} />
      
      <main className="dashboard-main">
        <div className="dashboard-content-wrapper">
          <WelcomeSection 
            profile={data?.profile || { fullName: "Candidate", avatarUrl: null, completionPercentage: 0 }} 
            stats={data?.quickStats || { appliedJobs: 0, matchedJobs: 0, profileCompletion: 0 }} 
          />
          
          <JobMatchesSection 
            jobs={data?.jobMatches || []} 
            firstName={data?.profile?.fullName?.split(" ").pop() || "CANDIDATE"} 
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
