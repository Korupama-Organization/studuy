import React, { useState } from "react";
import type { ApplicationStat } from "../../../services/dashboardService";

type ChartPeriod = "week" | "month";

interface ApplicationsBarChartProps {
  data: ApplicationStat[];
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
}

const valueFormatter = new Intl.NumberFormat("vi-VN");

const ApplicationsBarChart: React.FC<ApplicationsBarChartProps> = ({
  data,
  period,
  onPeriodChange,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const renderPeriodControls = () => (
    <div className="rd-period-controls" aria-label="Chọn khoảng thời gian">
      <button
        type="button"
        className={`rd-period-btn ${period === "week" ? "active" : ""}`}
        onClick={() => onPeriodChange("week")}
      >
        Tuần
      </button>
      <button
        type="button"
        className={`rd-period-btn ${period === "month" ? "active" : ""}`}
        onClick={() => onPeriodChange("month")}
      >
        Tháng
      </button>
    </div>
  );

  if (!data || data.length === 0) {
    return (
      <div className="rd-chart-card">
        <div className="rd-chart-header">
          <h3 className="rd-chart-title">Thống kê hồ sơ</h3>
          {renderPeriodControls()}
        </div>
        <div className="rd-empty">Chưa có dữ liệu</div>
      </div>
    );
  }

  const chartWidth = 520;
  const chartHeight = 220;
  const paddingLeft = 42;
  const paddingRight = 16;
  const paddingBottom = 40;
  const paddingTop = 14;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const groupWidth = innerWidth / data.length;
  const barWidth = Math.max(4, Math.min(groupWidth * 0.28, 18));
  const gap = barWidth * 0.6;
  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.count, item.secondaryCount])
  );
  const activeIndex = hoveredIndex ?? Math.max(0, data.length - 1);
  const activePoint = data[activeIndex];
  const activeGroupX = paddingLeft + activeIndex * groupWidth + groupWidth / 2;
  const tooltipLeft = Math.min(
    86,
    Math.max(14, (activeGroupX / chartWidth) * 100)
  );
  const labelStep = data.length > 14 ? Math.ceil(data.length / 10) : 1;
  const axisLevels = [1, 0.75, 0.5, 0.25, 0];
  const getBarHeight = (value: number) => {
    if (value <= 0) return 0;
    return Math.max(4, (value / maxValue) * innerHeight);
  };

  return (
    <div className="rd-chart-card">
      <div className="rd-chart-header">
        <h3 className="rd-chart-title">Thống kê hồ sơ</h3>
        {renderPeriodControls()}
      </div>

      <div className="rd-bar-chart-wrap">
        {hoveredIndex !== null && activePoint ? (
          <div className="rd-chart-tooltip" style={{ left: `${tooltipLeft}%` }}>
            <div className="rd-chart-tooltip-title">
              {period === "week" ? "Tuần" : "Tháng"} · {activePoint.day}
            </div>
            <div className="rd-chart-tooltip-row">
              <span>
                <i className="rd-chart-tooltip-dot rd-chart-tooltip-dot-primary" />
                Hồ sơ nhận
              </span>
              <strong>{valueFormatter.format(activePoint.count)}</strong>
            </div>
            <div className="rd-chart-tooltip-row">
              <span>
                <i className="rd-chart-tooltip-dot rd-chart-tooltip-dot-secondary" />
                Đạt sàng lọc
              </span>
              <strong>{valueFormatter.format(activePoint.secondaryCount)}</strong>
            </div>
          </div>
        ) : null}

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="rd-bar-chart"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Biểu đồ thống kê hồ sơ"
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
          {axisLevels.map((level) => {
            const y = paddingTop + innerHeight * (1 - level);
            return (
              <g key={level}>
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="Inter, sans-serif"
                >
                  {valueFormatter.format(Math.round(maxValue * level))}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const groupX = paddingLeft + i * groupWidth + groupWidth / 2;
            const barAX = groupX - gap / 2 - barWidth;
            const barBX = groupX + gap / 2;

            const hA = getBarHeight(d.count);
            const hB = getBarHeight(d.secondaryCount);
            const yA = paddingTop + innerHeight - hA;
            const yB = paddingTop + innerHeight - hB;

            const isActive = activeIndex === i;
            const shouldShowLabel =
              i % labelStep === 0 || i === data.length - 1 || isActive;

            return (
              <g key={d.key ?? `${d.day}-${i}`}>
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
                  opacity={isActive ? 1 : 0.75}
                />
                {/* X-axis label */}
                {shouldShowLabel ? (
                  <text
                    x={groupX}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill={isActive ? "#6366f1" : "#94a3b8"}
                    fontWeight={isActive ? "700" : "400"}
                    fontFamily="Inter, sans-serif"
                  >
                    {d.day}
                  </text>
                ) : null}
                <rect
                  x={paddingLeft + i * groupWidth}
                  y={paddingTop}
                  width={groupWidth}
                  height={innerHeight + paddingBottom - 8}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${d.day}: ${valueFormatter.format(
                    d.count
                  )} hồ sơ nhận, ${valueFormatter.format(
                    d.secondaryCount
                  )} đạt sàng lọc`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onFocus={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onBlur={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rd-chart-legend" aria-hidden="true">
        <span className="rd-chart-legend-item">
          <i className="rd-chart-tooltip-dot rd-chart-tooltip-dot-primary" />
          Hồ sơ nhận
        </span>
        <span className="rd-chart-legend-item">
          <i className="rd-chart-tooltip-dot rd-chart-tooltip-dot-secondary" />
          Đạt sàng lọc
        </span>
      </div>
    </div>
  );
};

export default ApplicationsBarChart;
