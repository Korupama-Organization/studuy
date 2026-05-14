import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileForm } from './ProfileFormContext';
import ProfileSidebar from './ProfileSidebar';
import GlobalHeader from '../../components/GlobalHeader';

const STEPS = [
    { label: "Bước 1", sub: "Thông tin cơ bản" },
    { label: "Bước 2", sub: "Học vấn và Kỹ năng" },
    { label: "Bước 3", sub: "Dự án và Kinh nghiệm" },
    { label: "Bước 4", sub: "Mục tiêu sự nghiệp" },
];

export default function UpdateProfile() {
    const [activeStep] = useState(0);
    const navigate = useNavigate();
    const { form, updateField, completion, completionLoading, saving, saveStep2 } = useProfileForm();

    const progress = completion?.completionPercentage ?? 0;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="profile-page">
            <GlobalHeader />

            {/* Page Body */}
            <main className="profile-main">
                <div className="profile-content-wrapper">
                    {/* Page Title */}
                    <div className="page-title-block">
                        <h1 className="page-title">Cập nhật hồ sơ của bạn</h1>
                        <p className="page-subtitle">
                            Hoàn thành hồ sơ của bạn để cá nhân hóa các cuộc phỏng vấn và cơ hội việc làm phù hợp
                        </p>
                    </div>

                    <div className="profile-layout">
                        {/* Left: Form Area */}
                        <div className="form-area">
                            {/* Step Navigator */}
                            <div className="step-card">
                                <p className="step-counter" style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Bước 1 trên 4</span>
                                    <span style={{color: '#6D52E5'}}>{completionLoading ? '...' : `${progress}%`}</span>
                                </p>
                                <div className="step-progress-bar">
                                    <div className="step-progress-fill" style={{ width: `${progress}%`, transition: 'width 0.6s ease' }} />
                                </div>
                                <div className="step-tabs">
                                    {STEPS.map((step, idx) => (
                                        <button
                                            key={idx}
                                            className={`step-tab ${idx === activeStep ? "step-tab--active" : "step-tab--inactive"}`}
                                        >
                                            <span className="step-tab-label">{step.label}</span>
                                            <span className="step-tab-sub">{step.sub}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Basic Info Section */}
                            <div className="form-section-card">
                                <div className="form-section-header">
                                    <h2 className="form-section-title">Thông tin cơ bản</h2>
                                    <p className="form-section-desc">Thông tin cá nhân của bạn</p>
                                </div>

                                <div className="form-grid">
                                    <div className="form-field">
                                        <label className="field-label">
                                            Họ và tên <span className="required-star">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="field-input"
                                            placeholder="Nguyen Van A"
                                            value={form.fullName}
                                            onChange={(e) => updateField('fullName', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="field-label">
                                            Mã số sinh viên <span className="required-star">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="field-input field-input--disabled"
                                            placeholder="SE123456"
                                            value={form.studentId}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-field form-field--full">
                                        <label className="field-label">
                                            Email <span className="required-star">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="field-input"
                                            placeholder="student@university.edu.vn"
                                            value={form.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                        />
                                        <p className="field-hint">Email để gửi các thông báo quan trọng của SEeds</p>
                                    </div>
                                    <div className="form-field">
                                        <label className="field-label">
                                            Số điện thoại <span className="required-star">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="field-input"
                                            placeholder="+84 723 456 789"
                                            value={form.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="field-label">
                                            Ngày sinh <span className="required-star">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="field-input"
                                            value={form.birthDate}
                                            onChange={(e) => updateField('birthDate', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="field-label">
                                            Giới tính <span className="required-star">*</span>
                                        </label>
                                        <select className="field-input field-select" value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
                                            <option value="">-- Chọn giới tính --</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Social Media Section */}
                                <div className="social-section">
                                    <h3 className="social-section-title">Mạng xã hội</h3>
                                    <div className="form-grid">
                                        <div className="form-field">
                                            <label className="field-label field-label--icon">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <g clipPath="url(#clip-github)">
                                                        <path d="M9.99666 14.6619V11.9961C10.0894 11.1613 9.84999 10.3234 9.33021 9.66358C11.3295 9.66358 13.3289 8.33069 13.3289 5.99813C13.3822 5.16507 13.1489 4.34534 12.6624 3.66557C12.849 2.89916 12.849 2.09942 12.6624 1.33301C12.6624 1.33301 11.996 1.33301 10.6631 2.33268C8.90369 1.99945 7.09095 1.99945 5.33154 2.33268C3.99864 1.33301 3.3322 1.33301 3.3322 1.33301C3.13227 2.09942 3.13227 2.89916 3.3322 3.66557C2.84694 4.3426 2.61142 5.16693 2.66575 5.99813C2.66575 8.33069 4.66509 9.66358 6.66443 9.66358C6.40451 9.99014 6.21124 10.3633 6.09795 10.7632C5.98465 11.1631 5.95133 11.5829 5.99798 11.9961V14.6619" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M5.99801 11.996C2.99234 13.3289 2.66578 10.6631 1.33289 10.6631" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip-github"><rect width="15.99" height="15.99" fill="white"/></clipPath>
                                                    </defs>
                                                </svg>
                                                GitHub URL
                                            </label>
                                            <input type="url" className="field-input" placeholder="https://github.com/username" value={form.githubUrl} onChange={(e) => updateField('githubUrl', e.target.value)} />
                                        </div>
                                        <div className="form-field">
                                            <label className="field-label field-label--icon">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <g clipPath="url(#clip-linkedin)">
                                                        <path d="M10.6631 5.33154C11.7236 5.33154 12.7407 5.75283 13.4906 6.50273C14.2405 7.25262 14.6618 8.2697 14.6618 9.33022V13.9953H11.996V9.33022C11.996 8.97671 11.8556 8.63769 11.6056 8.38772C11.3556 8.13776 11.0166 7.99733 10.6631 7.99733C10.3096 7.99733 9.97057 8.13776 9.72061 8.38772C9.47064 8.63769 9.33021 8.97671 9.33021 9.33022V13.9953H6.66443V9.33022C6.66443 8.2697 7.08572 7.25262 7.83561 6.50273C8.58551 5.75283 9.60259 5.33154 10.6631 5.33154Z" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M3.99867 5.99805H1.33289V13.9954H3.99867V5.99805Z" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M2.66578 3.99879C3.40191 3.99879 3.99867 3.40204 3.99867 2.6659C3.99867 1.92976 3.40191 1.33301 2.66578 1.33301C1.92964 1.33301 1.33289 1.92976 1.33289 2.6659C1.33289 3.40204 1.92964 3.99879 2.66578 3.99879Z" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip-linkedin"><rect width="15.99" height="15.99" fill="white"/></clipPath>
                                                    </defs>
                                                </svg>
                                                LinkedIn URL
                                            </label>
                                            <input type="url" className="field-input" placeholder="https://linkedin.com/in/username" value={form.linkedinUrl} onChange={(e) => updateField('linkedinUrl', e.target.value)} />
                                        </div>
                                        <div className="form-field">
                                            <label className="field-label field-label--icon">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <g clipPath="url(#clip-facebook)">
                                                        <path d="M11.9961 1.33301H9.99673C9.11297 1.33301 8.2654 1.68408 7.64049 2.309C7.01557 2.93391 6.6645 3.78147 6.6645 4.66524V6.66457H4.66516V9.33036H6.6645V14.6619H9.33028V9.33036H11.3296L11.9961 6.66457H9.33028V4.66524C9.33028 4.48848 9.4005 4.31897 9.52548 4.19399C9.65046 4.06901 9.81998 3.99879 9.99673 3.99879H11.9961V1.33301Z" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip-facebook"><rect width="15.99" height="15.99" fill="white"/></clipPath>
                                                    </defs>
                                                </svg>
                                                Facebook URL
                                            </label>
                                            <input type="url" className="field-input" placeholder="https://facebook.com/username" value={form.facebookUrl} onChange={(e) => updateField('facebookUrl', e.target.value)} />
                                        </div>
                                        <div className="form-field">
                                            <label className="field-label field-label--icon">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <g clipPath="url(#clip-portfolio)">
                                                        <path d="M7.99734 14.6619C11.678 14.6619 14.6618 11.6781 14.6618 7.99747C14.6618 4.31679 11.678 1.33301 7.99734 1.33301C4.31667 1.33301 1.33289 4.31679 1.33289 7.99747C1.33289 11.6781 4.31667 14.6619 7.99734 14.6619Z" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M7.99733 1.33301C6.28605 3.12985 5.33154 5.51612 5.33154 7.99747C5.33154 10.4788 6.28605 12.8651 7.99733 14.6619C9.7086 12.8651 10.6631 10.4788 10.6631 7.99747C10.6631 5.51612 9.7086 3.12985 7.99733 1.33301Z" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M1.33289 7.99731H14.6618" stroke="#6A7282" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip-portfolio"><rect width="15.99" height="15.99" fill="white"/></clipPath>
                                                    </defs>
                                                </svg>
                                                Portfolio URL
                                            </label>
                                            <input type="url" className="field-input" placeholder="https://yourportfolio.com" value={form.portfolioUrl} onChange={(e) => updateField('portfolioUrl', e.target.value)} />
                                            <p className="field-hint">Trang portfolio của bạn</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="form-actions">
                                    <button className="btn-back" disabled style={{opacity:0.4,cursor:'not-allowed'}}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Trở lại
                                    </button>
                                    <div className="form-actions-right">
                                        <button className="btn-save" onClick={saveStep2} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu bản nháp'}</button>
                                        <button className="btn-next" disabled={saving} onClick={async () => {
                                            await saveStep2();
                                            navigate('/profile/update/step2');
                                        }}>
                                            Tiếp
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Sidebar */}
                        <ProfileSidebar activeStep={0} />
                    </div>
                </div>
            </main>

            <style>{`
                .profile-page {
                    min-height: 100vh;
                    background: #F9FAFB;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                /* ── Main ── */
                .profile-main {
                    background: linear-gradient(135deg, #F9FAFB 0%, rgba(250,245,255,0.3) 100%);
                    min-height: calc(100vh - 64px);
                    padding: 2rem 0;
                }
                .profile-content-wrapper {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .page-title-block { display: flex; flex-direction: column; gap: 8px; }
                .page-title {
                    font-size: clamp(24px, 4vw, 36px);
                    font-weight: 700;
                    color: #101828;
                    margin: 0;
                    line-height: 1.2;
                }
                .page-subtitle {
                    font-size: 16px;
                    color: #4A5565;
                    margin: 0;
                }

                /* ── Layout ── */
                .profile-layout {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 1.5rem;
                    align-items: start;
                }
                @media (max-width: 1024px) {
                    .profile-layout { grid-template-columns: 1fr; }
                    .profile-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                }
                @media (max-width: 640px) {
                    .profile-sidebar { grid-template-columns: 1fr; }
                    .header-nav .nav-link { display: none; }
                }

                .form-area { display: flex; flex-direction: column; gap: 1.5rem; }

                /* ── Step Card ── */
                .step-card {
                    background: #FFF;
                    border-radius: 14px;
                    box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
                    padding: 1.5rem 1.5rem 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    overflow: hidden;
                }
                .step-counter {
                    font-size: 18px;
                    font-weight: 600;
                    color: #101828;
                    margin: 0;
                }
                .step-progress-bar {
                    height: 10px;
                    background: #E5E7EB;
                    border-radius: 999px;
                    overflow: hidden;
                }
                .step-progress-fill {
                    height: 100%;
                    border-radius: 999px;
                    background: linear-gradient(90deg, #4D55CC 0%, #8B4CFF 100%);
                }
                .step-tabs {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    padding-bottom: 0;
                }
                @media (max-width: 600px) {
                    .step-tabs { grid-template-columns: repeat(2, 1fr); }
                }
                .step-tab {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 16px 8px;
                    border-radius: 10px;
                    border: none;
                    cursor: pointer;
                    gap: 4px;
                    font-family: 'Inter', sans-serif;
                    transition: background 0.2s;
                }
                .step-tab--active {
                    background: linear-gradient(90deg, #4D55CC 0%, #8B4CFF 100%);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,.1);
                }
                .step-tab--inactive {
                    background: transparent;
                    border: 1px solid #E5E7EB;
                }
                .step-tab--inactive:hover { background: #F9FAFB; }
                .step-tab-label {
                    font-size: 14px;
                    font-weight: 600;
                }
                .step-tab--active .step-tab-label { color: #FFF; }
                .step-tab--inactive .step-tab-label { color: #364153; }
                .step-tab-sub {
                    font-size: 12px;
                    font-weight: 400;
                }
                .step-tab--active .step-tab-sub { color: rgba(255,255,255,0.85); }
                .step-tab--inactive .step-tab-sub { color: #6A7282; }

                /* ── Form Section Card ── */
                .form-section-card {
                    background: #FFF;
                    border-radius: 14px;
                    box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .form-section-header { display: flex; flex-direction: column; gap: 4px; }
                .form-section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #101828;
                    margin: 0;
                }
                .form-section-desc {
                    font-size: 14px;
                    color: #6A7282;
                    margin: 0;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                @media (max-width: 640px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .form-field--full { grid-column: 1; }
                }
                .form-field { display: flex; flex-direction: column; gap: 8px; }
                .form-field--full { grid-column: 1 / -1; }
                .field-label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #364153;
                }
                .required-star { color: #E7000B; }
                .field-input {
                    height: 50px;
                    padding: 12px 16px;
                    border-radius: 10px;
                    border: 1px solid #E5E7EB;
                    background: #FFF;
                    font-size: 16px;
                    color: #101828;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .field-input::placeholder { color: rgba(10,10,10,0.5); }
                .field-input:focus { border-color: #6D52E5; box-shadow: 0 0 0 3px rgba(109,82,229,0.1); }
                .field-input--disabled { background: #F9FAFB; color: #6A7282; cursor: not-allowed; }
                .field-hint { font-size: 12px; color: #6A7282; margin: 0; }

                /* Social Section */
                .social-section { display: flex; flex-direction: column; gap: 1rem; }
                .social-section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #101828;
                    margin: 0;
                    border-top: 1px solid #E5E7EB;
                    padding-top: 1rem;
                }
                .field-label--icon { color: #364153; }
                .field-select { cursor: pointer; appearance: auto; }

                /* Action Buttons */
                .form-actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 1.25rem;
                    border-top: 1px solid #E5E7EB;
                    margin-top: 0.5rem;
                    gap: 12px;
                }
                .form-actions-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .btn-back {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: 1px solid #E5E7EB;
                    border-radius: 10px;
                    padding: 10px 18px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #364153;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: background 0.2s, border-color 0.2s;
                }
                .btn-back:hover { background: #F3F4F6; border-color: #D1D5DB; }
                .btn-save {
                    background: none;
                    border: 1.5px solid #6D52E5;
                    border-radius: 10px;
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #6D52E5;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: background 0.2s, color 0.2s;
                }
                .btn-save:hover { background: #F5F3FF; }
                .btn-next {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: linear-gradient(90deg, #4D55CC 0%, #8B4CFF 100%);
                    border: none;
                    border-radius: 10px;
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #FFF;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: opacity 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 12px rgba(109,82,229,0.3);
                }
                .btn-next:hover { opacity: 0.9; box-shadow: 0 6px 16px rgba(109,82,229,0.4); }

                /* ── Sidebar ── */
                .profile-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }

                /* Progress Card */
                .progress-card {
                    background: #FFF;
                    border-radius: 14px;
                    box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .progress-card-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #101828;
                    margin: 0;
                    align-self: flex-start;
                }
                .progress-circle-wrapper {
                    position: relative;
                    width: 128px;
                    height: 128px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .progress-percentage {
                    position: absolute;
                    font-size: 30px;
                    font-weight: 700;
                    color: #101828;
                }
                .progress-message {
                    font-size: 14px;
                    color: #4A5565;
                    text-align: center;
                    margin: 0;
                }
                .missing-info-section {
                    width: 100%;
                    border-top: 1px solid #E5E7EB;
                    padding-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .missing-info-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: #364153;
                    margin: 0;
                }
                .missing-info-list { display: flex; flex-direction: column; gap: 6px; }
                .missing-info-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 10px;
                    border: 1px solid #FEE685;
                    background: #FFFBEB;
                }
                .missing-info-icon { font-size: 12px; flex-shrink: 0; }
                .missing-info-text { font-size: 12px; color: #BB4D00; }

                /* Tips Card */
                .tips-card {
                    border-radius: 14px;
                    border: 1px solid #F3E8FF;
                    background: linear-gradient(135deg, #FAF5FF 0%, #EFF6FF 100%);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .tips-header { display: flex; align-items: center; gap: 12px; }
                .tips-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #4D55CC 0%, #8B4CFF 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .tips-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #101828;
                    margin: 0;
                }
                .tips-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .tips-item { display: flex; gap: 8px; align-items: flex-start; }
                .tips-bullet { color: #AD46FF; font-size: 14px; flex-shrink: 0; line-height: 20px; }
                .tips-text { font-size: 14px; color: #364153; line-height: 20px; }
            `}</style>
        </div>
    );
}
