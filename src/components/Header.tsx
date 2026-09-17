"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";
import { Category } from "@/types/category";
import {
  Search,
  PhoneCall,
  FileText,
  ShoppingBag,
  Menu,
  ChevronDown,
  ChevronRight,
  UserCog,
} from "lucide-react";

interface HeaderProps {
  siteInfo?: SiteInfo;
  categories?: Category[];
}

export default function Header({ siteInfo = defaultSiteInfo, categories = [] }: HeaderProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);

  // Group categories into parents & children
  const rootCategories = categories.filter((c) => !c.parentId);
  
  // Set default active parent on hover/open
  const activeParent = rootCategories.find((c) => c.id === activeParentId) || rootCategories[0];
  const subCategories = activeParent ? categories.filter((c) => c.parentId === activeParent.id) : [];

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-[#c8102e] text-white flex flex-col items-center justify-center font-bold shadow-md transform group-hover:scale-105 transition-transform">
            <span className="text-xs leading-none">{siteInfo.logoText || "TRUNG TÍN"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-[#c8102e] tracking-tight leading-tight">
              {siteInfo.siteName || "TRUNG TÍN"}
            </span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {siteInfo.siteSubName || "Đồ Chơi & Thiết Bị Mầm Non"}
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center border-2 border-[#c8102e] rounded-md overflow-hidden bg-white shadow-inner"
          >
            <input
              type="text"
              placeholder="Tìm kiếm theo sản phẩm: Xích đu, bập bênh, thú nhún..."
              className="w-full px-4 py-2 text-sm focus:outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-[#c8102e] text-white px-6 py-2 flex items-center gap-1.5 font-medium hover:bg-[#a00c24] transition-colors text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </div>

        {/* Right Info Items */}
        <div className="flex items-center gap-5 text-xs text-gray-700 font-medium">
          {/* Hotline */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center">
              <PhoneCall className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Hotline hỗ trợ</div>
              <a
                href={`tel:${(siteInfo.hotline || "").replace(/\s+/g, "")}`}
                className="text-sm font-bold text-[#c8102e] hover:underline"
              >
                {siteInfo.hotline || "0862 888 679"}
              </a>
            </div>
          </div>

          {/* Quote List */}
          <Link
            href="/bao-gia"
            className="flex items-center gap-2 hover:text-[#c8102e] transition-colors relative"
          >
            <div className="relative w-8 h-8 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center">
              <FileText className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-[#c8102e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] text-gray-400">Danh sách báo giá</div>
              <div className="font-bold text-gray-800">0 sản phẩm</div>
            </div>
          </Link>

          {/* Cart */}
          <Link
            href="/gio-hang"
            className="flex items-center gap-2 hover:text-[#c8102e] transition-colors relative"
          >
            <div className="relative w-8 h-8 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-[#c8102e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] text-gray-400">Giỏ hàng</div>
              <div className="font-bold text-gray-800">0 sản phẩm</div>
            </div>
          </Link>

          {/* Admin Link Button */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white hover:bg-[#c8102e] rounded-lg transition-colors text-xs font-bold shadow"
            title="Truy cập Trang Quản Trị Admin"
          >
            <UserCog className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Admin</span>
          </Link>
        </div>
      </div>

      {/* Main Red Nav Bar */}
      <div className="bg-[#c8102e] text-white shadow-md relative">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Category Dropdown Button */}
          <div
            className="relative w-64 z-50"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full bg-[#a00c24] hover:bg-[#880a1e] text-white py-3.5 px-4 font-bold text-xs md:text-sm uppercase flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                <span>DANH MỤC SẢN PHẨM</span>
              </div>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Dropdown (Matching attached design!) */}
            {isCategoryOpen && rootCategories.length > 0 && (
              <div className="absolute top-full left-0 w-[850px] bg-white shadow-2xl border border-gray-200 text-gray-800 flex rounded-b-lg overflow-hidden z-50">
                {/* Left Parent Categories Column */}
                <div className="w-64 bg-white border-r border-gray-100 divide-y divide-gray-100 shrink-0">
                  {rootCategories.map((parent) => {
                    const isActive = activeParent?.id === parent.id;
                    return (
                      <Link
                        key={parent.id}
                        href={`/danh-muc/${parent.slug}`}
                        onMouseEnter={() => setActiveParentId(parent.id)}
                        className={`flex items-center justify-between p-3.5 text-xs font-bold transition-all ${
                          isActive
                            ? "bg-[#c8102e] text-white"
                            : "text-gray-800 hover:bg-red-50 hover:text-[#c8102e]"
                        }`}
                      >
                        <span className="truncate">{parent.name}</span>
                        <ChevronRight className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                      </Link>
                    );
                  })}
                </div>

                {/* Right Subcategories & Feature Banner Column */}
                <div className="flex-1 p-6 flex gap-6 bg-white">
                  {/* Subcategories Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4">
                    {subCategories.length > 0 ? (
                      subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/danh-muc/${sub.slug}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#c8102e] py-1 border-b border-gray-100 transition-colors group"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#c8102e] shrink-0" />
                          <span className="line-clamp-1">{sub.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-2 py-4">
                        <Link
                          href={`/danh-muc/${activeParent?.slug}`}
                          className="text-xs font-bold text-[#c8102e] hover:underline"
                        >
                          Xem tất cả sản phẩm trong {activeParent?.name}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Category Feature Image */}
                  <div className="w-56 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm relative group">
                    <img
                      src={
                        activeParent?.image ||
                        "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={activeParent?.name || "Danh mục"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold drop-shadow">
                        {activeParent?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex items-center gap-1 overflow-x-auto text-xs md:text-sm font-bold uppercase tracking-wider pl-4">
            <Link
              href="/"
              className="py-3.5 px-4 bg-[#a00c24] text-white hover:bg-[#880a1e] transition-colors whitespace-nowrap"
            >
              TRANG CHỦ
            </Link>
            <Link
              href="/gioi-thieu"
              className="py-3.5 px-4 hover:bg-[#a00c24] transition-colors whitespace-nowrap"
            >
              GIỚI THIỆU
            </Link>
            <Link
              href="/cong-trinh"
              className="py-3.5 px-4 hover:bg-[#a00c24] transition-colors whitespace-nowrap"
            >
              CÔNG TRÌNH
            </Link>
            <Link
              href="/tin-tuc"
              className="py-3.5 px-4 hover:bg-[#a00c24] transition-colors whitespace-nowrap"
            >
              TIN TỨC
            </Link>
            <Link
              href="/khuyen-mai"
              className="py-3.5 px-4 hover:bg-[#a00c24] transition-colors whitespace-nowrap text-yellow-300 animate-pulse"
            >
              KHUYẾN MẠI
            </Link>
            <Link
              href="/lien-he"
              className="py-3.5 px-4 hover:bg-[#a00c24] transition-colors whitespace-nowrap"
            >
              LIÊN HỆ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
