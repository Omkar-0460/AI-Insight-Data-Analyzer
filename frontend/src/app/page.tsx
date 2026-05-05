"use client";

import {
  BarChart2,
  Database,
  FileSpreadsheet,
  LoaderCircle,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { useState, useTransition } from "react";

import { ChartPanel } from "@/components/ChartPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { InsightCards } from "@/components/InsightCards";
import { UploadZone } from "@/components/UploadZone";
import { analyzeDataset, uploadDataset } from "@/lib/api";
import type { AnalyzeResponse, UploadResponse } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function Home() {
  const [upload, setUpload] = useState<UploadResponse | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUploading, startUploadTransition] = useTransition();
  const [isAnalyzing, startAnalyzeTransition] = useTransition();

  const handleFileSelect = (file: File) => {
    setError(null);
    setAnalysis(null);

    startUploadTransition(async () => {
      try {
        const nextUpload = await uploadDataset(file);
        setUpload(nextUpload);
        setIsChatOpen(false);
        startAnalyzeTransition(async () => {
          try {
            const nextAnalysis = await analyzeDataset(nextUpload.dataset_id);
            setAnalysis(nextAnalysis);
          } catch (analysisError) {
            setError(
              analysisError instanceof Error
                ? analysisError.message
                : "Analysis failed.",
            );
          }
        });
      } catch (uploadError) {
        setError(
          uploadError instanceof Error ? uploadError.message : "Upload failed.",
        );
      }
    });
  };

  return (
    <main className="app-shell">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <BarChart2 size={16} color="#fff" />
          </div>
          DataInsight AI
        </div>
        <span className="nav-badge">Powered by Gemini</span>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-card animate-in">
        <div className="hero-copy">
          <span className="badge">
            <Sparkles size={12} />
            AI-Powered Analytics
          </span>
          <h1>Turn data into decisions</h1>
          <p>
            Upload any CSV or Excel file and instantly generate professional
            charts, AI executive summaries, anomaly detection, and
            natural-language Q&amp;A — all in one workspace.
          </p>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-icon">
              <FileSpreadsheet size={16} />
            </div>
            <div>
              <h3>Upload &amp; Preview</h3>
              <p>Inspect tabular data before analysis begins.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <ScanSearch size={16} />
            </div>
            <div>
              <h3>AI Insights</h3>
              <p>Summaries, patterns, anomalies, and business suggestions.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Database size={16} />
            </div>
            <div>
              <h3>Auto-generated Charts</h3>
              <p>Bar, line, and pie charts built from your data automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upload Panel ── */}
      <section className="panel animate-in">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Data Intake</span>
            <h2>Upload your dataset</h2>
          </div>
          <div className="pill-tags">
            <span className="pill-tag">CSV</span>
            <span className="pill-tag">XLSX</span>
            <span className="pill-tag">XLS</span>
          </div>
        </div>

        <UploadZone onFileSelect={handleFileSelect} loading={isUploading} />

        {error && <p className="error-banner">{error}</p>}

        {(isUploading || isAnalyzing) && (
          <div className="status-row">
            <LoaderCircle className="spin" size={16} />
            <span>
              {isUploading ? "Uploading dataset…" : "Generating AI insights…"}
            </span>
          </div>
        )}

        {upload && (
          <div className="preview-header">
            <div>
              <span className="eyebrow">Current Dataset</span>
              <h3>{upload.file_name}</h3>
            </div>
            <div className="pill-tags">
              <span className="pill-tag">{upload.rows.toLocaleString()} rows</span>
              <span className="pill-tag">{upload.columns.length} fields</span>
            </div>
          </div>
        )}

        {upload && (
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  {upload.columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {upload.preview.map((row, i) => (
                  <tr key={i}>
                    {upload.columns.map((col) => (
                      <td key={col}>{String(row[col] ?? "—")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Analysis Results ── */}
      {analysis && (
        <>
          <InsightCards analysis={analysis} />
          <ChartPanel
            charts={analysis.charts}
            columns={upload?.columns || []}
            datasetId={upload?.dataset_id || ""}
            fileName={upload?.file_name || "dataset"}
            apiBaseUrl={API_BASE_URL}
          />
        </>
      )}

      {/* ── Chat ── */}
      {analysis && upload && (
        <ChatPanel
          datasetId={upload.dataset_id}
          suggestions={analysis.ai_insights.recommended_questions}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen((v) => !v)}
        />
      )}
    </main>
  );
}
