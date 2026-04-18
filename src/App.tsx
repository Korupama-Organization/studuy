import LandingPage from './LandingPage'
import LoginPage from './pages/login/Index'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/*" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
