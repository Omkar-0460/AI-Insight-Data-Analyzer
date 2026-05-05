"use client";

import {
  Bar, BarChart, CartesianGrid, Cell,
  Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { FileDown } from "lucide-react";

import type { AnalyzeResponse } from "@/lib/types";

const PALETTE = ["#6366f1", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#ec4899"];

const TOOLTIP_STYLE = {
  backgroundColor: "#111827",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "10px",
  fontSize: "0.8rem",
  color: "#f1f5f9",
};

type ChartPanelProps = {
  charts: AnalyzeResponse["charts"];
  columns: string[];
  datasetId: string;
  fileName: string;
  apiBaseUrl: string;
};

export function ChartPanel({ charts, columns, datasetId, fileName, apiBaseUrl }: ChartPanelProps) {
  return (
    <section className="panel animate-in">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Visual Analytics</span>
          <h2>Auto-generated Charts</h2>
        </div>
      </div>

      <div className="chart-grid">
        {charts.map((chart) => (
          <article key={chart.title} className="chart-card">
            <div className="chart-card-header">
              <h3>{chart.title}</h3>
              <p>{chart.description}</p>
            </div>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%">
                {chart.chart_type === "bar" || chart.chart_type === "histogram" ? (
                  <BarChart data={chart.data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey={chart.x_key} stroke="#475569" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis stroke="#475569" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                    <Bar dataKey={chart.y_key || "count"} fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                ) : chart.chart_type === "line" ? (
                  <LineChart data={chart.data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey={chart.x_key} stroke="#475569" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis stroke="#475569" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line
                      type="monotone"
                      dataKey={chart.y_key || "count"}
                      stroke="#22d3ee"
                      strokeWidth={2.5}
                      dot={{ fill: "#22d3ee", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={chart.data}
                      dataKey={chart.y_key || "count"}
                      nameKey={chart.x_key}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={40}
                      paddingAngle={3}
                    >
                      {chart.data.map((entry, idx) => (
                        <Cell
                          key={`${String(entry[chart.x_key])}-${idx}`}
                          fill={PALETTE[idx % PALETTE.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.78rem", color: "#94a3b8" }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </article>
        ))}
      </div>

      {/* Schema */}
      <div className="schema-section">
        <span className="eyebrow">Dataset Schema</span>
        <div className="chips-wrap">
          {columns.map((col) => (
            <span key={col} className="chip">{col}</span>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="export-section">
        <div>
          <span className="eyebrow">Export</span>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "6px" }}>
            Download Executive Report
          </h2>
          <p>
            Get a polished PDF of <strong>{fileName}</strong> including AI insights,
            chart context, and schema overview.
          </p>
        </div>
        <form action={`${apiBaseUrl}/report`} method="post" target="_blank">
          <input type="hidden" name="dataset_id" value={datasetId} readOnly />
          <button id="export-pdf-btn" className="btn-primary" type="submit">
            <FileDown size={15} />
            Export PDF
          </button>
        </form>
      </div>
    </section>
  );
}
