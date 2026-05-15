import React, { useState } from "react";
import type { RecentApplication } from "../../../services/dashboardService";

interface RecentApplicationsTableProps {
  applications: RecentApplication[];
}

const STATUS_CLASS: Record<string, string> = {
  Review: "review",
  Interview: "interview",
  Offered: "offered",
  Hired: "hired",
  Pending: "pending",
};

const STATUS_LABEL: Record<string, string> = {
  Review: "Xem xét",
  Interview: "Phỏng vấn",
  Offered: "Đề xuất",
  Hired: "Đã tuyển",
  Pending: "Chờ xử lý",
};

const RecentApplicationsTable: React.FC<RecentApplicationsTableProps> = ({ applications }) => {
  const [search, setSearch] = useState("");

  const filtered = applications.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rd-table-card">
      <div className="rd-table-header">
        <h3 className="rd-table-title">Ứng tuyển gần đây</h3>
        <div className="rd-table-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rd-empty">
          {search ? "Không tìm thấy kết quả." : "Chưa có ứng tuyển gần đây."}
        </div>
      ) : (
        <table className="rd-table">
          <thead>
            <tr>
              <th>Ứng viên</th>
              <th>Vị trí</th>
              <th>Ngày ứng tuyển</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id}>
                <td>
                  <div className="rd-candidate-cell">
                    <img
                      src={
                        app.recruiterAvatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=e0e7ff&color=4f46e5&size=64`
                      }
                      alt={app.name}
                      className="rd-candidate-avatar"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=e0e7ff&color=4f46e5&size=64`;
                      }}
                    />
                    <span className="rd-candidate-name">{app.name}</span>
                  </div>
                </td>
                <td>{app.position}</td>
                <td>{app.date}</td>
                <td>
                  <span className={`rd-status-pill ${STATUS_CLASS[app.status] ?? "pending"}`}>
                    {STATUS_LABEL[app.status] ?? app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentApplicationsTable;
