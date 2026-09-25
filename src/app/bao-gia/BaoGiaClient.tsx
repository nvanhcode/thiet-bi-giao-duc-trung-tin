"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SiteInfo } from "@/types/site-info";
import { useQuote } from "@/context/QuoteContext";
import {
  QuoteRequest,
  QuoteRequestStatus,
  statusLabels,
  customerTypeLabels,
  cityLabels,
  vietnamProvinces,
} from "@/types/quote-request";
import { DEFAULT_IMAGE, handleImageError } from "@/lib/imageFallback";
import {
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Clock,
  Building,
  MapPin,
  User,
  Phone,
  Mail,
  Loader2,
  ShoppingBag,
  Send,
  XCircle,
  Sparkles,
} from "lucide-react";

interface BaoGiaClientProps {
  siteInfo: SiteInfo;
}

export default function BaoGiaClient({ siteInfo }: BaoGiaClientProps) {
  const { items, updateQuantity, removeFromQuote, clearQuote } = useQuote();

  const [activeTab, setActiveTab] = useState<"cart" | "track">("cart");

  // Form inputs
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState("mam-non");
  const [city, setCity] = useState("hanoi");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Success Modal state
  const [createdQuote, setCreatedQuote] = useState<QuoteRequest | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Lookup / Tracking state
  const [trackQuery, setTrackQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackResults, setTrackResults] = useState<QuoteRequest[] | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // Handle Form Submission
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError("Vui lòng nhập họ và tên của bạn");
      return;
    }
    if (!phone.trim()) {
      setFormError("Vui lòng nhập số điện thoại liên hệ");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          customerType,
          city,
          note,
          items,
        }),
      });

      const data = await res.json();
      if (res.ok && data.data) {
        setCreatedQuote(data.data);
        clearQuote(); // Clear cart after successful request
      } else {
        setFormError(data.error || "Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (err) {
      console.error("Lỗi gửi báo giá:", err);
      setFormError("Không thể kết nối đến máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy tracking code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Perform Quote Search
  const handleSearchTrack = async (queryToSearch?: string) => {
    const q = (queryToSearch !== undefined ? queryToSearch : trackQuery).trim();
    if (!q) {
      setTrackError("Vui lòng nhập Mã báo giá hoặc Số điện thoại");
      return;
    }

    setTrackError(null);
    setIsSearching(true);
    try {
      const res = await fetch(`/api/quote-requests?search=${encodeURIComponent(q)}`);
      const json = await res.json();

      if (res.ok && json.data) {
        setTrackResults(json.data);
        if (json.data.length === 0) {
          setTrackError(`Không tìm thấy báo giá nào khớp với từ khóa "${q}"`);
        }
      } else {
        setTrackError(json.error || "Lỗi khi tra cứu thông tin.");
      }
    } catch (err) {
      console.error("Lỗi tra cứu:", err);
      setTrackError("Lỗi kết nối máy chủ khi tra cứu.");
    } finally {
      setIsSearching(false);
    }
  };

  // Customer Response (Accept / Reject Quote)
  const handleRespondQuote = async (id: string, newStatus: "nguoi-dung-dong-y" | "nguoi-dung-tu-choi") => {
    setRespondingId(id);
    try {
      const res = await fetch("/api/quote-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        const json = await res.json();
        // Update local results
        setTrackResults((prev) =>
          prev ? prev.map((r) => (r.id === id || r.trackingCode === id ? json.data : r)) : null
        );
      } else {
        alert("Lỗi khi gửi phản hồi báo giá.");
      }
    } catch (e) {
      console.error("Response error:", e);
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setRespondingId(null);
    }
  };

  const getStatusBadgeStyle = (status: QuoteRequestStatus) => {
    switch (status) {
      case "chua-xu-ly":
        return "bg-rose-100 text-rose-700 border-rose-200";
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
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      {/* SUCCESS MODAL POPUP WITH TRACKING CODE */}
      {createdQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Gửi Yêu Cầu Báo Giá Thành Công!
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cảm ơn <span className="font-bold text-gray-800">{createdQuote.fullName}</span>. Chúng tôi đã nhận được thông tin yêu cầu của bạn và sẽ gọi điện hỗ trợ sớm nhất.
              </p>
            </div>

            {/* Tracking Code Highlight Box */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-2xl border border-red-200/80 space-y-2">
              <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                Mã Theo Dõi Báo Giá Của Bạn
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-black text-[#c8102e] tracking-widest">
                  {createdQuote.trackingCode}
                </span>
                <button
                  onClick={() => handleCopyCode(createdQuote.trackingCode)}
                  className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-xl border border-gray-200 text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95"
                  title="Sao chép mã"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600 text-[11px]">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-[11px]">Chép</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 italic">
                Hãy lưu lại mã này để tra cứu tiến độ phản hồi của chuyên viên báo giá.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  const code = createdQuote.trackingCode;
                  setCreatedQuote(null);
                  setActiveTab("track");
                  setTrackQuery(code);
                  handleSearchTrack(code);
                }}
                className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <Search className="w-4 h-4" />
                <span>Tra cứu ngay</span>
              </button>

              <button
                onClick={() => setCreatedQuote(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-red-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hệ Thống Báo Giá Trực Tuyến Nhanh Chóng</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Danh Sách Báo Giá
          </h1>
          <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Chọn sản phẩm cần báo giá, để lại họ tên & số điện thoại để nhận bảng giá chi tiết cùng chiết khấu tốt nhất cho trường học, dự án và đại lý.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center gap-1 z-10 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("cart")}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === "cart"
                ? "bg-[#c8102e] text-white shadow-lg"
                : "text-gray-200 hover:text-white hover:bg-white/10"
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Danh Sách ({items.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab("track")}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === "track"
                ? "bg-[#c8102e] text-white shadow-lg"
                : "text-gray-200 hover:text-white hover:bg-white/10"
              }`}
          >
            <Search className="w-4 h-4" />
            <span>Tra Cứu Trạng Thái</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DANH SÁCH BÁO GIÁ & FORM YÊU CẦU */}
      {/* ========================================================================= */}
      {activeTab === "cart" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Items Table / List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#c8102e]" />
                  <span>Sản Phẩm Cần Báo Giá</span>
                  <span className="text-xs text-gray-400 font-medium">
                    ({items.length} chủng loại)
                  </span>
                </h2>

                {items.length > 0 && (
                  <button
                    onClick={clearQuote}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa tất cả</span>
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-gray-800">
                      Chưa có sản phẩm nào trong danh sách báo giá
                    </p>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Dạo xem các danh mục sản phẩm đồ chơi mầm non, thiết bị trường học và bấm nút <strong className="text-[#c8102e]">+ Thêm vào báo giá</strong>.
                    </p>
                  </div>
                  <Link
                    href="/san-pham"
                    className="inline-flex items-center gap-2 bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow transition-colors uppercase"
                  >
                    <span>Khám phá sản phẩm ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-3 sm:gap-4 group">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-1.5 shrink-0">
                        <img
                          src={item.image || DEFAULT_IMAGE}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={handleImageError}
                        />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <Link
                          href={`/san-pham/${item.slug}`}
                          className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#c8102e] line-clamp-2 transition-colors"
                        >
                          {item.name}
                        </Link>
                        {item.code && (
                          <p className="text-[11px] text-gray-400 font-mono">
                            Mã SP: <span className="font-semibold text-gray-700">{item.code}</span>
                          </p>
                        )}
                        <p className="text-xs font-bold text-[#c8102e]">
                          {typeof item.price === "number" && item.price > 0
                            ? item.price.toLocaleString("vi-VN") + "đ"
                            : "Giá: Liên hệ"}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
                          title="Giảm số lượng"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
                          title="Tăng số lượng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromQuote(item.id)}
                        className="text-gray-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Xóa khỏi báo giá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customer Info Form */}
          <div className="lg:col-span-5 space-y-4">
            <form
              onSubmit={handleSubmitQuote}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#c8102e]" />
                  <span>Thông Tin Khách Hàng</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Vui lòng điền thông tin để phòng kinh doanh lập bảng báo giá gửi quý khách.
                </p>
              </div>

              {formError && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Input: Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <span>Họ và tên người nhận báo giá</span>
                  <span className="text-[#c8102e]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Anh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-gray-50/50 font-medium"
                  />
                </div>
              </div>

              {/* Input: Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <span>Số điện thoại liên hệ</span>
                  <span className="text-[#c8102e]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0978 618 790"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-gray-50/50 font-medium"
                  />
                </div>
              </div>

              {/* Input: Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span>Email nhận file báo giá (nếu có)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Không bắt buộc</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="VD: nguyenvananh@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-gray-50/50 font-medium"
                  />
                </div>
              </div>

              {/* Select: Customer Type & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    <span>Nhóm khách hàng</span>
                  </label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-gray-50/50 font-medium cursor-pointer"
                  >
                    {Object.entries(customerTypeLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Tỉnh / Thành phố</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-gray-50/50 font-medium cursor-pointer"
                  >
                    {vietnamProvinces.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Textarea: Note */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nhu cầu / Ghi chú chi tiết</label>
                <textarea
                  rows={3}
                  placeholder="Ghi rõ diện tích sân chơi, tiến độ cần hàng hoặc các yêu cầu lắp đặt tận nơi..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-gray-50/50 font-medium resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi yêu cầu...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Báo Giá Nhanh</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                🔒 Thông tin của bạn được bảo mật tuyệt đối và chỉ dùng để tư vấn báo giá.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRA CỨU TRẠNG THÁI BÁO GIÁ */}
      {/* ========================================================================= */}
      {activeTab === "track" && (
        <div className="space-y-6">
          {/* Search Box Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-extrabold text-gray-900">
                Tra Cứu Tiến Độ Xử Lý Báo Giá
              </h2>
              <p className="text-xs text-gray-500">
                Nhập <strong className="text-gray-800">Mã báo giá (VD: BG-892341)</strong> hoặc <strong className="text-gray-800">Số điện thoại</strong> quý khách đã đăng ký.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchTrack();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Nhập mã báo giá hoặc số điện thoại..."
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none font-bold uppercase tracking-wider bg-gray-50/50"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition-colors flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Tra cứu</span>
                  </>
                )}
              </button>
            </form>

            {trackError && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-700 font-semibold flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}
          </div>

          {/* Results List */}
          {trackResults && trackResults.length > 0 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {trackResults.map((req) => {
                const customerTypeStr = customerTypeLabels[req.customerType || ""] || req.customerType || "Khách hàng";
                const cityStr = cityLabels[req.city || ""] || req.city || "Chưa chọn";
                const isRespondingThis = respondingId === req.id || respondingId === req.trackingCode;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden space-y-0"
                  >
                    {/* Result Header */}
                    <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-medium">Mã báo giá:</span>
                          <span className="font-mono font-black text-amber-400 text-lg tracking-wider">
                            {req.trackingCode || req.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Ngày gửi: {formatDate(req.createdAt)}</span>
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${getStatusBadgeStyle(req.status)}`}>
                        {statusLabels[req.status] || req.status}
                      </span>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="p-5 bg-gray-50/80 border-b border-gray-200">
                      <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                        Tiến độ xử lý báo giá:
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-bold">
                        <div className={`p-2 rounded-xl border ${req.status !== "chua-xu-ly" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-rose-50 text-rose-700 border-rose-300 font-black"}`}>
                          1. Đã nhận yêu cầu
                        </div>
                        <div className={`p-2 rounded-xl border ${["da-gui-bao-gia", "dang-cho-phan-hoi", "nguoi-dung-dong-y", "nguoi-dung-tu-choi"].includes(req.status) ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
                          2. Đã gửi báo giá
                        </div>
                        <div className={`p-2 rounded-xl border ${["dang-cho-phan-hoi", "nguoi-dung-dong-y", "nguoi-dung-tu-choi"].includes(req.status) ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
                          3. Chờ phản hồi
                        </div>
                        <div className={`p-2 rounded-xl border ${req.status === "nguoi-dung-dong-y" ? "bg-emerald-600 text-white border-emerald-600" : req.status === "nguoi-dung-tu-choi" ? "bg-slate-700 text-white border-slate-700" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
                          4. {req.status === "nguoi-dung-dong-y" ? "Khách đồng ý" : req.status === "nguoi-dung-tu-choi" ? "Khách từ chối" : "Chốt báo giá"}
                        </div>
                      </div>
                    </div>

                    {/* Result Content */}
                    <div className="p-6 space-y-6">
                      {/* Customer Details Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200/80">
                        <div>
                          <p className="text-gray-400 font-medium">Khách hàng</p>
                          <p className="font-bold text-gray-900 mt-0.5">{req.fullName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Số điện thoại</p>
                          <p className="font-bold text-[#c8102e] mt-0.5">{req.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Phân loại & Khu vực</p>
                          <p className="font-bold text-gray-800 mt-0.5">
                            {customerTypeStr} • {cityStr}
                          </p>
                        </div>
                      </div>

                      {/* Products requested */}
                      {req.items && req.items.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                            Danh mục sản phẩm báo giá ({req.items.length} sản phẩm):
                          </p>
                          <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                            {req.items.map((it, idx) => (
                              <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-gray-50 border p-1 shrink-0">
                                    <img
                                      src={it.image || DEFAULT_IMAGE}
                                      alt={it.name}
                                      className="w-full h-full object-contain"
                                      onError={handleImageError}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{it.name}</p>
                                    {it.code && <p className="text-[10px] text-gray-400">Mã: {it.code}</p>}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-extrabold text-gray-800">
                                    SL: {it.quantity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Admin Note / Reply message */}
                      {req.adminNote && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1">
                          <p className="text-xs font-bold text-amber-900 flex items-center gap-1">
                            <span>💬 Phản hồi từ Chuyên Viên Tư Vấn Phúc An Minh:</span>
                          </p>
                          <p className="text-xs text-gray-800 font-medium leading-relaxed">
                            {req.adminNote}
                          </p>
                        </div>
                      )}

                      {/* Interactive Actions for Customer */}
                      {["da-gui-bao-gia", "dang-cho-phan-hoi"].includes(req.status) && (
                        <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-3">
                          <p className="text-xs font-bold text-blue-900 text-center">
                            Quý khách đã nhận được báo giá và xem qua thông tin? Hãy phản hồi cho chúng tôi:
                          </p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                              onClick={() => handleRespondQuote(req.id, "nguoi-dung-dong-y")}
                              disabled={isRespondingThis}
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase disabled:opacity-50"
                            >
                              {isRespondingThis ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Đồng ý báo giá & Đặt hàng</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleRespondQuote(req.id, "nguoi-dung-tu-choi")}
                              disabled={isRespondingThis}
                              className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase disabled:opacity-50"
                            >
                              {isRespondingThis ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  <span>Từ chối báo giá này</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
