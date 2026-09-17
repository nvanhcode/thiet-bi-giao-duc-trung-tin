"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types/category";
import ImageUploadInput from "@/components/ImageUploadInput";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  CornerDownRight,
  FolderPlus,
  Trees,
  Armchair,
  Ship,
  Boxes,
  FileCheck2,
  Castle,
  Sparkles,
  Folder,
  Puzzle,
  Shapes,
  Heart,
  Star,
  Tag,
  Grid,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Trees,
  Armchair,
  Ship,
  Boxes,
  FileCheck2,
  Castle,
  Sparkles,
  Folder,
  Puzzle,
  Shapes,
  Heart,
  Star,
  Tag,
  Grid,
};

const ICON_OPTIONS = [
  { key: "Trees", label: "Cây / Ngoài trời", Icon: Trees },
  { key: "Armchair", label: "Ghế / Nội thất", Icon: Armchair },
  { key: "Ship", label: "Tàu / Nhập khẩu", Icon: Ship },
  { key: "Boxes", label: "Hộp / Đồ chơi gỗ", Icon: Boxes },
  { key: "FileCheck2", label: "Hồ sơ / Thông tư 02", Icon: FileCheck2 },
  { key: "Castle", label: "Lâu đài / Vui chơi", Icon: Castle },
  { key: "Sparkles", label: "Nổi bật / Mới", Icon: Sparkles },
  { key: "Folder", label: "Thư mục / Mặc định", Icon: Folder },
  { key: "Puzzle", label: "Xếp hình", Icon: Puzzle },
  { key: "Shapes", label: "Hình khối", Icon: Shapes },
  { key: "Heart", label: "Mẹ & bé", Icon: Heart },
  { key: "Star", label: "Sản phẩm VIP", Icon: Star },
  { key: "Tag", label: "Khuyến mãi", Icon: Tag },
  { key: "Grid", label: "Tổng hợp", Icon: Grid },
];

const COLOR_OPTIONS = [
  { key: "bg-red-50 text-[#c8102e]", name: "Đỏ" },
  { key: "bg-orange-50 text-orange-600", name: "Cam" },
  { key: "bg-blue-50 text-blue-600", name: "Xanh Dương" },
  { key: "bg-amber-50 text-amber-700", name: "Vàng Gỗ" },
  { key: "bg-emerald-50 text-emerald-600", name: "Xanh Lá" },
  { key: "bg-purple-50 text-purple-600", name: "Tím" },
  { key: "bg-pink-50 text-pink-600", name: "Hồng" },
  { key: "bg-teal-50 text-teal-600", name: "Xanh Ngọc" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      showToast("Lỗi tải danh sách danh mục!", "error");
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

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory({ ...cat });
    } else {
      setEditingCategory({
        id: `cat-${Date.now()}`,
        name: "",
        slug: "",
        description: "",
        parentId: null,
        displayOrder: categories.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    const currentSlug = editingCategory.slug || generateSlug(editingCategory.name);
    const updatedCat = { ...editingCategory, slug: currentSlug };

    const existsIndex = categories.findIndex((c) => c.id === updatedCat.id);
    let updatedList = [...categories];

    if (existsIndex >= 0) {
      updatedList[existsIndex] = updatedCat;
    } else {
      updatedList.push(updatedCat);
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setCategories(updatedList);
        setIsModalOpen(false);
        showToast("Lưu danh mục thành công!", "success");
      } else {
        showToast("Lỗi lưu danh mục!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server!", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này? Các danh mục con có thể bị ảnh hưởng.")) return;

    const updatedList = categories.filter((c) => c.id !== id && c.parentId !== id);

    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
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
      showToast("Lỗi kết nối server!", "error");
    } finally {
      setSaving(false);
    }
  };

  // Hierarchy building
  const rootCategories = categories.filter((c) => !c.parentId);
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#c8102e]" />
        <span>Đang tải danh sách danh mục...</span>
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

      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Quản Lý Danh Mục Sản Phẩm Đa Cấp</h2>
            <p className="text-xs text-gray-500">Tạo danh mục cha/con, slug SEO và mô tả danh mục</p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Category Hierarchy List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase tracking-wider grid grid-cols-12 gap-4">
          <div className="col-span-5">Tên Danh Mục & Slug</div>
          <div className="col-span-4">Mô Tả / Ảnh Banner</div>
          <div className="col-span-3 text-right">Thao Tác</div>
        </div>

        <div className="divide-y divide-gray-100">
          {rootCategories.map((root) => {
            const subs = getSubcategories(root.id);
            const RootIconComponent = ICON_MAP[root.icon || ""] || Folder;
            const rootColorClass = root.color || "bg-red-50 text-[#c8102e]";
            return (
              <React.Fragment key={root.id}>
                {/* Root Category Row */}
                <div className="p-4 hover:bg-amber-50/30 transition-colors grid grid-cols-12 gap-4 items-center bg-white font-semibold text-sm">
                  <div className="col-span-5 flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full ${rootColorClass} flex items-center justify-center shrink-0`}>
                      <RootIconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-gray-900">{root.name}</div>
                      <div className="text-[11px] font-mono text-gray-400">/{root.slug}</div>
                    </div>
                  </div>

                  <div className="col-span-4 text-xs text-gray-600 line-clamp-1">
                    {root.description || "Chưa có mô tả"}
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory({
                          id: `cat-${Date.now()}`,
                          name: "",
                          slug: "",
                          description: "",
                          parentId: root.id,
                          displayOrder: subs.length + 1,
                        });
                        setIsModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-xs font-bold transition-colors flex items-center gap-1"
                      title="Thêm danh mục con"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>+ Con</span>
                    </button>
                    <button
                      onClick={() => handleOpenModal(root)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Sửa danh mục"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(root.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Xóa danh mục"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories Rows */}
                {subs.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 pl-10 hover:bg-gray-50 transition-colors grid grid-cols-12 gap-4 items-center bg-gray-50/40 text-xs border-t border-gray-100"
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <CornerDownRight className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <div className="font-bold text-gray-800">{sub.name}</div>
                        <div className="text-[10px] font-mono text-gray-400">/{sub.slug}</div>
                      </div>
                    </div>

                    <div className="col-span-4 text-gray-500 line-clamp-1">
                      {sub.description || "Chưa có mô tả"}
                    </div>

                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(sub)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-gray-800 border-b pb-3 border-gray-100 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-[#c8102e]" />
              <span>{categories.some((c) => c.id === editingCategory.id) ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}</span>
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
                  className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-[#c8102e] outline-none text-sm font-semibold"
                  placeholder="Nhập tên danh mục..."
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Slug chuẩn SEO
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#c8102e] outline-none bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Danh mục cha
                </label>
                <select
                  value={editingCategory.parentId || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, parentId: e.target.value || null })}
                  className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-[#c8102e] outline-none bg-white text-xs font-medium"
                >
                  <option value="">-- Là danh mục gốc (Root) --</option>
                  {rootCategories
                    .filter((c) => c.id !== editingCategory.id)
                    .map((root) => (
                      <option key={root.id} value={root.id}>
                        📁 {root.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Icon Selector (Useful for Hero Sidebar & Navigation) */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Biểu tượng Icon (Hiển thị trang chủ Sidebar Hero)
                </label>
                <div className="grid grid-cols-7 gap-1.5 p-2 border rounded-lg bg-gray-50 max-h-28 overflow-y-auto">
                  {ICON_OPTIONS.map((item) => {
                    const ItemIcon = item.Icon;
                    const isSelected = editingCategory.icon === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, icon: item.key })}
                        className={`p-2 rounded flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[#c8102e] text-white shadow font-bold scale-105"
                            : "bg-white text-gray-600 hover:bg-gray-200 border border-gray-200"
                        }`}
                        title={item.label}
                      >
                        <ItemIcon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selector (For Icon Badge) */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tông màu đại diện Icon
                </label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-gray-50">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = (editingCategory.color || "bg-red-50 text-[#c8102e]") === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, color: c.key })}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 border ${c.key} ${
                          isSelected ? "ring-2 ring-[#c8102e] ring-offset-1 scale-105 font-extrabold" : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Mô tả danh mục
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-[#c8102e] outline-none resize-none"
                  placeholder="Nhập mô tả giới thiệu về danh mục..."
                />
              </div>

              {/* Banner Image Upload */}
              <ImageUploadInput
                label="Hình ảnh banner đại diện cho danh mục"
                value={editingCategory.image || ""}
                onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                previewAspect="video"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-100 text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveModal}
                className="px-6 py-2 bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
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
