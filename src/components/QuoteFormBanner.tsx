"use client";

import React, { useState } from "react";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";
import { PhoneCall, FileText, Send } from "lucide-react";

interface QuoteFormBannerProps {
  siteInfo?: SiteInfo;
}

export default function QuoteFormBanner({ siteInfo = defaultSiteInfo }: QuoteFormBannerProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    customerType: "",
    city: "",
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Cảm ơn ${formData.fullName || "bạn"}! Yêu cầu báo giá đã được gửi thành công. Chúng tôi sẽ liên hệ lại ngay!`);
    setFormData({ fullName: "", phone: "", customerType: "", city: "", note: "" });
  };

  const rawPhone = (siteInfo.hotline || "0862888679").replace(/\s+/g, "");

  return (
    <section className="w-full bg-gradient-to-r from-[#b91c1c] via-[#c8102e] to-[#ea580c] py-12 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left info box */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
              Bạn đã chọn được sản phẩm phù hợp?
            </h2>

            <p className="text-red-100 text-sm md:text-base leading-relaxed max-w-lg">
              Thêm nhiều sản phẩm vào danh sách và gửi một lần để Đồ Chơi Trung Tín tư vấn, báo giá theo số lượng, địa điểm và nhu cầu sử dụng.
            </p>

            {/* Sub box with action buttons */}
            <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Danh sách báo giá</h4>
                  <p className="text-xs text-red-200">Xem lại các sản phẩm bạn đã lưu</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => alert("Chưa có sản phẩm nào trong danh sách báo giá!")}
                  className="bg-white text-[#c8102e] hover:bg-red-50 font-bold text-xs py-3 px-5 rounded-lg transition-colors shadow"
                >
                  Mở danh sách báo giá
                </button>
                <a
                  href={`tel:${rawPhone}`}
                  className="bg-black/40 hover:bg-black/60 border border-white/30 text-white font-bold text-xs py-3 px-5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Gọi {siteInfo.hotline}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Lead Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-gray-800">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập họ và tên"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Nhập số điện thoại"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Khách hàng <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.customerType}
                      onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-white"
                    >
                      <option value="">-- Chọn nhóm khách hàng --</option>
                      <option value="mam-non">Trường Mầm Non</option>
                      <option value="dai-ly">Đại Lý Cung Cấp</option>
                      <option value="du-an">Dự Án / Khu Đô Thị</option>
                      <option value="ca-nhan">Cá Nhân / Gia Đình</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Tỉnh / Thành <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none bg-white"
                    >
                      <option value="">-- Chọn Tỉnh / Thành --</option>
                      <option value="hanoi">Hà Nội</option>
                      <option value="haiduong">Hải Dương</option>
                      <option value="thanhhoa">Thanh Hóa</option>
                      <option value="daklak">Đắk Lắk</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="khac">Tỉnh/Thành khác</option>
                    </select>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nhu cầu cần tư vấn
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập sản phẩm, số lượng, diện tích hoặc thời gian cần cân nhắc..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <p className="text-[11px] text-gray-500 italic">
                  Khi gửi yêu cầu, Đồ Chơi Trung Tín sẽ liên hệ lại tư vấn theo nhu cầu của anh/chị.
                </p>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-sm py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi yêu cầu báo giá</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
