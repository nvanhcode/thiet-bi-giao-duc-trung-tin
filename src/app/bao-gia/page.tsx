import React from "react";
import Link from "next/link";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { Home as HomeIcon, ChevronRight, FileText } from "lucide-react";
import BaoGiaClient from "./BaoGiaClient";

export const revalidate = 0;

export default async function BaoGiaPage() {
  const [siteInfo, categories] = await Promise.all([
    getSiteInfo(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header siteInfo={siteInfo} categories={categories} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-600">
          <Link href="/" className="hover:text-[#c8102e] flex items-center gap-1">
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#c8102e]" />
            <span>Yêu cầu báo giá & Tra cứu</span>
          </span>
        </div>
      </div>

      <main className="flex-1 py-6 md:py-10">
        <BaoGiaClient siteInfo={siteInfo} />
      </main>

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
