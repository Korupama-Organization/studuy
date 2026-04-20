import avatarImage from '../../../assets/Logo.png';
import RegisterFormCard from './RegisterFormCard';

interface MobileFormScreenProps {
    fullName: string;
    identifier: string;
    password: string;
    confirmPassword: string;
    isSubmitting: boolean;
    errorMessage: string;
    onFullNameChange: (value: string) => void;
    onIdentifierChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onSubmit: (event: React.FormEvent) => void;
}

export default function MobileFormScreen({
    fullName,
    identifier,
    password,
    confirmPassword,
    isSubmitting,
    errorMessage,
    onFullNameChange,
    onIdentifierChange,
    onPasswordChange,
    onConfirmPasswordChange,
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
                        isSubmitting={isSubmitting}
                        errorMessage={errorMessage}
                        showLoginLink={false}
                        onFullNameChange={onFullNameChange}
                        onIdentifierChange={onIdentifierChange}
                        onPasswordChange={onPasswordChange}
                        onConfirmPasswordChange={onConfirmPasswordChange}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
