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
}: CredentialInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label
                className="text-[#0A0A0A] font-inter font-light"
                style={{ fontSize: 'clamp(0.825rem, 2.2vw, 1rem)' }}
            >
                {label}
            </label>

            <div className="relative flex items-center h-[52px] sm:h-[56px]">
                <div className="absolute inset-0 rounded-full bg-[#7A73D1]" />

                <div className="relative z-30 flex items-center justify-center w-12 h-full pl-2.5 flex-shrink-0">
                    <img
                        src={iconUrl}
                        alt={iconAlt}
                        className="w-5 sm:w-6 h-auto brightness-0 invert"
                    />
                </div>

                <div className="relative z-20 flex-1 -ml-0.5 -mr-2">
                    <div className="h-[52px] sm:h-[56px] rounded-full bg-[#F4F7FB] overflow-hidden">
                        <input
                            type={type}
                            value={value}
                            onChange={(event) => onChange(event.target.value)}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            autoCapitalize={autoCapitalize}
                            className="w-full h-full bg-transparent px-4 text-[#0A0A0A] font-inter font-normal border-none outline-none appearance-none placeholder:text-[#0A0A0A80]"
                            style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
