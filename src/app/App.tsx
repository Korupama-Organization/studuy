import React from 'react';
import LandingPage from '../pages/landing/Index';
import LoginPage from '../pages/login/Index';
import RegisterPage from '../pages/register/Index';
import CandidateDashboard from '../pages/dashboard/Index';
import CandidateJobsPage from '../pages/candidate_jobs/Index';
import UpdateProfile from '../pages/profile/UpdateProfile';
import UpdateProfileStep2 from '../pages/profile/UpdateProfileStep2';
import UpdateProfileStep3 from '../pages/profile/UpdateProfileStep3';
import UpdateProfileStep4 from '../pages/profile/UpdateProfileStep4';
import { ProfileFormProvider } from '../pages/profile/ProfileFormContext';
import NotFound from '../pages/not-found/Index';
import CompanyPage from '../pages/company/Index';
import RecruiterDashboard from '../pages/recruiter_dashboard/Index';
import RecruiterJobsPage from '../pages/jobs/Index';
import RecruiterManagementPage from '../pages/recruiter_management/Index';
import RecruiterCandidatesPage from '../pages/recruiter_candidates/Index';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getStoredAccessToken, getStoredUserRole, hasValidStoredAccessToken } from '../services/auth';

const queryClient = new QueryClient();

function getRoleDashboard(role: string | null): string {
  switch (role) {
    case 'candidate':
      return '/dashboard';
    case 'recruiter':
    case 'hr':
      return '/recruiter/dashboard';
    default:
      return '/';
  }
}

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const token = getStoredAccessToken();
  const isAuthenticated = hasValidStoredAccessToken();

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const role = getStoredUserRole();
    if (role !== requiredRole) {
      return <Navigate to={getRoleDashboard(role)} replace />;
    }
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Candidate Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />

          {/* Recruiter / HR Dashboard */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register/*" element={<RegisterPage />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile/update" element={<ProfileFormProvider><UpdateProfile /></ProfileFormProvider>} />
          <Route path="/candidate/profile/update/step2" element={<ProfileFormProvider><UpdateProfileStep2 /></ProfileFormProvider>} />
          <Route path="/candidate/profile/update/step3" element={<ProfileFormProvider><UpdateProfileStep3 /></ProfileFormProvider>} />
          <Route path="/candidate/profile/update/step4" element={<ProfileFormProvider><UpdateProfileStep4 /></ProfileFormProvider>} />
          <Route path="/candidate/jobs" element={<CandidateJobsPage />} />

          <Route path="/recruiter/company" element={<CompanyPage />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
          <Route path="/recruiter/management" element={<RecruiterManagementPage />} />
          <Route path="/recruiter/candidates" element={<RecruiterCandidatesPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
