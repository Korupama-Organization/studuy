import LandingPage from '../pages/landing/Index';
import LoginPage from '../pages/login/Index';
import RegisterPage from '../pages/register/Index';
import DashboardPage from '../pages/dashboard/Index';
import CandidateJobsPage from '../pages/candidate_jobs/Index';
import UpdateProfile from '../pages/profile/UpdateProfile';
import UpdateProfileStep2 from '../pages/profile/UpdateProfileStep2';
import UpdateProfileStep3 from '../pages/profile/UpdateProfileStep3';
import UpdateProfileStep4 from '../pages/profile/UpdateProfileStep4';

import NotFound from '../pages/not-found/Index';

import CompanyPage from '../pages/company/Index';
import RecruiterDashboard from '../pages/recruiter_dashboard/RecruiterDashboard';
import RecruiterJobsPage from '../pages/jobs/Index';
import RecruiterManagementPage from '../pages/recruiter_management/Index';
import RecruiterCandidatesPage from '../pages/recruiter_candidates/Index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register/*" element={<RegisterPage />} />
          <Route path="/candidate/dashboard" element={<DashboardPage />} />
          <Route path="/candidate/jobs" element={<CandidateJobsPage />} />
          <Route path="/candidate/profile/update" element={<UpdateProfile />} />
          <Route path="/candidate/profile/update/step2" element={<UpdateProfileStep2 />} />
          <Route path="/candidate/profile/update/step3" element={<UpdateProfileStep3 />} />
          <Route path="/candidate/profile/update/step4" element={<UpdateProfileStep4 />} />


          <Route path="/recruiter/company" element={<CompanyPage />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
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
