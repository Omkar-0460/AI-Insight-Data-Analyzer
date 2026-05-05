import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataInsight AI — Intelligent Dataset Analysis",
  description:
    "Upload CSV or Excel files and get instant AI-powered charts, executive summaries, anomaly detection, and natural-language answers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
