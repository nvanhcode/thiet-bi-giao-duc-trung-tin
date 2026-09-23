"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Article, ArticleCategory } from "@/types/article";
import { Search, Calendar, User, Eye, ChevronRight, Newspaper, BookOpen, Sparkles, Filter } from "lucide-react";

interface NewsListClientProps {
  articles: Article[];
  categories: ArticleCategory[];
}

export default function NewsListClient({ articles, categories }: NewsListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter articles
  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      selectedCategory === "all" || art.categoryId === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter((a) => a.featured);

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#c8102e] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tất cả bài viết ({articles.length})</span>
          </button>

          {categories.map((cat) => {
            const count = articles.filter((a) => a.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-[#c8102e] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Featured Header (if "all" category and no search) */}
      {selectedCategory === "all" && !searchQuery && featuredArticles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="bg-[#c8102e] text-white font-black text-xs px-3.5 py-1 rounded-r-full uppercase tracking-wider shadow flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BÀI VIẾT NỔI BẬT</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top 1 Big Featured Card */}
            {featuredArticles.slice(0, 1).map((item) => (
              <Link
                key={item.id}
                href={`/tin-tuc/${item.slug}`}
                className="lg:col-span-7 group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-64 sm:h-80 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#c8102e] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                    {item.categoryName}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#c8102e]" />
                      {item.createdAt}
                    </span>
                    {item.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        {item.author}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#c8102e] group-hover:translate-x-1 transition-transform">
                    <span>Đọc tiếp bài viết</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}

            {/* Sub Featured Cards */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {featuredArticles.slice(1, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/tin-tuc/${item.slug}`}
                  className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex gap-4 items-center"
                >
                  <div className="w-28 h-24 sm:w-32 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#c8102e] bg-red-50 px-2 py-0.5 rounded">
                      {item.categoryName}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-gray-400 flex items-center gap-2">
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Articles List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <span className="bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-r-full uppercase tracking-wider shadow">
            {selectedCategory === "all"
              ? "DANH SÁCH BÀI VIẾT"
              : categories.find((c) => c.id === selectedCategory)?.name || "DANH SÁCH BÀI VIẾT"}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Hiển thị {filteredArticles.length} bài viết
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">Chưa có bài viết nào phù hợp</p>
            <p className="text-xs text-gray-500">Vui lòng thử tìm kiếm với từ khóa khác hoặc chuyển danh mục.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((item) => (
              <Link
                key={item.id}
                href={`/tin-tuc/${item.slug}`}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#c8102e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {item.categoryName}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#c8102e]" />
                        {item.createdAt}
                      </span>
                      {item.views !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.views} lượt xem
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-2 text-xs font-bold text-[#c8102e]">
                  <span>Xem chi tiết</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
