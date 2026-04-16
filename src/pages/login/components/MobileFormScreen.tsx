import avatarImage from '../../../assets/Avatar.png';
import LoginFormCard from './LoginFormCard';

interface MobileFormScreenProps {
    identifier: string;
    password: string;
    isSubmitting: boolean;
    errorMessage: string;
    onIdentifierChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (event: React.FormEvent) => void;
    onBack: () => void;
}

export default function MobileFormScreen({
    identifier,
    password,
    isSubmitting,
    errorMessage,
    onIdentifierChange,
    onPasswordChange,
    onSubmit,
    onBack,
}: MobileFormScreenProps) {
    return (
        <div className="w-full h-full bg-gradient-to-b from-[#2F3FB8] via-[#4C45CC] to-[#7E50E8] p-0 flex flex-col">
            <div className="pt-3 pb-4">
                <div className="mx-auto w-20 h-20 rounded-full overflow-hidden shadow-[0_14px_30px_rgba(34,22,99,0.3)]">
                    <img
                        src={avatarImage}
                        alt="SEeds logo"
                        className="w-full h-full object-cover scale-125 -translate-y-1"
                    />
                </div>
            </div>

            <div className="w-full flex-1 min-h-0 bg-white rounded-t-[125px] rounded-b-none px-6 pt-7 pb-7 flex flex-col overflow-hidden mt-0">
                

                <div className="w-full">
                    <LoginFormCard
                        identifier={identifier}
                        password={password}
                        isSubmitting={isSubmitting}
                        errorMessage={errorMessage}
                        showRegisterLink={false}
                        onIdentifierChange={onIdentifierChange}
                        onPasswordChange={onPasswordChange}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
