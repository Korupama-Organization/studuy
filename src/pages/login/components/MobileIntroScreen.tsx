import backgroundForPhone from '../../../assets/BackgroundforPhone.png';
import SocialLoginIcons from './SocialLoginIcons';

interface MobileIntroScreenProps {
    onContinue: () => void;
}

export default function MobileIntroScreen({ onContinue }: MobileIntroScreenProps) {
    return (
        <div className="w-full h-full bg-gradient-to-b from-[#4550C9] via-[#5B56D8] to-[#8C56F1] p-0">
            <div className="w-full h-full overflow-hidden bg-white flex flex-col">
                <img
                    src={backgroundForPhone}
                    alt="SEeds mobile background"
                    className="w-full h-[600px] object-cover object-top"
                />

                <div className="flex-1 px-6 pt-5 pb-6 flex flex-col justify-between">
                    <button
                        type="button"
                        onClick={onContinue}
                        className="w-full h-[44px] rounded-[12px] bg-[#D977E5] text-white font-nunito font-black text-[1.05rem] tracking-[0.01em] shadow-[0_8px_14px_rgba(92,35,120,0.35)]"
                    >
                        Log In
                    </button>

                    <div className="pt-4">
                        <SocialLoginIcons size={30} />
                    </div>
                </div>
            </div>
        </div>
    );
}
