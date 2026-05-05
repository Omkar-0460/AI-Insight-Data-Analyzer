"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

type UploadZoneProps = {
  onFileSelect: (file: File) => void;
  loading: boolean;
};

export function UploadZone({ onFileSelect, loading }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <button
      type="button"
      id="upload-zone"
      className={`upload-zone ${isDragging ? "dragging" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelect(file);
      }}
      disabled={loading}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />

      <div className="upload-icon">
        <UploadCloud size={24} />
      </div>

      <div>
        <h3>Drop your file here</h3>
        <p>CSV, XLSX, or XLS — up to any size</p>
      </div>

      <span className="upload-btn">
        {loading ? "Uploading…" : "Browse Files"}
      </span>
    </button>
  );
}
