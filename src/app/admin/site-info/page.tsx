"use client";

import React, { useState, useEffect } from "react";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  MapPin,
  Share2,
  FileCheck,
  RefreshCw,
} from "lucide-react";

export default function SiteInfoAdminPage() {
  const [formData, setFormData] = useState<SiteInfo>(defaultSiteInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchSiteInfo();
  }, []);

  const fetchSiteInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-info");
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (err) {
      showToast("Không thể tải thông tin từ server", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (field: keyof SiteInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast("Cập nhật và lưu thông tin thành công!", "success");
      } else {
        const errData = await res.json();
        showToast(errData.error || "Lỗi lưu thông tin!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server!", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#c8102e]" />
        <span>Đang tải thông tin cấu hình...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold border ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : "bg-red-600 text-white border-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Brand Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3 border-gray-100">
            <Building2 className="w-5 h-5 text-[#c8102e]" />
            <h3>Thông Tin Thương Hiệu & Logo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tên thương hiệu (Dòng 1)
              </label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tên phụ (Dòng 2)
              </label>
              <input
                type="text"
                required
                value={formData.siteSubName}
                onChange={(e) => handleChange("siteSubName", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Chữ hiển thị trong Logo tròn
              </label>
              <input
                type="text"
                required
                value={formData.logoText}
                onChange={(e) => handleChange("logoText", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3 border-gray-100">
            <Phone className="w-5 h-5 text-[#c8102e]" />
            <h3>Thông Tin Liên Hệ & Điện Thoại</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Hotline chính
              </label>
              <input
                type="text"
                required
                value={formData.hotline}
                onChange={(e) => handleChange("hotline", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Điện thoại bàn
              </label>
              <input
                type="text"
                value={formData.landline}
                onChange={(e) => handleChange("landline", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email liên hệ
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Số Zalo tư vấn
              </label>
              <input
                type="text"
                required
                value={formData.zaloNumber}
                onChange={(e) => handleChange("zaloNumber", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Addresses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3 border-gray-100">
            <MapPin className="w-5 h-5 text-[#c8102e]" />
            <h3>Địa Chỉ Trụ Sở & Xưởng Sản Xuất</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Địa chỉ văn phòng / trụ sở chính
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Địa chỉ xưởng sản xuất
              </label>
              <input
                type="text"
                required
                value={formData.factoryAddress}
                onChange={(e) => handleChange("factoryAddress", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social Media */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3 border-gray-100">
            <Share2 className="w-5 h-5 text-[#c8102e]" />
            <h3>Liên Kết Mạng Xã Hội</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Đường dẫn Facebook
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => handleChange("facebookUrl", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Đường dẫn YouTube
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Đường dẫn TikTok
              </label>
              <input
                type="url"
                value={formData.tiktokUrl}
                onChange={(e) => handleChange("tiktokUrl", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Đường dẫn Pinterest
              </label>
              <input
                type="url"
                value={formData.pinterestUrl}
                onChange={(e) => handleChange("pinterestUrl", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Legal & Copyright */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3 border-gray-100">
            <FileCheck className="w-5 h-5 text-[#c8102e]" />
            <h3>Pháp Lý & Dòng Bản Quyền Footer</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mã Số Thuế (MST)
              </label>
              <input
                type="text"
                value={formData.mst}
                onChange={(e) => handleChange("mst", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nội dung bản quyền chân trang
              </label>
              <textarea
                rows={2}
                value={formData.copyrightText}
                onChange={(e) => handleChange("copyrightText", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi Thông Tin</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
