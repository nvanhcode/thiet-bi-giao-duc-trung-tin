"use client";

import React, { useState, useEffect } from "react";
import {
  QuoteRequest,
  QuoteRequestStatus,
  statusLabels,
  customerTypeLabels,
  cityLabels,
} from "@/types/quote-request";
import {
  ClipboardList,
  Search,
  Filter,
  RefreshCw,
  Phone,
  MapPin,
  User,
  Calendar,
  Building,
  Save,
  Trash2,
  CheckCircle2,
  Clock,
  CheckCheck,
  AlertCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";

export default function AdminQuoteRequestsPage() {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/quote-requests");
      if (res.ok) {
        const data: QuoteRequest[] = await res.json();
        setRequests(data);
        // Initialize editing notes map
        const notesMap: Record<string, string> = {};
        data.forEach((r) => {
          notesMap[r.id] = r.adminNote || "";
        });
        setEditingNotes(notesMap);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu cầu báo giá:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleStatusChange = async (id: string, newStatus: QuoteRequestStatus) => {
    try {
      const res = await fetch("/api/admin/quote-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        const result = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: result.data.updatedAt } : r))
        );
        showToast(`Đã cập nhật trạng thái thành "${statusLabels[newStatus]}"`);
      } else {
        alert("Cập nhật trạng thái thất bại.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Không thể cập nhật trạng thái.");
    }
  };

  const handleSaveNote = async (id: string) => {
    const noteValue = editingNotes[id] || "";
    setSavingNoteId(id);
    try {
      const res = await fetch("/api/admin/quote-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminNote: noteValue }),
      });

      if (res.ok) {
        const result = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, adminNote: noteValue, updatedAt: result.data.updatedAt } : r))
        );
        showToast("Đã lưu ghi chú admin!");
      } else {
        alert("Lưu ghi chú thất bại.");
      }
    } catch (error) {
      console.error("Save note error:", error);
      alert("Không thể lưu ghi chú.");
    } finally {
      setSavingNoteId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa yêu cầu báo giá của "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/quote-requests?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        showToast("Đã xóa yêu cầu thành công!");
      } else {
        alert("Xóa yêu cầu thất bại.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Lỗi khi xóa yêu cầu.");
    }
  };

  // Filter & Search logic
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      req.fullName.toLowerCase().includes(q) ||
      req.phone.includes(q) ||
      (req.note && req.note.toLowerCase().includes(q)) ||
      (cityLabels[req.city] || "").toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // Count stats
  const stats = {
    total: requests.length,
    chuaXuLy: requests.filter((r) => r.status === "chua-xu-ly").length,
    dangXuLy: requests.filter((r) => r.status === "dang-xu-ly").length,
    daXuLy: requests.filter((r) => r.status === "da-xu-ly").length,
    hoanTat: requests.filter((r) => r.status === "hoan-tat").length,
  };

  const getStatusBadgeStyle = (status: QuoteRequestStatus) => {
    switch (status) {
      case "chua-xu-ly":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "dang-xu-ly":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "da-xu-ly":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "hoan-tat":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast feedback notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Quản Lý Yêu Cầu Báo Giá
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Danh sách và trạng thái phản hồi khách hàng gửi từ website
            </p>
          </div>
        </div>

        <button
          onClick={fetchRequests}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Đang làm mới..." : "Làm mới danh sách"}</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
        <div
          onClick={() => setStatusFilter("all")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "all"
              ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-[11px] font-medium opacity-80 uppercase tracking-wider">Tất cả yêu cầu</p>
          <p className="text-2xl font-extrabold mt-1">{stats.total}</p>
        </div>

        <div
          onClick={() => setStatusFilter("chua-xu-ly")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "chua-xu-ly"
              ? "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-rose-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider" style={{ color: statusFilter === "chua-xu-ly" ? "white" : undefined }}>Chưa xử lý</p>
            <AlertCircle className="w-3.5 h-3.5 opacity-70" />
          </div>
          <p className="text-2xl font-extrabold mt-1 text-rose-600" style={{ color: statusFilter === "chua-xu-ly" ? "white" : undefined }}>{stats.chuaXuLy}</p>
        </div>

        <div
          onClick={() => setStatusFilter("dang-xu-ly")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "dang-xu-ly"
              ? "bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider" style={{ color: statusFilter === "dang-xu-ly" ? "white" : undefined }}>Đang xử lý</p>
            <Clock className="w-3.5 h-3.5 opacity-70" />
          </div>
          <p className="text-2xl font-extrabold mt-1 text-amber-600" style={{ color: statusFilter === "dang-xu-ly" ? "white" : undefined }}>{stats.dangXuLy}</p>
        </div>

        <div
          onClick={() => setStatusFilter("da-xu-ly")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "da-xu-ly"
              ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider" style={{ color: statusFilter === "da-xu-ly" ? "white" : undefined }}>Đã xử lý</p>
            <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
          </div>
          <p className="text-2xl font-extrabold mt-1 text-blue-600" style={{ color: statusFilter === "da-xu-ly" ? "white" : undefined }}>{stats.daXuLy}</p>
        </div>

        <div
          onClick={() => setStatusFilter("hoan-tat")}
          className={`cursor-pointer p-4 rounded-xl border transition-all col-span-2 sm:col-span-1 ${
            statusFilter === "hoan-tat"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider" style={{ color: statusFilter === "hoan-tat" ? "white" : undefined }}>Hoàn tất</p>
            <CheckCheck className="w-3.5 h-3.5 opacity-70" />
          </div>
          <p className="text-2xl font-extrabold mt-1 text-emerald-600" style={{ color: statusFilter === "hoan-tat" ? "white" : undefined }}>{stats.hoanTat}</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, sđt, tỉnh thành, nhu cầu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-gray-50/50"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Trạng thái:
          </span>
          {[
            { id: "all", label: "Tất cả" },
            { id: "chua-xu-ly", label: "Chưa xử lý" },
            { id: "dang-xu-ly", label: "Đang xử lý" },
            { id: "da-xu-ly", label: "Đã xử lý" },
            { id: "hoan-tat", label: "Hoàn tất" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === f.id
                  ? "bg-[#c8102e] text-white font-bold"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section: Request Cards List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c8102e]" />
          <p className="text-xs font-medium">Đang tải danh sách yêu cầu báo giá...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500 space-y-3">
          <ClipboardList className="w-12 h-12 mx-auto text-gray-300" />
          <p className="text-sm font-bold text-gray-700">Không tìm thấy yêu cầu báo giá nào</p>
          <p className="text-xs text-gray-400">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const customerTypeStr = customerTypeLabels[req.customerType] || req.customerType || "Khách hàng";
            const cityStr = cityLabels[req.city] || req.city || "Chưa chọn";
            const isSavingThisNote = savingNoteId === req.id;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Request Header */}
                <div className="bg-gray-50/70 p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-400">#{req.id}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formatDate(req.createdAt)}
                    </span>
                  </div>

                  {/* Status Dropdown / Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Trạng thái:</span>
                    <select
                      value={req.status}
                      onChange={(e) =>
                        handleStatusChange(req.id, e.target.value as QuoteRequestStatus)
                      }
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors ${getStatusBadgeStyle(
                        req.status
                      )}`}
                    >
                      <option value="chua-xu-ly">Chưa xử lý</option>
                      <option value="dang-xu-ly">Đang xử lý</option>
                      <option value="da-xu-ly">Đã xử lý</option>
                      <option value="hoan-tat">Hoàn tất</option>
                    </select>
                  </div>
                </div>

                {/* Main Body */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left info col: Customer details */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center shrink-0 font-bold">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                          {req.fullName}
                        </h3>
                        <a
                          href={`tel:${req.phone}`}
                          className="text-xs font-extrabold text-[#c8102e] hover:underline flex items-center gap-1.5 mt-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{req.phone}</span>
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium">Nhóm khách hàng</p>
                          <p className="font-semibold text-gray-800">{customerTypeStr}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium">Khu vực</p>
                          <p className="font-semibold text-gray-800">{cityStr}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right info col: Customer Note & Admin Note */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Customer Request Note */}
                    <div className="bg-amber-50/60 border border-amber-200/70 p-3.5 rounded-xl space-y-1">
                      <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                        Nhu cầu tư vấn của khách hàng:
                      </p>
                      <p className="text-xs text-gray-800 leading-relaxed font-medium">
                        {req.note ? (
                          req.note
                        ) : (
                          <span className="italic text-gray-400">Không có ghi chú thêm</span>
                        )}
                      </p>
                    </div>

                    {/* Admin Note Box */}
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span>📝 Ghi chú của Admin</span>
                          <span className="text-[10px] font-normal text-slate-400">
                            (Dành cho quản trị viên lưu thông tin nội bộ)
                          </span>
                        </label>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(req.id, req.fullName)}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                          title="Xóa yêu cầu này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Nhập ghi chú (VD: Đã gọi điện lần 1, Khách hẹn chốt đơn thứ 6...)"
                          value={editingNotes[req.id] ?? ""}
                          onChange={(e) =>
                            setEditingNotes({ ...editingNotes, [req.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveNote(req.id);
                          }}
                          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-white"
                        />

                        <button
                          onClick={() => handleSaveNote(req.id)}
                          disabled={isSavingThisNote}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                        >
                          {isSavingThisNote ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>Lưu</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
