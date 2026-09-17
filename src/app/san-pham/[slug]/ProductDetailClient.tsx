"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { SiteInfo } from "@/types/site-info";
import {
  FilePlus,
  PhoneCall,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Wrench,
  PackageCheck,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  siteInfo: SiteInfo;
}

export default function ProductDetailClient({ product, siteInfo }: ProductDetailClientProps) {
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const [activeImage, setActiveImage] = useState(images[0]);

  const rawPhone = (siteInfo.hotline || "0862888679").replace(/\s+/g, "");
  const zaloPhone = (siteInfo.zaloNumber || rawPhone).replace(/\s+/g, "");

  const formatPrice = (val?: number | null) => {
    if (!val || val === 0) return "Liên hệ";
    return val.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="space-y-8">
      {/* Upper 2-column detail grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-4 relative group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            {product.discount && product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#c8102e] text-white text-xs font-black px-3 py-1 rounded-full shadow">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden bg-gray-50 p-1 shrink-0 transition-all ${
                    activeImage === img ? "border-[#c8102e] ring-2 ring-red-100" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Actions */}
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Code & Brand badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 border-b border-gray-100 pb-3">
              {product.code && (
                <div>
                  Mã sản phẩm: <span className="font-extrabold text-[#c8102e]">{product.code}</span>
                </div>
              )}
              <div>
                Thương hiệu: <span className="font-bold text-gray-800">{siteInfo.siteName}</span>
              </div>
              <div>
                Tình trạng: <span className="font-bold text-emerald-600">Còn hàng</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-red-50/60 p-4 rounded-xl border border-red-100 flex items-baseline gap-3">
              <span className="text-xs font-bold text-gray-500">Giá bán:</span>
              {product.price && product.price > 0 ? (
                <>
                  <span className="text-2xl md:text-3xl font-black text-[#c8102e]">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-2xl font-black text-[#c8102e]">Giá: Liên hệ</span>
              )}
            </div>

            {/* Summary */}
            {product.summary && (
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                {product.summary}
              </p>
            )}

            {/* Filter Tags Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {product.blockCount && (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">
                  Số khối: {product.blockCount}
                </span>
              )}
              {product.investmentLevel && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-bold">
                  Mức đầu tư: {product.investmentLevel}
                </span>
              )}
              {product.origin && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold">
                  Nguồn gốc: {product.origin}
                </span>
              )}
              {product.slideType && (
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold">
                  Máng trượt: {product.slideType}
                </span>
              )}
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => alert(`Đã thêm "${product.name}" vào danh sách báo giá!`)}
                className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer uppercase"
              >
                <FilePlus className="w-5 h-5" />
                <span>+ Thêm vào báo giá</span>
              </button>

              <a
                href={`tel:${rawPhone}`}
                className="border-2 border-[#c8102e] text-[#c8102e] hover:bg-red-50 font-extrabold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer uppercase"
              >
                <PhoneCall className="w-5 h-5 animate-pulse" />
                <span>Gọi ngay: {siteInfo.hotline}</span>
              </a>
            </div>

            <a
              href={`https://zalo.me/${zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Zalo nhận tư vấn thiết kế 3D miễn phí</span>
            </a>
          </div>

          {/* 4 Feature Promises Strip */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-gray-600 font-semibold border-t border-gray-100">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#c8102e]" />
              <span>Sản xuất trực tiếp</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Hỗ trợ lắp đặt tận nơi</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bảo hành chính hãng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Description Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Specifications Table */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 border-b pb-3 border-gray-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#c8102e]" />
            <span>THÔNG SỐ KỸ THUẬT</span>
          </h3>

          {product.specifications && product.specifications.length > 0 ? (
            <div className="divide-y divide-gray-100 text-xs">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="py-2.5 grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-bold text-gray-700">{spec.key}:</span>
                  <span className="col-span-8 text-gray-800 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Thông số kỹ thuật chuẩn theo yêu cầu dự án.</p>
          )}
        </div>

        {/* Detailed HTML Description */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="border-b pb-3 border-gray-100 flex items-center gap-2">
            <span className="bg-[#c8102e] text-white font-black text-xs md:text-sm px-4 py-1 rounded-r-full uppercase tracking-wider">
              MÔ TẢ CHI TIẾT SẢN PHẨM
            </span>
          </div>

          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-xs md:text-sm space-y-3"
            dangerouslySetInnerHTML={{ __html: product.description || "<p>Chưa có bài viết mô tả chi tiết.</p>" }}
          />
        </div>
      </div>
    </div>
  );
}
