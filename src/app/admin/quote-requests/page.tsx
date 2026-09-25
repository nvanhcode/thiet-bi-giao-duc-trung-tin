"use client";

import React, { useState, useEffect } from "react";
import {
  QuoteRequest,
  QuoteRequestStatus,
  statusLabels,
  customerTypeLabels,
  cityLabels,
} from "@/types/quote-request";
import { exportQuoteToExcel } from "@/lib/excelExport";
import { DEFAULT_IMAGE, handleImageError } from "@/lib/imageFallback";
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
  AlertCircle,
  MessageSquare,
  Loader2,
  FileSpreadsheet,
  Eye,
  X,
  Send,
  UserCheck,
  UserX,
  FileText,
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
  const [selectedDetailQuote, setSelectedDetailQuote] = useState<QuoteRequest | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/quote-requests");
      if (res.ok) {
        const data: QuoteRequest[] = await res.json();
        setRequests(data);
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
        showToast(`Đã cập nhật trạng thái thành "${statusLabels[newStatus] || newStatus}"`);
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

  const handleExportExcel = async (req: QuoteRequest) => {
    try {
      setExportingId(req.id);
      await exportQuoteToExcel(req);
      showToast(`Đã tải về file Excel báo giá cho ${req.fullName}!`);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      alert("Không thể tạo file Excel báo giá.");
    } finally {
      setExportingId(null);
    }
  };

  // Filter & Search logic
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (req.trackingCode && req.trackingCode.toLowerCase().includes(q)) ||
      req.id.toLowerCase().includes(q) ||
      req.fullName.toLowerCase().includes(q) ||
      req.phone.includes(q) ||
      (req.note && req.note.toLowerCase().includes(q)) ||
      (cityLabels[req.city || ""] || "").toLowerCase().includes(q) ||
      (req.items && req.items.some((i) => i.name.toLowerCase().includes(q)));

    return matchesStatus && matchesSearch;
  });

  // Count stats
  const stats = {
    total: requests.length,
    chuaXuLy: requests.filter((r) => r.status === "chua-xu-ly").length,
    daGuiBaoGia: requests.filter((r) => r.status === "da-gui-bao-gia").length,
    dangChoPhanHoi: requests.filter((r) => r.status === "dang-cho-phan-hoi").length,
    nguoiDungDongY: requests.filter((r) => r.status === "nguoi-dung-dong-y").length,
    nguoiDungTuChoi: requests.filter((r) => r.status === "nguoi-dung-tu-choi").length,
  };

  const getStatusBadgeStyle = (status: QuoteRequestStatus) => {
    switch (status) {
      case "chua-xu-ly":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "da-gui-bao-gia":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "dang-cho-phan-hoi":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "nguoi-dung-dong-y":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "nguoi-dung-tu-choi":
        return "bg-slate-200 text-slate-700 border-slate-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
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
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-[#c8102e] flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Quản Lý Danh Sách Yêu Cầu Báo Giá
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Quản lý báo giá, xuất file Excel đa-sheet chi tiết sản phẩm & cập nhật trạng thái phản hồi
            </p>
          </div>
        </div>

        <button
          onClick={fetchRequests}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Đang làm mới..." : "Làm mới danh sách"}</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 md:gap-4">
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
          onClick={() => setStatusFilter("da-gui-bao-gia")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "da-gui-bao-gia"
              ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider" style={{ color: statusFilter === "da-gui-bao-gia" ? "white" : undefined }}>Đã gửi báo giá</p>
            <Send className="w-3.5 h-3.5 opacity-70" />
          </div>
          <p className="text-2xl font-extrabold mt-1 text-blue-600" style={{ color: statusFilter === "da-gui-bao-gia" ? "white" : undefined }}>{stats.daGuiBaoGia}</p>
        </div>

        <div
          onClick={() => setStatusFilter("dang-cho-phan-hoi")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "dang-cho-phan-hoi"
              ? "bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-purple-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider" style={{ color: statusFilter === "dang-cho-phan-hoi" ? "white" : undefined }}>Chờ phản hồi</p>
            <Clock className="w-3.5 h-3.5 opacity-70" />
          </div>
          <p className="text-2xl font-extrabold mt-1 text-purple-600" style={{ color: statusFilter === "dang-cho-phan-hoi" ? "white" : undefined }}>{stats.dangChoPhanHoi}</p>
        </div>

        <div
          onClick={() => setStatusFilter("nguoi-dung-dong-y")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "nguoi-dung-dong-y"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider" style={{ color: statusFilter === "nguoi-dung-dong-y" ? "white" : undefined }}>Khách đồng ý</p>
            <UserCheck className="w-3.5 h-3.5 opacity-70" />
          </div>
          <p className="text-2xl font-extrabold mt-1 text-emerald-600" style={{ color: statusFilter === "nguoi-dung-dong-y" ? "white" : undefined }}>{stats.nguoiDungDongY}</p>
        </div>

        <div
          onClick={() => setStatusFilter("nguoi-dung-tu-choi")}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === "nguoi-dung-tu-choi"
              ? "bg-slate-700 text-white border-slate-700 shadow-md ring-2 ring-slate-500/20"
              : "bg-white text-gray-800 border-gray-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider" style={{ color: statusFilter === "nguoi-dung-tu-choi" ? "white" : undefined }}>Khách từ chối</p>
            <UserX className="w-3.5 h-3.5 opacity-70" />
          </div>
          <p className="text-2xl font-extrabold mt-1 text-slate-600" style={{ color: statusFilter === "nguoi-dung-tu-choi" ? "white" : undefined }}>{stats.nguoiDungTuChoi}</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm mã báo giá, tên khách, sđt, sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-gray-50/50"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Bộ lọc:
          </span>
          {[
            { id: "all", label: "Tất cả" },
            { id: "chua-xu-ly", label: "Chưa xử lý" },
            { id: "da-gui-bao-gia", label: "Đã gửi" },
            { id: "dang-cho-phan-hoi", label: "Chờ phản hồi" },
            { id: "nguoi-dung-dong-y", label: "Đồng ý" },
            { id: "nguoi-dung-tu-choi", label: "Từ chối" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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

      {/* Main Data Table Section */}
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4 border-b border-slate-800">Mã Báo Giá / Ngày</th>
                  <th className="p-4 border-b border-slate-800">Thông Tin Khách Hàng</th>
                  <th className="p-4 border-b border-slate-800">Sản Phẩm Yêu Cầu</th>
                  <th className="p-4 border-b border-slate-800">Trạng Thái</th>
                  <th className="p-4 border-b border-slate-800">Ghi Chú Admin</th>
                  <th className="p-4 border-b border-slate-800 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                {filteredRequests.map((req) => {
                  const customerTypeStr = customerTypeLabels[req.customerType || ""] || req.customerType || "Khách hàng";
                  const cityStr = cityLabels[req.city || ""] || req.city || "Chưa chọn";
                  const isSavingThisNote = savingNoteId === req.id;
                  const isExportingThis = exportingId === req.id;
                  const itemCount = req.items ? req.items.length : 0;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Col 1: Tracking code & date */}
                      <td className="p-4 font-medium align-top space-y-1 min-w-[140px]">
                        <span className="font-mono font-black text-[#c8102e] text-sm block">
                          {req.trackingCode || req.id}
                        </span>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{formatDate(req.createdAt)}</span>
                        </div>
                      </td>

                      {/* Col 2: Customer info */}
                      <td className="p-4 align-top space-y-1 min-w-[180px]">
                        <div className="font-extrabold text-gray-900 text-sm">{req.fullName}</div>
                        <a
                          href={`tel:${req.phone}`}
                          className="font-bold text-[#c8102e] hover:underline flex items-center gap-1 text-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{req.phone}</span>
                        </a>
                        <div className="text-[11px] text-gray-500 font-medium">
                          {customerTypeStr} • {cityStr}
                        </div>
                      </td>

                      {/* Col 3: Products */}
                      <td className="p-4 align-top space-y-1 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="bg-red-50 text-[#c8102e] font-black text-[11px] px-2 py-0.5 rounded-full border border-red-100">
                            {itemCount} sản phẩm
                          </span>
                          <button
                            onClick={() => setSelectedDetailQuote(req)}
                            className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> Xem danh sách
                          </button>
                        </div>

                        {req.items && req.items.length > 0 && (
                          <div className="text-[11px] text-gray-600 line-clamp-2 italic pt-0.5">
                            {req.items.map((i) => i.name).join(", ")}
                          </div>
                        )}
                      </td>

                      {/* Col 4: Status Dropdown */}
                      <td className="p-4 align-top min-w-[170px]">
                        <select
                          value={req.status}
                          onChange={(e) =>
                            handleStatusChange(req.id, e.target.value as QuoteRequestStatus)
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors w-full ${getStatusBadgeStyle(
                            req.status
                          )}`}
                        >
                          <option value="chua-xu-ly">Chưa xử lý</option>
                          <option value="da-gui-bao-gia">Đã gửi báo giá</option>
                          <option value="dang-cho-phan-hoi">Đang chờ phản hồi</option>
                          <option value="nguoi-dung-dong-y">Người dùng đồng ý</option>
                          <option value="nguoi-dung-tu-choi">Người dùng từ chối</option>
                        </select>
                      </td>

                      {/* Col 5: Admin Note */}
                      <td className="p-4 align-top min-w-[200px]">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Ghi chú nội bộ..."
                            value={editingNotes[req.id] ?? ""}
                            onChange={(e) =>
                              setEditingNotes({ ...editingNotes, [req.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveNote(req.id);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-slate-900 outline-none bg-white"
                          />
                          <button
                            onClick={() => handleSaveNote(req.id)}
                            disabled={isSavingThisNote}
                            className="bg-slate-900 hover:bg-slate-800 text-white p-1.5 rounded-lg transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                            title="Lưu ghi chú"
                          >
                            {isSavingThisNote ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Col 6: Actions */}
                      <td className="p-4 align-top text-right space-y-1.5 min-w-[170px]">
                        <button
                          onClick={() => handleExportExcel(req)}
                          disabled={isExportingThis}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-1.5 px-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Tải về file Excel mẫu báo giá"
                        >
                          {isExportingThis ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          )}
                          <span>Tải Excel Báo Giá</span>
                        </button>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDetailQuote(req)}
                            className="text-[11px] text-gray-700 hover:text-slate-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Chi tiết</span>
                          </button>

                          <button
                            onClick={() => handleDelete(req.id, req.fullName)}
                            className="text-[11px] text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR ADMIN */}
      {selectedDetailQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#c8102e]">
                  {selectedDetailQuote.trackingCode || selectedDetailQuote.id}
                </span>
                <h2 className="text-lg font-black text-gray-900">
                  Chi Tiết Yêu Cầu Báo Giá: {selectedDetailQuote.fullName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDetailQuote(null)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info Card */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-gray-400 font-medium">Khách hàng</p>
                <p className="font-bold text-gray-900 mt-0.5">{selectedDetailQuote.fullName}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Số điện thoại</p>
                <a href={`tel:${selectedDetailQuote.phone}`} className="font-bold text-[#c8102e] hover:underline mt-0.5 block">
                  {selectedDetailQuote.phone}
                </a>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Nhóm khách hàng</p>
                <p className="font-bold text-gray-800 mt-0.5">
                  {customerTypeLabels[selectedDetailQuote.customerType || ""] || selectedDetailQuote.customerType || "Chưa chọn"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Khu vực</p>
                <p className="font-bold text-gray-800 mt-0.5">
                  {cityLabels[selectedDetailQuote.city || ""] || selectedDetailQuote.city || "Chưa chọn"}
                </p>
              </div>
            </div>

            {/* Customer Note */}
            {selectedDetailQuote.note && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  Nhu cầu tư vấn của khách hàng:
                </p>
                <p className="text-xs text-gray-800 font-medium leading-relaxed">
                  {selectedDetailQuote.note}
                </p>
              </div>
            )}

            {/* Product items table */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                Danh sách sản phẩm khách cần báo giá:
              </h3>

              {selectedDetailQuote.items && selectedDetailQuote.items.length > 0 ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                  {selectedDetailQuote.items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 border p-1 shrink-0">
                          <img
                            src={item.image || DEFAULT_IMAGE}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={handleImageError}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{item.name}</p>
                          {item.code && <p className="text-[10px] text-gray-400">Mã: {item.code}</p>}
                          <p className="text-[11px] font-semibold text-[#c8102e]">
                            {typeof item.price === "number" && item.price > 0
                              ? item.price.toLocaleString("vi-VN") + "đ"
                              : "Giá: Liên hệ"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="bg-gray-100 text-gray-800 text-xs font-extrabold px-3 py-1 rounded-lg">
                          SL: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-gray-400">Yêu cầu tư vấn tổng hợp (chưa chọn sản phẩm cụ thể).</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-200">
              <button
                onClick={() => handleExportExcel(selectedDetailQuote)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-5 rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer uppercase"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Tải File Excel Mẫu Báo Giá</span>
              </button>

              <button
                onClick={() => setSelectedDetailQuote(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 px-5 rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
