import avatarImage from '../../../assets/Logo.png';
import RegisterFormCard from './RegisterFormCard';

type HrGender = 'Nam' | 'Nữ' | 'Khác';

interface MobileFormScreenProps {
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

export default function MobileFormScreen({
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
}: MobileFormScreenProps) {
    return (
        <div className="w-full h-full bg-gradient-to-b from-[#2F3FB8] via-[#4C45CC] to-[#7E50E8] p-0 flex flex-col">
            <div className="pt-3 pb-4">
                <div className="mx-auto w-16 h-16 rounded-full overflow-hidden bg-white shadow-[0_14px_30px_rgba(34,22,99,0.3)]">
                    <img
                        src={avatarImage}
                        alt="SEeds logo"
                        className="w-full h-full object-contain p-2.5"
                    />
                </div>
            </div>

            <div className="w-full flex-1 min-h-0 bg-white rounded-t-[125px] rounded-b-none px-6 pt-7 pb-7 flex flex-col overflow-hidden mt-0">
                <div className="w-full">
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
                        showLoginLink={false}
                        onFullNameChange={onFullNameChange}
                        onIdentifierChange={onIdentifierChange}
                        onPasswordChange={onPasswordChange}
                        onConfirmPasswordChange={onConfirmPasswordChange}
                        onPhoneChange={onPhoneChange}
                        onGenderChange={onGenderChange}
                        onAvatarUrlChange={onAvatarUrlChange}
                        onLinkedinUrlChange={onLinkedinUrlChange}
                        onGithubUrlChange={onGithubUrlChange}
                        onFacebookUrlChange={onFacebookUrlChange}
                        onCheckEmailAvailability={onCheckEmailAvailability}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
