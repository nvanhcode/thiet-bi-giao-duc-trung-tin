"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trees,
  Armchair,
  Ship,
  Boxes,
  FileCheck2,
  Castle,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Wrench,
  PackageCheck,
  Search,
} from "lucide-react";

const categories = [
  { name: "Đồ chơi ngoài trời", icon: Trees, href: "/do-choi-ngoai-troi", bg: "bg-red-50 text-[#c8102e]" },
  { name: "Nội thất mầm non", icon: Armchair, href: "/noi-that-mam-non", bg: "bg-orange-50 text-orange-600" },
  { name: "Đồ chơi nhập khẩu", icon: Ship, href: "/do-choi-nhap-khau", bg: "bg-blue-50 text-blue-600" },
  { name: "Đồ chơi gỗ", icon: Boxes, href: "/do-choi-go", bg: "bg-amber-50 text-amber-700" },
  { name: "Đồ chơi theo thông tư 02", icon: FileCheck2, href: "/do-choi-thong-tu-02", bg: "bg-emerald-50 text-emerald-600" },
  { name: "Đồ chơi khu vui chơi trong nhà", icon: Castle, href: "/do-choi-khu-vui-choi", bg: "bg-purple-50 text-purple-600" },
];

const bannerSlides = [
  {
    title: "THIẾT BỊ & ĐỒ CHƠI MẦM NON CAO CẤP",
    subtitle: "Chất lượng vượt trội - An toàn tuyệt đối cho trẻ em",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "SẢN XUẤT TRỰC TIẾP TẠI XƯỞNG TRUNG TÍN",
    subtitle: "Đạt chuẩn Bộ Giáo Dục & Đào Tạo - Giá tận gốc",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "THI CÔNG KHU VUI CHƠI TRỌN GÓI TOÀN QUỐC",
    subtitle: "Tư vấn thiết kế 3D miễn phí & Bảo hành lâu dài",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  return (
    <section className="w-full bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Vertical Category Sidebar */}
          <aside className="w-full md:w-64 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden shrink-0">
            <div className="divide-y divide-gray-100">
              {categories.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={idx}
                    href={cat.href}
                    className="flex items-center gap-3 p-3.5 hover:bg-red-50/50 hover:pl-5 transition-all text-gray-700 font-semibold text-xs md:text-sm group"
                  >
                    <div className={`w-8 h-8 rounded-full ${cat.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="group-hover:text-[#c8102e] transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Banner Slider Container */}
          <div className="flex-1 relative rounded-lg overflow-hidden shadow-sm bg-gray-900 group min-h-[340px] md:min-h-[380px] flex flex-col justify-between p-6">
            {/* Slide Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={bannerSlides[currentSlide].image}
                alt={bannerSlides[currentSlide].title}
                className="w-full h-full object-cover opacity-60 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
            </div>

            {/* Banner Top Overlay Search Header */}
            <div className="relative z-10 w-full text-center">
              <h2 className="text-xl md:text-2xl font-black text-amber-300 drop-shadow-md tracking-wider uppercase mb-2">
                BẠN ĐANG CẦN MUA ĐỒ CHƠI, THIẾT BỊ GÌ?
              </h2>
              <div className="max-w-md mx-auto relative">
                <input
                  type="text"
                  placeholder="Đồ chơi Trung Tín có tất cả..."
                  className="w-full py-2.5 px-4 pr-10 rounded-full bg-white/90 backdrop-blur text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c8102e] shadow-lg"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#c8102e] text-white rounded-full flex items-center justify-center hover:bg-[#a00c24]">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Banner Middle Content */}
            <div className="relative z-10 text-center my-6">
              <span className="inline-block px-3 py-1 bg-[#c8102e] text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider shadow">
                Khuyến Mại Đặc Biệt
              </span>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg mb-2">
                {bannerSlides[currentSlide].title}
              </h3>
              <p className="text-sm md:text-base text-gray-200 font-medium drop-shadow">
                {bannerSlides[currentSlide].subtitle}
              </p>
            </div>

            {/* Banner Controls & Indicators */}
            <div className="relative z-10 flex items-center justify-between">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-[#c8102e] text-white flex items-center justify-center backdrop-blur transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2">
                {bannerSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? "bg-[#c8102e] w-8" : "bg-white/60 hover:bg-white"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-[#c8102e] text-white flex items-center justify-center backdrop-blur transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Value Proposition Features */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-snug">
                Sản xuất & cung ứng
              </h4>
              <p className="text-[11px] text-gray-500">Đầy đủ chủng loại sản phẩm</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-l border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-snug">
                Giao hàng toàn quốc
              </h4>
              <p className="text-[11px] text-gray-500">Theo đơn hàng và khu vực</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-l border-gray-100">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-snug">
                Hỗ trợ lắp đặt
              </h4>
              <p className="text-[11px] text-gray-500">Lắp đặt tận nơi uy tín</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-l border-gray-100">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-snug">
                Chính sách bảo hành
              </h4>
              <p className="text-[11px] text-gray-500">Bảo hành chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
