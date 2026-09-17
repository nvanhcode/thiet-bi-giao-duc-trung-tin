"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { FilterOptionsData, defaultFilterOptions } from "@/types/filter";
import ImageUploadInput from "@/components/ImageUploadInput";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Package,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  X,
  Tag,
  Layers,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsData>(defaultFilterOptions);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Product>({
    id: `prod-${Date.now()}`,
    name: "",
    slug: "",
    code: `TP-${Math.floor(100 + Math.random() * 900)}`,
    categoryIds: [],
    price: null,
    oldPrice: null,
    discount: null,
    thumbnail: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=800&auto=format&fit=crop"],
    summary: "",
    description: "<h3>Đặc điểm nổi bật:</h3><ul><li>Chất liệu nhựa cao cấp, bền màu.</li><li>Khung sắt sơn tĩnh điện chống gỉ sét.</li></ul>",
    specifications: [
      { key: "Kích thước", value: "" },
      { key: "Chất liệu", value: "Nhựa LLDPE nhập khẩu, Khung sắt sơn tĩnh điện" },
      { key: "Xuất xứ", value: "Sản xuất trực tiếp tại xưởng Trung Tín" },
      { key: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    inStock: true,
    isHot: false,
    blockCount: "",
    investmentLevel: "",
    origin: "Sản xuất trực tiếp",
    slideType: "",
    feature: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catRes, filterRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/filters"),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (filterRes.ok) setFilterOptions(await filterRes.json());
    } catch (err) {
      showToast("Lỗi tải dữ liệu ban đầu", "error");
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

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Specs helper
  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { key: "", value: "" }],
    }));
  };

  const updateSpec = (index: number, key: string, value: string) => {
    const updated = [...(formData.specifications || [])];
    updated[index] = { key, value };
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const removeSpec = (index: number) => {
    const updated = (formData.specifications || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm!");
      return;
    }

    setSaving(true);
    try {
      // Fetch existing products
      const resGet = await fetch("/api/admin/products");
      const existingProducts: Product[] = resGet.ok ? await resGet.json() : [];

      const currentSlug = formData.slug || generateSlug(formData.name);
      const newProd = { ...formData, slug: currentSlug };

      const updatedList = [newProd, ...existingProducts];

      const resPost = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (resPost.ok) {
        showToast("Tạo mới sản phẩm thành công!", "success");
        setTimeout(() => router.push("/admin/products"), 1000);
      } else {
        showToast("Lỗi tạo sản phẩm!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server!", "error");
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
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Thêm Sản Phẩm Mới</h2>
            <p className="text-xs text-gray-500">
              Nhập chi tiết sản phẩm, soạn thảo bài viết Rich Text và đánh nhãn thuộc tính bộ lọc
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Tạo Sản Phẩm Mới</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-base border-b pb-3 border-gray-100">
            <Package className="w-5 h-5 text-[#c8102e]" />
            <h3>Thông Tin Cơ Bản Sản Phẩm</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name,
                    slug: generateSlug(name),
                  }));
                }}
                className="w-full px-3.5 py-2.5 border rounded-lg text-sm font-extrabold outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="Nhập tên sản phẩm..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Mã sản phẩm (Mã SP)</label>
              <input
                type="text"
                value={formData.code || ""}
                onChange={(e) => handleChange("code", e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="VD: TP1-129"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Slug SEO</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-xs font-mono outline-none bg-gray-50 focus:ring-2 focus:ring-[#c8102e]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Giá cũ (đ)</label>
              <input
                type="number"
                value={formData.oldPrice || ""}
                onChange={(e) => handleChange("oldPrice", Number(e.target.value) || null)}
                className="w-full px-3.5 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="Bỏ trống nếu không niêm yết giá cũ"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Giá bán chính thức (đ)</label>
              <input
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleChange("price", Number(e.target.value) || null)}
                className="w-full px-3.5 py-2 border rounded-lg text-xs font-extrabold text-[#c8102e] outline-none focus:ring-2 focus:ring-[#c8102e]"
                placeholder="Bỏ trống = Giá: Liên hệ"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Categories */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-base border-b pb-3 border-gray-100">
            <Layers className="w-5 h-5 text-[#c8102e]" />
            <h3>Danh Mục Sản Phẩm</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto border p-4 rounded-xl bg-gray-50">
            {categories.map((cat) => {
              const isChecked = (formData.categoryIds || []).includes(cat.id);
              return (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...(formData.categoryIds || []), cat.id]
                        : (formData.categoryIds || []).filter((id) => id !== cat.id);
                      handleChange("categoryIds", updated);
                    }}
                    className="rounded text-[#c8102e] focus:ring-[#c8102e]"
                  />
                  <span className={cat.parentId ? "pl-2 text-gray-600 font-medium" : "font-extrabold text-gray-900"}>
                    {cat.parentId ? "↳ " : "📁 "}{cat.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 3: Filter Attribute Tagging (Dynamic from filters.json!) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-base border-b pb-3 border-gray-100">
            <Tag className="w-5 h-5 text-amber-600" />
            <h3>Đánh Nhãn Thuộc Tính Bộ Lọc</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Số khối</label>
              <select
                value={formData.blockCount || ""}
                onChange={(e) => handleChange("blockCount", e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#c8102e] outline-none"
              >
                <option value="">-- Chọn số khối --</option>
                {(filterOptions.blockCount || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Mức đầu tư</label>
              <select
                value={formData.investmentLevel || ""}
                onChange={(e) => handleChange("investmentLevel", e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#c8102e] outline-none"
              >
                <option value="">-- Chọn mức đầu tư --</option>
                {(filterOptions.investmentLevel || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Nguồn gốc</label>
              <select
                value={formData.origin || ""}
                onChange={(e) => handleChange("origin", e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#c8102e] outline-none"
              >
                <option value="">-- Chọn nguồn gốc --</option>
                {(filterOptions.origin || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Kiểu máng trượt</label>
              <select
                value={formData.slideType || ""}
                onChange={(e) => handleChange("slideType", e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#c8102e] outline-none"
              >
                <option value="">-- Chọn kiểu máng trượt --</option>
                {(filterOptions.slideType || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Tính năng tích hợp</label>
              <select
                value={formData.feature || ""}
                onChange={(e) => handleChange("feature", e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#c8102e] outline-none"
              >
                <option value="">-- Chọn tính năng tích hợp --</option>
                {(filterOptions.feature || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Image Upload */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <ImageUploadInput
            label="Hình ảnh đại diện Thumbnail (Tự nén WebP)"
            value={formData.thumbnail}
            onChange={(url) => {
              handleChange("thumbnail", url);
              if (!formData.images || formData.images.length === 0) {
                handleChange("images", [url]);
              }
            }}
            previewAspect="video"
          />
        </div>

        {/* Section 5: Specifications Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-gray-100">
            <h3 className="font-bold text-gray-800 text-base">Thông Số Kỹ Thuật Chi Tiết</h3>
            <button
              type="button"
              onClick={addSpec}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Thêm thông số mới</span>
            </button>
          </div>

          <div className="space-y-2">
            {(formData.specifications || []).map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Tên thông số (Kích thước, Chất liệu...)"
                  value={spec.key}
                  onChange={(e) => updateSpec(index, e.target.value, spec.value)}
                  className="w-1/3 px-3.5 py-2 border rounded-lg text-xs font-bold bg-gray-50 outline-none"
                />
                <input
                  type="text"
                  placeholder="Giá trị thông số..."
                  value={spec.value}
                  onChange={(e) => updateSpec(index, spec.key, e.target.value)}
                  className="flex-1 px-3.5 py-2 border rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-[#c8102e]"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="text-gray-400 hover:text-red-600 p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: WYSIWYG Rich Text Editor */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <RichTextEditor
            label="Mô Tả Bài Viết Chi Tiết (WYSIWYG Rich Text Editor)"
            value={formData.description || ""}
            onChange={(html) => handleChange("description", html)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 uppercase"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Tạo Sản Phẩm Mới</span>
          </button>
        </div>
      </form>
    </div>
  );
}
