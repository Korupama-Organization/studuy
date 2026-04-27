import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CredentialInput from '../../login/components/CredentialInput';

const EMAIL_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/envelope.svg';
const PASSWORD_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/key.svg';
const USER_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/person.svg';
const PHONE_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/telephone.svg';
const LINK_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/link-45deg.svg';

type HrGender = 'Nam' | 'Nữ' | 'Khác';

interface RegisterFormCardProps {
    fullName: string;
    identifier: string;
    password: string;
    confirmPassword: string;
    phone: string;
    gender: HrGender | '';
    avatarUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    facebookUrl: string;
    isSubmitting: boolean;
    errorMessage: string;
    showLoginLink?: boolean;
    onFullNameChange: (value: string) => void;
    onIdentifierChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    onGenderChange: (value: HrGender | '') => void;
    onAvatarUrlChange: (value: string) => void;
    onLinkedinUrlChange: (value: string) => void;
    onGithubUrlChange: (value: string) => void;
    onFacebookUrlChange: (value: string) => void;
    onCheckEmailAvailability: (email: string) => Promise<void>;
    onSubmit: () => void;
}

export default function RegisterFormCard({
    fullName,
    identifier,
    password,
    confirmPassword,
    phone,
    gender,
    avatarUrl,
    linkedinUrl,
    githubUrl,
    facebookUrl,
    isSubmitting,
    errorMessage,
    showLoginLink = true,
    onFullNameChange,
    onIdentifierChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onPhoneChange,
    onGenderChange,
    onAvatarUrlChange,
    onLinkedinUrlChange,
    onGithubUrlChange,
    onFacebookUrlChange,
    onCheckEmailAvailability,
    onSubmit,
}: RegisterFormCardProps) {
    const isMobileFormLayout = !showLoginLink;
    const [currentStep, setCurrentStep] = useState(1);
    const [stepError, setStepError] = useState('');

    const steps = useMemo(
        () => [
            {
                id: 1,
                title: 'Thông tin',
                subtitle: 'Họ tên và email doanh nghiệp',
                sectionTitle: 'Thông tin tài khoản',
            },
            {
                id: 2,
                title: 'Bảo mật',
                subtitle: 'Mật khẩu, điện thoại, giới tính',
                sectionTitle: 'Bảo mật & Liên hệ',
            },
            {
                id: 3,
                title: 'Hồ sơ',
                subtitle: 'Avatar và mạng xã hội',
                sectionTitle: 'Hồ sơ chuyên nghiệp',
            },
        ],
        [],
    );

    const progressPercent = Math.round((currentStep / steps.length) * 100);
    const currentStepConfig = steps[currentStep - 1];

    useEffect(() => {
        const normalizedError = errorMessage.trim().toLowerCase();
        if (!normalizedError) {
            return;
        }

        const isEmailConflictError =
            normalizedError.includes('email is already registered') ||
            normalizedError.includes('email đã tồn tại');

        if (isEmailConflictError && currentStep !== 1) {
            setCurrentStep(1);
            setStepError('');
        }
    }, [errorMessage, currentStep]);

    const goToPreviousStep = () => {
        setStepError('');
        setCurrentStep((step) => Math.max(step - 1, 1));
    };

    const validateStep = (step: number): string => {
        const normalizedFullName = fullName.trim();
        const normalizedIdentifier = identifier.trim();
        const normalizedPassword = password.trim();
        const normalizedConfirmPassword = confirmPassword.trim();
        const normalizedPhone = phone.trim();

        if (step === 1) {
            if (!normalizedFullName || !normalizedIdentifier) {
                return 'Vui lòng nhập họ tên và email.';
            }

            if (!normalizedIdentifier.includes('@')) {
                return 'Email không hợp lệ.';
            }
        }

        if (step === 2) {
            if (!normalizedPassword || !normalizedConfirmPassword) {
                return 'Vui lòng nhập mật khẩu và xác nhận mật khẩu.';
            }

            if (normalizedPassword.length < 6) {
                return 'Mật khẩu phải có ít nhất 6 ký tự.';
            }

            if (normalizedPassword !== normalizedConfirmPassword) {
                return 'Mật khẩu xác nhận không khớp.';
            }

            if (normalizedPhone && normalizedPhone.length < 9) {
                return 'Số điện thoại không hợp lệ.';
            }
        }

        return '';
    };

    const goToNextStep = async () => {
        const validationMessage = validateStep(currentStep);
        if (validationMessage) {
            setStepError(validationMessage);
            return;
        }

        if (currentStep === 1) {
            try {
                await onCheckEmailAvailability(identifier.trim());
            } catch (error) {
                const fallbackMessage = 'Khong the kiem tra email.';
                setStepError(
                    error instanceof Error && error.message.trim()
                        ? error.message
                        : fallbackMessage,
                );
                return;
            }
        }

        setStepError('');
        setCurrentStep((step) => Math.min(step + 1, 3));
    };

    const handleFinalSubmit = async () => {
        const validationMessage = validateStep(currentStep);
        if (validationMessage) {
            setStepError(validationMessage);
            return;
        }

        setStepError('');
        onSubmit();
    };

    return (
        <div className="w-full min-h-full flex flex-col">
            <h1
                className="text-[#0A0A0A] text-center font-inter font-medium leading-[1.3] tracking-[-0.02em] mt-0.5 mb-2 sm:mb-3 lg:mb-2"
                style={{ fontSize: 'clamp(1.15rem, 3.4vw, 1.85rem)' }}
            >
                Đăng ký
                <br />
                tài khoản <span className="text-[#0A0A0A]">SEeds</span>
            </h1>

            <div className="mb-2 sm:mb-3 rounded-[18px] border border-[#E1E4F0] bg-[#F8F9FF] px-3 py-2.5 shadow-[0_6px_14px_rgba(26,28,73,0.1)]">
                <div className="grid grid-cols-3 gap-2 pb-1.5">
                    {steps.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div
                                key={step.id}
                                className={`rounded-[12px] border px-2 py-1.5 text-center transition-all ${isActive
                                    ? 'border-transparent bg-gradient-to-r from-[#6B63DE] to-[#D472E7] text-white shadow-[0_6px_14px_rgba(103,92,214,0.35)]'
                                    : isCompleted
                                        ? 'border-[#C9C6F8] bg-[#EEECFF] text-[#4E42C8]'
                                        : 'border-[#D8DCEB] bg-white text-[#6D748E]'
                                    }`}
                            >
                                <p
                                    className="font-semibold leading-tight"
                                    style={{ fontSize: 'clamp(0.72rem, 1.9vw, 0.8rem)' }}
                                >
                                    Bước {step.id}
                                </p>
                                <p
                                    className="mt-1 font-medium leading-tight"
                                    style={{ fontSize: 'clamp(0.66rem, 1.75vw, 0.76rem)' }}
                                >
                                    {step.title}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-1 flex items-center justify-between">
                    <p
                        className="text-[#7A8098] font-medium"
                        style={{ fontSize: 'clamp(0.68rem, 1.8vw, 0.78rem)' }}
                    >
                        Tiến độ hoàn thành
                    </p>
                    <p
                        className="text-[#4E42C8] font-bold"
                        style={{ fontSize: 'clamp(0.7rem, 1.9vw, 0.82rem)' }}
                    >
                        {progressPercent}%
                    </p>
                </div>
                <div className="mt-1 h-[6px] w-full overflow-hidden rounded-full bg-[#E3E5F3]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#D95DD8] to-[#8E8AF0] transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
                className={`w-full rounded-[18px] border border-[#E2E5F1] bg-[#F6F7FC] px-4 py-3 sm:px-5 sm:py-4 shadow-[0_8px_16px_rgba(24,27,73,0.08)] flex flex-col gap-3 sm:gap-3.5 lg:gap-3 ${isMobileFormLayout ? 'mt-2' : ''}`}
            >
                <div>
                    <div>
                        <h3
                            className="text-[#20243E] font-inter font-semibold"
                            style={{ fontSize: 'clamp(1rem, 2.55vw, 1.16rem)' }}
                        >
                            {currentStepConfig.sectionTitle}
                        </h3>
                    </div>

                    <div className="mt-3 space-y-3">
                        {currentStep === 1 ? (
                            <>
                                <CredentialInput
                                    label="Họ và tên"
                                    type="text"
                                    value={fullName}
                                    onChange={onFullNameChange}
                                    placeholder="Nhập họ và tên"
                                    iconUrl={USER_ICON_CDN}
                                    iconAlt="full name icon"
                                    autoComplete="name"
                                    autoCapitalize="words"
                                    compact
                                />

                                <CredentialInput
                                    label="Email"
                                    type="text"
                                    value={identifier}
                                    onChange={onIdentifierChange}
                                    placeholder="Nhập email công việc"
                                    iconUrl={EMAIL_ICON_CDN}
                                    iconAlt="Email icon"
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    labelClassName="pl-1.5"
                                    compact
                                />
                            </>
                        ) : null}

                        {currentStep === 2 ? (
                            <>
                                <CredentialInput
                                    label="Mật khẩu"
                                    type="password"
                                    value={password}
                                    onChange={onPasswordChange}
                                    placeholder="Nhập mật khẩu"
                                    iconUrl={PASSWORD_ICON_CDN}
                                    iconAlt="password icon"
                                    autoComplete="new-password"
                                    compact
                                />

                                <CredentialInput
                                    label="Xác nhận mật khẩu"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={onConfirmPasswordChange}
                                    placeholder="Nhập lại mật khẩu"
                                    iconUrl={PASSWORD_ICON_CDN}
                                    iconAlt="confirm password icon"
                                    autoComplete="new-password"
                                    compact
                                />

                                <CredentialInput
                                    label="Số điện thoại (không bắt buộc)"
                                    type="text"
                                    value={phone}
                                    onChange={onPhoneChange}
                                    placeholder="Ví dụ: 0901234567"
                                    iconUrl={PHONE_ICON_CDN}
                                    iconAlt="phone icon"
                                    autoComplete="tel"
                                    compact
                                />

                                <div className="flex flex-col gap-2 pb-1">
                                    <label
                                        className="text-[#0A0A0A] font-inter font-light"
                                        style={{ fontSize: 'clamp(0.9rem, 2.35vw, 1.05rem)' }}
                                    >
                                        Giới tính
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['Nam', 'Nữ', 'Khác'] as const).map((genderOption) => (
                                            <button
                                                key={genderOption}
                                                type="button"
                                                onClick={() => onGenderChange(genderOption)}
                                                className={`h-[44px] rounded-full border text-center transition-colors ${gender === genderOption
                                                    ? 'border-[#5E52D9] bg-[#E9E8FE] text-[#3D30B9]'
                                                    : 'border-[#D5D8E8] bg-white text-[#6C728C] hover:border-[#AAAED0]'
                                                    }`}
                                                style={{ fontSize: 'clamp(0.82rem, 2.1vw, 0.95rem)' }}
                                            >
                                                {genderOption}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {currentStep === 3 ? (
                            <>
                                <CredentialInput
                                    label="Avatar URL (không bắt buộc)"
                                    type="text"
                                    value={avatarUrl}
                                    onChange={onAvatarUrlChange}
                                    placeholder="https://..."
                                    iconUrl={LINK_ICON_CDN}
                                    iconAlt="avatar url icon"
                                    autoComplete="url"
                                    autoCapitalize="none"
                                    compact
                                />

                                <CredentialInput
                                    label="LinkedIn URL (không bắt buộc)"
                                    type="text"
                                    value={linkedinUrl}
                                    onChange={onLinkedinUrlChange}
                                    placeholder="https://linkedin.com/in/..."
                                    iconUrl={LINK_ICON_CDN}
                                    iconAlt="linkedin url icon"
                                    autoComplete="url"
                                    autoCapitalize="none"
                                    compact
                                />

                                <CredentialInput
                                    label="GitHub URL (không bắt buộc)"
                                    type="text"
                                    value={githubUrl}
                                    onChange={onGithubUrlChange}
                                    placeholder="https://github.com/..."
                                    iconUrl={LINK_ICON_CDN}
                                    iconAlt="github url icon"
                                    autoComplete="url"
                                    autoCapitalize="none"
                                    compact
                                />

                                <CredentialInput
                                    label="Facebook URL (không bắt buộc)"
                                    type="text"
                                    value={facebookUrl}
                                    onChange={onFacebookUrlChange}
                                    placeholder="https://facebook.com/..."
                                    iconUrl={LINK_ICON_CDN}
                                    iconAlt="facebook url icon"
                                    autoComplete="url"
                                    autoCapitalize="none"
                                    compact
                                />
                            </>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-0.5">
                    <button
                        type="button"
                        onClick={goToPreviousStep}
                        disabled={currentStep === 1 || isSubmitting}
                        className="h-[44px] sm:h-[48px] rounded-[50px] border border-[#B6B9CF] bg-white text-[#5C6281] font-nunito font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ fontSize: 'clamp(0.92rem, 2.4vw, 1.05rem)' }}
                    >
                        Quay lại
                    </button>

                    {currentStep < 3 ? (
                        <button
                            type="button"
                            onClick={() => {
                                void goToNextStep();
                            }}
                            className="h-[44px] sm:h-[48px] rounded-[50px] bg-[#7F78E8] text-white font-nunito font-black text-center transition-opacity hover:opacity-90 active:opacity-80"
                            style={{
                                boxShadow: '0 10px 6px 0 rgba(0,0,0,0.22)',
                                fontSize: 'clamp(0.95rem, 2.8vw, 1.1rem)',
                            }}
                        >
                            Tiếp tục
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                void handleFinalSubmit();
                            }}
                            disabled={isSubmitting}
                            className="h-[44px] sm:h-[48px] rounded-[50px] bg-[#E484EB] text-white font-nunito font-black text-center transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                            style={{
                                boxShadow: '0 10px 6px 0 rgba(0,0,0,0.25)',
                                fontSize: 'clamp(0.95rem, 2.8vw, 1.15rem)',
                            }}
                        >
                            {isSubmitting ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
                        </button>
                    )}
                </div>

                {stepError ? (
                    <p
                        className="text-center text-red-600 font-inter leading-snug"
                        style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                    >
                        {stepError}
                    </p>
                ) : null}

                {errorMessage ? (
                    <p
                        className="text-center text-red-600 font-inter leading-snug"
                        style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                    >
                        {errorMessage}
                    </p>
                ) : null}
            </form>

            {showLoginLink ? (
                <div className="mt-2 lg:mt-1.5 text-center">
                    <span
                        className="text-[#4A5565] font-inter"
                        style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                    >
                        Đã có tài khoản?{' '}
                    </span>
                    <Link
                        to="/login"
                        className="text-[#4D55CC] font-inter"
                        style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                    >
                        Đăng nhập
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
