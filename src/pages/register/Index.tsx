import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../../assets/Logo.png';
import backgroundForPC from '../../assets/BackgroundforPC.png';
import { checkHrEmailAvailability, hasValidStoredAccessToken, registerHrUser } from '../../services/auth';
import MobileViewportScaler from '../login/components/MobileViewportScaler';
import MobileFormScreen from './components/MobileFormScreen';
import MobileIntroScreen from './components/MobileIntroScreen';
import RegisterFormCard from './components/RegisterFormCard';

type MobileStep = 'intro' | 'form';
type HrGender = 'Nam' | 'Nữ' | 'Khác';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState<HrGender | ''>('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDesktop, setIsDesktop] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia('(min-width: 1024px)').matches;
    });
    const [mobileStep, setMobileStep] = useState<MobileStep>('intro');

    useEffect(() => {
        if (hasValidStoredAccessToken()) {
            navigate('/', { replace: true });
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

    const handleCheckEmailAvailability = async (email: string) => {
        await checkHrEmailAvailability(email);
    };

    const handleSubmit = async () => {
        const normalizedFullName = fullName.trim();
        const normalizedIdentifier = identifier.trim();
        const normalizedPassword = password.trim();
        const normalizedConfirmPassword = confirmPassword.trim();
        const normalizedPhone = phone.trim();
        const normalizedAvatarUrl = avatarUrl.trim();
        const normalizedLinkedinUrl = linkedinUrl.trim();
        const normalizedGithubUrl = githubUrl.trim();
        const normalizedFacebookUrl = facebookUrl.trim();

        setErrorMessage('');

        if (!normalizedFullName || !normalizedIdentifier || !normalizedPassword || !normalizedConfirmPassword) {
            setErrorMessage('Please enter full name, email, password, and confirm password.');
            return;
        }

        if (normalizedPassword !== normalizedConfirmPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (!normalizedIdentifier.includes('@')) {
            setErrorMessage('Email không hợp lệ.');
            return;
        }

        try {
            setIsSubmitting(true);
            await registerHrUser({
                fullName: normalizedFullName,
                email: normalizedIdentifier,
                password: normalizedPassword,
                phone: normalizedPhone || undefined,
                gender: gender || undefined,
                avatarUrl: normalizedAvatarUrl || undefined,
                linkedinUrl: normalizedLinkedinUrl || undefined,
                githubUrl: normalizedGithubUrl || undefined,
                facebookUrl: normalizedFacebookUrl || undefined,
            });
            navigate('/login', {
                replace: true,
                state: {
                    registrationSuccess: true,
                    identifier: normalizedIdentifier,
                },
            });
        } catch (error) {
            const fallbackMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
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
                        fullName={fullName}
                        identifier={identifier}
                        password={password}
                        confirmPassword={confirmPassword}
                        phone={phone}
                        gender={gender}
                        avatarUrl={avatarUrl}
                        linkedinUrl={linkedinUrl}
                        githubUrl={githubUrl}
                        facebookUrl={facebookUrl}
                        isSubmitting={isSubmitting}
                        errorMessage={errorMessage}
                        onFullNameChange={setFullName}
                        onIdentifierChange={setIdentifier}
                        onPasswordChange={setPassword}
                        onConfirmPasswordChange={setConfirmPassword}
                        onPhoneChange={setPhone}
                        onGenderChange={setGender}
                        onAvatarUrlChange={setAvatarUrl}
                        onLinkedinUrlChange={setLinkedinUrl}
                        onGithubUrlChange={setGithubUrl}
                        onFacebookUrlChange={setFacebookUrl}
                        onCheckEmailAvailability={handleCheckEmailAvailability}
                        onSubmit={handleSubmit}
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
                        <div className="relative z-10 pt-3 sm:pt-4 lg:pt-3 mb-2 lg:mb-2">
                            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full overflow-hidden bg-white shadow-[0_14px_30px_rgba(34,22,99,0.3)]">
                                <img
                                    src={avatarImage}
                                    alt="SEeds logo"
                                    className="w-full h-full object-contain p-2.5"
                                />
                            </div>
                        </div>

                        <div className="relative z-10 w-full bg-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] flex flex-col items-center px-6 xl:px-8 pt-4 lg:pt-4 pb-4 lg:pb-4 mb-0 rounded-t-[220px] rounded-b-none lg:flex-1">
                            <RegisterFormCard
                                fullName={fullName}
                                identifier={identifier}
                                password={password}
                                confirmPassword={confirmPassword}
                                phone={phone}
                                gender={gender}
                                avatarUrl={avatarUrl}
                                linkedinUrl={linkedinUrl}
                                githubUrl={githubUrl}
                                facebookUrl={facebookUrl}
                                isSubmitting={isSubmitting}
                                errorMessage={errorMessage}
                                showLoginLink
                                onFullNameChange={setFullName}
                                onIdentifierChange={setIdentifier}
                                onPasswordChange={setPassword}
                                onConfirmPasswordChange={setConfirmPassword}
                                onPhoneChange={setPhone}
                                onGenderChange={setGender}
                                onAvatarUrlChange={setAvatarUrl}
                                onLinkedinUrlChange={setLinkedinUrl}
                                onGithubUrlChange={setGithubUrl}
                                onFacebookUrlChange={setFacebookUrl}
                                onCheckEmailAvailability={handleCheckEmailAvailability}
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
