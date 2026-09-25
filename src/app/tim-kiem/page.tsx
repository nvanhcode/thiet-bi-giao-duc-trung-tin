import React, { Suspense } from "react";
import Link from "next/link";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getProducts } from "@/lib/getProducts";
import { getArticles } from "@/lib/getArticles";
import { getProjects } from "@/lib/getProjects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import SearchResultsClient from "./SearchResultsClient";
import { ChevronRight, Home as HomeIcon, Search as SearchIcon } from "lucide-react";

export const revalidate = 0;

export default async function SearchPage() {
  const [siteInfo, categories, products, articles, projects] =
    await Promise.all([
      getSiteInfo(),
      getCategories(),
      getProducts(),
      getArticles(),
      getProjects(),
    ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header siteInfo={siteInfo} categories={categories} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-600">
          <Link href="/" className="hover:text-[#c8102e] flex items-center gap-1">
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900">Tìm kiếm</span>
        </div>
      </div>

      {/* Page Hero Banner */}
      <section className="bg-slate-900 text-white py-8 md:py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 to-slate-900/90 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#c8102e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
            <SearchIcon className="w-3.5 h-3.5" />
            <span>Tra cứu & Tìm kiếm hệ thống</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Tìm Kiếm Sản Phẩm, Bài Viết & Công Trình
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Tra cứu nhanh danh mục đồ chơi mầm non, thiết bị giáo dục, bài viết tư vấn kỹ thuật và các dự án công trình đã hoàn thiện của {siteInfo.siteName || "Phúc An Minh"}.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Suspense fallback={<div className="py-12 text-center text-sm font-semibold text-gray-500">Đang tải kết quả tìm kiếm...</div>}>
            <SearchResultsClient
              products={products}
              articles={articles}
              projects={projects}
            />
          </Suspense>
        </div>
      </main>

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
