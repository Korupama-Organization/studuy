import LandingPage from '../pages/landing/Index';
import JobsPage from '../pages/jobs/Index';
import RecruiterManagementPage from '../pages/recruiter_managment/Index';
import LoginPage from '../pages/login/Index';
import RegisterPage from '../pages/register/Index';
import DashboardPage from '../pages/dashboard/Index';
import CompanyPage from '../pages/company/Index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register/*" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
