import { Link } from 'react-router-dom';
import CredentialInput from './CredentialInput';
import SocialLoginIcons from './SocialLoginIcons';

const EMAIL_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/envelope.svg';
const PASSWORD_ICON_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/key.svg';

interface LoginFormCardProps {
    identifier: string;
    password: string;
    isSubmitting: boolean;
    errorMessage: string;
    showRegisterLink?: boolean;
    onIdentifierChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (event: React.FormEvent) => void;
}

export default function LoginFormCard({
    identifier,
    password,
    isSubmitting,
    errorMessage,
    showRegisterLink = true,
    onIdentifierChange,
    onPasswordChange,
    onSubmit,
}: LoginFormCardProps) {
    const isMobileFormLayout = !showRegisterLink;

    return (
        <div className="w-full min-h-full flex flex-col">
            <h1
                className="text-[#0A0A0A] text-center font-inter font-medium leading-[1.35] tracking-[-0.02em] mt-1 mb-3 sm:mb-5 lg:mb-4"
                style={{ fontSize: 'clamp(1.3rem, 4.2vw, 2rem)' }}
            >
                Đăng nhập
                <br />
                tài khoản <span className="text-[#0A0A0A]">SEeds</span>
            </h1>

            <form
                onSubmit={onSubmit}
                className={`w-full flex flex-col gap-4 sm:gap-5 lg:gap-4 ${isMobileFormLayout ? 'mt-6' : ''}`}
            >
                <CredentialInput
                    label="Email or Student ID"
                    type="text"
                    value={identifier}
                    onChange={onIdentifierChange}
                    placeholder="Enter your email or student ID"
                    iconUrl={EMAIL_ICON_CDN}
                    iconAlt="email or student ID icon"
                    autoComplete="username"
                    autoCapitalize="none"
                />

                <CredentialInput
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="Nhập mật khẩu"
                    iconUrl={PASSWORD_ICON_CDN}
                    iconAlt="password icon"
                    autoComplete="current-password"
                />

                <div className="flex justify-end -mt-1">
                    <Link
                        to="/forgot-password"
                        className="text-[#4D55CC] font-inter font-light italic"
                        style={{ fontSize: 'clamp(0.78rem, 2.1vw, 0.92rem)' }}
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[48px] sm:h-[52px] rounded-[50px] bg-[#E484EB] text-white font-nunito font-black text-center transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                        boxShadow: '0 10px 6px 0 rgba(0,0,0,0.25)',
                        fontSize: 'clamp(0.95rem, 2.8vw, 1.15rem)',
                    }}
                >
                    {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
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

            {showRegisterLink ? (
                <div className="mt-5 lg:mt-4 text-center">
                    <span
                        className="text-[#4A5565] font-inter"
                        style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                    >
                        Chưa có tài khoản?{' '}
                    </span>
                    <Link
                        to="/register"
                        className="text-[#4D55CC] font-inter"
                        style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                    >
                        Nhấn vào đây
                    </Link>
                </div>
            ) : null}

            <div className={`w-full ${showRegisterLink ? 'mt-4' : 'mt-auto pt-8'}`}>
                <div className="h-px bg-[#D8DBE9]" />
                <div className="pt-4">
                    <SocialLoginIcons size={isMobileFormLayout ? 32 : 26} />
                </div>
            </div>
        </div>
    );
}
