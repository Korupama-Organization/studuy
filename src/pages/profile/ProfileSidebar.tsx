import { useProfileForm } from './ProfileFormContext';

const CIRCUMFERENCE = 2 * Math.PI * 56;

const FIELD_LABELS: Record<string, string> = {
    'basicInfo.fullName': 'Họ và tên',
    'basicInfo.studentId': 'Mã số sinh viên',
    'basicInfo.email': 'Email',
    'basicInfo.phone': 'Số điện thoại',
    'basicInfo.birthDate': 'Ngày sinh',
    'basicInfo.gender': 'Giới tính',
    'academicInfo.university': 'Trường đại học',
    'academicInfo.major': 'Chuyên ngành',
    'academicInfo.graduationYear': 'Năm tốt nghiệp',
    'introductionQuestions.preferredRoles': 'Vị trí mong muốn',
    'introductionQuestions.whyTheseRoles': 'Lý do chọn vị trí',
    'introductionQuestions.futureGoals': 'Mục tiêu nghề nghiệp',
    'introductionQuestions.favoriteTechnology': 'Công nghệ yêu thích',
    'advantagePoint': 'Điểm mạnh nổi bật',
    'technicalSkills': 'Kỹ năng chuyên môn',
    'softSkills': 'Kỹ năng mềm',
    'projects': 'Dự án',
    'languages': 'Chứng chỉ ngoại ngữ',
    'achievements': 'Thành tích',
};

const TIPS_BY_STEP: Record<number, string[]> = {
    0: [
        'Hãy điền đầy đủ thông tin cá nhân để nhà tuyển dụng dễ liên hệ.',
        'Thêm link GitHub, LinkedIn giúp hồ sơ chuyên nghiệp hơn.',
        'Email nên là email bạn thường xuyên kiểm tra.',
        'Nhớ lưu bản nháp khi bạn cập nhật bất kỳ điều gì vào hồ sơ nhé!',
    ],
    1: [
        'Liệt kê tất cả công nghệ bạn đã sử dụng trong học tập và dự án.',
        'Thêm chứng chỉ ngoại ngữ (IELTS, TOEIC) sẽ tăng sức hấp dẫn.',
        'Đánh giá trung thực mức độ tự tin để tránh mismatch khi phỏng vấn.',
        'Kỹ năng mềm cũng rất quan trọng, đừng bỏ qua phần này!',
    ],
    2: [
        'Mô tả chi tiết vai trò và đóng góp của bạn trong mỗi dự án.',
        'Đính kèm link repository để nhà tuyển dụng xem code của bạn.',
        'Kinh nghiệm thực tập cũng rất có giá trị, hãy thêm vào.',
        'Nhớ lưu bản nháp khi bạn cập nhật bất kỳ điều gì vào hồ sơ nhé!',
    ],
    3: [
        'Hãy cụ thể về mục tiêu nghề nghiệp 3-5 năm tới.',
        'Chia sẻ đam mê công nghệ giúp nhà tuyển dụng hiểu bạn hơn.',
        'Tóm tắt điểm mạnh nên kết hợp kỹ năng kỹ thuật và kỹ năng mềm.',
        'Nhớ kiểm tra lại toàn bộ hồ sơ trước khi nộp!',
    ],
};

interface ProfileSidebarProps {
    activeStep: number;
}

export default function ProfileSidebar({ activeStep }: ProfileSidebarProps) {
    const { completion, completionLoading, saving, saveError, saveSuccess, clearMessages } = useProfileForm();

    const progress = completion?.completionPercentage ?? 0;
    const missingFields = completion?.missingFields ?? [];
    const status = completion?.status ?? 'empty';
    const tips = TIPS_BY_STEP[activeStep] ?? TIPS_BY_STEP[0];

    const strokeDasharray = `${(progress / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;

    const progressMessage =
        status === 'complete'
            ? 'Tuyệt vời! Hồ sơ của bạn đã hoàn thiện! 🎉'
            : status === 'almost_complete'
                ? 'Gần hoàn thiện rồi, cố gắng thêm chút nữa nhé!'
                : status === 'empty'
                    ? 'Bạn chưa bắt đầu điền hồ sơ. Hãy bắt đầu nào!'
                    : 'Hồ sơ của bạn chưa hoàn thiện lắm, hãy cố gắng nhé!';

    return (
        <aside className="profile-sidebar">
            {/* Status Messages */}
            {(saveError || saveSuccess) && (
                <div
                    className={`save-message ${saveError ? 'save-message--error' : 'save-message--success'}`}
                    onClick={clearMessages}
                    style={{ cursor: 'pointer' }}
                >
                    <span>{saveError || saveSuccess}</span>
                    <span style={{ marginLeft: '8px', fontSize: '12px' }}>✕</span>
                </div>
            )}

            {/* Saving indicator */}
            {saving && (
                <div className="save-message save-message--saving">
                    <div className="save-spinner" />
                    <span>Đang lưu...</span>
                </div>
            )}

            {/* Progress Card */}
            <div className="progress-card">
                <h3 className="progress-card-title">Tiến độ hoàn thành hồ sơ</h3>

                <div className="progress-circle-wrapper">
                    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" />
                        <circle
                            cx="64" cy="64" r="56"
                            stroke="url(#progress-gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            style={{ transition: 'stroke-dasharray 0.6s ease' }}
                        />
                        <defs>
                            <linearGradient id="progress-gradient" x1="8" y1="120" x2="120" y2="8" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4D55CC" />
                                <stop offset="1" stopColor="#8B4CFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="progress-percentage">
                        {completionLoading ? '...' : `${progress}%`}
                    </span>
                </div>

                <p className="progress-message">{progressMessage}</p>

                {missingFields.length > 0 && (
                    <div className="missing-info-section">
                        <p className="missing-info-title">Thiếu thông tin về:</p>
                        <div className="missing-info-list">
                            {missingFields.map((field, idx) => (
                                <div key={idx} className="missing-info-item">
                                    <span className="missing-info-icon">⚠️</span>
                                    <span className="missing-info-text">
                                        {FIELD_LABELS[field] || field}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Tips Card */}
            <div className="tips-card">
                <div className="tips-header">
                    <div className="tips-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9.99427 18.3228C14.594 18.3228 18.3228 14.594 18.3228 9.99427C18.3228 5.39457 14.594 1.66577 9.99427 1.66577C5.39457 1.66577 1.66577 5.39457 1.66577 9.99427C1.66577 14.594 5.39457 18.3228 9.99427 18.3228Z" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.99414 13.3255V9.99414" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.99414 6.66284H10.0025" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3 className="tips-title">Mẹo nhỏ</h3>
                </div>
                <ul className="tips-list">
                    {tips.map((tip, idx) => (
                        <li key={idx} className="tips-item">
                            <span className="tips-bullet">•</span>
                            <span className="tips-text">{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <style>{`
                .save-message {
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    animation: slideDown 0.3s ease;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .save-message--error {
                    background: #FEF2F2;
                    border: 1px solid #FECACA;
                    color: #991B1B;
                }
                .save-message--success {
                    background: #F0FDF4;
                    border: 1px solid #BBF7D0;
                    color: #166534;
                }
                .save-message--saving {
                    background: #F5F3FF;
                    border: 1px solid #E0D4FF;
                    color: #4D55CC;
                    gap: 8px;
                }
                .save-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #E0D4FF;
                    border-top-color: #4D55CC;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </aside>
    );
}
