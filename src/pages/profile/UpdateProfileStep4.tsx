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

export default function UpdateProfileStep4() {
    const activeStep = 3;
    const navigate = useNavigate();
    const { form, updateField, completion, completionLoading, saveStep4, saveAllSteps, saving, saveError, saveSuccess } = useProfileForm();
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (saveSuccess) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccess]);

    const progress = completion?.completionPercentage ?? 0;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="profile-page">
            {/* Success Toast */}
            {showToast && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 9999,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span style={{ fontWeight: 500 }}>{saveSuccess || 'Hồ sơ đã được nộp thành công!'}</span>
                </div>
            )}
            <GlobalHeader userName={form.fullName || undefined} />

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
                                    <span>Bước 4 trên 4</span>
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

                            {/* Mục tiêu nghề nghiệp và Điểm mạnh Section */}
                            <div className="form-section-card" style={{ padding: '2rem' }}>
                                <div className="form-section-header" style={{ marginBottom: '2rem' }}>
                                    <h2 className="form-section-title">Mục tiêu nghề nghiệp và Điểm mạnh</h2>
                                    <p className="form-section-desc">Cho chúng tôi biết về nguyện vọng và điều gì khiến bạn nổi bật</p>
                                </div>

                                <div className="sub-section">
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#101828', marginBottom: '1rem' }}>Nguyện vọng nghề nghiệp</h3>
                                    <div className="form-grid" style={{ gap: '1.25rem' }}>
                                        <div className="form-field form-field--full">
                                            <label className="field-label">Vị trí mong muốn <span className="required-star">*</span></label>
                                            <select 
                                                className="field-input" 
                                                value={form.introductionQuestions.preferredRoles[0]?.preferredRole || ''} 
                                                onChange={(e) => updateField('introductionQuestions', { ...form.introductionQuestions, preferredRoles: [{ preferredRole: e.target.value }] })}
                                            >
                                                <option value="" disabled>Chọn vị trí mong muốn</option>
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                                <option value="Fullstack">Fullstack</option>
                                                <option value="Mobile">Mobile</option>
                                                <option value="DevOps">DevOps</option>
                                                <option value="QA">QA</option>
                                                <option value="Khác">Khác</option>
                                            </select>
                                            <p className="field-hint">Điều này giúp chúng tôi đề xuất các cơ hội phù hợp</p>
                                        </div>
                                        <div className="form-field form-field--full">
                                            <label className="field-label">Tại sao bạn quan tâm đến vị trí này? <span className="required-star">*</span></label>
                                            <textarea className="field-input" style={{ height: '100px', paddingTop: '12px', resize: 'vertical' }} placeholder="Chia sẻ động lực, đam mê và điều gì thu hút bạn đến vị trí này..." value={form.introductionQuestions.whyTheseRoles} onChange={(e) => updateField('introductionQuestions', { ...form.introductionQuestions, whyTheseRoles: e.target.value })}></textarea>
                                            <p className="field-hint">Hãy cụ thể nhất có thể về mục tiêu của bạn (tối thiểu 50 ký tự)</p>
                                        </div>
                                        <div className="form-field form-field--full">
                                            <label className="field-label">Mục tiêu nghề nghiệp <span className="required-star">*</span></label>
                                            <textarea className="field-input" style={{ height: '100px', paddingTop: '12px', resize: 'vertical' }} placeholder="Bạn thấy mình ở đâu trong 3-5 năm tới? Nguyện vọng nghề nghiệp của bạn là gì?" value={form.introductionQuestions.futureGoals} onChange={(e) => updateField('introductionQuestions', { ...form.introductionQuestions, futureGoals: e.target.value })}></textarea>
                                            <p className="field-hint">Bao gồm tầm nhìn dài hạn và các cột mốc bạn muốn đạt được</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="sub-section" style={{ marginTop: '2.5rem' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#101828', marginBottom: '1rem' }}>Điểm mạnh của bạn</h3>
                                    <div className="form-grid" style={{ gap: '1.25rem' }}>
                                        <div className="form-field form-field--full">
                                            <label className="field-label">Tóm tắt điểm mạnh <span className="required-star">*</span></label>
                                            <textarea className="field-input" style={{ height: '100px', paddingTop: '12px', resize: 'vertical' }} placeholder="Những điểm mạnh chính của bạn là gì? Điều gì khiến bạn nổi bật với tư cách ứng viên? Bao gồm cả kỹ năng chuyên môn..." value={form.advantagePoint} onChange={(e) => updateField('advantagePoint', e.target.value)}></textarea>
                                            <p className="field-hint">Ví dụ: Kỹ năng giải quyết vấn đề, tinh thần làm việc nhóm, chú ý đến chi tiết, học hỏi nhanh</p>
                                        </div>
                                        <div className="form-field form-field--full">
                                            <label className="field-label">Công nghệ mà bạn đam mê và yêu thích là gì? Tại sao? <span className="required-star">*</span></label>
                                            <textarea className="field-input" style={{ height: '100px', paddingTop: '12px', resize: 'vertical' }} placeholder="Chia sẻ về công nghệ, ngôn ngữ lập trình, framework hoặc lĩnh vực công nghệ mà bạn đam mê. Giải thích tại sao..." value={form.introductionQuestions.favoriteTechnology} onChange={(e) => updateField('introductionQuestions', { ...form.introductionQuestions, favoriteTechnology: e.target.value })}></textarea>
                                            <p className="field-hint">Ví dụ: React, AI, Machine Learning, UI/UX, hoặc những lĩnh vực bạn muốn đi sâu vào.</p>
                                        </div>
                                    </div>

                                    {/* Mẹo card */}
                                    <div style={{ marginTop: '1.5rem', background: '#F5F3FF', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ flexShrink: 0, width: '40px', height: '40px', background: '#E0D4FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '20px' }}>💡</span>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#4D55CC', margin: '0 0 8px 0' }}>Mẹo viết điểm mạnh</h4>
                                            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13px', color: '#4A5565', lineHeight: '1.6' }}>
                                                <li>Hãy cụ thể và cung cấp ví dụ nếu có thể</li>
                                                <li>Tập trung vào kỹ năng liên quan đến vị trí mong muốn</li>
                                                <li>Bao gồm cả chuyên môn kỹ thuật và kỹ năng mềm</li>
                                                <li>Đề cập đến thành tích thể hiện điểm mạnh của bạn</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="sub-section" style={{ marginTop: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#101828', margin: 0 }}>Thành tích nổi bật</h3>
                                            <p className="field-hint" style={{ marginTop: '4px' }}>Giải thưởng, học bổng, cuộc thi hoặc chứng nhận chuyên môn đáng chú ý.</p>
                                        </div>
                                        <button className="btn-add-solid" type="button" onClick={() => updateField('achievements', [...form.achievements, { title: '', achievedAt: '' }])}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
                                            Thêm thành tích
                                        </button>
                                    </div>

                                    {form.achievements.length === 0 && (
                                        <p className="field-hint" style={{ textAlign: 'center', padding: '1.5rem', color: '#9CA3AF', border: '1px dashed #E5E7EB', borderRadius: '12px' }}>
                                            Chưa có thành tích nào. Bạn có thể bỏ qua hoặc thêm thành tích để hồ sơ nổi bật hơn.
                                        </p>
                                    )}

                                    {form.achievements.map((achievement, idx) => (
                                        <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#101828', margin: 0 }}>Thành tích {idx + 1}</h4>
                                                <button className="btn-icon btn-delete-icon" type="button" onClick={() => updateField('achievements', form.achievements.filter((_, i) => i !== idx))}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path></svg>
                                                </button>
                                            </div>
                                            <div className="form-grid" style={{ gap: '1rem' }}>
                                                <div className="form-field">
                                                    <label className="field-label">Tên thành tích</label>
                                                    <input type="text" className="field-input" placeholder="VD: Giải nhất Hackathon, học bổng..." value={achievement.title} onChange={(e) => { const updated = [...form.achievements]; updated[idx] = { ...updated[idx], title: e.target.value }; updateField('achievements', updated); }} />
                                                </div>
                                                <div className="form-field">
                                                    <label className="field-label">Ngày đạt được</label>
                                                    <input type="date" className="field-input" value={achievement.achievedAt} onChange={(e) => { const updated = [...form.achievements]; updated[idx] = { ...updated[idx], achievedAt: e.target.value }; updateField('achievements', updated); }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="sub-section" style={{ marginTop: '2.5rem' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#101828', marginBottom: '1rem' }}>Cài đặt hồ sơ</h3>
                                    
                                    <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', flexShrink: 0 }}>
                                                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                                                <span className="slider round" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#8B4CFF', borderRadius: '24px', transition: '.4s' }}>
                                                    <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: '22px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s' }}></span>
                                                </span>
                                            </label>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#101828' }}>Hồ sơ hiển thị với nhà tuyển dụng</h4>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#6A7282' }}>Hồ sơ của bạn hiển thị với nhà tuyển dụng và họ có thể liên hệ với bạn về các cơ hội việc làm.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem', fontSize: '14px', color: '#1e40af' }}>
                                        <strong>Lưu ý:</strong> Bạn có thể thay đổi cài đặt này bất cứ lúc nào trong tài khoản của bạn. Công khai hồ sơ sẽ tăng cơ hội nhận được lời mời làm việc.
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem', background: '#FFF5F5', borderRadius: '12px', padding: '1.5rem', border: '1px solid #FECACA' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#991B1B', margin: '0 0 1rem 0' }}>Sẵn sàng nộp hồ sơ?</h3>
                                    <p style={{ fontSize: '14px', color: '#7F1D1D', marginBottom: '1rem' }}>Sau khi nộp hồ sơ, hồ sơ sẽ được xem xét và bạn sẽ có thể:</p>
                                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', fontSize: '14px', color: '#7F1D1D', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#8B4CFF' }}><path d="M20 6L9 17l-5-5"></path></svg>
                                            Truy cập các buổi phỏng vấn thử được thiết kế phù hợp với hồ sơ của bạn
                                        </li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#8B4CFF' }}><path d="M20 6L9 17l-5-5"></path></svg>
                                            Được kết nối với các cơ hội việc làm phù hợp
                                        </li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#8B4CFF' }}><path d="M20 6L9 17l-5-5"></path></svg>
                                            Nhận tài liệu chuẩn bị phỏng vấn được cá nhân hóa
                                        </li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#8B4CFF' }}><path d="M20 6L9 17l-5-5"></path></svg>
                                            Kết nối với nhà tuyển dụng đang tìm kiếm ứng viên như bạn
                                        </li>
                                    </ul>
                                </div>
                                
                                {saveError && (
                                    <div style={{ 
                                        marginTop: '1.5rem', 
                                        padding: '1rem', 
                                        background: '#FEF2F2', 
                                        border: '1px solid #FCA5A5', 
                                        borderRadius: '8px', 
                                        color: '#B91C1C',
                                        fontSize: '14px'
                                    }}>
                                        <strong>Lỗi:</strong> {saveError}
                                    </div>
                                )}

                                <div className="form-actions" style={{ paddingTop: '1.5rem', marginTop: '2rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button className="btn-back" type="button" onClick={() => navigate('/candidate/profile/update/step3')}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Quay lại
                                    </button>
                                    <div className="form-actions-right">
                                        <button className="btn-save" type="button" onClick={saveStep4} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu nháp'}</button>
                                        <button className="btn-next btn-submit" type="button" style={{ background: '#d946ef' }} disabled={saving} onClick={async () => {
                                            const success = await saveAllSteps();
                                            if (success) {
                                                // Wait 2 seconds for user to see the success toast before redirecting
                                                setTimeout(() => {
                                                    navigate('/candidate/dashboard'); 
                                                }, 2000);
                                            }
                                        }}>
                                            Nộp hồ sơ
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Sidebar */}
                        <ProfileSidebar activeStep={3} />
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

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
