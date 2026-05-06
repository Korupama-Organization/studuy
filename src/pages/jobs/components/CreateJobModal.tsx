import { useState } from "react";
import SuccessDialog from "./SuccessDialog";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateJobModal({
  isOpen,
  onClose,
}: CreateJobModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    shortDescription: "",
    location: "",
    requiredEducation: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Job created:", formData);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setFormData({
      jobTitle: "",
      jobDescription: "",
      shortDescription: "",
      location: "",
      requiredEducation: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">Create Job</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition">
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <p className="text-sm text-slate-500">
              Aliquam nostrum excepteur et voluptate est consectetur lorem, in a
              cuss aspersies et cum dignissimos colegues voluptate expetis.
              Maxime tempore scena U - Possant autem pundem placstat
            </p>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="Frontend Developer"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Job description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="Chúng tôi đang tìm kiếm một Frontend Developer năng động và sáng tạo để đề giúp tập ơi ngạ esca chứng tôi. Ban sẽ chịu trách nhiệm phát triển giao diện web hiện đại, tối ưu hóa trải nghiệm người dùng và phối hợp cùng backend để xây dựng các tính năng đầu tiên. Yêu cầu kinh nghiệm với React, Redux, HTML, CSS, JavaScript và các framework ứng dụng có khác React ngôn từ. Hãy gửi hồ sơ của bạn nếu bạn tự tin có thể chạy tất cả câu tôi với những sài phần web xuất sắc!"
                rows={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Phát triển giao diện web hiện đại, tối ưu hóa trải nghiệm người dùng với backend để xây dựng sản phẩm công nghệ hàng đầu."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
                  required
                />
                <button
                  type="button"
                  className="absolute bottom-2.5 right-2.5 flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition">
                  <span className="material-symbols-outlined text-[16px]">
                    auto_awesome
                  </span>
                  AI Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="TP.HCM"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Required Education
              </label>
              <textarea
                name="requiredEducation"
                value={formData.requiredEducation}
                onChange={handleInputChange}
                placeholder="• Sinh viên năm cuối hoặc đã tốt nghiệp ngành CNTT / Kỹ thuật phần mềm
• GPA >= 2.8
• Tiếng Anh dạo tiểu kỳ luật kỹ thuật"
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#5B5BF6] focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-[#5B5BF6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(91,91,246,0.3)] transition hover:bg-[#4A4AE6]">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessDialog isOpen={showSuccess} onClose={handleCloseSuccess} />
    </>
  );
}
