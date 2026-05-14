export const jobRows = Array.from({ length: 6 }).map((_, index) => ({
  id: `JOB-00${index + 1}`,
  title: "Middle Back End Developer (Java)",
  salary: "1000-2000 USD",
  createdAt: "22/10/2025",
  createdBy: "Adam",
  status: "Opening",
}));

export const navItems = [
  { label: "Bảng điều khiển", icon: "grid_view", path: "/recruiter/dashboard" },
  { label: "Nhân viên", icon: "badge", path: "/recruiter/management" },
  { label: "Thông tin công ty", icon: "business", path: "/company" },
  { label: "Việc làm", icon: "work", path: "/recruiter/jobs" },
  { label: "Ứng viên", icon: "group", path: "#" },
];

export const columns = [
  { key: "id", label: "Job ID", width: "100px" },
  { key: "title", label: "Job title", width: "1.7fr" },
  { key: "salary", label: "Salary", width: "1fr" },
  { key: "createdAt", label: "Created At", width: "1fr" },
  { key: "createdBy", label: "Created By", width: "1fr" },
  { key: "status", label: "Status", width: "120px" },
];
