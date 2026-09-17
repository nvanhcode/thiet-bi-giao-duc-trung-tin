import React from "react";
import Link from "next/link";
import { CheckCircle2, PlayCircle, ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="w-full bg-white py-10 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-block px-3 py-1 bg-red-50 text-[#c8102e] font-bold text-xs rounded-full uppercase tracking-wide">
              Xưởng Sản Xuất Trực Tiếp
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
              <span className="text-[#c8102e]">Đồ chơi Trung Tín</span> – Sản xuất, cung cấp đồ chơi mầm non, thiết bị mầm non uy tín giá tốt.
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed">
              Với hơn 10 năm kinh nghiệm và xưởng sản xuất trực tiếp, Đồ Chơi Trung Tín cung cấp đồ chơi, thiết bị mầm non cho trường học, khu vui chơi, công viên, chung cư và nhiều loại hình công trình khác.
            </p>

            <p className="text-gray-600 text-sm leading-relaxed">
              Danh mục sản phẩm gồm đồ chơi ngoài trời, thiết bị khu vui chơi trong nhà, nội thất mầm non, đồ chơi gỗ, sản phẩm Thông tư 02 và linh phụ kiện. Trung Tín hỗ trợ tư vấn hoàn toàn miễn phí, giao hàng toàn quốc và bảo hành phù hợp với từng nhóm sản phẩm.
            </p>

            {/* Bullet points */}
            <ul className="space-y-2 py-2 text-sm font-semibold text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c8102e] shrink-0" />
                <span>Sản xuất trực tiếp, chủ động mẫu mã và quy cách.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c8102e] shrink-0" />
                <span>Cung ứng sản phẩm cho trường học, dự án và đại lý.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c8102e] shrink-0" />
                <span>Hỗ trợ vận chuyển, lắp đặt và bảo hành trên toàn quốc.</span>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/san-pham"
                className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span>Xem tất cả sản phẩm</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lien-he"
                className="border-2 border-[#c8102e] text-[#c8102e] hover:bg-red-50 font-bold text-xs md:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all"
              >
                <span>Nhận tư vấn & báo giá</span>
              </Link>
            </div>
          </div>

          {/* Right Video Embed Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
              <div className="aspect-video w-full relative bg-gray-900">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Giới thiệu về Đồ Chơi Mầm Non Trung Tín"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="bg-gray-900 text-white p-3 text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="truncate max-w-[240px]">
                    Giới thiệu về Đồ Chơi Mầm Non Trung Tín - Xưởng sản xuất
                  </span>
                </div>
                <span className="text-gray-400 text-[10px]">YouTube</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
