import React from "react";
import { getSiteInfo } from "@/lib/getSiteInfo";
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
  const siteInfo = await getSiteInfo();

  return (
    <div className="flex flex-col min-h-screen">
      <Header siteInfo={siteInfo} />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <ProductSection />
        <ProjectSection />
        <NewsSection />
        <QuoteFormBanner siteInfo={siteInfo} />
      </main>
      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
