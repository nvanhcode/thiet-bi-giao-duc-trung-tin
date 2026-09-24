"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Project } from "@/types/project";
import ImageUploadInput from "@/components/ImageUploadInput";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Building2,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Images,
  Plus,
  Trash2,
  MapPin,
  Ruler,
  UserCheck,
  Calendar,
} from "lucide-react";

interface ProjectFormProps {
  initialData?: Project;
  isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<Project>(
    initialData || {
      id: `project-${Date.now()}`,
      title: "",
      slug: "",
      tag: "Khu đô thị | Hà Nội",
      address: "",
      scale: "",
      client: "",
      completionYear: new Date().getFullYear().toString(),
      excerpt: "",
      description: "<h3>1. Tổng quan công trình</h3><p>Giới thiệu chi tiết quá trình thi công và nghiệm thu công trình...</p>",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1000&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1000&auto=format&fit=crop",
      ],
      featured: true,
      createdAt: today,
    }
  );

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  // Gallery handlers
  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    if (formData.images.includes(url.trim())) {
      alert("Hình ảnh này đã có trong danh sách!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url.trim()],
    }));
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tên công trình!");
      return;
    }

    if (!formData.address.trim()) {
      alert("Vui lòng nhập địa chỉ công trình!");
      return;
    }

    setSaving(true);
    try {
      // Get existing projects
      const resGet = await fetch("/api/admin/projects");
      const existingProjects: Project[] = resGet.ok ? await resGet.json() : [];

      const finalSlug = formData.slug || generateSlug(formData.title);
      const updatedProject: Project = {
        ...formData,
        slug: finalSlug,
        updatedAt: today,
      };

      let updatedList: Project[];
      if (isEdit) {
        updatedList = existingProjects.map((p) => (p.id === formData.id ? updatedProject : p));
      } else {
        updatedList = [updatedProject, ...existingProjects];
      }

      const resPost = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (resPost.ok) {
        showToast(isEdit ? "Cập nhật công trình thành công!" : "Tạo công trình mới thành công!", "success");
        setTimeout(() => {
          window.location.href = "/admin/projects";
        }, 800);
      } else {
        showToast("Lỗi lưu dữ liệu công trình!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ!", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
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

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {isEdit ? "Chỉnh Sửa Công Trình Tiêu Biểu" : "Thêm Công Trình Tiêu Biểu Mới"}
            </h2>
            <p className="text-xs text-gray-500">
              Quản lý danh sách hình ảnh minh hoạ, thông tin công trình (địa chỉ, quy mô, chủ đầu tư) & bài viết mô tả
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEdit ? "Lưu Thay Đổi" : "Đăng Công Trình"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Project Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-base border-b pb-3 border-gray-100">
            <Building2 className="w-5 h-5 text-[#c8102e]" />
            <h3>Thông Tin Công Trình</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Tên công trình <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    slug: isEdit ? prev.slug : generateSlug(title),
                  }));
                }}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="VD: Công trình thi công lắp đặt sân chơi trẻ em ngoài trời..."
              />
            </div>

            {/* Tag / Category */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Phân loại / Thẻ tag công trình <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tag}
                onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="VD: Khu tập thể | Hải Dương, Khu đô thị, Resort..."
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">URL Slug (Chuẩn SEO)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-mono outline-none bg-gray-50 focus:ring-2 focus:ring-[#c8102e]"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Địa chỉ công trình</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="VD: Phường Lê Thanh Nghị, Thành phố Hải Dương..."
              />
            </div>

            {/* Scale */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-indigo-500" />
                <span>Quy mô công trình</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.scale}
                onChange={(e) => setFormData((prev) => ({ ...prev, scale: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="VD: 500m² - 12 Thiết bị ngoài trời & Thảm cao su EPDM..."
              />
            </div>

            {/* Client / Owner */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Chủ đầu tư / Khách hàng</span>
              </label>
              <input
                type="text"
                value={formData.client || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="VD: Ban quản lý khu dân cư / Tập đoàn..."
              />
            </div>

            {/* Completion Year */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Năm hoàn thành</span>
              </label>
              <input
                type="text"
                value={formData.completionYear || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, completionYear: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="VD: 2024"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 text-xs">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-[#c8102e] focus:ring-[#c8102e] rounded"
              />
              <span className="flex items-center gap-1 text-[#c8102e]">
                <Sparkles className="w-4 h-4" />
                <span>Đánh dấu công trình NỔI BẬT hiển thị trên trang chủ</span>
              </span>
            </label>
          </div>
        </div>

        {/* Main Image Thumbnail */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <ImageUploadInput
            label="Ảnh đại diện chính công trình (Thumbnail)"
            value={formData.image}
            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
            previewAspect="video"
          />
        </div>

        {/* Gallery Images List (Danh sách hình ảnh minh hoạ) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-800 text-base">
              <Images className="w-5 h-5 text-indigo-600" />
              <h3>Danh Sách Hình Ảnh Minh Hoạ ({formData.images.length})</h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">Tải ảnh hoặc dán URL để thêm vào bộ sưu tập công trình</span>
          </div>

          {/* Add Gallery Image Component */}
          <div className="space-y-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <span className="text-xs font-bold text-indigo-900 block">Thêm ảnh minh hoạ mới</span>
            <ImageUploadInput
              value={newGalleryUrl}
              onChange={(url) => {
                if (url) {
                  handleAddGalleryImage(url);
                }
              }}
              placeholder="Dán URL ảnh hoặc bấm nút bên phải để tải từ máy..."
            />
          </div>

          {/* Gallery Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
            {formData.images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group shadow-sm"
              >
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(idx)}
                  className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity shadow"
                  title="Xóa ảnh minh hoạ này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-2">
          <label className="block font-bold text-gray-800 text-xs">Mô tả tóm tắt (Excerpt)</label>
          <textarea
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            className="w-full p-3.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
            placeholder="Nhập 1-2 câu tóm tắt nổi bật của công trình..."
          />
        </div>

        {/* WYSIWYG Rich Text Description */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <RichTextEditor
            label="Bài Viết Mô Tả Chi Tiết Công Trình (Description / Nội dung bài viết)"
            value={formData.description}
            onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
            placeholder="Soạn thảo nội dung giới thiệu công trình, quy trình thi công, hình ảnh chi tiết..."
          />
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 uppercase"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isEdit ? "Cập Nhật Công Trình" : "Đăng Công Trình Mới"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
