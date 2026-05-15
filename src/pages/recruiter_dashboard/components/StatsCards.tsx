import React from "react";
import type { DashboardStats } from "../../../services/dashboardService";

interface StatsCardsProps {
  stats: DashboardStats;
}

const CARD_CONFIG = [
  {
    key: "candidates" as const,
    label: "Ứng viên tiềm năng",
    iconClass: "indigo",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "positions" as const,
    label: "Vị trí",
    iconClass: "violet",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    key: "cvsReceived" as const,
    label: "CV đã nhận",
    iconClass: "pink",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    key: "hired" as const,
    label: "Đã tuyển",
    iconClass: "green",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

const formatValue = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
};

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const values = {
    candidates: stats.candidates.value,
    positions: stats.positions.value,
    cvsReceived: stats.cvsReceived.value,
    hired: stats.hired.value,
  };

  const trends = {
    candidates: stats.candidates.trend,
  };

  return (
    <div className="rd-stats-row">
      {CARD_CONFIG.map(({ key, label, iconClass, icon }) => {
        const trend = trends[key as keyof typeof trends];
        const isUp = trend ? !trend.startsWith("-") : null;

        return (
          <div key={key} className="rd-stat-card">
            <div className="rd-stat-header">
              <div className={`rd-stat-icon ${iconClass}`}>{icon}</div>
              {trend && (
                <span className={`rd-stat-trend ${isUp ? "up" : "down"}`}>
                  {trend}
                </span>
              )}
            </div>
            <p className="rd-stat-label">{label}</p>
            <p className="rd-stat-value">{formatValue(values[key])}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
