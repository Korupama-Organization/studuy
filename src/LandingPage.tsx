import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FooterSection from './components/FooterSection';



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

            {/* Features Section */}
            <section className="py-20 bg-[#F4F5FA]">
                <div className="max-w-[1280px] mx-auto w-full px-4 md:px-8">
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center text-center mb-16">
                            <div className="bg-[#E5EFFF] px-4 py-1.5 rounded-full mb-6">
                                <span className="text-[#3B82F6] text-sm font-semibold">Tính năng</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
                                Mọi thứ bạn cần để <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#A855F7]">Phỏng vấn</span>
                            </h2>
                            <p className="text-[#6B7280] max-w-xl text-base md:text-lg">
                                Công cụ toàn diện được hỗ trợ bởi AI<br className="hidden md:block" /> để chuẩn bị cho mọi thử thách phỏng vấn
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            {features.map((feature) => (
                                <div key={feature.id} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r ${feature.gradient}`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-[80px] bg-white relative">
                <div className="max-w-[1280px] mx-auto px-4 w-full flex flex-col items-center">
                    
                    {/* Phần Tiêu đề */}
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-[#8B4CFF]/10 px-4 py-1.5 rounded-full mb-4">
                            <span className="text-[#8B4CFF] text-sm font-semibold">Cách hoạt động</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Bắt đầu chỉ với <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#A855F7]">4 bước đơn giản</span>
                        </h2>
                        <p className="text-[#4A5565] text-base md:text-lg">
                            Từ tạo hồ sơ đến nhận việc làm mơ ước
                        </p>
                    </div>

                    {/* Phần Các Bước (Grid) */}
                    <div className="mt-[64px] w-full max-w-[824px] relative">
                        
                        {/* Đường Line ngang (Connector) - Giấu đi ở màn hình nhỏ */}
                        <div className="hidden md:block absolute top-[30px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-[#D1D5DB] to-transparent z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
                            {steps.map((step) => (
                                <div key={step.id} className="flex flex-col items-center text-center">
                                    {/* Vòng tròn đánh số */}
                                    <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 bg-gradient-to-br from-[#A855F7] to-[#6366F1] shadow-[0_0_20px_rgba(139,76,255,0.4)] relative">
                                        {step.id}
                                        {/* Hiệu ứng Glow/viền trắng tùy chọn để đè lên đường line */}
                                        <div className="absolute inset-0 rounded-full border-[6px] border-white -z-10"></div>
                                    </div>
                                    
                                    {/* Container chứa Icon */}
                                    <div className="w-14 h-14 rounded-full bg-[#F8F9FA] flex items-center justify-center mb-4">
                                        {step.icon}
                                    </div>

                                    {/* Text nội dung */}
                                    <h3 className="text-base font-bold text-gray-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed max-w-[180px]">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Product Demo Section */}
            <section className="min-h-screen py-16 md:py-[60px] px-4 md:px-[20px] bg-gradient-to-br from-[#4318D1] via-[#5B2FC9] to-[#7B4BC1] font-['Inter',sans-serif] flex flex-col items-center justify-start relative overflow-hidden">
                {/* Product Preview Badge (Positioned absolute top right on large screens) */}
                <div className="md:absolute md:top-20 md:right-24 mb-8 md:mb-0">
                    <div className="bg-white/15 backdrop-blur-[10px] text-white text-[12px] md:text-[14px] font-medium px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/20">
                        Xem trước sản phẩm
                    </div>
                </div>

                {/* Header Section */}
                <div className="text-center mb-10 md:mb-[40px] max-w-[1200px] w-full">
                    <h2 className="text-white text-3xl md:text-[56px] font-bold leading-tight md:leading-[1.2] mb-4">
                        Trải nghiệm tương lai của việc chuẩn bị phỏng vấn
                    </h2>
                    <p className="text-white/85 text-[14px] md:text-[18px] font-normal leading-relaxed md:leading-[1.6]">
                        Xem nền tảng được hỗ trợ bởi AI của chúng tôi biến đổi cách luyện tập phỏng vấn
                    </p>
                </div>

                {/* Content Container */}
                <div className="flex flex-col lg:flex-row gap-6 md:gap-[32px] w-full max-w-[1400px] items-start">
                    
                    {/* Left Card: Live Interview Session */}
                    <div className="flex-1 w-full bg-white/10 backdrop-blur-[20px] rounded-[24px] border border-white/15 p-5 md:p-[32px]">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center">
                                <i className="ti ti-player-play-filled text-white text-2xl"></i>
                            </div>
                            <div className="flex-1">
                                <div className="text-white text-lg font-semibold leading-tight mb-0.5">Phiên phỏng vấn trực tiếp</div>
                                <div className="text-white/70 text-sm font-normal">Tương tác AI theo thời gian thực</div>
                            </div>
                        </div>

                        {/* Interview Chat Bubble */}
                        <div className="bg-black/20 backdrop-blur-[10px] rounded-2xl p-6 mb-6 border border-white/10">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
                                    AI
                                </div>
                                <div className="flex-1 text-white text-sm font-normal leading-[1.6]">
                                    "Hãy kể cho tôi nghe về một dự án thử thách mà bạn đã làm và cách bạn vượt qua khó khăn?"
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#FF6B9D] to-[#C084FC] h-full rounded-full w-[60%]"></div>
                            </div>
                            <div className="text-white/60 text-[12px] font-normal mt-3">Đang lắng nghe câu trả lời của bạn...</div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3 md:gap-[16px]">
                            <div className="bg-black/20 backdrop-blur-[10px] rounded-xl p-4 md:p-[20px] border border-white/10 flex flex-col items-center justify-center">
                                <div className="text-white text-2xl md:text-[32px] font-bold leading-[1.2] mb-1">45s</div>
                                <div className="text-white/70 text-[11px] md:text-[13px] font-normal">Thời gian nói</div>
                            </div>
                            <div className="bg-black/20 backdrop-blur-[10px] rounded-xl p-4 md:p-[20px] border border-white/10 flex flex-col items-center justify-center">
                                <div className="text-white text-2xl md:text-[32px] font-bold leading-[1.2] mb-1">8.2</div>
                                <div className="text-white/70 text-[11px] md:text-[13px] font-normal">Điểm rõ ràng</div>
                            </div>
                            <div className="bg-black/20 backdrop-blur-[10px] rounded-xl p-4 md:p-[20px] border border-white/10 flex flex-col items-center justify-center">
                                <div className="text-white text-2xl md:text-[32px] font-bold leading-[1.2] mb-1">95%</div>
                                <div className="text-white/70 text-[11px] md:text-[13px] font-normal">Tự tin</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Performance Report */}
                    <div className="flex-1 w-full bg-white/10 backdrop-blur-[20px] rounded-[24px] border border-white/15 p-5 md:p-[32px]">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FFA000] flex items-center justify-center">
                                <i className="ti ti-award text-white text-2xl"></i>
                            </div>
                            <div className="flex-1">
                                <div className="text-white text-lg font-semibold leading-tight mb-0.5">Báo cáo hiệu suất</div>
                                <div className="text-white/70 text-sm font-normal">Đánh giá chi tiết</div>
                            </div>
                        </div>

                        {/* Main Score Block */}
                        <div className="bg-gradient-to-br from-[rgba(139,92,246,0.3)] to-[rgba(168,85,247,0.2)] backdrop-blur-[10px] rounded-[20px] p-6 md:p-[32px] mb-6 border border-white/15 flex flex-col items-center justify-center">
                            <div className="text-white text-5xl md:text-[72px] font-bold leading-none mb-2">8.5</div>
                            <div className="text-white/85 text-sm md:text-[16px] font-medium mb-5">Điểm tổng thể</div>
                            <div className="bg-gradient-to-r from-[#FF6B9D] to-[#C084FC] text-white text-xs md:text-[14px] font-semibold px-5 md:px-6 py-2 md:py-2.5 rounded-[20px] cursor-pointer hover:opacity-80 transition-opacity">
                                Xuất sắc
                            </div>
                        </div>

                        {/* Skills Breakdown */}
                        <div className="space-y-4">
                            {/* Skill 1 */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="text-white text-sm font-medium">Kỹ năng giao tiếp</div>
                                    <div className="text-white text-sm font-semibold">9.0/10</div>
                                </div>
                                <div className="w-full bg-white/15 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] h-full rounded-full w-[90%]"></div>
                                </div>
                            </div>
                            {/* Skill 2 */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="text-white text-sm font-medium">Kiến thức chuyên môn</div>
                                    <div className="text-white text-sm font-semibold">8.5/10</div>
                                </div>
                                <div className="w-full bg-white/15 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] h-full rounded-full w-[85%]"></div>
                                </div>
                            </div>
                            {/* Skill 3 */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="text-white text-sm font-medium">Giải quyết vấn đề</div>
                                    <div className="text-white text-sm font-semibold">8.0/10</div>
                                </div>
                                <div className="w-full bg-white/15 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#84CC16] to-[#A3E635] h-full rounded-full w-[80%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Suggestion Block */}
                        <div className="mt-6 bg-black/20 backdrop-blur-[10px] rounded-2xl p-5 border border-white/10">
                            <div className="flex items-center gap-2.5 mb-2">
                                <i className="ti ti-trending-up text-[#10B981] text-xl"></i>
                                <div className="text-white text-[15px] font-semibold">Gợi ý cải thiện</div>
                            </div>
                            <div className="text-white/75 text-sm font-normal leading-relaxed">
                                Cố gắng đưa ra các ví dụ cụ thể hơn với kết quả có thể đo lường được
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* For Recruiters Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* Left side: Image with Badge */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl">
                                <img 
                                    src="https://miro.medium.com/v2/resize:fit:4800/format:webp/0*_QJNNyZqfXI7RStX" 
                                    alt="Recruitment AI" 
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -top-6 -right-6 md:top-10 md:-right-12 bg-white p-6 rounded-2xl shadow-xl z-20 flex flex-col items-center animate-bounce-slow">
                                <span className="text-3xl font-bold text-[#4D55CC]">75%</span>
                                <span className="text-gray-500 text-xs font-medium mt-1">Tiết kiệm thời gian</span>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
                        </div>

                        {/* Right side: Content */}
                        <div className="lg:w-1/2">
                            <div className="bg-[#F5F3FF] px-4 py-1.5 rounded-full inline-block mb-6">
                                <span className="text-[#7C3AED] text-sm font-semibold">Dành cho Nhà tuyển dụng</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-[#1E1C38] mb-6 leading-tight">
                                Tuyển dụng thông minh hơn với <span className="text-[#7C5CFC]">Phỏng vấn AI</span>
                            </h2>
                            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                                Đơn giản hóa quy trình tuyển dụng với sàng lọc và đánh giá ứng viên được hỗ trợ bởi AI.
                            </p>

                            {/* Features List */}
                            <div className="space-y-8 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] flex items-center justify-center flex-shrink-0 text-violet-600 shadow-sm">
                                        <i className="ti ti-clock-hour-4 text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1E1C38] mb-1">Đánh giá ứng viên nhanh hơn</h3>
                                        <p className="text-gray-500 text-sm">Sàng lọc AI giúp tiết kiệm hàng giờ đánh giá thủ công</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] flex items-center justify-center flex-shrink-0 text-[#0EA5E9] shadow-sm">
                                        <i className="ti ti-target-arrow text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1E1C38] mb-1">Sàng lọc AI tự động</h3>
                                        <p className="text-gray-500 text-sm">Tự động lọc và xếp hạng ứng viên theo mức độ phù hợp</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0 text-[#22C55E] shadow-sm">
                                        <i className="ti ti-users text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1E1C38] mb-1">Đánh giá có cấu trúc</h3>
                                        <p className="text-gray-500 text-sm">Đánh giá nhất quán, khách quan cho tất cả các ứng viên</p>
                                    </div>
                                </div>
                            </div>

                            <button className="group relative px-8 py-4 bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white font-bold rounded-2xl shadow-xl shadow-violet-600/30 hover:-translate-y-1 transition-all duration-300">
                                <span className="flex items-center gap-2">
                                    Tạo tin tuyển dụng
                                    <i className="ti ti-arrow-right transition-transform group-hover:translate-x-1"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

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



            {/* Final CTA Section */}
            <section className="py-24 px-4 md:px-8 bg-white">
                <div className="max-w-[1280px] mx-auto flex items-center justify-center">
                    <div className="w-full max-w-[850px] rounded-[24px] px-6 py-8 md:px-20 md:py-[60px] text-center relative overflow-hidden flex flex-col items-center" 
                         style={{ background: 'linear-gradient(135deg, #4a4e9e 0%, #6b4fb8 50%, #9b4fb8 100%)' }}>
                        
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            {/* Top Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-[4px] border border-white/20 text-white text-sm font-normal mb-8">
                                <i className="ti ti-sparkles text-white"></i>
                                <span>Bắt đầu hành trình của bạn ngay hôm nay</span>
                            </div>

                            <h2 className="text-3xl md:text-[48px] font-bold text-white mb-6 leading-tight md:leading-[56px]">
                                Sẵn sàng nâng cao kỹ năng phỏng vấn?
                            </h2>
                            
                            <p className="text-white text-sm md:text-base max-w-[600px] mx-auto mb-10 leading-6 opacity-90">
                                Tham gia cùng hàng ngàn sinh viên đã thành công nhận được công việc mơ ước với việc chuẩn bị phỏng vấn được hỗ trợ bởi AI
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-6 py-3 bg-white text-[#6b4fb8] font-semibold rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                    <span className="text-base">Bắt đầu phỏng vấn thử</span>
                                    <i className="ti ti-arrow-right text-xl"></i>
                                </button>
                                <button className="w-full sm:w-auto px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center justify-center">
                                    <span className="text-base">Tạo hồ sơ miễn phí</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <FooterSection />
        </div>
    );
};

export default LandingPage;
