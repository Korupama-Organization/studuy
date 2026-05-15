export const jobRows = Array.from({ length: 6 }).map((_, index) => ({
  id: `JOB-00${index + 1}`,
  title: "Lập trình viên Backend trung cấp (Java)",
  salary: "1000-2000 USD",
  createdAt: "22/10/2025",
  createdBy: "Adam",
  status: "Đang tuyển",
}));

export const navItems = [
  { label: "Bảng điều khiển", icon: "grid_view", path: "/recruiter/dashboard" },
  { label: "Nhân viên", icon: "badge", path: "/recruiter/management" },
  { label: "Thông tin công ty", icon: "business", path: "/company" },
  { label: "Việc làm", icon: "work", path: "/recruiter/jobs" },
  { label: "Ứng viên", icon: "group", path: "#" },
];

export const columns = [
  { key: "id", label: "Mã việc làm", width: "100px" },
  { key: "title", label: "Tên việc làm", width: "1.7fr" },
  { key: "salary", label: "Mức lương", width: "1fr" },
  { key: "createdAt", label: "Ngày tạo", width: "1fr" },
  { key: "createdBy", label: "Người tạo", width: "1fr" },
  { key: "status", label: "Trạng thái", width: "120px" },
];
