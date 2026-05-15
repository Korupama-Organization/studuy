import React from "react";
import type { StatusOverview } from "../../../services/dashboardService";

interface StatusDonutChartProps {
  statusOverview: StatusOverview;
}

const SEGMENT_COLORS = [
  "#6366f1",
  "#a5b4fc",
  "#34d399",
  "#fbbf24",
  "#f87171",
];

const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ statusOverview }) => {
  const { total, items } = statusOverview;

  if (!items || items.length === 0 || total === 0) {
    return (
      <div className="rd-chart-card">
        <div className="rd-chart-header">
          <h3 className="rd-chart-title">Trạng thái hồ sơ</h3>
        </div>
        <div className="rd-empty">Chưa có dữ liệu</div>
      </div>
    );
  }

  // SVG donut parameters
  const size = 150;
  const cx = size / 2;
  const cy = size / 2;
  const R = 56;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * R;

  // Build segments
  let cumulativeAngle = -Math.PI / 2; // start from top
  const segments = items.slice(0, 5).map((item, i) => {
    const fraction = total > 0 ? item.count / total : 0;
    const arcLength = fraction * circumference;
    const startAngle = cumulativeAngle;
    cumulativeAngle += fraction * 2 * Math.PI;

    // Convert to stroke-dasharray approach
    const dashOffset = -((startAngle + Math.PI / 2) / (2 * Math.PI)) * circumference;

    return {
      ...item,
      color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
      arcLength,
      dashOffset,
      fraction,
    };
  });

  return (
    <div className="rd-chart-card">
      <div className="rd-chart-header">
        <h3 className="rd-chart-title">Trạng thái hồ sơ</h3>
      </div>

      <div className="rd-donut-wrap">
        {/* SVG Donut */}
        <div className="rd-donut-svg-wrap" style={{ width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circle */}
            <circle
              cx={cx} cy={cy} r={R}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={cx} cy={cy} r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.arcLength} ${circumference - seg.arcLength}`}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="butt"
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="rd-donut-center">
            <span className="rd-donut-total">
              {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
            </span>
            <span className="rd-donut-label">Tổng</span>
          </div>
        </div>

        {/* Legend */}
        <div className="rd-donut-legend">
          {segments.map((seg, i) => (
            <div key={i} className="rd-legend-item">
              <div className="rd-legend-dot" style={{ background: seg.color }} />
              <div className="rd-legend-text">
                <span className="rd-legend-val">
                  {seg.count >= 1000
                    ? `${(seg.count / 1000).toFixed(1)}k`
                    : seg.count}
                </span>
                {" "}
                <span style={{ color: "#94a3b8" }}>
                  ({Math.round(seg.fraction * 100)}%)
                </span>
                <br />
                <span style={{ fontSize: "0.72rem" }}>{seg.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusDonutChart;
