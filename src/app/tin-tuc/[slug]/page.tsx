import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getArticles } from "@/lib/getArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import {
  ChevronRight,
  Home as HomeIcon,
  Calendar,
  User,
  Eye,
  ArrowLeft,
  Share2,
  Newspaper,
  BookOpen,
} from "lucide-react";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [siteInfo, categories, allArticles] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getArticles(),
  ]);

  const article = allArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Related articles in same category or recent
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.categoryId === article.categoryId || !article.categoryId))
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header siteInfo={siteInfo} categories={categories} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-600 overflow-x-auto">
          <Link href="/" className="hover:text-[#c8102e] flex items-center gap-1 shrink-0">
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />

          <Link href="/tin-tuc" className="hover:text-[#c8102e] shrink-0">
            Tin tức & Tư vấn
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />

          <span className="font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          {/* Article Header Card */}
          <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-10 space-y-6">
            {/* Category Tag & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <span className="bg-[#c8102e] text-white font-bold text-xs px-3 py-1 rounded-full shadow">
                {article.categoryName}
              </span>
              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c8102e]" />
                  {article.createdAt}
                </span>
                {article.author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    {article.author}
                  </span>
                )}
                {article.views !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    {article.views} lượt xem
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt Summary Box */}
            {article.excerpt && (
              <div className="bg-red-50/70 border-l-4 border-[#c8102e] p-4 rounded-r-xl text-xs sm:text-sm text-gray-700 font-medium leading-relaxed italic">
                "{article.excerpt}"
              </div>
            )}

            {/* Featured Image */}
            {article.image && (
              <div className="rounded-xl overflow-hidden bg-gray-100 shadow-inner max-h-[450px]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4 pt-2 border-t border-gray-100">
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="space-y-4 [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#c8102e] [&_p]:text-gray-700 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              />
            </div>

            {/* Footer Back & Share */}
            <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách bài viết</span>
              </Link>
            </div>
          </article>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="bg-[#c8102e] text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-r-full tracking-wider uppercase shadow flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>BÀI VIẾT LIÊN QUAN</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((item) => (
                  <Link
                    key={item.id}
                    href={`/tin-tuc/${item.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="h-36 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#c8102e] bg-red-50 px-2 py-0.5 rounded">
                        {item.categoryName}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">
                      {item.createdAt}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
