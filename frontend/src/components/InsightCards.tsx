import { BarChart2, Cpu, Hash, Layers } from "lucide-react";
import type { AnalyzeResponse } from "@/lib/types";

type Props = { analysis: AnalyzeResponse };

const METRIC_ICONS = [
  { icon: Hash,     color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { icon: Layers,   color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  { icon: BarChart2,color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { icon: Cpu,      color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
];

export function InsightCards({ analysis }: Props) {
  const p = analysis.profile;

  const metrics = [
    { label: "Total Rows",      value: p.row_count.toLocaleString() },
    { label: "Columns",         value: p.column_count },
    { label: "Numeric Fields",  value: p.numeric_columns.length },
    { label: "AI Suggestions",  value: analysis.ai_insights.business_suggestions.length },
  ];

  const insightPanels = [
    {
      id: "patterns",
      title: "Patterns",
      items: analysis.ai_insights.patterns,
      accent: "#6366f1",
    },
    {
      id: "anomalies",
      title: "Anomalies",
      items: analysis.ai_insights.anomalies,
      accent: "#f43f5e",
    },
    {
      id: "suggestions",
      title: "Business Suggestions",
      items: analysis.ai_insights.business_suggestions,
      accent: "#10b981",
    },
  ];

  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Metric Cards */}
      <div className="metrics-row">
        {metrics.map((m, i) => {
          const { icon: Icon, color, bg } = METRIC_ICONS[i];
          return (
            <article key={m.label} className="metric-card">
              <div
                className="metric-icon"
                style={{ background: bg, color }}
              >
                <Icon size={14} />
              </div>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
            </article>
          );
        })}
      </div>

      {/* Executive Summary */}
      <div className="panel summary-panel">
        <div className="panel-header" style={{ marginBottom: "12px" }}>
          <div>
            <span className="eyebrow">AI Summary</span>
            <h2>Executive Snapshot</h2>
          </div>
        </div>
        <p className="summary-text">{analysis.ai_insights.summary}</p>
      </div>

      {/* Insight Columns */}
      <div className="insight-grid">
        {insightPanels.map((panel) => (
          <article key={panel.id} className="insight-card">
            <h3 style={{ borderLeft: `3px solid ${panel.accent}`, paddingLeft: "10px" }}>
              {panel.title}
            </h3>
            <div className="insight-scroll">
              <ul className="insight-list">
                {panel.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
