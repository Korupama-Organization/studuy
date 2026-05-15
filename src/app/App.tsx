import React from 'react';
import LandingPage from '../pages/landing/Index';
import JobsPage from '../pages/jobs/Index';
import LoginPage from '../pages/login/Index';
import RegisterPage from '../pages/register/Index';
import CandidateDashboard from '../pages/dashboard/Index';
import RecruiterDashboard from '../pages/recruiter_dashboard/Index';
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

          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register/*" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
