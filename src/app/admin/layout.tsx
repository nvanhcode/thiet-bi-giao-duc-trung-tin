import React from "react";
import Link from "next/link";
import {
  Settings,
  Package,
  FolderTree,
  Globe,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8102e] flex items-center justify-center font-bold text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wider uppercase">TRUNG TÍN ADMIN</h1>
              <p className="text-[11px] text-slate-400">Hệ thống quản trị</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <div className="px-3 py-2 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              CẤU HÌNH HỆ THỐNG
            </div>

            <Link
              href="/admin/site-info"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#c8102e] text-white shadow transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Thông tin Website</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-80" />
            </Link>

            <div className="px-3 py-2 mt-4 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              QUẢN LÝ NỘI DUNG (SẮP RA MẮT)
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-400 bg-slate-800/40 cursor-not-allowed">
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 opacity-60" />
                <span>Quản lý sản phẩm</span>
              </div>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">Chờ</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-400 bg-slate-800/40 cursor-not-allowed">
              <div className="flex items-center gap-2.5">
                <FolderTree className="w-4 h-4 opacity-60" />
                <span>Quản lý danh mục</span>
              </div>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">Chờ</span>
            </div>
          </nav>
        </div>

        {/* Footer Back to Site */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Xem Trang Chủ</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Quản Lý Thông Tin Hiển Thị Website</h2>
            <p className="text-xs text-gray-500">Cấu hình các thông tin Header, Footer, Hotline, Địa chỉ xưởng...</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● File JSON Persistence
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
