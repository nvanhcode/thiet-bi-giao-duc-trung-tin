"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  Package,
  FolderTree,
  Sliders,
  Globe,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  ClipboardList,
  Newspaper,
  Building2,
  Sparkles,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Tự động đóng menu trên mobile khi thay đổi trang
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    {
      group: "QUẢN LÝ NỘI DUNG & KINH DOANH",
      items: [
        {
          href: "/admin/quote-requests",
          label: "Yêu cầu báo giá",
          icon: ClipboardList,
          iconColor: "text-rose-400",
        },
        {
          href: "/admin/site-info?tab=about",
          label: "Quản lý Trang Giới thiệu",
          icon: Sparkles,
          iconColor: "text-[#c8102e]",
        },
        {
          href: "/admin/articles",
          label: "Quản lý bài viết",
          icon: Newspaper,
          iconColor: "text-cyan-400",
        },
        {
          href: "/admin/projects",
          label: "Quản lý công trình",
          icon: Building2,
          iconColor: "text-indigo-400",
        },
        {
          href: "/admin/categories",
          label: "Quản lý danh mục",
          icon: FolderTree,
          iconColor: "text-amber-400",
        },
        {
          href: "/admin/products",
          label: "Quản lý sản phẩm",
          icon: Package,
          iconColor: "text-emerald-400",
        },
        {
          href: "/admin/filters",
          label: "Thuộc tính bộ lọc",
          icon: Sliders,
          iconColor: "text-purple-400",
        },
      ],
    },
    {
      group: "CẤU HÌNH HỆ THỐNG",
      items: [
        {
          href: "/admin/site-info",
          label: "Thông tin Website",
          icon: Settings,
          iconColor: "text-blue-400",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900 font-sans">
      {/* Mobile Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen shrink-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c8102e] flex items-center justify-center font-bold text-white shadow-lg shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-wider uppercase text-white">ADMIN</h1>
                <p className="text-[11px] text-slate-400">Hệ thống quản trị</p>
              </div>
            </div>
            {/* Close Button on Mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-4 text-xs font-semibold flex-1">
            {navItems.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="px-3 py-1.5 text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">
                  {group.group}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all ${isActive
                          ? "bg-[#c8102e] text-white shadow-md font-bold"
                          : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.iconColor}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${isActive ? "opacity-100 translate-x-0.5" : "opacity-50"
                            }`}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Back to Site */}
          <div className="p-4 border-t border-slate-800 mt-auto">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Xem Trang Chủ</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Toggle Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mở menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                Hệ Thống Quản Trị
              </h2>
              <p className="text-[11px] md:text-xs text-gray-500 hidden sm:block">
                Quản lý danh mục đa cấp, sản phẩm, bộ lọc và cấu hình giao diện
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trang chủ</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
