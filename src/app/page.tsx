import React from "react";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import { getProducts } from "@/lib/getProducts";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProductSection from "@/components/ProductSection";
import ProjectSection from "@/components/ProjectSection";
import NewsSection from "@/components/NewsSection";
import QuoteFormBanner from "@/components/QuoteFormBanner";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";

export const revalidate = 0; // Ensure fresh data on request

export default async function Home() {
  const [siteInfo, categories, products] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header siteInfo={siteInfo} categories={categories} />
      <main className="flex-1">
        <Hero siteInfo={siteInfo} categories={categories} />
        <AboutSection aboutSection={siteInfo.aboutSection} categories={categories} />
        <ProductSection categories={categories} products={products} />
        <ProjectSection />
        <NewsSection />
        <QuoteFormBanner siteInfo={siteInfo} />
      </main>
      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}

