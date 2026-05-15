import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileForm } from './ProfileFormContext';
import ProfileSidebar from './ProfileSidebar';
import GlobalHeader from '../../components/GlobalHeader';

const STEPS = [
    { label: "Bước 1", sub: "Thông tin cơ bản", path: "/candidate/profile/update" },
    { label: "Bước 2", sub: "Học vấn và Kỹ năng", path: "/candidate/profile/update/step2" },
    { label: "Bước 3", sub: "Dự án và Kinh nghiệm", path: "/candidate/profile/update/step3" },
    { label: "Bước 4", sub: "Mục tiêu sự nghiệp", path: "/candidate/profile/update/step4" },
];



const TECH_CATEGORIES = [
    { key: 'Ngôn ngữ lập trình', label: 'Ngôn ngữ lập trình', placeholder: 'Ví dụ: C#, Python, Java...', addLabel: 'Thêm ngôn ngữ lập trình' },
    { key: 'Framework', label: 'Frameworks', placeholder: 'Ví dụ: React, Spring Boot...', addLabel: 'Thêm Framework' },
    { key: 'OS', label: 'Hệ điều hành', placeholder: 'Ví dụ: Linux, Windows...', addLabel: 'Thêm hệ điều hành' },
    { key: 'Database', label: 'Cơ sở dữ liệu', placeholder: 'Ví dụ: MySQL, MongoDB...', addLabel: 'Thêm cơ sở dữ liệu' },
    { key: 'Cloud', label: 'Điện toán đám mây', placeholder: 'Ví dụ: AWS, GCP...', addLabel: 'Thêm dịch vụ đám mây' },
    { key: 'Version Control', label: 'Quản lý phiên bản', placeholder: 'Ví dụ: Git, SVN...', addLabel: 'Thêm công cụ quản lý phiên bản' },
    { key: 'Công cụ quản lý dự án', label: 'Công cụ quản lý dự án', placeholder: 'Ví dụ: Jira, Trello...', addLabel: 'Thêm công cụ quản lý dự án' },
];

export default function UpdateProfileStep2() {
    const activeStep = 1;
    const [newSoftSkill, setNewSoftSkill] = useState('');
    const navigate = useNavigate();
    const { form, updateField, completion, completionLoading, saveStep2, saving } = useProfileForm();

    const progress = completion?.completionPercentage ?? 0;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="profile-page">
            <GlobalHeader userName={form.fullName || undefined} />

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
                                    <span>Bước 2 trên 4</span>
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
                                            type="button"
                                            onClick={() => navigate(step.path)}
                                        >
                                            <span className="step-tab-label">{step.label}</span>
                                            <span className="step-tab-sub">{step.sub}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Education and Skills Section */}
                            <div className="form-section-card">
                                <div className="form-section-header">
                                    <h2 className="form-section-title">Học vấn và Kỹ năng</h2>
                                    <p className="form-section-desc">Hồ sơ sẽ nổi bật hơn nếu có thông tin này của bạn</p>
                                </div>

                                {/* Học vấn */}
                                <div className="sub-section">
                                    <h3 className="sub-section-title">Học vấn</h3>
                                    <div className="form-grid">
                                        <div className="form-field">
                                            <label className="field-label">Trường <span className="required-star">*</span></label>
                                            <input type="text" className="field-input" placeholder="UIT" value={form.academicInfo.university} onChange={(e) => updateField('academicInfo', { ...form.academicInfo, university: e.target.value })} />
                                        </div>
                                        <div className="form-field">
                                            <label className="field-label">Khoa</label>
                                            <input type="text" className="field-input" placeholder="Khoa Công nghệ phần mềm" />
                                        </div>
                                        <div className="form-field">
                                            <label className="field-label">Ngành học <span className="required-star">*</span></label>
                                            <input type="text" className="field-input" placeholder="Kỹ thuật phần mềm" value={form.academicInfo.major} onChange={(e) => updateField('academicInfo', { ...form.academicInfo, major: e.target.value })} />
                                        </div>
                                        <div className="form-field">
                                            <label className="field-label">Năm tốt nghiệp <span className="required-star">*</span></label>
                                            <input type="number" className="field-input" placeholder="2026" value={form.academicInfo.graduationYear} onChange={(e) => updateField('academicInfo', { ...form.academicInfo, graduationYear: parseInt(e.target.value) || 0 })} />
                                        </div>
                                        <div className="form-field">
                                            <label className="field-label">GPA (Hệ 4)</label>
                                            <input type="number" step="0.1" className="field-input" placeholder="e.g. 3.2" value={form.academicInfo.gpa || ''} onChange={(e) => updateField('academicInfo', { ...form.academicInfo, gpa: parseFloat(e.target.value) || 0 })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Công nghệ sử dụng */}
                                <div className="sub-section">
                                    <h3 className="sub-section-title" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px', marginBottom: '16px' }}>Công nghệ sử dụng</h3>
                                    
                                    {TECH_CATEGORIES.map((cat) => {
                                        const catSkills = form.technicalSkills.filter(s => s.category === cat.key);
                                        return (
                                            <div className="tech-section-card" key={cat.key}>
                                                <label className="field-label" style={{ fontWeight: 600, color: '#101828', marginBottom: '12px', display: 'block' }}>{cat.label}</label>
                                                {catSkills.map((skill, idx) => {
                                                    const globalIdx = form.technicalSkills.indexOf(skill);
                                                    return (
                                                        <div className="tech-input-row" key={idx}>
                                                            <input type="text" className="field-input" placeholder={cat.placeholder} style={{flex: 1, background: '#F3F4F6', border: '1px solid #E5E7EB'}} value={skill.name || ''} onChange={(e) => { const updated = [...form.technicalSkills]; updated[globalIdx] = { ...updated[globalIdx], name: e.target.value }; updateField('technicalSkills', updated); }} />
                                                            <input type="number" className="field-input input-short" placeholder="Năm" style={{background: '#F3F4F6', border: '1px solid #E5E7EB'}} value={skill.yearsOfExperience || ''} onChange={(e) => { const updated = [...form.technicalSkills]; updated[globalIdx] = { ...updated[globalIdx], yearsOfExperience: parseInt(e.target.value) || 0 }; updateField('technicalSkills', updated); }} />
                                                            <select className="field-input" style={{width: '140px', border: '1px solid #E5E7EB', background: '#F3F4F6', color: '#374151'}} value={skill.confidence ? 'true' : 'false'} onChange={(e) => { const updated = [...form.technicalSkills]; updated[globalIdx] = { ...updated[globalIdx], confidence: e.target.value === 'true' }; updateField('technicalSkills', updated); }}>
                                                                <option value="true">Tự tin</option>
                                                                <option value="false">Không tự tin</option>
                                                            </select>
                                                            <button className="btn-icon btn-delete-icon" type="button" onClick={() => { const updated = form.technicalSkills.filter((_, i) => i !== globalIdx); updateField('technicalSkills', updated); }}>
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path></svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                                <button className="btn-add-text" type="button" style={{ color: '#8B4CFF' }} onClick={() => { const newSkill = { category: cat.key, name: '', yearsOfExperience: 0, confidence: true }; updateField('technicalSkills', [...form.technicalSkills, newSkill]); }}>+ {cat.addLabel}</button>
                                            </div>
                                        );
                                    })}
                                </div>
                                    
                                {/* Kỹ năng mềm */}
                                <div className="sub-section" style={{ marginTop: '32px' }}>
                                    <h3 className="sub-section-title" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px', marginBottom: '16px' }}>Kỹ năng mềm</h3>
                                    
                                    <div className="tags-container" style={{ marginTop: '8px' }}>
                                        {form.softSkills.map((skill, idx) => (
                                            <span key={idx} className="tag tag--active">{skill} <span style={{marginLeft: '4px', cursor: 'pointer'}} onClick={() => { const updated = form.softSkills.filter((_, i) => i !== idx); updateField('softSkills', updated); }}>×</span></span>
                                        ))}
                                    </div>

                                    {/* Custom soft skill input */}
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                        <input type="text" className="field-input" placeholder="Nhập kỹ năng mềm..." style={{ flex: 1 }} value={newSoftSkill} onChange={(e) => setNewSoftSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && newSoftSkill.trim()) { if (!form.softSkills.includes(newSoftSkill.trim())) { updateField('softSkills', [...form.softSkills, newSoftSkill.trim()]); } setNewSoftSkill(''); } }} />
                                        <button className="btn-add-solid" type="button" onClick={() => { if (newSoftSkill.trim() && !form.softSkills.includes(newSoftSkill.trim())) { updateField('softSkills', [...form.softSkills, newSoftSkill.trim()]); setNewSoftSkill(''); } }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
                                            Thêm kỹ năng mềm
                                        </button>
                                    </div>

                                    <p className="field-hint" style={{marginTop:'12px', marginBottom: '8px'}}>Kỹ năng gợi ý:</p>
                                    <div className="tags-container">
                                        {['Làm việc nhóm', 'Quản lý thời gian', 'Lãnh đạo', 'Thích ứng', 'Sáng tạo', 'Giao tiếp', 'Tư duy phản biện', 'Giải quyết vấn đề'].filter(s => !form.softSkills.includes(s)).map(s => (
                                            <span key={s} className="tag" onClick={() => updateField('softSkills', [...form.softSkills, s])}>+ {s}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Chứng chỉ ngoại ngữ */}
                                <div className="sub-section certificate-section">
                                    <div className="sub-section-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                        <h3 className="sub-section-title">Chứng chỉ ngoại ngữ</h3>
                                        <button className="btn-add-solid" type="button" onClick={() => { updateField('languages', [...form.languages, { certificateName: '', score: 0, issuedAt: '', expiresAt: '' }]); }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
                                            Thêm chứng chỉ
                                        </button>
                                    </div>

                                    {form.languages.length === 0 && (
                                        <p className="field-hint" style={{ textAlign: 'center', padding: '1.5rem', color: '#9CA3AF' }}>Chưa có chứng chỉ nào. Bấm "Thêm chứng chỉ" để thêm.</p>
                                    )}

                                    {form.languages.map((lang, idx) => (
                                        <div className="certificate-card" key={idx}>
                                            <div className="certificate-card-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                                                <h4 className="certificate-title" style={{margin:0,fontSize:'14px',fontWeight:600}}>Chứng chỉ {idx + 1}</h4>
                                                <button className="btn-icon btn-delete-icon" type="button" onClick={() => { const updated = form.languages.filter((_, i) => i !== idx); updateField('languages', updated); }}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path></svg>
                                                </button>
                                            </div>
                                            <div className="form-grid">
                                                <div className="form-field">
                                                    <label className="field-label">Tên chứng chỉ</label>
                                                    <input type="text" className="field-input" placeholder="IELTS" value={lang.certificateName} onChange={(e) => { const updated = [...form.languages]; updated[idx] = { ...updated[idx], certificateName: e.target.value }; updateField('languages', updated); }} />
                                                </div>
                                                <div className="form-field">
                                                    <label className="field-label">Điểm</label>
                                                    <input type="number" step="0.1" className="field-input" placeholder="7.0" value={lang.score || ''} onChange={(e) => { const updated = [...form.languages]; updated[idx] = { ...updated[idx], score: parseFloat(e.target.value) || 0 }; updateField('languages', updated); }} />
                                                </div>
                                                <div className="form-field">
                                                    <label className="field-label">Ngày cấp</label>
                                                    <input type="date" className="field-input" value={lang.issuedAt} onChange={(e) => { const updated = [...form.languages]; updated[idx] = { ...updated[idx], issuedAt: e.target.value }; updateField('languages', updated); }} />
                                                </div>
                                                <div className="form-field">
                                                    <label className="field-label">Ngày hết hạn</label>
                                                    <input type="date" className="field-input" value={lang.expiresAt} onChange={(e) => { const updated = [...form.languages]; updated[idx] = { ...updated[idx], expiresAt: e.target.value }; updateField('languages', updated); }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="form-actions">
                                    <button className="btn-back" type="button" onClick={() => navigate('/candidate/profile/update')}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Trở lại
                                    </button>
                                    <div className="form-actions-right">
                                        <button className="btn-save" type="button" onClick={saveStep2} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu bản nháp'}</button>
                                        <button className="btn-next" type="button" disabled={saving} onClick={async () => {
                                            const success = await saveStep2();
                                            if (success) navigate('/candidate/profile/update/step3');
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
                        <ProfileSidebar activeStep={1} />
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

                /* Step 2 specific styles */
                .sub-section { margin-top: 2rem; }
                .sub-section:first-child { margin-top: 0; }
                .sub-section-title { font-size: 16px; font-weight: 600; color: #101828; margin-bottom: 1rem; }
                .margin-top-sm { margin-top: 1rem; }
                .input-group { display: flex; gap: 8px; align-items: center; }
                .tech-section-card { background: #FAFAFA; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
                .tech-input-row { background: #FFF; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
                .input-short { width: 100px; flex-shrink: 0; }
                .btn-icon { background: none; border: none; cursor: pointer; color: #6A7282; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; }
                .btn-icon:hover { background: #F3F4F6; }
                .btn-delete-icon { color: #9CA3AF; transition: color 0.2s; }
                .btn-delete-icon:hover { color: #E7000B; background: #FEF2F2; }
                .btn-add-text { background: none; border: none; color: #6D52E5; font-size: 14px; font-weight: 500; cursor: pointer; padding: 0; margin-top: 8px; text-align: left; }
                .btn-add-text:hover { text-decoration: underline; }
                .btn-add-solid { display: flex; align-items: center; gap: 6px; background: #6D52E5; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; }
                .btn-add-solid:hover { background: #5b42cf; }
                .btn-pill { border: none; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; }
                .btn-pill--purple { background: #6D52E5; color: #FFF; }
                .btn-pill--dark { background: #364153; color: #FFF; }
                .tags-container { display: flex; flex-wrap: wrap; gap: 8px; }
                .tag { padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid #E5E7EB; background: #FFF; color: #364153; }
                .tag--active { background: #F5F3FF; border-color: #6D52E5; color: #6D52E5; }
                .certificate-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 1.25rem; margin-top: 1rem; }

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
