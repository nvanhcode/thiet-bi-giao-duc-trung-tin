"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Article, ArticleCategory } from "@/types/article";
import ImageUploadInput from "@/components/ImageUploadInput";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Newspaper,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function CreateArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<Article>({
    id: `art-${Date.now()}`,
    title: "",
    slug: "",
    excerpt: "",
    content: "<h3>1. Giới thiệu tổng quan</h3><p>Nhập nội dung bài viết chi tiết tại đây...</p>",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop",
    categoryId: "tu-van-san-pham",
    categoryName: "Tư vấn sản phẩm",
    author: "Ban biên tập",
    createdAt: today,
    views: 0,
    featured: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/article-categories");
      if (res.ok) {
        const data: ArticleCategory[] = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: data[0].id,
            categoryName: data[0].name,
          }));
        }
      }
    } catch (err) {
      showToast("Lỗi tải danh mục bài viết", "error");
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết!");
      return;
    }

    setSaving(true);
    try {
      // Get existing articles
      const resGet = await fetch("/api/admin/articles");
      const existingArticles: Article[] = resGet.ok ? await resGet.json() : [];

      const catObj = categories.find((c) => c.id === formData.categoryId);
      const finalCategoryName = catObj ? catObj.name : formData.categoryName;
      const finalSlug = formData.slug || generateSlug(formData.title);

      const newArticle: Article = {
        ...formData,
        slug: finalSlug,
        categoryName: finalCategoryName,
      };

      const updatedList = [newArticle, ...existingArticles];

      const resPost = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (resPost.ok) {
        showToast("Tạo mới bài viết thành công!", "success");
        setTimeout(() => router.push("/admin/articles"), 800);
      } else {
        showToast("Lỗi tạo bài viết!", "error");
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
            href="/admin/articles"
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-gray-900">Thêm Bài Viết Mới</h2>
            <p className="text-xs text-gray-500">
              Nhập thông tin cơ bản, chọn danh mục và soạn thảo nội dung với WYSIWYG Rich Text Editor
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Đăng Bài Viết</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Article Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-base border-b pb-3 border-gray-100">
            <Newspaper className="w-5 h-5 text-[#c8102e]" />
            <h3>Thông Tin Cơ Bản Bài Viết</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Tiêu đề bài viết <span className="text-red-500">*</span>
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
                    slug: generateSlug(title),
                  }));
                }}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="Nhập tiêu đề bài viết..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Danh mục bài viết <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => {
                  const catId = e.target.value;
                  const catObj = categories.find((c) => c.id === catId);
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: catId,
                    categoryName: catObj ? catObj.name : "",
                  }));
                }}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-[#c8102e]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    📁 {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">URL Slug (Chuẩn SEO)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-mono outline-none bg-gray-50 focus:ring-2 focus:ring-[#c8102e]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Tác giả / Nguồn phát hành</label>
              <input
                type="text"
                value={formData.author || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="VD: Ban biên tập, Kỹ sư Nam..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Ngày xuất bản</label>
              <input
                type="date"
                value={formData.createdAt}
                onChange={(e) => setFormData((prev) => ({ ...prev, createdAt: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
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
                <span>Đánh dấu bài viết NỔI BẬT trên trang chủ</span>
              </span>
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <ImageUploadInput
            label="Hình ảnh đại diện bài viết (Tự động nén WebP)"
            value={formData.image}
            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
            previewAspect="video"
          />
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-2">
          <label className="block font-bold text-gray-800 text-xs">Mô tả tóm tắt (Excerpt)</label>
          <textarea
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            className="w-full p-3.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
            placeholder="Nhập 1-2 câu tóm tắt nội dung để hiển thị trên danh sách bài viết..."
          />
        </div>

        {/* WYSIWYG Rich Text Editor */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <RichTextEditor
            label="Nội Dung Chi Tiết Bài Viết (WYSIWYG Rich Text Editor)"
            value={formData.content}
            onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
            placeholder="Soạn thảo nội dung bài viết tại đây..."
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
            <span>Đăng Bài Viết Mới</span>
          </button>
        </div>
      </form>
    </div>
  );
}
