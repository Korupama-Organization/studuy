import React from "react";
import type {
  Notification,
  UpcomingInterview,
} from "../../../services/dashboardService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface ActivityPanelProps {
  notifications: Notification[];
  upcomingInterviews: UpcomingInterview[];
  isLoading?: boolean;
  error?: string;
  unreadCount?: number;
  onMarkAllAsRead?: () => void;
  onClose?: () => void;
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({
  notifications,
  upcomingInterviews,
  isLoading = false,
  error = "",
  unreadCount = 0,
  onMarkAllAsRead,
  onClose,
}) => {
  return (
    <aside className="rd-activity">
      <div className="rd-activity-header">
        <span>Hoạt động</span>
        {onClose ? (
          <button
            type="button"
            className="rd-activity-close"
            aria-label="Đóng bảng thông báo"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <p className="rd-empty" style={{ padding: "1rem 1.25rem" }}>
          Đang tải thông báo...
        </p>
      ) : null}

      {error ? (
        <p className="rd-activity-error">
          {error}
        </p>
      ) : null}

      {/* Notifications */}
      <div className="rd-activity-section">
        <div className="rd-activity-section-heading">
          <p className="rd-activity-section-label">Thông báo</p>
          {onMarkAllAsRead ? (
            <button
              type="button"
              className="rd-mark-read-btn"
              disabled={unreadCount === 0 || notifications.length === 0}
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </button>
          ) : null}
        </div>
        {!isLoading && notifications.length === 0 ? (
          <p className="rd-empty" style={{ padding: "0.5rem 0" }}>
            Chưa có thông báo.
          </p>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <div key={n.id} className="rd-notif-item">
              <img
                src={
                  n.candidate.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    n.candidate.fullName
                  )}&background=e0e7ff&color=4f46e5&size=64`
                }
                alt={n.candidate.fullName}
                className="rd-notif-avatar"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(n.candidate.fullName)}&background=e0e7ff&color=4f46e5&size=64`;
                }}
              />
              <div>
                <p className="rd-notif-text">
                  <strong>{n.candidate.fullName}</strong> nộp CV cho{" "}
                  <span className="rd-notif-job">{n.job.title}</span>
                </p>
                <p className="rd-notif-time">
                  {n.createdAt
                    ? dayjs(n.createdAt).fromNow()
                    : ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upcoming Interviews */}
      <div className="rd-activity-section" style={{ marginTop: "1.25rem" }}>
        <p className="rd-activity-section-label">Phỏng vấn sắp tới</p>
        {!isLoading && upcomingInterviews.length === 0 ? (
          <p className="rd-empty" style={{ padding: "0.5rem 0" }}>
            Không có lịch phỏng vấn sắp tới.
          </p>
        ) : (
          upcomingInterviews.slice(0, 3).map((iv) => (
            <div key={iv.id} className="rd-interview-card">
              <div className="rd-interview-time-row">
                <span className="rd-interview-today">Hôm nay</span>
                {iv.time && <span className="rd-interview-hour">{iv.time}</span>}
              </div>
              <p className="rd-interview-title">
                {iv.tag} · {iv.candidateName}
              </p>
              {iv.interviewer && (
                <div className="rd-interview-people">
                  <img
                    src={
                      iv.interviewerAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        iv.interviewer
                      )}&background=e0e7ff&color=4f46e5&size=64`
                    }
                    alt={iv.interviewer}
                    className="rd-interviewer-avatar"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(iv.interviewer)}&background=e0e7ff&color=4f46e5&size=64`;
                    }}
                  />
                  <span className="rd-interviewer-name">{iv.interviewer}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default ActivityPanel;
