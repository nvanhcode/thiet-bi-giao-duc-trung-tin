"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";
import {
  Search,
  PhoneCall,
  FileText,
  ShoppingBag,
  Menu,
  ChevronDown,
  UserCog,
} from "lucide-react";

interface HeaderProps {
  siteInfo?: SiteInfo;
}

export default function Header({ siteInfo = defaultSiteInfo }: HeaderProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

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
      <div className="bg-[#c8102e] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Category Dropdown Trigger */}
          <div className="relative w-64">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full bg-[#a00c24] hover:bg-[#880a1e] text-white py-3 px-4 font-bold text-sm uppercase flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                <span>DANH MỤC SẢN PHẨM</span>
              </div>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>
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
