import { useEffect, useState } from 'react'
import LandingPage from './LandingPage'
import RegisterPage from './RegisterPage'

const getPathname = () => {
    if (typeof window === 'undefined') {
        return '/'
    }
    return window.location.pathname || '/'
}

function App() {
    const [pathname, setPathname] = useState<string>(() => getPathname())

    useEffect(() => {
        const handlePopState = () => setPathname(getPathname())
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    const normalizedPath = pathname.replace(/\/+$/, '') || '/'
    const isRegisterRoute = normalizedPath === '/register'

    if (isRegisterRoute) {
        return <RegisterPage />
    }

    return <LandingPage />
}

export default App
