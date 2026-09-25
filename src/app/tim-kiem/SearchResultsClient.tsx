"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { Article } from "@/types/article";
import { Project } from "@/types/project";
import ProductCard from "@/components/ProductCard";
import { searchMatch } from "@/lib/searchHelper";
import { DEFAULT_IMAGE, handleImageError } from "@/lib/imageFallback";
import {
  Search,
  X,
  Package,
  Newspaper,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Ruler,
  Calendar,
  User,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

interface SearchResultsClientProps {
  products: Product[];
  articles: Article[];
  projects: Project[];
}

type TabType = "all" | "products" | "articles" | "projects";
type SortOption = "default" | "price-asc" | "price-desc";

const POPULAR_TAGS = [
  "Xích đu",
  "Bập bênh",
  "Nội thất mầm non",
  "Cầu trượt",
  "Thú nhún",
  "Khu vui chơi",
  "Thông tư 02",
  "Đồ chơi gỗ",
];

export default function SearchResultsClient({
  products,
  articles,
  projects,
}: SearchResultsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialTab = (searchParams.get("tab") as TabType) || "all";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Synchronize when URL search param changes
  React.useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/tim-kiem?q=${encodeURIComponent(trimmed)}&tab=${activeTab}`);
    } else {
      router.push(`/tim-kiem`);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    router.push(`/tim-kiem?q=${encodeURIComponent(tag)}&tab=${activeTab}`);
  };

  // Filter products
  const matchingProducts = useMemo(() => {
    if (!query.trim()) return [];
    const list = products.filter((p) => {
      if (searchMatch(p.name, query)) return true;
      if (searchMatch(p.code, query)) return true;
      if (searchMatch(p.summary, query)) return true;
      if (searchMatch(p.description, query)) return true;
      if (searchMatch(p.origin, query)) return true;
      if (searchMatch(p.blockCount, query)) return true;
      if (searchMatch(p.slideType, query)) return true;
      if (searchMatch(p.feature, query)) return true;
      if (searchMatch(p.investmentLevel, query)) return true;
      if (
        p.specifications &&
        p.specifications.some(
          (s) => searchMatch(s.key, query) || searchMatch(s.value, query)
        )
      ) {
        return true;
      }
      return false;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => {
        const pA = typeof a.price === "number" ? a.price : 999999999;
        const pB = typeof b.price === "number" ? b.price : 999999999;
        return pA - pB;
      });
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => {
        const pA = typeof a.price === "number" ? a.price : 0;
        const pB = typeof b.price === "number" ? b.price : 0;
        return pB - pA;
      });
    }
    return list;
  }, [products, query, sortBy]);

  // Filter articles
  const matchingArticles = useMemo(() => {
    if (!query.trim()) return [];
    return articles.filter((a) => {
      if (searchMatch(a.title, query)) return true;
      if (searchMatch(a.excerpt, query)) return true;
      if (searchMatch(a.content, query)) return true;
      if (searchMatch(a.categoryName, query)) return true;
      if (searchMatch(a.author, query)) return true;
      return false;
    });
  }, [articles, query]);

  // Filter projects
  const matchingProjects = useMemo(() => {
    if (!query.trim()) return [];
    return projects.filter((p) => {
      if (searchMatch(p.title, query)) return true;
      if (searchMatch(p.tag, query)) return true;
      if (searchMatch(p.address, query)) return true;
      if (searchMatch(p.scale, query)) return true;
      if (searchMatch(p.client, query)) return true;
      if (searchMatch(p.excerpt, query)) return true;
      if (searchMatch(p.description, query)) return true;
      return false;
    });
  }, [projects, query]);

  const totalResults =
    matchingProducts.length + matchingArticles.length + matchingProjects.length;

  return (
    <div className="space-y-6">
      {/* Search Header Bar & Popular Tags */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm sản phẩm, bài viết, công trình..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#c8102e] rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  router.push("/tim-kiem");
                }}
                className="absolute right-3 top-3.5 p-0.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 sm:px-7 py-3 bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>
        </form>

        {/* Popular Tags */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-gray-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý tìm kiếm:</span>
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 bg-gray-100 hover:bg-red-50 hover:text-[#c8102e] text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Container */}
      {!query.trim() ? (
        /* State when no query is typed */
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-[#c8102e] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Search className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-gray-800">
              Nhập từ khóa để bắt đầu tìm kiếm
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bạn có thể tìm kiếm tên sản phẩm (Xích đu, bập bênh...), mã sản phẩm, bài viết tư vấn hoặc tên công trình thi công.
            </p>
          </div>
        </div>
      ) : totalResults === 0 ? (
        /* State when query returns 0 results */
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <X className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-gray-800">
              Không tìm thấy kết quả phù hợp cho &quot;<span className="text-[#c8102e]">{query}</span>&quot;
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Vui lòng kiểm tra lại chính tả hoặc thử với từ khóa đơn giản hơn như &quot;xích đu&quot;, &quot;bập bênh&quot;, &quot;bàn ghế&quot;.
            </p>
          </div>
        </div>
      ) : (
        /* Results Content with Tabs */
        <div className="space-y-6">
          {/* Tabs Navigation & Sort Control */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#c8102e] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>Tất cả</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {totalResults}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "products"
                    ? "bg-[#c8102e] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Sản phẩm</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {matchingProducts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("articles")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "articles"
                    ? "bg-[#c8102e] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Bài viết</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {matchingArticles.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "projects"
                    ? "bg-[#c8102e] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Công trình</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {matchingProjects.length}
                </span>
              </button>
            </div>

            {/* Price Sort (Only visible when products exist) */}
            {(activeTab === "all" || activeTab === "products") && matchingProducts.length > 0 && (
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-gray-500 font-medium flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sắp xếp giá:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-800 focus:outline-none focus:border-[#c8102e]"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
              </div>
            )}
          </div>

          {/* TAB 1: ALL RESULTS */}
          {activeTab === "all" && (
            <div className="space-y-10">
              {/* Section Products */}
              {matchingProducts.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-50 text-[#c8102e] flex items-center justify-center font-bold">
                        <Package className="w-4 h-4" />
                      </div>
                      <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                        Sản phẩm ({matchingProducts.length})
                      </h2>
                    </div>
                    {matchingProducts.length > 8 && (
                      <button
                        onClick={() => setActiveTab("products")}
                        className="text-xs font-bold text-[#c8102e] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Xem tất cả {matchingProducts.length} sản phẩm</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {matchingProducts.slice(0, 8).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              )}

              {/* Section Articles */}
              {matchingArticles.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Newspaper className="w-4 h-4" />
                      </div>
                      <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                        Bài viết & Tư vấn ({matchingArticles.length})
                      </h2>
                    </div>
                    {matchingArticles.length > 4 && (
                      <button
                        onClick={() => setActiveTab("articles")}
                        className="text-xs font-bold text-[#c8102e] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Xem tất cả {matchingArticles.length} bài viết</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchingArticles.slice(0, 4).map((art) => (
                      <Link
                        key={art.id}
                        href={`/tin-tuc/${art.slug}`}
                        className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all flex gap-4 group"
                      >
                        <div className="w-28 h-24 sm:w-36 sm:h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={art.image || DEFAULT_IMAGE}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#c8102e] uppercase tracking-wider block mb-1">
                              {art.categoryName || "Tin tức"}
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug">
                              {art.title}
                            </h3>
                            <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 mt-1">
                              {art.excerpt}
                            </p>
                          </div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-2 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {art.createdAt ? new Date(art.createdAt).toLocaleDateString("vi-VN") : "Mới đăng"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Section Projects */}
              {matchingProjects.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                        Công trình tiêu biểu ({matchingProjects.length})
                      </h2>
                    </div>
                    {matchingProjects.length > 3 && (
                      <button
                        onClick={() => setActiveTab("projects")}
                        className="text-xs font-bold text-[#c8102e] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Xem tất cả {matchingProjects.length} công trình</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matchingProjects.slice(0, 3).map((pj) => (
                      <Link
                        key={pj.id}
                        href={`/cong-trinh/${pj.slug}`}
                        className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                          <img
                            src={pj.image || DEFAULT_IMAGE}
                            alt={pj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                          <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-400" />
                            <span>{pj.tag || pj.address}</span>
                          </span>
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2">
                              {pj.title}
                            </h3>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                              {pj.excerpt}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                            <span className="flex items-center gap-1 truncate">
                              <Ruler className="w-3 h-3 text-[#c8102e]" />
                              <span>{pj.scale}</span>
                            </span>
                            <span className="font-bold text-[#c8102e] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Chi tiết <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS ONLY */}
          {activeTab === "products" && (
            <div className="space-y-4">
              {matchingProducts.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm font-medium">
                  Không tìm thấy sản phẩm nào matching với từ khóa.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {matchingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ARTICLES ONLY */}
          {activeTab === "articles" && (
            <div className="space-y-4">
              {matchingArticles.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm font-medium">
                  Không tìm thấy bài viết nào matching với từ khóa.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchingArticles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/tin-tuc/${art.slug}`}
                      className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all flex gap-4 group"
                    >
                      <div className="w-32 h-28 sm:w-40 sm:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={art.image || DEFAULT_IMAGE}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#c8102e] uppercase tracking-wider block mb-1">
                            {art.categoryName || "Tin tức"}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug">
                            {art.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 mt-1">
                            {art.excerpt}
                          </p>
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center justify-between mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {art.createdAt ? new Date(art.createdAt).toLocaleDateString("vi-VN") : "Mới đăng"}
                          </span>
                          <span className="font-bold text-[#c8102e] group-hover:underline flex items-center gap-0.5">
                            Đọc tiếp <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROJECTS ONLY */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              {matchingProjects.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm font-medium">
                  Không tìm thấy công trình nào matching với từ khóa.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchingProjects.map((pj) => (
                    <Link
                      key={pj.id}
                      href={`/cong-trinh/${pj.slug}`}
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={pj.image || DEFAULT_IMAGE}
                          alt={pj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={handleImageError}
                        />
                        <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          <span>{pj.tag || pj.address}</span>
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2">
                            {pj.title}
                          </h3>
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                            {pj.excerpt}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                          <span className="flex items-center gap-1 truncate">
                            <Ruler className="w-3 h-3 text-[#c8102e]" />
                            <span>{pj.scale}</span>
                          </span>
                          <span className="font-bold text-[#c8102e] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                            Xem công trình <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
