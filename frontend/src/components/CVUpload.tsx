"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";

export function CVUpload() {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }

    setFileName(file.name);
    setError("");
    setSuccess(false);
    setUploading(true);

    try {
      await api.uploadCV(file);
      setSuccess(true);
    } catch {
      setError("Upload failed. Please sign in first.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-primary-400 hover:bg-primary-50"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="hidden"
        />
        <div className="text-4xl text-gray-400">&#128196;</div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          {uploading ? "Uploading..." : "Drop your CV here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500">PDF files only (max 10MB)</p>
        {fileName && (
          <p className="mt-2 text-sm text-gray-600">{fileName}</p>
        )}
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="mt-3 text-sm text-green-600">
          CV uploaded and analyzed! Go to your{" "}
          <a href="/dashboard" className="underline">
            dashboard
          </a>{" "}
          to see matches.
        </p>
      )}
    </div>
  );
}
