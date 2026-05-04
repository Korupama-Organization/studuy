import LandingPage from './LandingPage'
import LoginPage from './pages/login/Index'
import RegisterPage from './pages/register/Index'
import UpdateProfile from './pages/profile/UpdateProfile'
import UpdateProfileStep2 from './pages/profile/UpdateProfileStep2'
import UpdateProfileStep3 from './pages/profile/UpdateProfileStep3'
import UpdateProfileStep4 from './pages/profile/UpdateProfileStep4'
import { ProfileFormProvider } from './pages/profile/ProfileFormContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/*" element={<LoginPage />} />
                <Route path="/register/*" element={<RegisterPage />} />
                <Route path="/profile/update" element={<ProfileFormProvider><UpdateProfile /></ProfileFormProvider>} />
                <Route path="/profile/update/step2" element={<ProfileFormProvider><UpdateProfileStep2 /></ProfileFormProvider>} />
                <Route path="/profile/update/step3" element={<ProfileFormProvider><UpdateProfileStep3 /></ProfileFormProvider>} />
                <Route path="/profile/update/step4" element={<ProfileFormProvider><UpdateProfileStep4 /></ProfileFormProvider>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
