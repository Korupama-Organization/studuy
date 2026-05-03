import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import PainSection from './components/PainSection';
import SolutionSection from './components/SolutionSection';
import HowItWorksSection from './components/HowItWorksSection';
import AIAnalysisSection from './components/AIAnalysisSection';
import ExperienceSection from './components/ExperienceSection';
import ValueSection from './components/ValueSection';
import JobConnectionSection from './components/JobConnectionSection';
import RecruiterSection from './components/RecruiterSection';
import CTASection from './components/CTASection';
import FAQSection from './components/FAQSection';
import FooterSection from './components/FooterSection';
import introMusic from './assets/logo.png.mp3';




const LandingPage: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const audio = new Audio(introMusic);
        audio.volume = 0.5;
        audio.loop = true;
        
        const attemptPlay = () => {
            audio.play().catch(() => {
                console.log("Autoplay blocked. Music will start on first interaction.");
                const playOnInteraction = () => {
                    audio.play();
                    window.removeEventListener('click', playOnInteraction);
                    window.removeEventListener('keydown', playOnInteraction);
                    window.removeEventListener('touchstart', playOnInteraction);
                };
                window.addEventListener('click', playOnInteraction);
                window.addEventListener('keydown', playOnInteraction);
                window.addEventListener('touchstart', playOnInteraction);
            });
        };

        attemptPlay();

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);


    const features = [
        {
            id: 1,
            title: "Phỏng vấn AI",
            description: "Tương tác giọng nói theo thời gian thực với câu hỏi động phù hợp với hồ sơ của bạn",
            gradient: "from-[#68C5B3] to-[#0B60B0]",
            icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.9978 2.33295C13.0697 2.33295 12.1796 2.70164 11.5233 3.35791C10.867 4.01419 10.4984 4.90428 10.4984 5.8324V13.9978C10.4984 14.9259 10.867 15.816 11.5233 16.4723C12.1796 17.1285 13.0697 17.4972 13.9978 17.4972C14.9259 17.4972 15.816 17.1285 16.4723 16.4723C17.1286 15.816 17.4973 14.9259 17.4973 13.9978V5.8324C17.4973 4.90428 17.1286 4.01419 16.4723 3.35791C15.816 2.70164 14.9259 2.33295 13.9978 2.33295Z" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22.1632 11.6649V13.9978C22.1632 16.1634 21.3029 18.2403 19.7716 19.7716C18.2403 21.3029 16.1634 22.1632 13.9978 22.1632C11.8322 22.1632 9.75532 21.3029 8.22401 19.7716C6.69271 18.2403 5.83243 16.1634 5.83243 13.9978V11.6649" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.9978 22.1632V25.6627" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            id: 2,
            title: "Đánh giá thông minh",
            description: "Phân tích điểm số chi tiết với điểm mạnh, điểm yếu và gợi ý cải thiện",
            gradient: "from-[#4CC3FF] to-[#4D55CC]",
            icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.49945 3.49945V22.1632C3.49945 22.7819 3.74524 23.3753 4.18276 23.8128C4.62028 24.2504 5.21368 24.4961 5.83242 24.4961H24.4961" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.9967 19.8302V10.4984" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.1643 19.8302V5.8324" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.33185 19.8302V16.3307" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            id: 3,
            title: "Hồ sơ thông minh",
            description: "Xây dựng hồ sơ ứng viên hoàn chỉnh với phỏng vấn được cá nhân hóa",
            gradient: "from-[#F36A5A] to-[#E484EB]",
            icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.1632 24.4962V22.1632C22.1632 20.9257 21.6716 19.7389 20.7965 18.8639C19.9215 17.9888 18.7347 17.4973 17.4972 17.4973H10.4983C9.26085 17.4973 8.07405 17.9888 7.19902 18.8639C6.32399 19.7389 5.8324 20.9257 5.8324 22.1632V24.4962" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.9978 12.8313C16.5747 12.8313 18.6637 10.7423 18.6637 8.16538C18.6637 5.58846 16.5747 3.49945 13.9978 3.49945C11.4209 3.49945 9.33185 5.58846 9.33185 8.16538C9.33185 10.7423 11.4209 12.8313 13.9978 12.8313Z" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            id: 4,
            title: "Kết nối việc làm",
            description: "Ứng tuyển vào công việc thực tế với sàng lọc AI và gợi ý thông minh",
            gradient: "from-[#DA498D] to-[#7A73D1]",
            icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.6638 23.3296V4.66591C18.6638 4.04717 18.418 3.45377 17.9805 3.01626C17.5429 2.57874 16.9496 2.33295 16.3308 2.33295H11.6649C11.0461 2.33295 10.4527 2.57874 10.0152 3.01626C9.5777 3.45377 9.33191 4.04717 9.33191 4.66591V23.3296" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23.3297 6.9989H4.66597C3.37751 6.9989 2.33301 8.04341 2.33301 9.33187V20.9967C2.33301 22.2852 3.37751 23.3297 4.66597 23.3297H23.3297C24.6182 23.3297 25.6627 22.2852 25.6627 20.9967V9.33187C25.6627 8.04341 24.6182 6.9989 23.3297 6.9989Z" stroke="white" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        }
    ];

    const steps = [
        {
            id: "01",
            title: "Tạo hồ sơ cá nhân",
            description: "Xây dựng hồ sơ ứng viên hoàn chỉnh với kỹ năng, kinh nghiệm và sở thích của bạn",
            icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.6637 24.4961V22.1631C18.6637 20.9256 18.1722 19.7388 17.2971 18.8638C16.4221 17.9888 15.2353 17.4972 13.9978 17.4972H6.99891C5.76143 17.4972 4.57463 17.9888 3.6996 18.8638C2.82457 19.7388 2.33298 20.9256 2.33298 22.1631V24.4961" stroke="url(#paint0_linear_step1)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.4984 12.8313C13.0753 12.8313 15.1643 10.7422 15.1643 8.16532C15.1643 5.5884 13.0753 3.49939 10.4984 3.49939C7.92144 3.49939 5.83243 5.5884 5.83243 8.16532C5.83243 10.7422 7.92144 12.8313 10.4984 12.8313Z" stroke="url(#paint1_linear_step1)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22.1632 9.33191V16.3308" stroke="url(#paint2_linear_step1)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M25.6626 12.8313H18.6637" stroke="url(#paint3_linear_step1)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_step1" x1="10.4984" y1="17.4972" x2="10.4984" y2="24.4961" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint1_linear_step1" x1="10.4984" y1="3.49939" x2="10.4984" y2="12.8313" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint2_linear_step1" x1="22.6632" y1="9.33191" x2="22.6632" y2="16.3308" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint3_linear_step1" x1="22.1632" y1="12.8313" x2="22.1632" y2="13.8313" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                    </defs>
                </svg>
            )
        },
        {
            id: "02",
            title: "Bắt đầu phỏng vấn AI",
            description: "Luyện tập với AI thông qua tương tác giọng nói theo thời gian thực và câu hỏi động",
            icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.9978 2.33301C13.0697 2.33301 12.1796 2.7017 11.5233 3.35797C10.867 4.01425 10.4984 4.90435 10.4984 5.83246V13.9978C10.4984 14.926 10.867 15.8161 11.5233 16.4723C12.1796 17.1286 13.0697 17.4973 13.9978 17.4973C14.9259 17.4973 15.816 17.1286 16.4723 16.4723C17.1286 15.8161 17.4973 14.926 17.4973 13.9978V5.83246C17.4973 4.90435 17.1286 4.01425 16.4723 3.35797C15.816 2.7017 14.9259 2.33301 13.9978 2.33301Z" stroke="url(#paint0_linear_step2)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22.1632 11.6648V13.9978C22.1632 16.1634 21.3029 18.2403 19.7716 19.7716C18.2403 21.3029 16.1634 22.1631 13.9978 22.1631C11.8322 22.1631 9.75529 21.3029 8.22398 19.7716C6.69268 18.2403 5.8324 16.1634 5.8324 13.9978V11.6648" stroke="url(#paint1_linear_step2)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.9978 22.1632V25.6627" stroke="url(#paint2_linear_step2)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_step2" x1="13.9978" y1="2.33301" x2="13.9978" y2="17.4973" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint1_linear_step2" x1="13.9978" y1="11.6648" x2="13.9978" y2="22.1631" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint2_linear_step2" x1="14.4978" y1="22.1632" x2="14.4978" y2="25.6627" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                    </defs>
                </svg>
            )
        },
        {
            id: "03",
            title: "Nhận phản hồi tức thì",
            description: "Nhận đánh giá chi tiết với phân tích điểm số và gợi ý cải thiện cá nhân hóa",
            icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.4972 2.33301H6.99886C6.38012 2.33301 5.78672 2.5788 5.3492 3.01632C4.91169 3.45383 4.66589 4.04723 4.66589 4.66597V23.3297C4.66589 23.9484 4.91169 24.5418 5.3492 24.9794C5.78672 25.4169 6.38012 25.6627 6.99886 25.6627H20.9967C21.6154 25.6627 22.2088 25.4169 22.6463 24.9794C23.0838 24.5418 23.3296 23.9484 23.3296 23.3297V8.16542L17.4972 2.33301Z" stroke="url(#paint0_linear_step3)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.3308 2.33301V6.99894C16.3308 7.61768 16.5766 8.21108 17.0141 8.6486C17.4516 9.08611 18.045 9.33191 18.6638 9.33191H23.3297" stroke="url(#paint1_linear_step3)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.6649 10.4983H9.33191" stroke="url(#paint2_linear_step3)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.6638 15.1643H9.33191" stroke="url(#paint3_linear_step3)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.6638 19.8302H9.33191" stroke="url(#paint4_linear_step3)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_step3" x1="13.9978" y1="2.33301" x2="13.9978" y2="25.6627" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint1_linear_step3" x1="19.8303" y1="2.33301" x2="19.8303" y2="9.33191" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint2_linear_step3" x1="10.4984" y1="10.4983" x2="10.4984" y2="11.4983" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint3_linear_step3" x1="13.9978" y1="15.1643" x2="13.9978" y2="16.1643" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint4_linear_step3" x1="13.9978" y1="19.8302" x2="13.9978" y2="20.8302" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                    </defs>
                </svg>
            )
        },
        {
            id: "04",
            title: "Ứng tuyển việc làm",
            description: "Ứng tuyển vào các cơ hội việc làm phù hợp với hồ sơ và kỹ năng phỏng vấn đã được trau dồi",
            icon: (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9561 25.2964C17.0004 25.4068 17.0774 25.5011 17.1768 25.5665C17.2763 25.6319 17.3933 25.6653 17.5123 25.6622C17.6313 25.6592 17.7464 25.6198 17.8424 25.5494C17.9383 25.479 18.0104 25.381 18.0491 25.2684L25.6312 3.1052C25.6685 3.00185 25.6757 2.88999 25.6517 2.78273C25.6278 2.67548 25.5738 2.57725 25.4961 2.49954C25.4184 2.42183 25.3202 2.36786 25.2129 2.34395C25.1057 2.32003 24.9938 2.32715 24.8905 2.36449L2.7273 9.94663C2.61473 9.98523 2.51666 10.0573 2.44626 10.1533C2.37586 10.2492 2.33649 10.3644 2.33344 10.4834C2.3304 10.6024 2.36381 10.7194 2.42921 10.8188C2.49461 10.9183 2.58885 10.9953 2.6993 11.0396L11.9495 14.749C12.2419 14.8661 12.5076 15.0412 12.7306 15.2637C12.9535 15.4863 13.129 15.7516 13.2466 16.0438L16.9561 25.2964Z" stroke="url(#paint0_linear_step4)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M25.4923 2.50439L12.731 15.2646" stroke="url(#paint1_linear_step4)" strokeWidth="2.33297" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_step4" x1="13.9994" y1="2.33008" x2="13.9994" y2="25.6624" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                        <linearGradient id="paint1_linear_step4" x1="19.1116" y1="2.50439" x2="19.1116" y2="15.2646" gradientUnits="userSpaceOnUse"><stop stopColor="#E484EB"/><stop offset="1" stopColor="#4D55CC"/></linearGradient>
                    </defs>
                </svg>
            )
        }
    ];

    
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{background: 'linear-gradient(135deg, #4D55CC 0%, #8B4CFF 100%)'}}>
                              
                            </div>
                            <span className="text-xl font-bold text-slate-900">Mixigaming</span>
                        </div>
                        <div className="hidden md:flex items-center gap-10">
                            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" href="#">Tính năng</a>
                            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" href="#">Cách hoạt động</a>
                            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" href="#">Dành cho Nhà tuyển dụng</a>
                        </div>
                        <div className="flex items-center gap-8">
                            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC]" href="#">Đăng nhập</a>
                            <a className="px-7 py-3 bg-gradient-to-r from-[#C977D6] to-[#7C5CFC] text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(124,92,252,0.4)]" href="#">
                                Bắt đầu ngay
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection />

            {/* Problem Section */}
            <ProblemSection />

            {/* Pain Section */}
            <PainSection />

            {/* Solution Section */}
            <SolutionSection />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* AI Analysis Section */}
            <AIAnalysisSection />

            {/* Experience Section */}
            <ExperienceSection />

            {/* Value Section */}
            <ValueSection />

            {/* Job Connection Section */}
            <JobConnectionSection />

            {/* Recruiter Section */}
            <RecruiterSection />

          
        
            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-b from-[#E484EB]/10 to-white/50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-16 relative">
                        <div className="px-5 py-2.5 rounded-full bg-[#DA498D]/30 shadow-[0_4px_3px_0_rgba(33,28,132,0.25)] mb-6">
                            <span className="text-[#372AA5] text-sm font-medium">Đánh giá</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                            <span className="text-[#101828]">Được yêu thích bởi </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4D55CC] via-[#6D52E5] to-[#8B4CFF]">
                                Sinh viên & Nhà tuyển dụng
                            </span>
                        </h2>
                        <p className="text-[#4A5565] text-xl max-w-2xl mx-auto">
                            Xem cộng đồng của chúng tôi nói gì về trải nghiệm của họ
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {[
                            {
                                quote: "Luyện phỏng vấn với AI đã giúp mình nhận được công việc mơ ước tại một công ty công nghệ hàng đầu. Phản hồi cực kỳ chi tiết và hữu ích!",
                                author: "Nguyễn Minh Anh",
                                role: "Sinh viên CNTT, UIT",
                                emoji: "👨‍💻",
                                bg: "#372AA5"
                            },
                            {
                                quote: "Mình đã luyện hơn 20 buổi phỏng vấn thử trước khi đi phỏng vấn thật. Các câu hỏi AI đưa ra rất sát với thực tế và chuẩn bị hoàn hảo.",
                                author: "Trần Thanh Hà",
                                role: "Tốt nghiệp KHMT, HCMUS",
                                emoji: "👩‍💻",
                                bg: "#372AA5"
                            },
                            {
                                quote: "Trong con người tôi không thể tha thứ được cho bố tôi, tại vì việc làm của bố tôi là không thể chấp nhận được",
                                author: "Phùng Thanh Độ",
                                role: "Streamer người tày",
                                emoji: "👔",
                                bg: "#372AA5"
                            },
                            {
                                quote: "Phản hồi theo thời gian thực trong quá trình phỏng vấn giúp mình tự tin hơn rất nhiều. Mình có thể thấy ngay điểm cần cải thiện.",
                                author: "Phạm Thu Trang",
                                role: "Kỹ sư phần mềm",
                                emoji: "👩‍🎓",
                                bg: "#372AA5"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#F3F4F6] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] flex flex-col justify-between min-h-[285px] hover:shadow-lg transition-shadow">
                                <div>
                                    {/* Quote Icon */}
                                    <div className="mb-4">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.3262 3.99878C20.6192 3.99878 19.9411 4.27964 19.4412 4.77957C18.9413 5.2795 18.6604 5.95755 18.6604 6.66455V14.6619C18.6604 15.3689 18.9413 16.0469 19.4412 16.5469C19.9411 17.0468 20.6192 17.3277 21.3262 17.3277C21.6797 17.3277 22.0187 17.4681 22.2687 17.718C22.5187 17.968 22.6591 18.307 22.6591 18.6605V19.9934C22.6591 20.7004 22.3782 21.3785 21.8783 21.8784C21.3784 22.3783 20.7003 22.6592 19.9933 22.6592C19.6398 22.6592 19.3008 22.7996 19.0508 23.0496C18.8009 23.2996 18.6604 23.6386 18.6604 23.9921V26.6579C18.6604 27.0114 18.8009 27.3504 19.0508 27.6004C19.3008 27.8503 19.6398 27.9908 19.9933 27.9908C22.1143 27.9908 24.1485 27.1482 25.6483 25.6484C27.1481 24.1486 27.9906 22.1145 27.9906 19.9934V6.66455C27.9906 5.95755 27.7098 5.2795 27.2099 4.77957C26.7099 4.27964 26.0319 3.99878 25.3249 3.99878H21.3262Z" stroke="#4D55CC" strokeOpacity="0.5" strokeWidth="2.66578" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6.66443 3.99878C5.95742 3.99878 5.27937 4.27964 4.77944 4.77957C4.27951 5.2795 3.99866 5.95755 3.99866 6.66455V14.6619C3.99866 15.3689 4.27951 16.0469 4.77944 16.5469C5.27937 17.0468 5.95742 17.3277 6.66443 17.3277C7.01794 17.3277 7.35696 17.4681 7.60693 17.718C7.85689 17.968 7.99732 18.307 7.99732 18.6605V19.9934C7.99732 20.7004 7.71646 21.3785 7.21653 21.8784C6.7166 22.3783 6.03855 22.6592 5.33154 22.6592C4.97804 22.6592 4.63902 22.7996 4.38905 23.0496C4.13909 23.2996 3.99866 23.6386 3.99866 23.9921V26.6579C3.99866 27.0114 4.13909 27.3504 4.38905 27.6004C4.63902 27.8503 4.97804 27.9908 5.33154 27.9908C7.45257 27.9908 9.48672 27.1482 10.9865 25.6484C12.4863 24.1486 13.3289 22.1145 13.3289 19.9934V6.66455C13.3289 5.95755 13.048 5.2795 12.5481 4.77957C12.0482 4.27964 11.3701 3.99878 10.6631 3.99878H6.66443Z" stroke="#4D55CC" strokeOpacity="0.5" strokeWidth="2.66578" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>

                                    {/* Pink Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[1,2,3,4,5].map(s => (
                                            <svg key={s} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.68079 1.52954C7.71 1.47053 7.75511 1.42086 7.81105 1.38614C7.86699 1.35141 7.93151 1.33301 7.99735 1.33301C8.06319 1.33301 8.12772 1.35141 8.18366 1.38614C8.23959 1.42086 8.28471 1.47053 8.31392 1.52954L9.8534 4.64784C9.95482 4.85308 10.1045 5.03065 10.2897 5.1653C10.4748 5.29995 10.6899 5.38767 10.9164 5.42092L14.3592 5.92475C14.4245 5.9342 14.4858 5.96172 14.5362 6.00419C14.5866 6.04666 14.6241 6.10239 14.6445 6.16507C14.6649 6.22776 14.6673 6.2949 14.6515 6.3589C14.6358 6.42289 14.6024 6.4812 14.5552 6.52722L12.0653 8.95175C11.9011 9.11176 11.7783 9.30928 11.7073 9.52731C11.6364 9.74533 11.6195 9.97733 11.6581 10.2033L12.2459 13.6289C12.2575 13.6941 12.2504 13.7612 12.2256 13.8226C12.2008 13.884 12.1593 13.9372 12.1057 13.9761C12.0521 14.015 11.9887 14.0381 11.9226 14.0427C11.8566 14.0473 11.7906 14.0332 11.7321 14.0021L8.65447 12.3839C8.45168 12.2775 8.22606 12.2218 7.99702 12.2218C7.76798 12.2218 7.54236 12.2775 7.33957 12.3839L4.26259 14.0021C4.20416 14.033 4.1382 14.0469 4.07229 14.0422C4.00635 14.0375 3.94301 14.0144 3.88958 13.9756C3.83611 13.9367 3.79463 13.8836 3.76986 13.8223C3.74508 13.761 3.738 13.694 3.74943 13.6289L4.33657 10.204C4.37532 9.97789 4.35852 9.74575 4.28761 9.52759C4.21667 9.30942 4.09372 9.1118 3.92937 8.95175L1.43953 6.52788C1.39194 6.48192 1.35822 6.42351 1.3422 6.35932C1.32618 6.29513 1.32852 6.22773 1.34894 6.1648C1.36936 6.10187 1.40705 6.04594 1.4577 6.00338C1.50836 5.96082 1.56995 5.93334 1.63546 5.92408L5.07762 5.42092C5.30439 5.38793 5.51974 5.30033 5.70514 5.16566C5.89054 5.03099 6.04044 4.85328 6.14194 4.64784L7.68076 1.52954Z" fill="#DA498D" stroke="#DA498D" strokeWidth="1.33289" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ))}
                                    </div>

                                    <p className="text-[#4A5565] text-sm leading-[1.625] mb-6">
                                        "{item.quote}"
                                    </p>
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl" style={{ backgroundColor: item.bg }}>
                                        {item.emoji}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#101828] text-sm font-semibold">{item.author}</span>
                                        <span className="text-[#6A7282] text-[12px]">{item.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



             {/* CTA Section */}
            <CTASection />

             {/* FAQ Section */}
            <FAQSection />

            {/* Footer Section */}
            <FooterSection />
        </div>
    );
};

export default LandingPage;
