"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FilePlus } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  code?: string;
  image: string;
  oldPrice?: number | null;
  price?: number | null; // null or 0 means 'Giá: Liên hệ'
  discount?: number | null;
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (val?: number | null) => {
    if (!val || val === 0) return "Liên hệ";
    return val.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative">
      {/* Discount Tag */}
      {product.discount && product.discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-[#c8102e] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
          -{product.discount}%
        </span>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between border-t border-gray-100">
        <div>
          <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#c8102e] transition-colors leading-snug min-h-[36px]">
            {product.title}
          </h3>
        </div>

        <div className="mt-3">
          {/* Price area */}
          <div className="flex flex-wrap items-baseline gap-2 mb-3">
            {product.price && product.price > 0 ? (
              <>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                <span className="text-sm font-extrabold text-[#c8102e]">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-gray-700">
                Giá: <span className="text-[#c8102e]">Liên hệ</span>
              </span>
            )}
          </div>

          {/* Add to Quote Button */}
          <button
            onClick={() => alert(`Đã thêm "${product.title}" vào danh sách báo giá!`)}
            className="w-full py-1.5 px-3 border border-[#c8102e] text-[#c8102e] hover:bg-[#c8102e] hover:text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Thêm vào báo giá</span>
          </button>
        </div>
      </div>
    </div>
  );
}
