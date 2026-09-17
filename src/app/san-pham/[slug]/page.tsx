import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getProducts } from "@/lib/getProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [siteInfo, categories, allProducts] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getProducts(),
  ]);

  const product = allProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Find primary category
  const primaryCategoryId = (product.categoryIds || [])[0];
  const primaryCategory = categories.find((c) => c.id === primaryCategoryId);

  // Related products
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.categoryIds || []).some((id) => product.categoryIds?.includes(id)))
    .slice(0, 4);

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

          {primaryCategory && (
            <>
              <Link href={`/danh-muc/${primaryCategory.slug}`} className="hover:text-[#c8102e]">
                {primaryCategory.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </>
          )}

          <span className="font-bold text-gray-900 truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Detail Body */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Product Detail Card Component */}
          <ProductDetailClient product={product} siteInfo={siteInfo} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
                <span className="bg-[#c8102e] text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-r-full tracking-wider uppercase shadow">
                  SẢN PHẨM CÙNG DANH MỤC
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
