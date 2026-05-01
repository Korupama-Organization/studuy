import React from 'react';

const FooterSection: React.FC = () => {
    return (
        <footer className="bg-[#0f1c2e] font-inter">
            <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-10 lg:py-[60px]">
                <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-[120px]">
                    
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:max-w-[400px]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                                AI
                            </div>
                            <span className="text-2xl font-semibold text-white tracking-tight">SEeds</span>
                        </div>
                        <p className="text-[#94a3b8] text-sm leading-[22px]">
                            Nền tảng phỏng vấn AI giúp sinh viên kỹ thuật phần mềm nhận được công việc mơ ước
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center cursor-pointer transition-colors hover:opacity-80">
                                <i className="ti ti-brand-facebook text-white text-[20px]"></i>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center cursor-pointer transition-colors hover:opacity-80">
                                <i className="ti ti-brand-github text-white text-[20px]"></i>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#0a66c2] flex items-center justify-center cursor-pointer transition-colors hover:opacity-80">
                                <i className="ti ti-brand-linkedin text-white text-[20px]"></i>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center cursor-pointer transition-colors hover:opacity-80">
                                <i className="ti ti-mail text-white text-[20px]"></i>
                            </div>
                        </div>
                    </div>

                    {/* Links Group */}
                    <div className="flex flex-wrap gap-10 lg:gap-[120px]">
                        {/* Product Column */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white text-base font-semibold mb-2">Sản phẩm</h4>
                            <a href="#" className="text-[#94a3b8] text-sm leading-6 transition-colors hover:text-white">Tính năng</a>
                            <a href="#" className="text-[#94a3b8] text-sm leading-6 transition-colors hover:text-white">Cách hoạt động</a>
                            <a href="#" className="text-[#94a3b8] text-sm leading-6 transition-colors hover:text-white">Trường hợp sử dụng</a>
                        </div>

                        {/* Company Column */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white text-base font-semibold mb-2">Công ty</h4>
                            <a href="#" className="text-[#94a3b8] text-sm leading-6 transition-colors hover:text-white">Về chúng tôi</a>
                            <a href="#" className="text-[#94a3b8] text-sm leading-6 transition-colors hover:text-white">Liên hệ</a>
                        </div>

                        {/* Legal Column */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white text-base font-semibold mb-2">Pháp lý</h4>
                            <a href="#" className="text-[#94a3b8] text-sm leading-6 transition-colors hover:text-white">Chính sách bảo mật</a>
                            <a href="#" className="text-[#94a3b8] text-sm leading-6 transition-colors hover:text-white">Điều khoản dịch vụ</a>
                            <a href="#" className="text-[#94a3b8] text-sm leading-6 transition-colors hover:text-white">Chính sách Cookie</a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-10 lg:mt-[60px] pt-8 border-t border-[#1e293b] flex flex-col md:flex-row justify-between items-center gap-5">
                    <div className="text-[#64748b] text-sm">© 2026 SEeds</div>
                    <div className="flex items-center gap-8">
                        <a href="#" className="text-[#94a3b8] text-sm transition-colors hover:text-white">Bảo mật</a>
                        <a href="#" className="text-[#94a3b8] text-sm transition-colors hover:text-white">Điều khoản</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
