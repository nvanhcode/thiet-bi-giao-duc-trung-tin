import React from "react";
import Link from "next/link";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getArticles, getArticleCategories } from "@/lib/getArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import NewsListClient from "./NewsListClient";
import { ChevronRight, Home as HomeIcon, Newspaper } from "lucide-react";

export const revalidate = 0;

export default async function NewsListPage() {
  const [siteInfo, categories, articles, articleCategories] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getArticles(),
    getArticleCategories(),
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
          <span className="font-bold text-gray-900">Tin tức & Tư vấn sản phẩm</span>
        </div>
      </div>

      {/* Hero Banner Header */}
      <section className="bg-slate-900 text-white py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-slate-900/80 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#c8102e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Chuyên mục Tin tức & Tư vấn</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Tất Cả Bài Viết & Kinh Nghiệm Chọn Thiết Bị
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Cập nhật tin tức mới nhất về thiết bị trường học, mầm non, thú nhún lò xo, tiêu chuẩn an toàn và hướng dẫn bóc tách khối lượng dự toán.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <NewsListClient articles={articles} categories={articleCategories} />
        </div>
      </main>

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
