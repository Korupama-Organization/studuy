import LandingPage from './LandingPage'
import LoginPage from './pages/login/Index'
import RegisterPage from './pages/register/Index'
import Dashboard from './pages/recuit_dashboard/dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/*" element={<LoginPage />} />
                <Route path="/register/*" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
