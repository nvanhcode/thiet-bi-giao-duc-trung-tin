"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Article, ArticleCategory } from "@/types/article";
import {
  Newspaper,
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Star,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";

export default function AdminArticlesPage() {
  const [activeTab, setActiveTab] = useState<"articles" | "categories">("articles");

  // Data states
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Search & Filter state for Articles
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Category Modal state (Tab 2)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ArticleCategory | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resArticles, resCategories] = await Promise.all([
        fetch("/api/admin/articles"),
        fetch("/api/admin/article-categories"),
      ]);

      if (resArticles.ok && resCategories.ok) {
        const dataArticles = await resArticles.json();
        const dataCategories = await resCategories.json();
        setArticles(dataArticles);
        setCategories(dataCategories);
      }
    } catch (err) {
      showToast("Lỗi tải dữ liệu bài viết & danh mục!", "error");
    } finally {
      setLoading(false);
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

  // -------------------------------------------------------------
  // ARTICLE HANDLERS
  // -------------------------------------------------------------
  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    const updatedList = articles.filter((a) => a.id !== id);

    setSaving(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setArticles(updatedList);
        showToast("Xóa bài viết thành công!", "success");
      } else {
        showToast("Lỗi xóa bài viết!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ!", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (art: Article) => {
    const updatedArt = { ...art, featured: !art.featured };
    const updatedList = articles.map((a) => (a.id === art.id ? updatedArt : a));

    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setArticles(updatedList);
        showToast(
          updatedArt.featured
            ? "Đã đánh dấu bài viết nổi bật!"
            : "Đã bỏ đánh dấu nổi bật",
          "success"
        );
      }
    } catch (err) {
      showToast("Lỗi cập nhật trạng thái!", "error");
    }
  };

  // -------------------------------------------------------------
  // CATEGORY HANDLERS (TAB 2)
  // -------------------------------------------------------------
  const handleOpenCategoryModal = (cat?: ArticleCategory) => {
    if (cat) {
      setEditingCategory({ ...cat });
    } else {
      setEditingCategory({
        id: `art-cat-${Date.now()}`,
        name: "",
        slug: "",
        description: "",
        displayOrder: categories.length + 1,
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    const finalSlug = editingCategory.slug || generateSlug(editingCategory.name);
    const updatedCat: ArticleCategory = { ...editingCategory, slug: finalSlug };

    const existsIndex = categories.findIndex((c) => c.id === updatedCat.id);
    let updatedList = [...categories];

    if (existsIndex >= 0) {
      updatedList[existsIndex] = updatedCat;
    } else {
      updatedList.push(updatedCat);
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/article-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setCategories(updatedList);
        setIsCategoryModalOpen(false);
        showToast("Lưu danh mục thành công!", "success");
      } else {
        showToast("Lỗi lưu danh mục!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ!", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const articlesCount = articles.filter((a) => a.categoryId === id).length;
    if (articlesCount > 0) {
      if (!confirm(`Danh mục này có ${articlesCount} bài viết. Bạn có chắc chắn muốn xóa?`)) return;
    } else {
      if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    }

    const updatedList = categories.filter((c) => c.id !== id);

    setSaving(true);
    try {
      const res = await fetch("/api/admin/article-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setCategories(updatedList);
        showToast("Xóa danh mục thành công!", "success");
      } else {
        showToast("Lỗi xóa danh mục!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ!", "error");
    } finally {
      setSaving(false);
    }
  };

  // Filtered Articles List
  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategoryFilter === "all" || art.categoryId === selectedCategoryFilter;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#c8102e]" />
        <span>Đang tải danh sách bài viết & danh mục...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Quản Lý Bài Viết & Tư Vấn Sản Phẩm</h2>
            <p className="text-xs text-gray-500">
              Quản lý tin tức, hướng dẫn kỹ thuật, bóc tách khối lượng và danh mục bài viết
            </p>
          </div>
        </div>

        <Link
          href="/tin-tuc"
          target="_blank"
          className="text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-cyan-200"
        >
          <span>Xem trang tin tức công khai</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main 2-Tab Controller */}
      <div className="flex border-b border-gray-200 space-x-2 bg-white p-2 rounded-xl border shadow-sm">
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "articles"
              ? "bg-[#c8102e] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Tab 1: Quản Lý Bài Viết ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-[#c8102e] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Tab 2: Quản Lý Danh Mục Bài Viết ({categories.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: QUẢN LÝ BÀI VIẾT */}
      {/* ========================================================= */}
      {activeTab === "articles" && (
        <div className="space-y-4">
          {/* Action Bar: Search & Category Filter & Add Button */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-xl text-xs font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
              >
                <option value="all">-- Tất cả danh mục ({articles.length}) --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    📁 {c.name} ({articles.filter((a) => a.categoryId === c.id).length})
                  </option>
                ))}
              </select>

              {/* Search Box */}
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Tìm theo tiêu đề bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs font-medium text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Link to create page */}
            <Link
              href="/admin/articles/create"
              className="w-full md:w-auto bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bài Viết Mới</span>
            </Link>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase tracking-wider grid grid-cols-12 gap-4">
              <div className="col-span-5">Bài Viết</div>
              <div className="col-span-3">Danh Mục / Tác Giả</div>
              <div className="col-span-2">Ngày Đăng & Nổi Bật</div>
              <div className="col-span-2 text-right">Thao Tác</div>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs">
                Chưa có bài viết nào phù hợp. Vui lòng bấm "Thêm Bài Viết Mới".
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 hover:bg-gray-50/80 transition-colors grid grid-cols-12 gap-4 items-center text-xs"
                  >
                    {/* Article Image & Title */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <Link
                          href={`/tin-tuc/${art.slug}`}
                          target="_blank"
                          className="font-bold text-gray-900 hover:text-[#c8102e] transition-colors line-clamp-1 flex items-center gap-1"
                        >
                          <span>{art.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 text-gray-400" />
                        </Link>
                        <p className="text-[11px] text-gray-500 line-clamp-1">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Category & Author */}
                    <div className="col-span-3 space-y-1">
                      <span className="inline-block bg-red-50 text-[#c8102e] font-bold px-2.5 py-0.5 rounded text-[11px]">
                        {art.categoryName}
                      </span>
                      <div className="text-gray-500 text-[11px] flex items-center gap-1">
                        <User className="w-3 h-3 text-blue-500" />
                        <span>{art.author || "Ban biên tập"}</span>
                      </div>
                    </div>

                    {/* Date & Featured Toggle */}
                    <div className="col-span-2 space-y-1.5">
                      <div className="text-gray-500 text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{art.createdAt}</span>
                      </div>

                      <button
                        onClick={() => handleToggleFeatured(art)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                          art.featured
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title="Bấm để bật/tắt hiển thị Nổi bật trang chủ"
                      >
                        <Star className={`w-3 h-3 ${art.featured ? "fill-amber-500 text-amber-500" : ""}`} />
                        <span>{art.featured ? "Nổi bật" : "Thường"}</span>
                      </button>
                    </div>

                    {/* Actions: Link to edit page */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/articles/edit/${art.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa bài viết (Trang riêng)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: QUẢN LÝ DANH MỤC BÀI VIẾT */}
      {/* ========================================================= */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          {/* Header & Add Category Button */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Danh Sách Danh Mục Bài Viết</h3>
              <p className="text-xs text-gray-500">Tạo các danh mục như Tin tức, Tư vấn sản phẩm, Tiêu chuẩn kỹ thuật</p>
            </div>

            <button
              onClick={() => handleOpenCategoryModal()}
              className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Danh Mục Mới</span>
            </button>
          </div>

          {/* Category Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase tracking-wider grid grid-cols-12 gap-4">
              <div className="col-span-4">Tên Danh Mục & Slug</div>
              <div className="col-span-4">Mô Tả Chuyên Mục</div>
              <div className="col-span-2 text-center">Số Bài Viết</div>
              <div className="col-span-2 text-right">Thao Tác</div>
            </div>

            {categories.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs">
                Chưa có danh mục bài viết nào. Vui lòng thêm danh mục mới.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {categories.map((cat) => {
                  const count = articles.filter((a) => a.categoryId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-4 hover:bg-gray-50 transition-colors grid grid-cols-12 gap-4 items-center text-xs"
                    >
                      <div className="col-span-4 space-y-1">
                        <div className="font-extrabold text-gray-900 text-sm">{cat.name}</div>
                        <div className="font-mono text-gray-400 text-[11px]">/{cat.slug}</div>
                      </div>

                      <div className="col-span-4 text-gray-600 line-clamp-2">
                        {cat.description || "Chưa có mô tả"}
                      </div>

                      <div className="col-span-2 text-center font-bold text-blue-600">
                        <span className="bg-blue-50 px-3 py-1 rounded-full">{count} bài viết</span>
                      </div>

                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa danh mục"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DANH MỤC BÀI VIẾT (CATEGORY EDIT/ADD MODAL - TAB 2) */}
      {/* ========================================================= */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-200">
            <h3 className="text-base font-extrabold text-gray-900 border-b pb-3 border-gray-100 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-[#c8102e]" />
              <span>
                {categories.some((c) => c.id === editingCategory.id)
                  ? "Chỉnh Sửa Danh Mục Bài Viết"
                  : "Thêm Danh Mục Bài Viết Mới"}
              </span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditingCategory({
                      ...editingCategory,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-[#c8102e] outline-none text-sm font-semibold"
                  placeholder="VD: Tin tức, Tư vấn sản phẩm..."
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#c8102e] outline-none bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô tả danh mục</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-[#c8102e] outline-none text-xs"
                  placeholder="Nhập giới thiệu ngắn về danh mục này..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 border rounded-xl font-bold text-gray-600 hover:bg-gray-100 text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveCategory}
                className="px-6 py-2 bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Lưu danh mục</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
