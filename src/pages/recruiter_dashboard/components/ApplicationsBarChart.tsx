import React, { useState } from "react";
import type { ApplicationStat } from "../../../services/dashboardService";

interface ApplicationsBarChartProps {
  data: ApplicationStat[];
}

const ApplicationsBarChart: React.FC<ApplicationsBarChartProps> = ({ data }) => {
  const [activePeriod, setActivePeriod] = useState<"week" | "month">("week");

  if (!data || data.length === 0) {
    return (
      <div className="rd-chart-card">
        <div className="rd-chart-header">
          <h3 className="rd-chart-title">Thống kê hồ sơ</h3>
        </div>
        <div className="rd-empty">Chưa có dữ liệu</div>
      </div>
    );
  }

  const chartWidth = 460;
  const chartHeight = 180;
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingBottom = 30;
  const paddingTop = 10;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const groupWidth = innerWidth / data.length;
  const barWidth = Math.min(groupWidth * 0.28, 18);
  const gap = barWidth * 0.6;

  return (
    <div className="rd-chart-card">
      <div className="rd-chart-header">
        <h3 className="rd-chart-title">Thống kê hồ sơ</h3>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button
            className={`rd-period-btn ${activePeriod === "week" ? "active" : ""}`}
            onClick={() => setActivePeriod("week")}
          >
            Tuần
          </button>
          <button
            className={`rd-period-btn ${activePeriod === "month" ? "active" : ""}`}
            onClick={() => setActivePeriod("month")}
          >
            Tháng
          </button>
        </div>
      </div>

      <div className="rd-bar-chart-wrap">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="rd-bar-chart"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="barGradPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>
            <linearGradient id="barGradSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7d2fe" />
              <stop offset="100%" stopColor="#e0e7ff" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((level) => (
            <line
              key={level}
              x1={paddingLeft}
              y1={paddingTop + innerHeight * (1 - level)}
              x2={chartWidth - paddingRight}
              y2={paddingTop + innerHeight * (1 - level)}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const groupX = paddingLeft + i * groupWidth + groupWidth / 2;
            const barAX = groupX - gap / 2 - barWidth;
            const barBX = groupX + gap / 2;

            const hA = Math.max(4, (d.count / 100) * innerHeight);
            const hB = Math.max(4, (d.secondaryCount / 100) * innerHeight);
            const yA = paddingTop + innerHeight - hA;
            const yB = paddingTop + innerHeight - hB;

            const isActive = d.day === "Wed" || i === Math.floor(data.length / 2);

            return (
              <g key={i}>
                {/* Primary bar */}
                <rect
                  x={barAX}
                  y={yA}
                  width={barWidth}
                  height={hA}
                  rx="4"
                  fill={isActive ? "url(#barGradPrimary)" : "#6366f1"}
                  opacity={isActive ? 1 : 0.55}
                />
                {/* Secondary bar */}
                <rect
                  x={barBX}
                  y={yB}
                  width={barWidth}
                  height={hB}
                  rx="4"
                  fill="url(#barGradSecondary)"
                />
                {/* X-axis label */}
                <text
                  x={groupX}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isActive ? "#6366f1" : "#94a3b8"}
                  fontWeight={isActive ? "700" : "400"}
                  fontFamily="Inter, sans-serif"
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ApplicationsBarChart;
