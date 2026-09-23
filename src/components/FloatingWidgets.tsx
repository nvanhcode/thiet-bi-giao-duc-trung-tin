"use client";

import React, { useState } from "react";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";
import { vietnamProvinces } from "@/types/quote-request";
import {
  PhoneCall,
  MessageCircle,
  Phone,
  X,
  Send,
  CheckCircle2,
  Loader2,
  User,
  MapPin,
  Building,
  FileText,
} from "lucide-react";

interface FloatingWidgetsProps {
  siteInfo?: SiteInfo;
}

export default function FloatingWidgets({ siteInfo = defaultSiteInfo }: FloatingWidgetsProps) {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    customerType: "",
    city: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const rawPhone = (siteInfo.hotline || "0862888679").replace(/\s+/g, "");
  const zaloPhone = (siteInfo.zaloNumber || rawPhone).replace(/\s+/g, "");

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert("Vui lòng điền họ tên và số điện thoại của bạn!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowSuccessModal(true);
        setFormData({ fullName: "", phone: "", customerType: "", city: "", note: "" });
      } else {
        const data = await res.json();
        alert(data.error || "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Submit callback request error:", error);
      alert("Không thể kết nối đến hệ thống. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsCallbackOpen(false);
    setShowSuccessModal(false);
  };

  return (
    <>
      {/* Bottom Left Floating Icons */}
      <div className="fixed bottom-16 md:bottom-6 left-3 md:left-6 z-40 flex flex-col gap-2.5 sm:gap-3">
        {/* Zalo Icon */}
        <a
          href={`https://zalo.me/${zaloPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 group relative"
          title="Chat Zalo"
        >
          <span className="font-black text-[11px] md:text-xs">Zalo</span>
          <span className="hidden md:block absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Zalo ({zaloPhone})
          </span>
        </a>

        {/* Phone Call Icon */}
        <a
          href={`tel:${rawPhone}`}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c8102e] hover:bg-[#a00c24] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 group relative animate-bounce"
          title="Gọi điện trực tiếp"
        >
          <PhoneCall className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden md:block absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Gọi ngay {siteInfo.hotline}
          </span>
        </a>

        {/* Messenger Icon */}
        <a
          href={siteInfo.facebookUrl || "https://m.me/"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 group relative"
          title="Messenger"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden md:block absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Messenger
          </span>
        </a>
      </div>

      {/* Bottom Right Floating Callback Trigger Button */}
      <div className="fixed bottom-14 md:bottom-0 right-2 md:right-4 z-40">
        <button
          onClick={() => {
            setShowSuccessModal(false);
            setIsCallbackOpen(true);
          }}
          className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-[11px] md:text-sm px-3.5 py-2 md:px-5 md:py-3 rounded-t-xl shadow-2xl flex items-center gap-1.5 cursor-pointer transition-all uppercase tracking-wide border-t border-l border-r border-red-400 hover:scale-105"
        >
          <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse" />
          <span>Yêu Cầu Gọi Lại</span>
        </button>
      </div>

      {/* Callback Request Modal Form Overlay */}
      {isCallbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={handleCloseModal}
            aria-hidden="true"
          />
          <div className="bg-white text-gray-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative border border-gray-100 z-10 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {!showSuccessModal ? (
              <>
                {/* Form Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                      Yêu Cầu Tư Vấn & Gọi Lại
                    </h3>
                    <p className="text-xs text-gray-500">
                      Gửi thông tin, Đồ Chơi Trung Tín sẽ gọi lại tư vấn ngay lập tức!
                    </p>
                  </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#c8102e]" />
                        <span>Họ và tên</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nhập họ và tên..."
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#c8102e]" />
                        <span>Số điện thoại</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Nhập số điện thoại..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Customer Type */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-[#c8102e]" />
                        <span>Nhóm khách hàng</span>
                      </label>
                      <select
                        value={formData.customerType}
                        onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-white"
                      >
                        <option value="">-- Chọn nhóm khách hàng --</option>
                        <option value="mam-non">Trường Mầm Non</option>
                        <option value="dai-ly">Đại Lý Cung Cấp</option>
                        <option value="du-an">Dự Án / Khu Đô Thị</option>
                        <option value="ca-nhan">Cá Nhân / Gia Đình</option>
                      </select>
                    </div>

                    {/* City / Province */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#c8102e]" />
                        <span>Tỉnh / Thành phố</span>
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-white"
                      >
                        <option value="">-- Chọn Tỉnh / Thành --</option>
                        {vietnamProvinces.map((prov) => (
                          <option key={prov.value} value={prov.value}>
                            {prov.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Note / Request Details */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#c8102e]" />
                      <span>Nhu cầu tư vấn</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Nhập loại sản phẩm, số lượng hoặc thắc mắc cần hỗ trợ..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-70 mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang gửi yêu cầu...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gửi Yêu Cầu Gọi Lại</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success Confirmation View */
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  Đã ghi nhận yêu cầu thành công!
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Cảm ơn bạn! Đồ Chơi Trung Tín đã nhận được yêu cầu tư vấn gọi lại và sẽ liên hệ hỗ trợ bạn trong thời gian sớm nhất.
                </p>

                {/* Call Hotline Callout */}
                <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-left space-y-2 mt-2">
                  <p className="text-[11px] font-semibold text-amber-900 flex items-start gap-1">
                    <span className="shrink-0">⚡</span>
                    <span>Cần tư vấn gấp? Quý khách có thể gọi trực tiếp hotline:</span>
                  </p>

                  <a
                    href={`tel:${rawPhone}`}
                    className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
                    <span>Gọi Hotline: {siteInfo.hotline || "0862.888.679"}</span>
                  </a>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-full py-2 px-4 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 mt-2"
                >
                  Đóng cửa sổ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

