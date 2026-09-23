import React from "react";
import Link from "next/link";
import { ChevronRight, Newspaper, Calendar } from "lucide-react";
import { getArticles } from "@/lib/getArticles";

export default async function NewsSection() {
  const allArticles = await getArticles();
  
  // Lấy các bài viết thuộc danh mục tư vấn sản phẩm hoặc nổi bật (tối đa 4 bài)
  const articles = allArticles
    .filter((a) => a.categoryId === "tu-van-san-pham" || a.featured)
    .slice(0, 4);

  return (
    <section className="w-full bg-gray-50 py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#c8102e] text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-r-full tracking-wider uppercase shadow flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" />
              <span>TƯ VẤN SẢN PHẨM & KINH NGHIỆM</span>
            </span>
          </div>
          <Link
            href="/tin-tuc"
            className="text-xs md:text-sm font-semibold text-gray-500 hover:text-[#c8102e] flex items-center gap-1 transition-colors"
          >
            <span>Xem thêm tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2x2 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((item) => (
            <Link
              key={item.id}
              href={`/tin-tuc/${item.slug}`}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group cursor-pointer"
            >
              <div className="w-28 h-24 sm:w-36 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-gray-100 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#c8102e] bg-red-50 px-2 py-0.5 rounded">
                      {item.categoryName}
                    </span>
                    {item.createdAt && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.createdAt}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
                <div className="text-[11px] font-bold text-[#c8102e] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  <span>Chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
