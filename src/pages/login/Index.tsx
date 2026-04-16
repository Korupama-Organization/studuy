import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarImage from "../../assets/Avatar.png";
import backgroundForPC from "../../assets/BackgroundforPC.png";
import {
    getStoredAccessToken,
    loginNormalAuth,
    storeAuthSession,
} from "../../services/auth";

const EMAIL_ICON_CDN = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/envelope.svg";
const PASSWORD_ICON_CDN = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/key.svg";

export default function LoginPage() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (getStoredAccessToken()) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedIdentifier = identifier.trim().toLowerCase();
        const normalizedPassword = password.trim();

        setErrorMessage("");

        if (!normalizedIdentifier || !normalizedPassword) {
            setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }

        if (!normalizedIdentifier.includes("@")) {
            setErrorMessage("Người dùng thường vui lòng đăng nhập bằng email.");
            return;
        }

        try {
            setIsSubmitting(true);

            const result = await loginNormalAuth(normalizedIdentifier, normalizedPassword);
            storeAuthSession(result);
            navigate("/", { replace: true });
        } catch (error) {
            const fallbackMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
            setErrorMessage(
                error instanceof Error && error.message.trim()
                    ? error.message
                    : fallbackMessage,
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row font-inter">
            {/* Left panel - Purple gradient with form */}
            <div className="relative flex flex-col items-center w-full lg:w-[390px] xl:w-[440px] 2xl:w-[480px] flex-shrink-0 bg-gradient-to-b from-[#4D55CC] to-[#8B4CFF] lg:h-screen">
                {/* Avatar circle */}
                <div className="relative z-10 mt-4 lg:mt-5 mb-3 lg:mb-4">
                    <div
                        className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden"
                    >
                        <img
                            src={avatarImage}
                            alt="SEeds logo"
                            className="w-full h-full object-cover scale-125 -translate-y-1"
                        />
                    </div>
                </div>

                {/* White card with form */}
                <div
                    className="relative w-full flex-1 bg-white shadow-[0_8px_4px_0_rgba(0,0,0,0.25)] flex flex-col items-center px-6 md:px-10 lg:px-7 xl:px-10 pt-7 lg:pt-5 pb-7 lg:pb-5 mt-2 lg:mt-3"
                    style={{ borderRadius: "220px 220px 0 0" }}
                >
                    {/* Title */}
                    <h1
                        className="text-[#0A0A0A] text-center font-inter font-medium leading-[1.45] tracking-[-0.02em] mt-2 lg:mt-1 mb-5 lg:mb-4"
                        style={{ fontSize: "clamp(1.4rem, 3.6vw, 2rem)" }}
                    >
                        Đăng nhập
                        <br />
                        tài khoản{" "}
                        <span className="text-[#0A0A0A]">SEeds</span>
                    </h1>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 lg:gap-4">
                        {/* Email field for normal user */}
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-[#0A0A0A] font-inter font-light"
                                style={{ fontSize: "clamp(0.825rem, 2.2vw, 1rem)" }}
                            >
                                Email
                            </label>
                            <div className="relative flex items-center h-[56px]">
                                {/* Outer pill - purple */}
                                <div
                                    className="absolute inset-0 rounded-full bg-[#7A73D1]"
                                />
                                {/* Icon area */}
                                <div className="relative z-30 flex items-center justify-center w-12 h-full pl-2.5 flex-shrink-0">
                                    <img
                                        src={EMAIL_ICON_CDN}
                                        alt="email icon"
                                        className="w-6 h-auto brightness-0 invert"
                                    />
                                </div>
                                {/* Inner pill - light background overlaps purple */}
                                <div className="relative z-20 flex-1 -ml-0.5 -mr-2">
                                    <div className="h-[56px] rounded-full bg-[#F4F7FB] overflow-hidden">
                                        <input
                                            type="text"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            placeholder="name@work-email.com"
                                            className="w-full h-full bg-transparent px-4 text-[#0A0A0A80] font-inter font-normal border-none outline-none appearance-none placeholder:text-[#0A0A0A80]"
                                            style={{ fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-[#0A0A0A] font-inter font-light"
                                style={{ fontSize: "clamp(0.825rem, 2.2vw, 1rem)" }}
                            >
                                Mật khẩu
                            </label>
                            <div className="relative flex items-center h-[56px]">
                                {/* Outer pill - purple */}
                                <div
                                    className="absolute inset-0 rounded-full bg-[#7A73D1]"
                                />
                                {/* Icon area */}
                                <div className="relative z-30 flex items-center justify-center w-12 h-full pl-2.5 flex-shrink-0">
                                    <img
                                        src={PASSWORD_ICON_CDN}
                                        alt="password icon"
                                        className="w-6 h-auto brightness-0 invert"
                                    />
                                </div>
                                {/* Inner pill - light background overlaps purple */}
                                <div className="relative z-20 flex-1 -ml-0.5 -mr-2">
                                    <div className="h-[56px] rounded-full bg-[#F4F7FB] overflow-hidden">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Nhập mật khẩu"
                                            className="w-full h-full bg-transparent px-4 text-[#0A0A0A80] font-inter font-normal border-none outline-none appearance-none placeholder:text-[#0A0A0A80]"
                                            style={{ fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Forgot password */}
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-[#4D55CC] font-inter font-light italic"
                                style={{ fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)" }}
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 lg:py-2.5 rounded-[50px] bg-[#E484EB] text-white font-nunito font-black text-center transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                            style={{
                                boxShadow: "0 10px 6px 0 rgba(0,0,0,0.25)",
                                fontSize: "clamp(0.95rem, 2.8vw, 1.15rem)",
                            }}
                        >
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>

                        {errorMessage ? (
                            <p
                                className="text-center text-red-600 font-inter"
                                style={{ fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)" }}
                            >
                                {errorMessage}
                            </p>
                        ) : null}
                    </form>

                    {/* Register link */}
                    <div className="mt-5 lg:mt-4 text-center">
                        <span
                            className="text-[#4A5565] font-inter"
                            style={{ fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)" }}
                        >
                            Chưa có tài khoản?{" "}
                        </span>
                        <Link
                            to="/register"
                            className="text-[#4D55CC] font-inter"
                            style={{ fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)" }}
                        >
                            Nhấn vào đây
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right panel - Background image (desktop only) */}
            <div className="hidden lg:block flex-1 relative overflow-hidden">
                <img
                    src={backgroundForPC}
                    alt="SEeds background"
                    className="w-full h-full object-contain xl:object-cover"
                />
            </div>
        </div>
    );
}
