import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getProducts } from "@/lib/getProducts";
import { getFilters } from "@/lib/getFilters";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import ProductsPageClient from "./ProductsPageClient";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();
  return {
    title: `Sản Phẩm & Danh Mục Thiết Bị Giáo Dục | ${siteInfo.siteName || "Phúc An Minh"}`,
    description:
      "Danh sách tất cả các danh mục thiết bị mầm non, đồ chơi ngoài trời, nội thất phòng học và chăm sóc nuôi dưỡng đạt chuẩn Bộ GD&ĐT.",
    openGraph: {
      title: `Sản Phẩm & Danh Mục Thiết Bị Giáo Dục | ${siteInfo.siteName || "Phúc An Minh"}`,
      description:
        "Danh sách tất cả các danh mục thiết bị mầm non, đồ chơi ngoài trời, nội thất phòng học và chăm sóc nuôi dưỡng đạt chuẩn Bộ GD&ĐT.",
    },
  };
}

export default async function ProductsPage() {
  const [siteInfo, categories, products, filtersData] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getProducts(),
    getFilters(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header siteInfo={siteInfo} categories={categories} />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-600">
          <Link href="/" className="hover:text-[#c8102e] flex items-center gap-1">
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900">Danh mục sản phẩm</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <ProductsPageClient
            categories={categories}
            products={products}
            filtersData={filtersData}
          />
        </div>
      </main>

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
