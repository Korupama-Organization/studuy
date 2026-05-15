import { useEffect, type ReactNode } from 'react';
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
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  getStoredAccessToken,
  getStoredAccessTokenExpiry,
  getStoredUserRole,
  hasValidStoredAccessToken,
} from '../services/auth';

const queryClient = new QueryClient();

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password'];

const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

const getRoleDashboard = (role: string | null): string => {
  switch (role) {
    case 'candidate':
      return '/candidate/dashboard';
    case 'recruiter':
    case 'hr':
      return '/recruiter/dashboard';
    default:
      return '/';
  }
};

function AuthSessionGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPublicPath(location.pathname)) {
      return;
    }

    const expiry = getStoredAccessTokenExpiry();
    if (!expiry) {
      navigate('/login', { replace: true });
      return;
    }

    const remainingMs = expiry * 1000 - Date.now();
    if (remainingMs <= 0) {
      navigate('/login', { replace: true });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate('/login', { replace: true });
    }, remainingMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname, navigate]);

  return null;
}

function ProtectedRoute({
  children,
  requiredRoles,
}: {
  children: ReactNode;
  requiredRoles?: string[];
}) {
  const token = getStoredAccessToken();
  const isAuthenticated = hasValidStoredAccessToken();

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles?.length) {
    const role = getStoredUserRole();
    if (!role || !requiredRoles.includes(role)) {
      return <Navigate to={getRoleDashboard(role)} replace />;
    }
  }

  return <>{children}</>;
}

function CandidateProfileLayout() {
  return (
    <ProfileFormProvider>
      <Outlet />
    </ProfileFormProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthSessionGuard />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register/*" element={<RegisterPage />} />

          <Route path="/dashboard" element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="/jobs" element={<Navigate to="/candidate/jobs" replace />} />

          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute requiredRoles={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/jobs"
            element={
              <ProtectedRoute requiredRoles={['candidate']}>
                <CandidateJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/profile/update"
            element={
              <ProtectedRoute requiredRoles={['candidate']}>
                <CandidateProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UpdateProfile />} />
            <Route path="step2" element={<UpdateProfileStep2 />} />
            <Route path="step3" element={<UpdateProfileStep3 />} />
            <Route path="step4" element={<UpdateProfileStep4 />} />
          </Route>

          <Route
            path="/recruiter/company"
            element={
              <ProtectedRoute requiredRoles={['recruiter', 'hr']}>
                <CompanyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute requiredRoles={['recruiter', 'hr']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute requiredRoles={['recruiter', 'hr']}>
                <RecruiterJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/management"
            element={
              <ProtectedRoute requiredRoles={['recruiter', 'hr']}>
                <RecruiterManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/candidates"
            element={
              <ProtectedRoute requiredRoles={['recruiter', 'hr']}>
                <RecruiterCandidatesPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
