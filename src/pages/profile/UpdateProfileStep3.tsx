import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileForm } from './ProfileFormContext';
import ProfileSidebar from './ProfileSidebar';

const STEPS = [
    { label: "Bước 1", sub: "Thông tin cơ bản" },
    { label: "Bước 2", sub: "Học vấn và Kỹ năng" },
    { label: "Bước 3", sub: "Dự án và Kinh nghiệm" },
    { label: "Bước 4", sub: "Mục tiêu sự nghiệp" },
];

export default function UpdateProfileStep3() {
    const [activeStep] = useState(2);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { form, updateField, completion, completionLoading, saveStep3, saving } = useProfileForm();

    const progress = completion?.completionPercentage ?? 0;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="profile-page">
            {/* Header */}
            <header className="profile-header">
                <div className="header-container">
                    <a href="/" className="brand-logo">
                        <div className="brand-icon">S</div>
                        <span className="brand-name">SEeds</span>
                    </a>

                    <nav className="header-nav">
                        <a href="#" className="nav-link">Bảng điều khiển</a>
                        <a href="#" className="nav-link">Phỏng vấn thử</a>
                        <a href="#" className="nav-link">Việc làm</a>

                        <div className="user-menu-wrapper">
                            <button
                                className="user-menu-trigger"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15.8242 17.4898V15.8241C15.8242 14.9405 15.4732 14.0932 14.8485 13.4684C14.2237 12.8437 13.3763 12.4927 12.4928 12.4927H7.49571C6.61216 12.4927 5.76481 12.8437 5.14005 13.4684C4.51529 14.0932 4.16431 14.9405 4.16431 15.8241V17.4898" stroke="#364153" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9.99424 9.16133C11.8341 9.16133 13.3256 7.66982 13.3256 5.82994C13.3256 3.99005 11.8341 2.49854 9.99424 2.49854C8.15436 2.49854 6.66284 3.99005 6.66284 5.82994C6.66284 7.66982 8.15436 9.16133 9.99424 9.16133Z" stroke="#364153" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="user-name">Nguyễn Văn A</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M11.9959 9.99665L7.99725 5.99798L3.99857 9.99665" stroke="#364153" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="user-dropdown">
                                    <a href="#" className="dropdown-item">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M12.6625 13.9953V12.6624C12.6625 11.9554 12.3817 11.2773 11.8817 10.7774C11.3818 10.2774 10.7037 9.99658 9.99673 9.99658H5.99806C5.29105 9.99658 4.613 10.2774 4.11307 10.7774C3.61313 11.2773 3.33228 11.9554 3.33228 12.6624V13.9953" stroke="#364153" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M7.99733 7.33108C9.4696 7.33108 10.6631 6.13757 10.6631 4.6653C10.6631 3.19302 9.4696 1.99951 7.99733 1.99951C6.52505 1.99951 5.33154 3.19302 5.33154 4.6653C5.33154 6.13757 6.52505 7.33108 7.99733 7.33108Z" stroke="#364153" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Hồ sơ
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <g clipPath="url(#clip-settings)">
                                                <path d="M8.1439 1.33301H7.85066C7.49715 1.33301 7.15813 1.47344 6.90816 1.7234C6.6582 1.97337 6.51777 2.31239 6.51777 2.6659V2.78586C6.51753 3.0196 6.45583 3.24917 6.33885 3.45153C6.22188 3.6539 6.05375 3.82194 5.85132 3.93881L5.56475 4.10542C5.36213 4.22241 5.13228 4.284 4.8983 4.284C4.66433 4.284 4.43448 4.22241 4.23186 4.10542L4.13189 4.05211C3.82604 3.87567 3.46267 3.82781 3.12156 3.91902C2.78045 4.01024 2.48947 4.23307 2.31249 4.53861L2.16588 4.79186C1.98944 5.09772 1.94158 5.46108 2.03279 5.80219C2.12401 6.1433 2.34684 6.43428 2.65238 6.61126L2.75235 6.6779C2.9538 6.79421 3.12131 6.9612 3.23822 7.1623C3.35514 7.36339 3.41739 7.59158 3.41879 7.82419V8.16408C3.41973 8.39895 3.35858 8.62989 3.24155 8.83353C3.12452 9.03716 2.95575 9.20626 2.75235 9.32369L2.65238 9.38367C2.34684 9.56065 2.12401 9.85163 2.03279 10.1927C1.94158 10.5339 1.98944 10.8972 2.16588 11.2031L2.31249 11.4563C2.48947 11.7619 2.78045 11.9847 3.12156 12.0759C3.46267 12.1671 3.82604 12.1193 4.13189 11.9428L4.23186 11.8895C4.43448 11.7725 4.66433 11.7109 4.8983 11.7109C5.13228 11.7109 5.36213 11.7725 5.56475 11.8895L5.85132 12.0561C6.05375 12.173 6.22188 12.341 6.33885 12.5434C6.45583 12.7458 6.51753 12.9753 6.51777 13.2091V13.329C6.51777 13.6825 6.6582 14.0216 6.90816 14.2715C7.15813 14.5215 7.49715 14.6619 7.85066 14.6619H8.1439C8.4974 14.6619 8.83643 14.5215 9.08639 14.2715C9.33636 14.0216 9.47679 13.6825 9.47679 13.329V13.2091C9.47703 12.9753 9.53873 12.7458 9.6557 12.5434C9.77268 12.341 9.94081 12.173 10.1432 12.0561L10.4298 11.8895C10.6324 11.7725 10.8623 11.7109 11.0963 11.7109C11.3302 11.7109 11.5601 11.7725 11.7627 11.8895L11.8627 11.9428C12.1685 12.1193 12.5319 12.1671 12.873 12.0759C13.2141 11.9847 13.5051 11.7619 13.6821 11.4563L13.8287 11.1964C14.0051 10.8906 14.053 10.5272 13.9618 10.1861C13.8705 9.84497 13.6477 9.55398 13.3422 9.37701L13.2422 9.32369C13.0388 9.20626 12.87 9.03716 12.753 8.83353C12.636 8.62989 12.5748 8.39895 12.5758 8.16408V7.83085C12.5748 7.59599 12.636 7.36504 12.753 7.1614C12.87 6.95777 13.0388 6.78867 13.2422 6.67124L13.3422 6.61126C13.6477 6.43428 13.8705 6.1433 13.9618 5.80219C14.053 5.46108 14.0051 5.09772 13.8287 4.79186L13.6821 4.53861C13.5051 4.23307 13.2141 4.01024 12.873 3.91902C12.5319 3.82781 12.1685 3.87567 11.8627 4.05211L11.7627 4.10542C11.5601 4.22241 11.3302 4.284 11.0963 4.284C10.8623 4.284 10.6324 4.22241 10.4298 4.10542L10.1432 3.93881C9.94081 3.82194 9.77268 3.6539 9.6557 3.45153C9.53873 3.24917 9.47703 3.0196 9.47679 2.78586V2.6659C9.47679 2.31239 9.33636 1.97337 9.08639 1.7234C8.83643 1.47344 8.4974 1.33301 8.1439 1.33301Z" stroke="#364153" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7.99738 9.99672C9.10159 9.99672 9.99672 9.10159 9.99672 7.99738C9.99672 6.89318 9.10159 5.99805 7.99738 5.99805C6.89318 5.99805 5.99805 6.89318 5.99805 7.99738C5.99805 9.10159 6.89318 9.99672 7.99738 9.99672Z" stroke="#364153" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip-settings">
                                                    <rect width="15.99" height="15.99" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        Quản lý tài khoản
                                    </a>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item dropdown-logout">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M5.99794 13.9955H3.33216C2.97865 13.9955 2.63963 13.8551 2.38966 13.6051C2.1397 13.3552 1.99927 13.0162 1.99927 12.6626V3.3324C1.99927 2.9789 2.1397 2.63987 2.38966 2.38991C2.63963 2.13994 2.97865 1.99951 3.33216 1.99951H5.99794" stroke="#E7000B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M10.6631 11.3295L13.9953 7.99727L10.6631 4.66504" stroke="#E7000B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M13.9954 7.99756H5.99805" stroke="#E7000B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Page Body */}
            <main className="profile-main">
                <div className="profile-content-wrapper">
                    {/* Page Title */}
                    <div className="page-title-block">
                        <h1 className="page-title">Tạo hồ sơ ứng viên</h1>
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
                                    <span>Bước 3 trên 4</span>
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

                            {/* Dự án và Kinh nghiệm Section */}
                            <div className="form-section-card" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
                                <div className="form-section-header" style={{ marginBottom: '1rem' }}>
                                    <h2 className="form-section-title">Dự án và Kinh nghiệm</h2>
                                    <p className="form-section-desc">Thể hiện các dự án kỹ thuật và kinh nghiệm làm việc của bạn</p>
                                </div>

                                {/* DỰ ÁN */}
                                <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#101828' }}>Dự án</h3>
                                    <button className="btn-add-solid" onClick={() => updateField('projects', [...form.projects, { name: '', description: '', role: '', contribution: '', startDate: '', endDate: '', teamSize: 1, technologies: [], projectUrl: '', reportUrl: '' }])}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                        Thêm dự án
                                    </button>
                                </div>

                                {form.projects.length === 0 && (
                                    <p className="field-hint" style={{ textAlign: 'center', padding: '1.5rem', color: '#9CA3AF' }}>Chưa có dự án nào. Bấm "Thêm dự án" để thêm.</p>
                                )}

                                {form.projects.map((proj, idx) => (
                                    <div key={idx} className="item-card project-card" style={{ background: '#F5F3FF', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #E0D4FF' }}>
                                        <div className="item-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#101828' }}>Dự án {idx + 1}</h4>
                                            <button className="btn-icon btn-delete-icon" onClick={() => { const updated = form.projects.filter((_, i) => i !== idx); updateField('projects', updated); }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path></svg>
                                            </button>
                                        </div>

                                        <div className="form-grid" style={{ gap: '1.25rem' }}>
                                            <div className="form-field form-field--full">
                                                <label className="field-label">Tên dự án <span className="required-star">*</span></label>
                                                <input type="text" className="field-input" placeholder="VD: Nền tảng thương mại điện tử" style={{background: '#FFF'}} value={proj.name} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], name: e.target.value }; updateField('projects', updated); }} />
                                            </div>
                                            <div className="form-field form-field--full">
                                                <label className="field-label">Mô tả</label>
                                                <textarea className="field-input" style={{ height: '80px', paddingTop: '12px', resize: 'vertical', background: '#FFF' }} placeholder="Mô tả ngắn gọn về dự án, mục đích và các tính năng chính..." value={proj.description} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], description: e.target.value }; updateField('projects', updated); }}></textarea>
                                            </div>
                                            <div className="form-field form-field--full">
                                                <label className="field-label">Công nghệ sử dụng</label>
                                                <div className="field-input" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', height: 'auto', minHeight: '50px', padding: '8px 12px', background: '#FFF' }}>
                                                    {proj.technologies?.map((tech, tIdx) => (
                                                        <span key={tIdx} className="tag" style={{ margin: 0, background: '#F5F3FF', color: '#8B4CFF', border: 'none', borderRadius: '16px', padding: '4px 12px' }}>{tech} <span style={{ marginLeft: '4px', cursor: 'pointer' }} onClick={() => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], technologies: updated[idx].technologies.filter((_, i) => i !== tIdx) }; updateField('projects', updated); }}>×</span></span>
                                                    ))}
                                                    <input type="text" style={{ border: 'none', outline: 'none', flex: 1, minWidth: '150px', fontSize: '14px', background: 'transparent' }} placeholder="Thêm công nghệ khác..." onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); const val = (e.target as HTMLInputElement).value.trim(); if (val && !proj.technologies?.includes(val)) { const updated = [...form.projects]; updated[idx] = { ...updated[idx], technologies: [...(updated[idx].technologies || []), val] }; updateField('projects', updated); } (e.target as HTMLInputElement).value = ''; } }} />
                                                </div>
                                                <p className="field-hint" style={{ marginTop: '4px' }}>Nhấn Enter hoặc dấu phẩy để thêm công nghệ</p>
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Vai trò của bạn</label>
                                                <input type="text" className="field-input" placeholder="VD: Full-stack Developer" style={{background: '#FFF'}} value={proj.role} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], role: e.target.value }; updateField('projects', updated); }} />
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Quy mô nhóm</label>
                                                <input type="number" className="field-input" placeholder="VD: 4" style={{background: '#FFF'}} value={proj.teamSize || ''} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], teamSize: parseInt(e.target.value) || 0 }; updateField('projects', updated); }} />
                                            </div>
                                            <div className="form-field form-field--full">
                                                <label className="field-label">Đóng góp của bạn</label>
                                                <textarea className="field-input" style={{ height: '80px', paddingTop: '12px', resize: 'vertical', background: '#FFF' }} placeholder="Mô tả các đóng góp cụ thể của bạn cho dự án..." value={proj.contribution} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], contribution: e.target.value }; updateField('projects', updated); }}></textarea>
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Ngày bắt đầu</label>
                                                <input type="date" className="field-input" style={{background: '#FFF'}} value={proj.startDate} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], startDate: e.target.value }; updateField('projects', updated); }} />
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Ngày kết thúc</label>
                                                <input type="date" className="field-input" style={{background: '#FFF'}} value={proj.endDate} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], endDate: e.target.value }; updateField('projects', updated); }} />
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Repository URL</label>
                                                <input type="url" className="field-input" placeholder="https://github.com/username/repo" style={{background: '#FFF'}} value={proj.projectUrl || ''} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], projectUrl: e.target.value }; updateField('projects', updated); }} />
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Báo cáo URL</label>
                                                <input type="url" className="field-input" placeholder="Liên kết tài liệu dự án" style={{background: '#FFF'}} value={proj.reportUrl || ''} onChange={(e) => { const updated = [...form.projects]; updated[idx] = { ...updated[idx], reportUrl: e.target.value }; updateField('projects', updated); }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* KINH NGHIỆM */}
                                <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingTop: '1rem' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#101828' }}>Kinh nghiệm làm việc</h3>
                                    <button className="btn-add-solid" onClick={() => updateField('workExperiences', [...form.workExperiences, { companyName: '', position: '', startDate: '', endDate: '', description: '', technologiesUsed: [] }])}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6M16 8V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M4 8h16v5H4z"></path></svg>
                                        Thêm kinh nghiệm
                                    </button>
                                </div>

                                {form.workExperiences.length === 0 && (
                                    <p className="field-hint" style={{ textAlign: 'center', padding: '1.5rem', color: '#9CA3AF' }}>Chưa có kinh nghiệm làm việc nào. Bấm "Thêm kinh nghiệm" để thêm.</p>
                                )}

                                {form.workExperiences.map((exp, idx) => (
                                    <div key={idx} className="item-card experience-card" style={{ background: '#FAFAFA', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
                                        <div className="item-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#101828' }}>Kinh nghiệm {idx + 1}</h4>
                                            <button className="btn-icon btn-delete-icon" onClick={() => { const updated = form.workExperiences.filter((_, i) => i !== idx); updateField('workExperiences', updated); }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path></svg>
                                            </button>
                                        </div>

                                        <div className="form-grid" style={{ gap: '1.25rem' }}>
                                            <div className="form-field">
                                                <label className="field-label">Chức danh <span className="required-star">*</span></label>
                                                <input type="text" className="field-input" placeholder="VD: Junior Developer" style={{background: '#FFF'}} value={exp.position} onChange={(e) => { const updated = [...form.workExperiences]; updated[idx] = { ...updated[idx], position: e.target.value }; updateField('workExperiences', updated); }} />
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Tổ chức</label>
                                                <input type="text" className="field-input" placeholder="VD: Công ty Công nghệ ABC" style={{background: '#FFF'}} value={exp.companyName} onChange={(e) => { const updated = [...form.workExperiences]; updated[idx] = { ...updated[idx], companyName: e.target.value }; updateField('workExperiences', updated); }} />
                                            </div>
                                            <div className="form-field form-field--full">
                                                <label className="field-label">Công nghệ sử dụng</label>
                                                <div className="field-input" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', height: 'auto', minHeight: '50px', padding: '8px 12px', background: '#FFF' }}>
                                                    {exp.technologiesUsed?.map((tech, tIdx) => (
                                                        <span key={tIdx} className="tag" style={{ margin: 0, background: '#F5F3FF', color: '#8B4CFF', border: 'none', borderRadius: '16px', padding: '4px 12px' }}>{tech} <span style={{ marginLeft: '4px', cursor: 'pointer' }} onClick={() => { const updated = [...form.workExperiences]; updated[idx] = { ...updated[idx], technologiesUsed: updated[idx].technologiesUsed.filter((_, i) => i !== tIdx) }; updateField('workExperiences', updated); }}>×</span></span>
                                                    ))}
                                                    <input type="text" style={{ border: 'none', outline: 'none', flex: 1, minWidth: '150px', fontSize: '14px', background: 'transparent' }} placeholder="Thêm công nghệ khác..." onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); const val = (e.target as HTMLInputElement).value.trim(); if (val && !exp.technologiesUsed?.includes(val)) { const updated = [...form.workExperiences]; updated[idx] = { ...updated[idx], technologiesUsed: [...(updated[idx].technologiesUsed || []), val] }; updateField('workExperiences', updated); } (e.target as HTMLInputElement).value = ''; } }} />
                                                </div>
                                                <p className="field-hint" style={{ marginTop: '4px' }}>Nhấn Enter hoặc dấu phẩy để thêm công nghệ</p>
                                            </div>
                                            <div className="form-field form-field--full">
                                                <label className="field-label">Mô tả</label>
                                                <textarea className="field-input" style={{ height: '80px', paddingTop: '12px', resize: 'vertical', background: '#FFF' }} placeholder="Mô tả trách nhiệm, thành tích và kỹ năng đã phát triển..." value={exp.description} onChange={(e) => { const updated = [...form.workExperiences]; updated[idx] = { ...updated[idx], description: e.target.value }; updateField('workExperiences', updated); }}></textarea>
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Ngày bắt đầu</label>
                                                <input type="date" className="field-input" style={{background: '#FFF'}} value={exp.startDate} onChange={(e) => { const updated = [...form.workExperiences]; updated[idx] = { ...updated[idx], startDate: e.target.value }; updateField('workExperiences', updated); }} />
                                            </div>
                                            <div className="form-field">
                                                <label className="field-label">Ngày kết thúc</label>
                                                <input type="date" className="field-input" style={{background: '#FFF'}} value={exp.endDate} onChange={(e) => { const updated = [...form.workExperiences]; updated[idx] = { ...updated[idx], endDate: e.target.value }; updateField('workExperiences', updated); }} />
                                                <p className="field-hint" style={{ marginTop: '4px', textAlign: 'left' }}>Để trống nếu đang làm việc</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Action Buttons */}
                                <div className="form-actions" style={{ background: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button className="btn-back" onClick={() => navigate('/profile/update/step2')}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Trở lại
                                    </button>
                                    <div className="form-actions-right">
                                        <button className="btn-save" onClick={saveStep3} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu bản nháp'}</button>
                                        <button className="btn-next" disabled={saving} onClick={async () => {
                                            const success = await saveStep3();
                                            if (success) navigate('/profile/update/step4');
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
                        <ProfileSidebar activeStep={2} />
                    </div>
                </div>
            </main>

            <style>{`
                .profile-page {
                    min-height: 100vh;
                    background: #F9FAFB;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                /* ── Header ── */
                .profile-header {
                    background: #FFF;
                    border-bottom: 1px solid #E5E7EB;
                    box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }
                .header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    height: 64px;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    flex-shrink: 0;
                }
                .brand-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4D55CC 0%, #8B4CFF 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #FFF;
                    font-weight: 700;
                    font-size: 16px;
                    flex-shrink: 0;
                }
                .brand-name {
                    font-size: 24px;
                    font-weight: 700;
                    background: linear-gradient(90deg, #4D55CC 0%, #8B4CFF 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .header-nav {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .nav-link {
                    color: #364153;
                    font-size: 16px;
                    font-weight: 500;
                    text-decoration: none;
                    white-space: nowrap;
                }
                .nav-link:hover { color: #4D55CC; }

                /* User menu */
                .user-menu-wrapper { position: relative; }
                .user-menu-trigger {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 10px;
                    color: #364153;
                    font-size: 16px;
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                }
                .user-menu-trigger:hover { background: #F3F4F6; }
                .user-name { white-space: nowrap; }
                .user-dropdown {
                    position: absolute;
                    right: 0;
                    top: calc(100% + 8px);
                    width: 224px;
                    background: #FFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 10px;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1);
                    padding: 8px 0;
                    z-index: 100;
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 16px;
                    color: #364153;
                    font-size: 16px;
                    font-weight: 400;
                    text-decoration: none;
                    width: 100%;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    text-align: left;
                }
                .dropdown-item:hover { background: #F9FAFB; }
                .dropdown-divider { height: 1px; background: #F3F4F6; margin: 4px 0; }
                .dropdown-logout { color: #E7000B; font-weight: 500; }
                .dropdown-logout:hover { background: #FFF5F5; }

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
                .btn-add-solid { display: flex; align-items: center; gap: 6px; background: #6D52E5; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; }
                .btn-add-solid:hover { background: #5b42cf; }
                .btn-icon { background: none; border: none; cursor: pointer; color: #6A7282; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; }
                .btn-icon:hover { background: #F3F4F6; }
                .tag { padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid #E5E7EB; background: #FFF; color: #364153; display: inline-flex; align-items: center; }
                .tag--active { background: #F5F3FF; border-color: #6D52E5; color: #6D52E5; }

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
