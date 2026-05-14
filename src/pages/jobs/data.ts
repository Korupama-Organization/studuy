export const jobRows = Array.from({ length: 6 }).map((_, index) => ({
  id: `JOB-00${index + 1}`,
  title: "Middle Back End Developer (Java)",
  salary: "1000-2000 USD",
  createdAt: "22/10/2025",
  createdBy: "Adam",
  status: "Opening",
}));

export const navItems = [
  { label: "Dashboard", icon: "grid_view", path: "/dashboard" },
  { label: "Nhân viên", icon: "badge", path: "/recruiters" },
  { label: "Thông tin công ty", icon: "business", path: "/company" },
  { label: "Bài tuyển dụng", icon: "work", path: "/jobs" },
  { label: "Phỏng vấn", icon: "forum", path: "/interview" },
];

export const columns = [
  { key: "id", label: "Job ID", width: "100px" },
  { key: "title", label: "Job title", width: "1.7fr" },
  { key: "salary", label: "Salary", width: "1fr" },
  { key: "createdAt", label: "Created At", width: "1fr" },
  { key: "createdBy", label: "Created By", width: "1fr" },
  { key: "status", label: "Status", width: "120px" },
];
