import { useState } from 'react';

interface CredentialInputProps {
    label: string;
    type: 'text' | 'password';
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    iconUrl: string;
    iconAlt: string;
    autoComplete?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    labelClassName?: string;
    compact?: boolean;
}

export default function CredentialInput({
    label,
    type,
    value,
    onChange,
    placeholder,
    iconUrl,
    iconAlt,
    autoComplete,
    autoCapitalize,
    labelClassName,
    compact = false,
}: CredentialInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const canTogglePassword = type === 'password';
    const wrapperGapClass = compact ? 'gap-1.5' : 'gap-2.5';
    const labelFontSize = compact ? 'clamp(0.82rem, 2.1vw, 0.95rem)' : 'clamp(0.9rem, 2.35vw, 1.05rem)';
    const outerHeightClass = compact ? 'h-[50px] sm:h-[54px]' : 'h-[58px] sm:h-[62px]';
    const iconWrapClass = compact
        ? 'w-11 sm:w-12 pl-2 sm:pl-2.5'
        : 'w-12 sm:w-14 pl-2.5 sm:pl-3';
    const iconSizeClass = compact ? 'w-4.5 sm:w-5' : 'w-5 sm:w-6';
    const inputContainerHeightClass = compact ? 'h-[50px] sm:h-[54px]' : 'h-[58px] sm:h-[62px]';
    const inputPaddingClass = compact
        ? canTogglePassword
            ? 'pl-4 pr-11'
            : 'px-4'
        : canTogglePassword
            ? 'pl-5 pr-12'
            : 'px-5';
    const inputFontSize = compact ? 'clamp(0.82rem, 2.15vw, 0.94rem)' : 'clamp(0.9rem, 2.35vw, 1rem)';
    const resolvedInputType = canTogglePassword && isPasswordVisible ? 'text' : type;

    return (
        <div className={`flex flex-col ${wrapperGapClass}`}>
            <label
                className={`text-[#0A0A0A] font-inter font-light ${labelClassName ?? ''}`}
                style={{ fontSize: labelFontSize }}
            >
                {label}
            </label>

            <div className={`relative flex items-center ${outerHeightClass}`}>
                <div className="absolute inset-0 rounded-full bg-[#7A73D1]" />

                <div className={`relative z-30 flex items-center justify-center h-full flex-shrink-0 ${iconWrapClass}`}>
                    <img
                        src={iconUrl}
                        alt={iconAlt}
                        className={`${iconSizeClass} h-auto brightness-0 invert`}
                    />
                </div>

                <div className="relative z-20 flex-1 -ml-0.5 -mr-2">
                    <div className={`${inputContainerHeightClass} rounded-full bg-[#F4F7FB] overflow-hidden`}>
                        <input
                            type={resolvedInputType}
                            value={value}
                            onChange={(event) => onChange(event.target.value)}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            autoCapitalize={autoCapitalize}
                            className={`w-full h-full bg-transparent ${inputPaddingClass} text-[#0A0A0A] font-inter font-normal border-none outline-none appearance-none placeholder:text-[#0A0A0A80]`}
                            style={{ fontSize: inputFontSize }}
                        />
                        {canTogglePassword ? (
                            <button
                                type="button"
                                aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                onClick={() => setIsPasswordVisible((visible) => !visible)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D83A0] hover:text-[#4E55C6]"
                            >
                                {isPasswordVisible ? (
                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                                        <path
                                            d="M3 3L21 21M10.58 10.58C10.21 10.94 10 11.45 10 12C10 13.1 10.9 14 12 14C12.55 14 13.06 13.79 13.42 13.42M9.88 4.24C10.56 4.08 11.27 4 12 4C17 4 20.27 7.11 21.54 8.58C21.85 8.94 22 9.12 22 9.41C22 9.7 21.85 9.88 21.54 10.24C21.09 10.77 20.42 11.49 19.56 12.22M6.61 6.61C4.58 7.88 3.22 9.5 2.46 10.24C2.15 10.54 2 10.7 2 11C2 11.3 2.15 11.46 2.46 11.76C3.73 13.23 7 16 12 16C13.76 16 15.32 15.61 16.66 15"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                                        <path
                                            d="M2.46 12.24C3.73 13.71 7 16.48 12 16.48C17 16.48 20.27 13.71 21.54 12.24C21.85 11.88 22 11.7 22 11.41C22 11.12 21.85 10.94 21.54 10.58C20.27 9.11 17 6 12 6C7 6 3.73 9.11 2.46 10.58C2.15 10.94 2 11.12 2 11.41C2 11.7 2.15 11.88 2.46 12.24Z"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />
                                        <circle cx="12" cy="11.41" r="2.75" stroke="currentColor" strokeWidth="1.8" />
                                    </svg>
                                )}
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
