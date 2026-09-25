"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Article } from "@/types/article";
import { Project } from "@/types/project";
import { useQuote } from "@/context/QuoteContext";
import {
  Search,
  PhoneCall,
  FileText,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  UserCog,
  Folder,
  Package,
  Newspaper,
  Building2,
  Loader2,
} from "lucide-react";

interface HeaderProps {
  siteInfo?: SiteInfo;
  categories?: Category[];
}

export default function Header({ siteInfo = defaultSiteInfo, categories = [] }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useQuote();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{
    products: Product[];
    articles: Article[];
    projects: Project[];
  }>({ products: [], articles: [], projects: [] });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions({ products: [], articles: [], projects: [] });
      setIsLoadingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=3`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Fetch suggestions error:", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActiveRoute = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { href: "/", label: "TRANG CHỦ", mobileLabel: "Trang chủ" },
    { href: "/gioi-thieu", label: "GIỚI THIỆU", mobileLabel: "Giới thiệu" },
    { href: "/cong-trinh", label: "CÔNG TRÌNH", mobileLabel: "Công trình" },
    { href: "/tin-tuc", label: "TIN TỨC", mobileLabel: "Tin tức" },
    { href: "/khuyen-mai", label: "KHUYẾN MẠI", mobileLabel: "Khuyến mại HOT 🔥", isHighlight: true },
    { href: "/lien-he", label: "LIÊN HỆ", mobileLabel: "Liên hệ" },
  ];

  // Group categories into parents & children
  const rootCategories = categories.filter((c) => !c.parentId);

  // Set default active parent on hover/open
  const activeParent = rootCategories.find((c) => c.id === activeParentId) || rootCategories[0];
  const subCategories = activeParent ? categories.filter((c) => c.parentId === activeParent.id) : [];

  const toggleAccordionCategory = (catId: string) => {
    setExpandedCategoryId(expandedCategoryId === catId ? null : catId);
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2 md:gap-4 flex-wrap">
        {/* Logo & Subtitle */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          {siteInfo.logoUrl ? (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex items-center justify-center shadow-md bg-white border border-gray-100 transform group-hover:scale-105 transition-transform shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteInfo.logoUrl}
                alt={siteInfo.siteName || "PHÚC AN MINH"}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c8102e] text-white flex flex-col items-center justify-center font-bold shadow-md transform group-hover:scale-105 transition-transform shrink-0">
              <span className="text-[10px] md:text-xs leading-none">{siteInfo.logoText || "PHÚC AN MINH"}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-extrabold text-[#c8102e] tracking-tight leading-tight">
              {siteInfo.siteName || "PHÚC AN MINH"}
            </span>
            <span className="text-[9px] md:text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline-block">
              {siteInfo.siteSubName || "Đồ Chơi & Thiết Bị Giáo Dục Mầm Non"}
            </span>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-4 relative" ref={searchRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center border-2 border-[#c8102e] rounded-md overflow-hidden bg-white shadow-inner"
          >
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm: Xích đu, bập bênh, thú nhún..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-3 py-2 text-xs md:text-sm focus:outline-none text-gray-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#c8102e] text-white px-4 lg:px-6 py-2 flex items-center gap-1 font-medium hover:bg-[#a00c24] transition-colors text-xs md:text-sm shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
          </form>

          {/* Desktop Search Suggestions Dropdown */}
          {showSuggestions && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden text-gray-800 animate-in fade-in duration-150 max-h-[80vh] overflow-y-auto">
              {isLoadingSuggestions ? (
                <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#c8102e]" />
                  <span>Đang tìm kiếm...</span>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Products Section */}
                  {suggestions.products.length > 0 && (
                    <div className="p-2 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Package className="w-3 h-3 text-[#c8102e]" />
                        <span>Sản phẩm</span>
                      </div>
                      {suggestions.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/san-pham/${p.slug || p.id}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-1.5 hover:bg-red-50/60 rounded-md transition-colors group"
                        >
                          <div className="w-9 h-9 rounded bg-gray-50 overflow-hidden shrink-0 border border-gray-100 p-0.5">
                            <img src={p.thumbnail || (p.images && p.images[0]) || ""} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 truncate">
                            <h4 className="text-xs font-semibold text-gray-800 group-hover:text-[#c8102e] truncate">{p.name}</h4>
                            <span className="text-[10px] font-bold text-[#c8102e]">
                              {typeof p.price === "number" && p.price > 0 ? `${p.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Articles Section */}
                  {suggestions.articles.length > 0 && (
                    <div className="p-2 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Newspaper className="w-3 h-3 text-blue-600" />
                        <span>Bài viết</span>
                      </div>
                      {suggestions.articles.map((a) => (
                        <Link
                          key={a.id}
                          href={`/tin-tuc/${a.slug}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-1.5 hover:bg-blue-50/60 rounded-md transition-colors group"
                        >
                          <div className="w-9 h-9 rounded bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                            <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 truncate">
                            <h4 className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 truncate">{a.title}</h4>
                            <span className="text-[10px] text-gray-400 truncate block">{a.categoryName}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Projects Section */}
                  {suggestions.projects.length > 0 && (
                    <div className="p-2 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-amber-600" />
                        <span>Công trình</span>
                      </div>
                      {suggestions.projects.map((pj) => (
                        <Link
                          key={pj.id}
                          href={`/cong-trinh/${pj.slug}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-1.5 hover:bg-amber-50/60 rounded-md transition-colors group"
                        >
                          <div className="w-9 h-9 rounded bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                            <img src={pj.image} alt={pj.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 truncate">
                            <h4 className="text-xs font-semibold text-gray-800 group-hover:text-amber-600 truncate">{pj.title}</h4>
                            <span className="text-[10px] text-gray-400 truncate block">{pj.tag || pj.address}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* No suggestions */}
                  {suggestions.products.length === 0 && suggestions.articles.length === 0 && suggestions.projects.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-500">
                      Không tìm thấy gợi ý nào. Nhấn Enter để xem kết quả tìm kiếm đầy đủ.
                    </div>
                  )}

                  {/* View All Button */}
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full p-2.5 bg-gray-50 hover:bg-red-50 text-[#c8102e] text-xs font-bold text-center block transition-colors border-t border-gray-100 cursor-pointer"
                  >
                    Xem tất cả kết quả cho &quot;{searchQuery}&quot; &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-700 font-medium shrink-0">
          {/* Hotline - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center">
              <PhoneCall className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Hotline hỗ trợ</div>
              <a
                href={`tel:${(siteInfo.hotline || "").replace(/\s+/g, "")}`}
                className="text-xs lg:text-sm font-bold text-[#c8102e] hover:underline"
              >
                {siteInfo.hotline || "0978 618 790"}
              </a>
            </div>
          </div>

          {/* Quote List */}
          <Link
            href="/bao-gia"
            className="flex items-center gap-1.5 hover:text-[#c8102e] transition-colors relative"
            title="Danh sách báo giá"
          >
            <div className="relative w-8 h-8 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center">
              <FileText className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-[#c8102e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <div className="hidden xl:block">
              <div className="text-[10px] text-gray-400">Danh sách báo giá</div>
              <div className="font-bold text-gray-800">{itemCount} sản phẩm</div>
            </div>
          </Link>

          {/* Cart */}
          {/* <Link
            href="/gio-hang"
            className="flex items-center gap-1.5 hover:text-[#c8102e] transition-colors relative"
            title="Giỏ hàng"
          >
            <div className="relative w-8 h-8 rounded-full bg-red-50 text-[#c8102e] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-[#c8102e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            <div className="hidden xl:block">
              <div className="text-[10px] text-gray-400">Giỏ hàng</div>
              <div className="font-bold text-gray-800">0 sản phẩm</div>
            </div>
          </Link> */}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#c8102e] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search Bar - Mobile View Only */}
        <div className="w-full md:hidden pt-2">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border-2 border-[#c8102e] rounded-lg overflow-hidden bg-white shadow-inner"
          >
            <input
              type="text"
              placeholder="Tìm xích đu, bập bênh, thú nhún..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs focus:outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-[#c8102e] text-white px-3 py-1.5 flex items-center justify-center font-medium hover:bg-[#a00c24] transition-colors text-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Main Red Navigation Bar */}
      <div className="bg-[#c8102e] text-white shadow-md relative hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Category Dropdown Button (Mega Menu) */}
          <div
            className="relative w-64 z-50"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full bg-[#a00c24] hover:bg-[#880a1e] text-white py-3.5 px-4 font-bold text-xs lg:text-sm uppercase flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                <span>DANH MỤC SẢN PHẨM</span>
              </div>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Mega Menu Dropdown */}
            {isCategoryOpen && rootCategories.length > 0 && (
              <div className="absolute top-full left-0 w-[800px] xl:w-[850px] bg-white shadow-2xl border border-gray-200 text-gray-800 flex rounded-b-lg overflow-hidden z-50">
                {/* Left Parent Categories Column */}
                <div className="w-64 bg-white border-r border-gray-100 divide-y divide-gray-100 shrink-0">
                  {rootCategories.map((parent) => {
                    const isActive = activeParent?.id === parent.id;
                    return (
                      <Link
                        key={parent.id}
                        href={`/danh-muc/${parent.slug}`}
                        onMouseEnter={() => setActiveParentId(parent.id)}
                        className={`flex items-center justify-between p-3 text-xs font-bold transition-all ${isActive
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

                {/* Right Subcategories Column */}
                <div className="flex-1 p-5 flex gap-6 bg-white">
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

                  {/* Feature Image Banner */}
                  <div className="w-48 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm relative group">
                    <img
                      src={
                        activeParent?.image ||
                        "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={activeParent?.name || "Danh mục"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                      <span className="text-white text-xs font-bold drop-shadow line-clamp-2">
                        {activeParent?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex-1 flex items-center gap-1 overflow-x-auto text-xs lg:text-sm font-bold uppercase tracking-wider pl-4">
            {navItems.map((item) => {
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-3.5 px-4 transition-colors whitespace-nowrap ${active
                      ? "bg-[#a00c24] text-white shadow-inner"
                      : "hover:bg-[#a00c24]"
                    } ${item.isHighlight
                      ? "text-yellow-300" + (!active ? " animate-pulse" : "")
                      : ""
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Slide-Over Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content Window */}
          <div className="relative w-[300px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-4 bg-[#c8102e] text-white flex items-center justify-between shadow">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white text-[#c8102e] flex items-center justify-center font-black text-xs">
                  PAM
                </div>
                <span className="font-extrabold text-sm uppercase tracking-wide">MENU PHÚC AN MINH</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Hotline Banner */}
            <div className="bg-red-50 p-3 border-b border-red-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-gray-500 block text-[10px]">Hotline tư vấn nhanh:</span>
                <a
                  href={`tel:${(siteInfo.hotline || "").replace(/\s+/g, "")}`}
                  className="font-extrabold text-[#c8102e] text-xs hover:underline flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3 animate-pulse" />
                  <span>{siteInfo.hotline || "0978 618 790"}</span>
                </a>
              </div>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2.5 py-1 bg-gray-900 text-white rounded text-[11px] font-bold"
              >
                Admin
              </Link>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Main Navigation Links */}
              <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
                  TRANG CHÍNH
                </h4>
                <nav className="flex flex-col gap-1 text-xs font-bold">
                  {navItems.map((item) => {
                    const active = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`p-2.5 rounded-lg transition-colors flex items-center gap-2 ${active
                            ? item.isHighlight
                              ? "bg-[#c8102e] text-yellow-300 font-extrabold"
                              : "bg-[#c8102e] text-white font-extrabold"
                            : item.isHighlight
                              ? "bg-yellow-50 text-amber-700 hover:bg-yellow-100"
                              : "hover:bg-red-50 hover:text-[#c8102e] text-gray-800"
                          }`}
                      >
                        <span>{item.mobileLabel}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Accordion Categories Tree */}
              {rootCategories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5 text-[#c8102e]" />
                    <span>DANH MỤC SẢN PHẨM</span>
                  </h4>
                  <div className="space-y-1 divide-y divide-gray-100 text-xs">
                    {rootCategories.map((parent) => {
                      const childList = categories.filter((c) => c.parentId === parent.id);
                      const isExpanded = expandedCategoryId === parent.id;
                      return (
                        <div key={parent.id} className="pt-1.5">
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                            <Link
                              href={`/danh-muc/${parent.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="font-bold text-gray-800 hover:text-[#c8102e] flex-1 truncate"
                            >
                              {parent.name}
                            </Link>
                            {childList.length > 0 && (
                              <button
                                onClick={() => toggleAccordionCategory(parent.id)}
                                className="p-1 text-gray-400 hover:text-[#c8102e] rounded cursor-pointer"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180 text-[#c8102e]" : ""}`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Subcategories accordion */}
                          {isExpanded && childList.length > 0 && (
                            <div className="pl-4 py-1.5 space-y-1 bg-gray-50/70 rounded-lg mt-1">
                              {childList.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/danh-muc/${sub.slug}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block p-1.5 text-[11px] font-medium text-gray-600 hover:text-[#c8102e] hover:font-bold transition-colors"
                                >
                                  • {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
