import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getProjects, getProjectBySlug } from "@/lib/getProjects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import ProjectDetailClient from "./ProjectDetailClient";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [siteInfo, categories, project, allProjects] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 3);

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
          <Link href="/cong-trinh" className="hover:text-[#c8102e]">
            Công trình tiêu biểu
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900 line-clamp-1">{project.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <ProjectDetailClient project={project} relatedProjects={relatedProjects} />
        </div>
      </main>

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
