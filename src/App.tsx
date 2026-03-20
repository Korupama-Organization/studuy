import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './auth/login';
import ForgotPasswordPage from './auth/forgotpassword';
import OptForgotPasswordPage from './auth/opt_forgotpassword';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/opt-forgot-password" element={<OptForgotPasswordPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
