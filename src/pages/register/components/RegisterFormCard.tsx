import { Link } from 'react-router-dom';
import CredentialInput from '../../login/components/CredentialInput';
import SocialLoginIcons from '../../login/components/SocialLoginIcons';

const EMAIL_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/envelope.svg';
const PASSWORD_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/key.svg';

interface RegisterFormCardProps {
    fullName: string;
    identifier: string;
    password: string;
    confirmPassword: string;
    isSubmitting: boolean;
    errorMessage: string;
    showLoginLink?: boolean;
    onFullNameChange: (value: string) => void;
    onIdentifierChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onSubmit: (event: React.FormEvent) => void;
}

export default function RegisterFormCard({
    fullName,
    identifier,
    password,
    confirmPassword,
    isSubmitting,
    errorMessage,
    showLoginLink = true,
    onFullNameChange,
    onIdentifierChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
}: RegisterFormCardProps) {
    const isMobileFormLayout = !showLoginLink;

    return (
        <div className="w-full min-h-full flex flex-col">
            <h1
                className="text-[#0A0A0A] text-center font-inter font-medium leading-[1.35] tracking-[-0.02em] mt-1 mb-3 sm:mb-5 lg:mb-4"
                style={{ fontSize: 'clamp(1.3rem, 4.2vw, 2rem)' }}
            >
                Đăng ký
                <br />
                tài khoản <span className="text-[#0A0A0A]">SEeds</span>
            </h1>

            <form
                onSubmit={onSubmit}
                className={`w-full flex flex-col gap-4 sm:gap-5 lg:gap-4 ${isMobileFormLayout ? 'mt-6' : ''}`}
            >
                <CredentialInput
                    label="Họ và tên"
                    type="text"
                    value={fullName}
                    onChange={onFullNameChange}
                    placeholder="Nhập họ và tên"
                    iconUrl={EMAIL_ICON_CDN}
                    iconAlt="full name icon"
                    autoComplete="name"
                    autoCapitalize="words"
                />

                <CredentialInput
                    label="Email"
                    type="text"
                    value={identifier}
                    onChange={onIdentifierChange}
                    placeholder="Enter your Email"
                    iconUrl={EMAIL_ICON_CDN}
                    iconAlt="Email icon"
                    autoComplete="username"
                    autoCapitalize="none"
                    labelClassName="pl-1.5"
                />

                <CredentialInput
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="Nhập mật khẩu"
                    iconUrl={PASSWORD_ICON_CDN}
                    iconAlt="password icon"
                    autoComplete="new-password"
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
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[48px] sm:h-[52px] rounded-[50px] bg-[#E484EB] text-white font-nunito font-black text-center transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                        boxShadow: '0 10px 6px 0 rgba(0,0,0,0.25)',
                        fontSize: 'clamp(0.95rem, 2.8vw, 1.15rem)',
                    }}
                >
                    {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>

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
                <div className="mt-5 lg:mt-4 text-center">
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

            <div className={`w-full ${showLoginLink ? 'mt-4' : 'mt-auto pt-8'}`}>
                <div className="h-px bg-[#D8DBE9]" />
                <div className="pt-4">
                    <SocialLoginIcons size={isMobileFormLayout ? 32 : 26} />
                </div>
            </div>
        </div>
    );
}
