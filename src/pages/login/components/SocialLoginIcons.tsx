const GOOGLE_ICON = 'https://img.icons8.com/color/48/google-logo.png';
const FACEBOOK_ICON = 'https://img.icons8.com/color/48/facebook-new.png';
const LINKEDIN_ICON = 'https://img.icons8.com/color/48/linkedin.png';

interface SocialLoginIconsProps {
    size?: number;
}

export default function SocialLoginIcons({ size = 26 }: SocialLoginIconsProps) {
    const iconStyle = {
        width: `${size}px`,
        height: `${size}px`,
    };

    return (
        <div className="flex justify-center items-center gap-5">
            <button type="button" className="p-1" aria-label="Login with Google">
                <img src={GOOGLE_ICON} alt="Google" style={iconStyle} />
            </button>
            <button type="button" className="p-1" aria-label="Login with Facebook">
                <img src={FACEBOOK_ICON} alt="Facebook" style={iconStyle} />
            </button>
            <button type="button" className="p-1" aria-label="Login with LinkedIn">
                <img src={LINKEDIN_ICON} alt="LinkedIn" style={iconStyle} />
            </button>
        </div>
    );
}
