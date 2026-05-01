import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="bg-[#FAF9FF] py-16 px-6 lg:px-24 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Content */}
                <div className="flex flex-col items-start z-10">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-600 font-medium text-sm mb-6">
                        <span>Luyện phỏng vấn với AI</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E1C38] leading-tight mb-6">
                        Chinh phục phỏng vấn <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">
                            cùng AI
                        </span>
                    </h1>
                    
                    <p className="text-gray-600 text-lg max-w-lg mb-8 leading-relaxed">
                        Thực hành với câu hỏi phỏng vấn thực tế, nhận phản hồi tức thì và nâng cao cơ hội nhận việc mơ ước của bạn.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition duration-200 shadow-lg shadow-violet-600/30">
                            <span>Bắt đầu phỏng vấn thử</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.16425 9.9942H15.8241" stroke="white" strokeWidth="1.6657" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9.9942 4.16425L15.8242 9.9942L9.9942 15.8241" stroke="white" strokeWidth="1.6657" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        
                        <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-violet-200 text-[#4D55CC] rounded-full font-semibold hover:border-violet-300 hover:bg-violet-50 transition duration-200">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.99421 18.3227C14.5939 18.3227 18.3227 14.5939 18.3227 9.99421C18.3227 5.39451 14.5939 1.66571 9.99421 1.66571C5.39451 1.66571 1.66571 5.39451 1.66571 9.99421C1.66571 14.5939 5.39451 18.3227 9.99421 18.3227Z" stroke="currentColor" strokeWidth="1.6657" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9.99422 10.8271C11.3741 10.8271 12.4928 9.70842 12.4928 8.32851C12.4928 6.94859 11.3741 5.82996 9.99422 5.82996C8.61431 5.82996 7.49567 6.94859 7.49567 8.32851C7.49567 9.70842 8.61431 10.8271 9.99422 10.8271Z" stroke="currentColor" strokeWidth="1.6657" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5.82996 17.2083V15.8241C5.82996 15.3824 6.00545 14.9587 6.31783 14.6463C6.63021 14.3339 7.05388 14.1584 7.49566 14.1584H12.4928C12.9345 14.1584 13.3582 14.3339 13.6706 14.6463C13.983 14.9587 14.1585 15.3824 14.1585 15.8241V17.2083" stroke="currentColor" strokeWidth="1.6657" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Tạo hồ sơ</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Visual & Badges */}
                <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[500px]">
                    <img
                        className="w-full h-full object-cover rounded-3xl shadow-xl"
                        src="https://images.gamebanana.com/img/ss/mods/69a40152405e6.jpg"
                        alt="Người dùng đang luyện phỏng vấn với AI"
                    />
                    
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in-up">
                        <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm">
                            AI
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">AI đang lắng nghe...</p>
                            <p className="text-sm font-bold text-gray-800">Phân tích theo thời gian thực</p>
                        </div>
                    </div>

                    {/* Score Badge (Bottom Left) */}
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur p-5 rounded-2xl shadow-lg min-w-[150px]">
                        <p className="text-xs text-gray-500 font-medium mb-1">Điểm phỏng vấn</p>
                        <p className="text-3xl font-extrabold text-[#D9417C] tracking-tight">8.5<span className="text-xl text-gray-400 font-semibold">/10</span></p>
                        <p className="text-sm font-bold text-gray-800 mt-1">Xuất sắc!</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
