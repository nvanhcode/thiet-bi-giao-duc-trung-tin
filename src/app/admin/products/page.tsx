"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);
      if (prodRes.ok && catRes.ok) {
        setProducts(await prodRes.json());
        setCategories(await catRes.json());
      }
    } catch (err) {
      showToast("Lỗi tải dữ liệu sản phẩm!", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    const updatedList = products.filter((p) => p.id !== id);

    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setProducts(updatedList);
        showToast("Xóa sản phẩm thành công!", "success");
      } else {
        showToast("Lỗi xóa sản phẩm!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server!", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#c8102e]" />
        <span>Đang tải danh sách sản phẩm...</span>
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
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Quản Lý Danh Sách Sản Phẩm</h2>
            <p className="text-xs text-gray-500">
              Quản lý sản phẩm, thông số kỹ thuật, bài viết mô tả chi tiết & thuộc tính bộ lọc
            </p>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs px-5 py-3 rounded-lg flex items-center gap-1.5 shadow transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm hoặc mã SP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#c8102e]"
          />
        </div>
        <span className="text-xs font-semibold text-gray-500">
          Tổng số: <span className="font-bold text-gray-900">{filteredProducts.length}</span> sản phẩm
        </span>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase tracking-wider grid grid-cols-12 gap-4">
          <div className="col-span-1">Hình ảnh</div>
          <div className="col-span-4">Tên Sản Phẩm & Mã SP</div>
          <div className="col-span-2">Giá Bán</div>
          <div className="col-span-3">Thuộc Tính Bộ Lọc</div>
          <div className="col-span-2 text-right">Thao Tác</div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="p-4 hover:bg-gray-50 transition-colors grid grid-cols-12 gap-4 items-center text-xs">
              <div className="col-span-1">
                <div className="w-12 h-12 rounded border bg-gray-100 overflow-hidden">
                  <img src={prod.thumbnail} alt={prod.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="col-span-4 space-y-1">
                <div className="font-bold text-gray-900 line-clamp-1">{prod.name}</div>
                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                  <span>Mã: <strong className="text-red-600">{prod.code || "N/A"}</strong></span>
                  <Link href={`/san-pham/${prod.slug}`} target="_blank" className="text-blue-500 hover:underline flex items-center gap-0.5">
                    <span>/san-pham/{prod.slug}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>

              <div className="col-span-2">
                {prod.price && prod.price > 0 ? (
                  <div>
                    <div className="font-extrabold text-[#c8102e]">{prod.price.toLocaleString("vi-VN")}đ</div>
                    {prod.oldPrice && <div className="text-[10px] text-gray-400 line-through">{prod.oldPrice.toLocaleString("vi-VN")}đ</div>}
                  </div>
                ) : (
                  <span className="font-bold text-gray-600">Giá: Liên hệ</span>
                )}
              </div>

              <div className="col-span-3 flex flex-wrap gap-1">
                {prod.blockCount && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">{prod.blockCount}</span>}
                {prod.investmentLevel && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-semibold">{prod.investmentLevel}</span>}
                {prod.origin && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold">{prod.origin}</span>}
                {prod.slideType && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-semibold">{prod.slideType}</span>}
              </div>

              <div className="col-span-2 flex items-center justify-end gap-2">
                <Link
                  href={`/admin/products/${prod.id}`}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </Link>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Xóa sản phẩm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
