import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatarImage from "../../assets/Avatar.png";
import backgroundForPC from "../../assets/BackgroundforPC.png";
import {
    getStoredAccessToken,
    loginNormalAuth,
    storeAuthSession,
    loginWithUIT,
} from "../../services/auth";
import LoginFormCard from "./components/LoginFormCard";
import MobileFormScreen from "./components/MobileFormScreen";
import MobileIntroScreen from "./components/MobileIntroScreen";
import MobileViewportScaler from "./components/MobileViewportScaler";

type MobileStep = 'intro' | 'form';

export default function LoginPage() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDesktop, setIsDesktop] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia('(min-width: 1024px)').matches;
    });
    const [mobileStep, setMobileStep] = useState<MobileStep>('intro');

    useEffect(() => {
        if (getStoredAccessToken()) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');

        const onMediaChange = (event: MediaQueryListEvent) => {
            setIsDesktop(event.matches);
        };

        setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener('change', onMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', onMediaChange);
        };
    }, []);

    useEffect(() => {
        if (isDesktop) {
            setMobileStep('form');
        }
    }, [isDesktop]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedIdentifier = identifier.trim();
        const normalizedPassword = password.trim();

        setErrorMessage("");

        if (!normalizedIdentifier || !normalizedPassword) {
            setErrorMessage("Please enter your email or student ID and password.");
            return;
        }

        try {
            setIsSubmitting(true);

            // handle UIT authentication first with checking identifier is not an email
            if (normalizedIdentifier.includes('@')) {
                var result = await loginNormalAuth(normalizedIdentifier, normalizedPassword);
            }
            else{
                var result = await loginWithUIT(normalizedIdentifier, normalizedPassword);
            }
            storeAuthSession(result);
            navigate("/", { replace: true });
        } catch (error) {
            const fallbackMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
            setErrorMessage(
                error instanceof Error && error.message.trim()
                    ? error.message
                    : fallbackMessage,
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isDesktop) {
        return (
            <MobileViewportScaler>
                {mobileStep === 'intro' ? (
                    <MobileIntroScreen onContinue={() => setMobileStep('form')} />
                ) : (
                    <MobileFormScreen
                        identifier={identifier}
                        password={password}
                        isSubmitting={isSubmitting}
                        errorMessage={errorMessage}
                        onIdentifierChange={setIdentifier}
                        onPasswordChange={setPassword}
                        onSubmit={handleSubmit}
                        onBack={() => setMobileStep('intro')}
                    />
                )}
            </MobileViewportScaler>
        );
    }

    return (
        <div className="min-h-dvh bg-[#ECEFFF] lg:bg-transparent font-inter">
            <div className="min-h-dvh lg:flex">
                <div className="relative w-full lg:w-[390px] xl:w-[440px] 2xl:w-[480px] flex-shrink-0 bg-gradient-to-b from-[#4D55CC] to-[#8B4CFF] px-4 sm:px-6 lg:px-0">
                    <div className="mx-auto w-full max-w-[460px] lg:max-w-none lg:min-h-screen lg:flex lg:flex-col lg:items-center">
                        <div className="relative z-10 pt-5 sm:pt-6 lg:pt-5 mb-4 lg:mb-3">
                            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden shadow-[0_14px_30px_rgba(34,22,99,0.3)]">
                                <img
                                    src={avatarImage}
                                    alt="SEeds logo"
                                    className="w-full h-full object-cover scale-125 -translate-y-1"
                                />
                            </div>
                        </div>

                        <div className="relative z-10 w-full bg-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] flex flex-col items-center px-7 xl:px-10 pt-6 lg:pt-5 pb-7 lg:pb-6 mb-0 rounded-t-[220px] rounded-b-none lg:flex-1">
                            <LoginFormCard
                                identifier={identifier}
                                password={password}
                                isSubmitting={isSubmitting}
                                errorMessage={errorMessage}
                                showRegisterLink
                                onIdentifierChange={setIdentifier}
                                onPasswordChange={setPassword}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#F4F6FF]">
                    <img
                        src={backgroundForPC}
                        alt="SEeds background"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
