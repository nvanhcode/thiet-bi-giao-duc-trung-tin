"use client";

import React, { useState, useEffect } from "react";
import {
  SiteInfo,
  BannerSlide,
  AboutSectionConfig,
  AboutHighlight,
  AboutStat,
  defaultSiteInfo,
  defaultAboutSection,
} from "@/types/site-info";
import { Category } from "@/types/category";
import ImageUploadInput from "@/components/ImageUploadInput";
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
  ImageIcon,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  Grid,
  CheckSquare,
  Square,
  BarChart2,
  Palette,
} from "lucide-react";

export default function SiteInfoAdminPage() {
  const [formData, setFormData] = useState<SiteInfo>(defaultSiteInfo);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("brand");

  useEffect(() => {
    fetchSiteData();
    // Sync active tab from URL search parameters on mount
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get("tab");
    if (urlTab && ["brand", "about", "banners", "contact", "social"].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tabId);
    window.history.replaceState({}, "", url.toString());
  };

  const fetchSiteData = async () => {
    setLoading(true);
    try {
      const [siteRes, catRes] = await Promise.all([
        fetch("/api/admin/site-info"),
        fetch("/api/admin/categories"),
      ]);

      if (siteRes.ok) {
        const data = await siteRes.json();
        setFormData({
          ...defaultSiteInfo,
          ...data,
          bannerSlides: data.bannerSlides || defaultSiteInfo.bannerSlides,
          aboutSection: {
            ...defaultAboutSection,
            ...(data.aboutSection || {}),
          },
        });
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData || []);
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

  const handleChange = (field: keyof SiteInfo, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Banner slides management helpers
  const handleSlideChange = (index: number, field: keyof BannerSlide, value: string) => {
    const updatedSlides = [...(formData.bannerSlides || [])];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setFormData((prev) => ({ ...prev, bannerSlides: updatedSlides }));
  };

  const addSlide = () => {
    const newSlide: BannerSlide = {
      id: `slide-${Date.now()}`,
      title: "TIÊU ĐỀ SLIDE MỚI",
      subtitle: "Mô tả ngắn gọn cho slide banner mới",
      image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
    };
    setFormData((prev) => ({
      ...prev,
      bannerSlides: [...(prev.bannerSlides || []), newSlide],
    }));
  };

  const removeSlide = (index: number) => {
    if ((formData.bannerSlides || []).length <= 1) {
      alert("Cần giữ lại ít nhất 1 slide banner!");
      return;
    }
    const updatedSlides = (formData.bannerSlides || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, bannerSlides: updatedSlides }));
  };

  // About Section management helpers
  const handleAboutChange = (field: keyof AboutSectionConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...(prev.aboutSection || defaultAboutSection),
        [field]: value,
      },
    }));
  };

  const handleHighlightChange = (index: number, field: keyof AboutHighlight, value: string) => {
    const currentAbout = formData.aboutSection || defaultAboutSection;
    const updatedHighlights = [...(currentAbout.highlights || [])];
    updatedHighlights[index] = { ...updatedHighlights[index], [field]: value };
    handleAboutChange("highlights", updatedHighlights);
  };

  const handleStatChange = (index: number, field: keyof AboutStat, value: string) => {
    const currentAbout = formData.aboutSection || defaultAboutSection;
    const updatedStats = [...(currentAbout.stats || [])];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    handleAboutChange("stats", updatedStats);
  };

  const toggleSampleCategory = (catId: string) => {
    const currentAbout = formData.aboutSection || defaultAboutSection;
    const currentIds = currentAbout.sampleCategoryIds || [];
    let newIds: string[];
    if (currentIds.includes(catId)) {
      newIds = currentIds.filter((id) => id !== catId);
    } else {
      newIds = [...currentIds, catId];
    }
    handleAboutChange("sampleCategoryIds", newIds);
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

  const aboutConfig = formData.aboutSection || defaultAboutSection;

  const tabs = [
    {
      id: "brand",
      label: "Thương Hiệu & SEO",
      icon: Building2,
    },
    {
      id: "about",
      label: "Trang Giới Thiệu",
      icon: Sparkles,
    },
    {
      id: "banners",
      label: "Banner Trang Chủ",
      icon: Sliders,
      badge: `${(formData.bannerSlides || []).length}`,
    },
    {
      id: "contact",
      label: "Liên Hệ & Địa Chỉ",
      icon: Phone,
    },
    {
      id: "social",
      label: "Mạng Xã Hội",
      icon: Share2,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
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

      {/* Header & Save Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-7 h-7 text-[#c8102e]" />
            Cấu Hình Thông Tin Website
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý thông tin thương hiệu, hình ảnh, banner, giới thiệu và thông tin liên hệ.
          </p>
        </div>
        <button
          type="submit"
          form="site-info-form"
          disabled={saving}
          className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 justify-center disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu Thay Đổi</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none flex-1 justify-center ${
                isActive
                  ? "bg-[#c8102e] text-white shadow-md font-extrabold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-red-50 text-[#c8102e] border border-red-100"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <form id="site-info-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Thương Hiệu & SEO */}
        <div className={activeTab === "brand" ? "space-y-6" : "hidden"}>
          {/* Brand Info */}
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
                  value={formData.logoText}
                  onChange={(e) => handleChange("logoText", e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Favicon, Social Share Image (OpenGraph) & Primary Color */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3 border-gray-100">
              <ImageIcon className="w-5 h-5 text-[#c8102e]" />
              <h3>Favicon, Hình Ảnh Chia Sẻ & Màu Sắc Chủ Đạo</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadInput
                label="Favicon Icon (.ico, .png, .svg)"
                value={formData.faviconUrl || ""}
                onChange={(url) => handleChange("faviconUrl", url)}
                placeholder="/favicon.ico hoặc dán link / chọn file từ máy..."
                previewAspect="square"
              />

              <ImageUploadInput
                label="Hình ảnh chia sẻ Link (OpenGraph Share Image 1200x630)"
                value={formData.ogImageUrl || ""}
                onChange={(url) => handleChange("ogImageUrl", url)}
                placeholder="Dán link hoặc chọn file từ máy..."
                previewAspect="og"
              />
            </div>

            {/* Primary Color Picker */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#c8102e]" />
                <label className="block text-xs font-bold text-gray-700">
                  Màu sắc chủ đạo Website (Primary Theme Color)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor || "#c8102e"}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={formData.primaryColor || "#c8102e"}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  placeholder="#c8102e"
                  className="w-32 px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-[#c8102e] outline-none"
                />
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[
                    { name: "Đỏ Đô Trung Tín (Mặc định)", hex: "#c8102e" },
                    { name: "Đỏ Tươi", hex: "#dc2626" },
                    { name: "Xanh Dương", hex: "#0284c7" },
                    { name: "Xanh Lá", hex: "#16a34a" },
                    { name: "Cam", hex: "#ea580c" },
                    { name: "Tím", hex: "#7e22ce" },
                  ].map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => handleChange("primaryColor", preset.hex)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        (formData.primaryColor || "#c8102e").toLowerCase() === preset.hex.toLowerCase()
                          ? "ring-2 ring-offset-1 ring-gray-800 scale-110"
                          : "hover:scale-105 opacity-90 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-gray-500">
                Màu chủ đạo mặc định là đỏ thương hiệu (<span className="font-mono text-[#c8102e] font-bold">#c8102e</span>). Chọn mã màu hex hoặc click các nút màu gợi ý ở trên.
              </p>
            </div>
          </div>

          {/* Legal & Copyright */}
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
        </div>

        {/* Tab 2: Trang Giới Thiệu */}
        <div className={activeTab === "about" ? "space-y-6" : "hidden"}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                <Sparkles className="w-5 h-5 text-[#c8102e]" />
                <h3>Cấu Hình Phần Giới Thiệu (About Section)</h3>
              </div>
              <span className="text-xs bg-red-50 text-[#c8102e] font-bold px-2.5 py-1 rounded-full border border-red-100">
                Trang chủ
              </span>
            </div>

            {/* Badge & Main Titles */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Huy hiệu Badge (Phía trên tiêu đề)
                </label>
                <input
                  type="text"
                  value={aboutConfig.badgeText}
                  onChange={(e) => handleAboutChange("badgeText", e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-[#c8102e] outline-none"
                  placeholder="Ví dụ: Xưởng Sản Xuất Trực Tiếp - Trung Tín"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tiêu đề chính (Chữ thường)
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.title}
                    onChange={(e) => handleAboutChange("title", e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-[#c8102e] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Đoạn tiêu đề nổi bật (Màu đỏ)
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.titleHighlight}
                    onChange={(e) => handleAboutChange("titleHighlight", e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-bold text-[#c8102e] focus:ring-2 focus:ring-[#c8102e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Đoạn văn mô tả 1
                </label>
                <textarea
                  rows={3}
                  value={aboutConfig.description1}
                  onChange={(e) => handleAboutChange("description1", e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#c8102e] outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Đoạn văn mô tả 2
                </label>
                <textarea
                  rows={2}
                  value={aboutConfig.description2}
                  onChange={(e) => handleAboutChange("description2", e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#c8102e] outline-none resize-y"
                />
              </div>
            </div>

            {/* Category Picker for Catalog Sample Grid Cards */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#c8102e]" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Chọn Danh Mục Hiển Thị Ở Catalog Sample Cards
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-[#c8102e]">
                  Đã chọn: {(aboutConfig.sampleCategoryIds || []).length} danh mục
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Tick chọn các danh mục đã có trong hệ thống để tự động hiển thị ảnh, tên và đường dẫn lên thẻ Catalog Sample Cards ở bên phải About Section.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 pt-2">
                {categories.map((cat) => {
                  const isSelected = (aboutConfig.sampleCategoryIds || []).includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleSampleCategory(cat.id)}
                      className={`cursor-pointer p-2.5 rounded-xl border flex items-center gap-2.5 transition-all select-none ${
                        isSelected
                          ? "bg-red-50/80 border-[#c8102e] shadow-sm"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#c8102e] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <img
                        src={cat.image || "/products/catalog/tt-01.jpg"}
                        alt={cat.name}
                        className="w-8 h-8 object-contain rounded shrink-0 bg-gray-100 p-0.5 border"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-gray-800 block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate">
                          Mã ID: {cat.id}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Category Highlights (4 Items) */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
                4 Điểm Nổi Bật Sản Phẩm
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(aboutConfig.highlights || []).map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2"
                  >
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      Mục {idx + 1}
                    </span>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Tiêu đề ngắn
                      </label>
                      <input
                        type="text"
                        value={hl.title}
                        onChange={(e) => handleHighlightChange(idx, "title", e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Mô tả phụ
                      </label>
                      <input
                        type="text"
                        value={hl.subtitle}
                        onChange={(e) => handleHighlightChange(idx, "subtitle", e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons Links */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
                Nút Bấm Hành Động (CTA Buttons)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold text-[#c8102e] uppercase">
                    Nút bấm chính (Màu đỏ)
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Tên nút
                    </label>
                    <input
                      type="text"
                      value={aboutConfig.primaryButtonText}
                      onChange={(e) => handleAboutChange("primaryButtonText", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Đường dẫn
                    </label>
                    <input
                      type="text"
                      value={aboutConfig.primaryButtonLink}
                      onChange={(e) => handleAboutChange("primaryButtonLink", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold text-gray-700 uppercase">
                    Nút bấm phụ (Viền đỏ)
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Tên nút
                    </label>
                    <input
                      type="text"
                      value={aboutConfig.secondaryButtonText}
                      onChange={(e) => handleAboutChange("secondaryButtonText", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Đường dẫn
                    </label>
                    <input
                      type="text"
                      value={aboutConfig.secondaryButtonLink}
                      onChange={(e) => handleAboutChange("secondaryButtonLink", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Banner Card & Stats */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 border-b pb-2">
                <BarChart2 className="w-4 h-4 text-[#c8102e]" />
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Khung Thống Kê Bên Phải (Feature Card & 4 Stats)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tiêu đề Khung
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.cardTitle}
                    onChange={(e) => handleAboutChange("cardTitle", e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mô tả phụ Khung
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.cardSubtitle}
                    onChange={(e) => handleAboutChange("cardSubtitle", e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {(aboutConfig.stats || []).map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2"
                  >
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      Thông số {idx + 1}
                    </span>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                        Con số
                      </label>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                        className="w-full px-2.5 py-1 border border-gray-300 rounded-lg text-xs font-black text-[#c8102e] bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                        Nhãn mô tả
                      </label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                        className="w-full px-2.5 py-1 border border-gray-300 rounded-lg text-[11px] bg-white outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab 3: Banner Slideshow */}
        <div className={activeTab === "banners" ? "space-y-6" : "hidden"}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                <Sliders className="w-5 h-5 text-[#c8102e]" />
                <h3>Quản Lý Banner Slideshow (Trang Chủ)</h3>
              </div>
              <button
                type="button"
                onClick={addSlide}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Slide Banner</span>
              </button>
            </div>

            <div className="space-y-6">
              {(formData.bannerSlides || []).map((slide, index) => (
                <div
                  key={slide.id || index}
                  className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#c8102e] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-md border border-red-200">
                      Slide {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSlide(index)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                      title="Xóa slide này"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa slide</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Tiêu đề lớn Slide
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleSlideChange(index, "title", e.target.value)}
                          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-[#c8102e] outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Tiêu đề phụ (Mô tả ngắn)
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => handleSlideChange(index, "subtitle", e.target.value)}
                          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#c8102e] outline-none bg-white"
                        />
                      </div>
                    </div>

                    <ImageUploadInput
                      label="Hình ảnh Banner (Dán link hoặc tải file từ máy tính)"
                      value={slide.image}
                      onChange={(url) => handleSlideChange(index, "image", url)}
                      previewAspect="video"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab 4: Liên Hệ & Địa Chỉ */}
        <div className={activeTab === "contact" ? "space-y-6" : "hidden"}>
          {/* Contact Info */}
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
                  value={formData.zaloNumber}
                  onChange={(e) => handleChange("zaloNumber", e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Addresses */}
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
                  value={formData.factoryAddress}
                  onChange={(e) => handleChange("factoryAddress", e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c8102e] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab 5: Mạng Xã Hội */}
        <div className={activeTab === "social" ? "space-y-6" : "hidden"}>
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
        </div>

        {/* Bottom Save button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
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
