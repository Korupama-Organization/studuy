import React from "react";

// Helper component to render an SVG Radar Chart
const RadarChart: React.FC<{ scores: Record<string, number> }> = ({ scores }) => {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  
  const labels = Object.keys(scores);
  const data = Object.values(scores);
  const maxScore = 10;
  
  const points = labels.map((_, i) => {
    const angle = (Math.PI / 2) - (2 * Math.PI * i / labels.length);
    const value = data[i];
    const r = radius * (value / maxScore);
    return `${center + r * Math.cos(angle)},${center - r * Math.sin(angle)}`;
  }).join(" ");

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="radar-chart-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Grid */}
        {gridLevels.map(level => {
          const levelPoints = labels.map((_, i) => {
            const angle = (Math.PI / 2) - (2 * Math.PI * i / labels.length);
            const r = radius * level;
            return `${center + r * Math.cos(angle)},${center - r * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon 
              key={level} 
              points={levelPoints} 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="1" 
            />
          );
        })}
        
        {/* Axes */}
        {labels.map((_, i) => {
          const angle = (Math.PI / 2) - (2 * Math.PI * i / labels.length);
          return (
            <line 
              key={i} 
              x1={center} 
              y1={center} 
              x2={center + radius * Math.cos(angle)} 
              y2={center - radius * Math.sin(angle)} 
              stroke="#e2e8f0" 
              strokeWidth="1" 
            />
          );
        })}
        
        {/* Data Polygon */}
        <polygon 
          points={points} 
          fill="rgba(59, 130, 246, 0.3)" 
          stroke="#3b82f6" 
          strokeWidth="2" 
        />
        
        {/* Labels */}
        {labels.map((label, i) => {
          const angle = (Math.PI / 2) - (2 * Math.PI * i / labels.length);
          const r = radius + 20;
          const x = center + r * Math.cos(angle);
          const y = center - r * Math.sin(angle);
          
          let textAnchor: "inherit" | "end" | "start" | "middle" = "middle";
          if (x > center + 10) textAnchor = "start";
          else if (x < center - 10) textAnchor = "end";
          
          let dy = 0;
          if (y > center + 10) dy = 10;
          else if (y < center - 10) dy = -5;

          return (
            <text 
              key={i} 
              x={x} 
              y={y} 
              dy={dy}
              textAnchor={textAnchor} 
              fill="#64748b" 
              fontSize="12" 
              fontWeight="500"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export interface MockInterviewData {
  id: string;
  overallScore: number;
  scores: Record<string, number>;
  summary: string;
}

interface RecentMockSectionProps {
  mockData: MockInterviewData | null;
}

const RecentMockSection: React.FC<RecentMockSectionProps> = ({ mockData }) => {
  if (!mockData) {
    return (
      <section>
        <div className="section-header">
          <h2 className="section-title mock-section-title">
            Phỏng vấn thử gần đây
            <span className="badge-latest">Mới nhất</span>
          </h2>
        </div>
        <div className="radar-card" style={{ textAlign: "center", color: "#64748b", padding: "3rem" }}>
          <p>Chưa có dữ liệu phỏng vấn thử gần đây. Hãy bắt đầu một buổi phỏng vấn thử để xem phân tích hiệu suất của bạn.</p>
        </div>
      </section>
    );
  }

  const { overallScore, scores: mockScores, summary } = mockData;

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title mock-section-title">
          Phỏng vấn thử gần đây
          <span className="badge-latest">Mới nhất</span>
        </h2>
      </div>

      <div className="mock-content-grid">
        <div className="radar-card">
          <h3 className="radar-title">Phân tích radar hiệu suất</h3>
          <RadarChart scores={mockScores} />
        </div>

        <div className="mock-details">
          <div className="score-card">
            <p className="score-label">Điểm tổng thể</p>
            <div className="score-value">
              {overallScore} <span className="score-total">/100</span>
            </div>
            <div className="score-bar-bg">
              <div className="score-bar-fill" style={{ width: `${overallScore}%` }}></div>
            </div>
          </div>

          <div className="detailed-scores-card">
            <h4 className="card-title">CHI TIẾT ĐIỂM SỐ</h4>
            
            {Object.entries(mockScores).map(([name, score]) => (
              <div className="score-row" key={name}>
                <div className="score-row-header">
                  <span className="score-name">{name}</span>
                  <span className="score-num">{score}/10</span>
                </div>
                <div className="score-progress-bg">
                  <div className="score-progress-fill" style={{ width: `${score * 10}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="interviewer-summary-card">
            <h4 className="card-title">TỔNG KẾT CỦA NGƯỜI PHỎNG VẤN</h4>
            <p className="summary-text">
              {summary}
            </p>
            <div className="summary-meta">
              Đánh giá bởi: AI Interviewer<br/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentMockSection;
