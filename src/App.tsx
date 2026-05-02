import LandingPage from './LandingPage'
import LoginPage from './pages/login/Index'
import RegisterPage from './pages/register/Index'
import UpdateProfile from './pages/profile/UpdateProfile'
import UpdateProfileStep2 from './pages/profile/UpdateProfileStep2'
import UpdateProfileStep3 from './pages/profile/UpdateProfileStep3'
import UpdateProfileStep4 from './pages/profile/UpdateProfileStep4'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/*" element={<LoginPage />} />
                <Route path="/register/*" element={<RegisterPage />} />
                <Route path="/profile/update" element={<UpdateProfile />} />
                <Route path="/profile/update/step2" element={<UpdateProfileStep2 />} />
                <Route path="/profile/update/step3" element={<UpdateProfileStep3 />} />
                <Route path="/profile/update/step4" element={<UpdateProfileStep4 />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
