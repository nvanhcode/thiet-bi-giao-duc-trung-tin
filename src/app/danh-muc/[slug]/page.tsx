import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getProducts } from "@/lib/getProducts";
import { getFilters } from "@/lib/getFilters";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import CategoryProductsClient from "./CategoryProductsClient";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [siteInfo, categories, allProducts, filtersData] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getProducts(),
    getFilters(),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  // Find parent category if any
  const parentCategory = currentCategory.parentId
    ? categories.find((c) => c.id === currentCategory.parentId)
    : null;

  // Collect category IDs (current + children if any)
  const childCategoryIds = categories.filter((c) => c.parentId === currentCategory.id).map((c) => c.id);
  const targetCategoryIds = [currentCategory.id, ...childCategoryIds];

  // Filter products for this category branch
  const categoryProducts = allProducts.filter((p) =>
    (p.categoryIds || []).some((catId) => targetCategoryIds.includes(catId))
  );

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

          {parentCategory && (
            <>
              <Link href={`/danh-muc/${parentCategory.slug}`} className="hover:text-[#c8102e]">
                {parentCategory.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </>
          )}

          <span className="font-bold text-gray-900">{currentCategory.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {/* Category Title & Description */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <h1 className="text-xl md:text-2xl font-black text-[#c8102e] uppercase tracking-wide">
              {currentCategory.name}
            </h1>
            {currentCategory.description && (
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {currentCategory.description}
              </p>
            )}
          </div>

          {/* Interactive Products Grid & Filter Bar Client Component */}
          <CategoryProductsClient initialProducts={categoryProducts} filtersData={filtersData} />
        </div>
      </main>

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
