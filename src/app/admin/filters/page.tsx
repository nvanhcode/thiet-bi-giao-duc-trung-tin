"use client";

import React, { useState, useEffect } from "react";
import { FilterOptionsData, defaultFilterOptions } from "@/types/filter";
import {
  Tag,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderPlus,
  Sliders,
} from "lucide-react";

export default function AdminFiltersPage() {
  const [filters, setFilters] = useState<FilterOptionsData>(defaultFilterOptions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // New item state per group
  const [newOptionInputs, setNewOptionInputs] = useState<{ [key: string]: string }>({});
  const [newGroupKey, setNewGroupKey] = useState("");

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/filters");
      if (res.ok) {
        const data = await res.json();
        setFilters(data);
      }
    } catch (err) {
      showToast("Lỗi tải thuộc tính bộ lọc!", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddOption = (groupKey: string) => {
    const val = (newOptionInputs[groupKey] || "").trim();
    if (!val) return;

    const currentList = filters[groupKey] || [];
    if (currentList.includes(val)) {
      alert("Tùy chọn này đã tồn tại trong nhóm!");
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [groupKey]: [...currentList, val],
    }));

    setNewOptionInputs((prev) => ({ ...prev, [groupKey]: "" }));
  };

  const handleRemoveOption = (groupKey: string, index: number) => {
    const currentList = filters[groupKey] || [];
    const updated = currentList.filter((_, i) => i !== index);
    setFilters((prev) => ({ ...prev, [groupKey]: updated }));
  };

  const handleAddGroup = () => {
    const key = newGroupKey.trim();
    if (!key) return;

    if (filters[key]) {
      alert("Nhóm bộ lọc này đã tồn tại!");
      return;
    }

    setFilters((prev) => ({ ...prev, [key]: [] }));
    setNewGroupKey("");
  };

  const handleRemoveGroup = (groupKey: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa toàn bộ nhóm bộ lọc "${groupKey}"?`)) return;

    const updated = { ...filters };
    delete updated[groupKey];
    setFilters(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (res.ok) {
        showToast("Lưu cấu hình thuộc tính bộ lọc thành công!", "success");
      } else {
        showToast("Lỗi lưu thuộc tính bộ lọc!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server!", "error");
    } finally {
      setSaving(false);
    }
  };

  const groupTitles: { [key: string]: string } = {
    blockCount: "Số khối",
    investmentLevel: "Mức đầu tư",
    origin: "Nguồn gốc",
    slideType: "Kiểu máng trượt",
    feature: "Tính năng tích hợp",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#c8102e]" />
        <span>Đang tải thuộc tính bộ lọc...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold border ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : "bg-red-600 text-white border-red-500"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Quản Lý Đánh Nhãn Thuộc Tính Bộ Lọc</h2>
            <p className="text-xs text-gray-500">
              Cấu hình danh sách các lựa chọn bộ lọc (Số khối, Mức đầu tư, Nguồn gốc, Máng trượt...)
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs px-6 py-3 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Lưu Thuộc Tính Bộ Lọc</span>
        </button>
      </div>

      {/* Filter Groups Grid */}
      <div className="space-y-6">
        {Object.keys(filters).map((groupKey) => {
          const title = groupTitles[groupKey] || groupKey;
          const options = filters[groupKey] || [];

          return (
            <div key={groupKey} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                  <Tag className="w-4 h-4 text-[#c8102e]" />
                  <span>Nhóm bộ lọc: <strong className="text-[#c8102e] font-extrabold">{title}</strong> ({groupKey})</span>
                </div>
                {!["blockCount", "investmentLevel", "origin", "slideType", "feature"].includes(groupKey) && (
                  <button
                    onClick={() => handleRemoveGroup(groupKey)}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa nhóm này</span>
                  </button>
                )}
              </div>

              {/* Tag options list */}
              <div className="flex flex-wrap items-center gap-2">
                {options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg border border-gray-200 transition-colors group"
                  >
                    <span>{opt}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(groupKey, idx)}
                      className="text-gray-400 hover:text-red-600 p-0.5 rounded transition-colors"
                      title="Xóa tùy chọn này"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Option Form */}
              <div className="flex items-center gap-2 max-w-md pt-2">
                <input
                  type="text"
                  placeholder={`Thêm tùy chọn mới cho ${title}...`}
                  value={newOptionInputs[groupKey] || ""}
                  onChange={(e) => setNewOptionInputs({ ...newOptionInputs, [groupKey]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption(groupKey);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
                />
                <button
                  type="button"
                  onClick={() => handleAddOption(groupKey)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Custom Filter Group */}
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <FolderPlus className="w-4 h-4 text-emerald-600" />
            <span>Thêm Nhóm Bộ Lọc Mới (Nâng cao):</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Nhập tên nhóm bộ lọc mới (tiếng Anh / không dấu)..."
              value={newGroupKey}
              onChange={(e) => setNewGroupKey(e.target.value)}
              className="px-3.5 py-2 border rounded-lg text-xs font-mono bg-white outline-none focus:ring-2 focus:ring-emerald-600 flex-1 sm:w-64"
            />
            <button
              onClick={handleAddGroup}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Nhóm Mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
