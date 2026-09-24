import React from "react";
import Link from "next/link";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getProjects } from "@/lib/getProjects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import ProjectListClient from "./ProjectListClient";
import { ChevronRight, Home as HomeIcon, Building2 } from "lucide-react";

export const revalidate = 0;

export default async function ProjectsPage() {
  const [siteInfo, categories, projects] = await Promise.all([
    getSiteInfo(),
    getCategories(),
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
          <span className="font-bold text-gray-900">Công trình tiêu biểu</span>
        </div>
      </div>

      {/* Hero Banner Header */}
      <section className="bg-slate-900 text-white py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 to-slate-900/90 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#c8102e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
            <Building2 className="w-3.5 h-3.5" />
            <span>Dự án & Công trình đã thực hiện</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Công Trình Tiêu Biểu Thi Công Lắp Đặt Thiết Bị Sân Chơi
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Tổng hợp hình ảnh minh hoạ thực tế, địa chỉ, quy mô các công trình sân chơi ngoài trời, khu đô thị, khu dân cư, resort và trường học trên toàn quốc.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <ProjectListClient projects={projects} />
        </div>
      </main>

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
