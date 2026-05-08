import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../../assets/Logo.png';
import backgroundForPC from '../../assets/BackgroundforPC.png';
import { 
    checkHrEmailAvailability, 
    hasValidStoredAccessToken, 
    registerHrUser, 
    loginNormalAuth, 
    storeAuthSession, 
    createCompany 
} from '../../services/auth';
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
    
    // Company fields
    const [companyName, setCompanyName] = useState('');
    const [companyShortName, setCompanyShortName] = useState('');
    const [companyLogoUrl, setCompanyLogoUrl] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [companyDescription, setCompanyDescription] = useState('');
    const [companyType, setCompanyType] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
    const [companyTechStack, setCompanyTechStack] = useState<string>('Node.js, TypeScript, MongoDB');
    const [companyBenefits, setCompanyBenefits] = useState<string>('Flexible time, Laptop support');
    const [companyTargetRoles, setCompanyTargetRoles] = useState<string>('Backend Developer, QA Engineer');
    const [usingAIInterview, setUsingAIInterview] = useState(false);
    const [usingManualInterview, setUsingManualInterview] = useState(true);

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
        
        const normalizedCompanyName = companyName.trim();
        const normalizedCompanyWebsite = companyWebsite.trim();
        const normalizedCompanyAddress = companyAddress.trim();

        setErrorMessage('');

        if (!normalizedFullName || !normalizedIdentifier || !normalizedPassword || !normalizedConfirmPassword) {
            setErrorMessage('Vui lòng nhập đầy đủ họ tên, email và mật khẩu.');
            return;
        }

        if (!normalizedCompanyName || !normalizedCompanyWebsite || !normalizedCompanyAddress) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin công ty.');
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
            
            // 1. Register HR user
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

            // 2. Auto-login to get token
            const loginResult = await loginNormalAuth(normalizedIdentifier, normalizedPassword);
            storeAuthSession(loginResult);

            // 3. Create company using the provided detailed template
            await createCompany(loginResult.accessToken, {
                name: normalizedCompanyName,
                shortName: companyShortName.trim() || normalizedCompanyName.slice(0, 10),
                logoUrl: companyLogoUrl.trim() || "https://seeds.example.com/logo.png",
                website: normalizedCompanyWebsite,
                email: normalizedIdentifier,
                phone: normalizedPhone || "0909123456",
                address: normalizedCompanyAddress,
                description: companyDescription.trim() || "Company profile for first-time recruiter team",
                location: [
                  {
                    address: normalizedCompanyAddress,
                    city: "Ho Chi Minh",
                    country: "Vietnam"
                  }
                ],
                workingEnvironment: {
                  type: companyType,
                  techStack: companyTechStack.split(',').map(s => s.trim()).filter(Boolean),
                  benefits: companyBenefits.split(',').map(s => s.trim()).filter(Boolean)
                },
                socialMediaLinks: [
                  {
                    platform: "LinkedIn",
                    url: normalizedLinkedinUrl || "https://www.linkedin.com/company/seeds-technology"
                  },
                  {
                    platform: "Facebook",
                    url: normalizedFacebookUrl || "https://facebook.com/seeds.technology"
                  }
                ],
                recruitingPreferences: {
                  targetRoles: companyTargetRoles.split(',').map(s => s.trim()).filter(Boolean),
                  targetLevels: [{ level: "Intern" }, { level: "Fresher" }],
                  usingAIInterview: usingAIInterview,
                  usingManualInterview: usingManualInterview
                },
                partnerStatus: "inactive"
            });

            // 4. Redirect to dashboard
            navigate('/dashboard', { replace: true });

        } catch (error) {
            const fallbackMessage = 'Đăng ký hoặc tạo công ty thất bại. Vui lòng thử lại.';
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
                        companyName={companyName}
                        companyShortName={companyShortName}
                        companyLogoUrl={companyLogoUrl}
                        companyWebsite={companyWebsite}
                        companyAddress={companyAddress}
                        companyDescription={companyDescription}
                        companyType={companyType}
                        companyTechStack={companyTechStack}
                        companyBenefits={companyBenefits}
                        companyTargetRoles={companyTargetRoles}
                        usingAIInterview={usingAIInterview}
                        usingManualInterview={usingManualInterview}
                        onCompanyNameChange={setCompanyName}
                        onCompanyShortNameChange={setCompanyShortName}
                        onCompanyLogoUrlChange={setCompanyLogoUrl}
                        onCompanyWebsiteChange={setCompanyWebsite}
                        onCompanyAddressChange={setCompanyAddress}
                        onCompanyDescriptionChange={setCompanyDescription}
                        onCompanyTypeChange={setCompanyType}
                        onCompanyTechStackChange={setCompanyTechStack}
                        onCompanyBenefitsChange={setCompanyBenefits}
                        onCompanyTargetRolesChange={setCompanyTargetRoles}
                        onUsingAIInterviewChange={setUsingAIInterview}
                        onUsingManualInterviewChange={setUsingManualInterview}
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
                                companyName={companyName}
                                companyShortName={companyShortName}
                                companyLogoUrl={companyLogoUrl}
                                companyWebsite={companyWebsite}
                                companyAddress={companyAddress}
                                companyDescription={companyDescription}
                                companyType={companyType}
                                companyTechStack={companyTechStack}
                                companyBenefits={companyBenefits}
                                companyTargetRoles={companyTargetRoles}
                                usingAIInterview={usingAIInterview}
                                usingManualInterview={usingManualInterview}
                                onCompanyNameChange={setCompanyName}
                                onCompanyShortNameChange={setCompanyShortName}
                                onCompanyLogoUrlChange={setCompanyLogoUrl}
                                onCompanyWebsiteChange={setCompanyWebsite}
                                onCompanyAddressChange={setCompanyAddress}
                                onCompanyDescriptionChange={setCompanyDescription}
                                onCompanyTypeChange={setCompanyType}
                                onCompanyTechStackChange={setCompanyTechStack}
                                onCompanyBenefitsChange={setCompanyBenefits}
                                onCompanyTargetRolesChange={setCompanyTargetRoles}
                                onUsingAIInterviewChange={setUsingAIInterview}
                                onUsingManualInterviewChange={setUsingManualInterview}
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
