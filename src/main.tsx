import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import { installAuthRedirectInterceptor } from './services/auth'
import App from './app/App'

installAuthRedirectInterceptor()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
