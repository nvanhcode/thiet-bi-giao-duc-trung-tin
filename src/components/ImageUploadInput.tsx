"use client";

import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, RefreshCw, CheckCircle2, FileImage } from "lucide-react";

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  previewAspect?: "square" | "video" | "og";
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = "Nhập URL ảnh hoặc chọn file từ máy...",
  previewAspect = "video",
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<{
    originalSize?: string;
    compressedSize?: string;
    savedPercent?: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatKB = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    return Math.round(bytes / 1024) + " KB";
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStats(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        setStats({
          originalSize: formatKB(data.originalSize),
          compressedSize: formatKB(data.compressedSize),
          savedPercent: data.savedPercent,
        });
      } else {
        alert("Lỗi upload hình ảnh!");
      }
    } catch (err) {
      alert("Lỗi kết nối upload hình ảnh!");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const aspectClass =
    previewAspect === "square"
      ? "aspect-square w-24"
      : previewAspect === "og"
      ? "aspect-[1.91/1] w-full"
      : "aspect-[16/9] w-full";

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-gray-700">{label}</label>}

      {/* Input controls */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#c8102e] outline-none bg-white"
          />
          <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Đang nén WebP...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tải ảnh từ máy tính</span>
            </>
          )}
        </button>
      </div>

      {/* Compression Stats Badge */}
      {stats && (
        <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 font-semibold animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Đã nén WebP: <span className="line-through text-gray-500">{stats.originalSize}</span> ➔{" "}
            <span className="font-extrabold text-emerald-700">{stats.compressedSize}</span> (Giảm {stats.savedPercent}%)
          </span>
        </div>
      )}

      {/* Image Live Preview */}
      <div className="pt-1">
        <div className={`${aspectClass} rounded-lg border border-gray-300 bg-gray-100 overflow-hidden relative shadow-inner flex items-center justify-center`}>
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400 p-4 text-center">
              <FileImage className="w-6 h-6" />
              <span className="text-[11px]">Chưa chọn hình ảnh</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
