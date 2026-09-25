"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteInfo, defaultSiteInfo, defaultBannerSlides } from "@/types/site-info";
import { Category } from "@/types/category";
import {
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
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Wrench,
  PackageCheck,
  Search,
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

const defaultCategories = [
  { name: "Đồ chơi ngoài trời", icon: "Trees", href: "/danh-muc/do-choi-ngoai-troi", color: "bg-red-50 text-[#c8102e]" },
  { name: "Nội thất mầm non", icon: "Armchair", href: "/danh-muc/noi-that-mam-non", color: "bg-orange-50 text-orange-600" },
  { name: "Đồ chơi nhập khẩu", icon: "Ship", href: "/danh-muc/do-choi-nhap-khau", color: "bg-blue-50 text-blue-600" },
  { name: "Đồ chơi gỗ", icon: "Boxes", href: "/danh-muc/do-choi-go", color: "bg-amber-50 text-amber-700" },
  { name: "Đồ chơi theo thông tư 02", icon: "FileCheck2", href: "/danh-muc/do-choi-thong-tu-02", color: "bg-emerald-50 text-emerald-600" },
  { name: "Đồ chơi khu vui chơi trong nhà", icon: "Castle", href: "/danh-muc/do-choi-khu-vui-choi", color: "bg-purple-50 text-purple-600" },
];

interface HeroProps {
  siteInfo?: SiteInfo;
  categories?: Category[];
}

export default function Hero({ siteInfo = defaultSiteInfo, categories }: HeroProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroQuery, setHeroQuery] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(heroQuery.trim())}`);
    }
  };

  // Filter root categories if categories prop provided
  const rootCats = categories
    ? categories
        .filter((c) => !c.parentId)
        .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99))
    : [];

  const displayCategories = rootCats.length > 0
    ? rootCats.map((c) => ({
        name: c.name,
        icon: c.icon || "Folder",
        href: c.slug.startsWith("/") ? c.slug : `/danh-muc/${c.slug}`,
        color: c.color || "bg-red-50 text-[#c8102e]",
      }))
    : defaultCategories;

  const slides = (siteInfo.bannerSlides && siteInfo.bannerSlides.length > 0)
    ? siteInfo.bannerSlides
    : defaultBannerSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[currentSlide] || slides[0];

  return (
    <section className="w-full bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Vertical Category Sidebar - Desktop */}
          <aside className="hidden md:block w-64 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden shrink-0">
            <div className="divide-y divide-gray-100">
              {displayCategories.map((cat, idx) => {
                const IconComponent = ICON_MAP[cat.icon] || Folder;
                return (
                  <Link
                    key={idx}
                    href={cat.href}
                    className="flex items-center gap-3 p-3.5 hover:bg-red-50/50 hover:pl-5 transition-all text-gray-700 font-semibold text-xs md:text-sm group"
                  >
                    <div className={`w-8 h-8 rounded-full ${cat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
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

          {/* Horizontal Category Pill Strip - Mobile Only */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            {displayCategories.map((cat, idx) => {
              const IconComponent = ICON_MAP[cat.icon] || Folder;
              return (
                <Link
                  key={idx}
                  href={cat.href}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-2xs whitespace-nowrap text-gray-700 hover:text-[#c8102e] shrink-0"
                >
                  <IconComponent className="w-3.5 h-3.5 text-[#c8102e]" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Banner Slider Container */}
          <div className="flex-1 relative rounded-lg overflow-hidden shadow-sm bg-gray-900 group min-h-[280px] sm:min-h-[340px] md:min-h-[380px] flex flex-col justify-between p-4 md:p-6">
            {/* Slide Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="w-full h-full object-cover opacity-60 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
            </div>

            {/* Banner Top Overlay Search Header */}
            <div className="relative z-10 w-full text-center">
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md tracking-wider uppercase mb-2">
                BẠN ĐANG CẦN MUA ĐỒ CHƠI, THIẾT BỊ GÌ?
              </h2>
              <form onSubmit={handleHeroSearch} className="max-w-md mx-auto relative hidden sm:block">
                <input
                  type="text"
                  placeholder={`Đồ chơi ${siteInfo.siteName || "Phúc An Minh"} có tất cả...`}
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  className="w-full py-2.5 px-4 pr-10 rounded-full bg-white/90 backdrop-blur text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c8102e] shadow-lg"
                />
                <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#c8102e] text-white rounded-full flex items-center justify-center hover:bg-[#a00c24] cursor-pointer">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Banner Middle Content */}
            <div className="relative z-10 text-center my-3 sm:my-6">
              <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#c8102e] text-white text-[10px] sm:text-xs font-bold rounded-full mb-2 sm:mb-3 uppercase tracking-wider shadow">
                Khuyến Mại Đặc Biệt
              </span>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg mb-1 sm:mb-2">
                {activeSlide.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-200 font-medium drop-shadow line-clamp-2">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* Banner Controls & Indicators */}
            {slides.length > 1 && (
              <div className="relative z-10 flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-[#c8102e] text-white flex items-center justify-center backdrop-blur transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 sm:h-3 rounded-full transition-all ${
                        currentSlide === idx ? "bg-[#c8102e] w-6 sm:w-8" : "bg-white/60 hover:bg-white w-2 sm:w-3"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-[#c8102e] text-white flex items-center justify-center backdrop-blur transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Value Proposition Features */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2.5 p-1.5 sm:p-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center shrink-0">
              <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 leading-snug">
                Phân phối & cung ứng
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Đầy đủ chủng loại</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5 sm:p-2 border-l border-gray-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 leading-snug">
                Giao hàng toàn quốc
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Theo đơn hàng</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5 sm:p-2 border-t md:border-t-0 md:border-l border-gray-100 pt-2.5 md:pt-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 leading-snug">
                Hỗ trợ lắp đặt
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Lắp đặt tận nơi</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5 sm:p-2 border-t border-l md:border-t-0 border-gray-100 pt-2.5 md:pt-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 leading-snug">
                Chính sách bảo hành
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Bảo hành uy tín</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
