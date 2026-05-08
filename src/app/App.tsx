import LandingPage from '../pages/landing/Index';
import JobsPage from '../pages/jobs/Index';
import LoginPage from '../pages/login/Index';
import RegisterPage from '../pages/register/Index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/register/*" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
