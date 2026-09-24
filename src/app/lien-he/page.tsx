import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import QuoteFormBanner from "@/components/QuoteFormBanner";
import ContactClient from "./ContactClient";
import { Home as HomeIcon, ChevronRight, PhoneCall, MapPin, Building2 } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();

  return {
    title: `Liên Hệ | ${siteInfo.siteName || "PHÚC AN MINH"} - ${siteInfo.siteSubName || "Đồ Chơi & Thiết Bị Giáo Dục Mầm Non"}`,
    description: `Thông tin liên hệ, hotline ${siteInfo.hotline}, email ${siteInfo.email}, địa chỉ trụ sở văn phòng và VPGD thiết bị mầm non Phúc An Minh tại Hà Nội.`,
    openGraph: {
      title: `Liên Hệ | ${siteInfo.siteName} - ${siteInfo.siteSubName}`,
      description: `Hotline: ${siteInfo.hotline}. Địa chỉ: ${siteInfo.address}`,
      images: siteInfo.ogImageUrl ? [{ url: siteInfo.ogImageUrl }] : [],
    },
  };
}

export default async function ContactPage() {
  const [siteInfo, categories] = await Promise.all([
    getSiteInfo(),
    getCategories(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CÔNG TY TNHH THƯƠNG MẠI CÔNG NGHỆ PHÚC AN MINH",
    alternateName: `${siteInfo.siteName} - ${siteInfo.siteSubName}`,
    telephone: siteInfo.hotline,
    email: siteInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteInfo.address,
      addressLocality: "Tiến Thắng",
      addressRegion: "Hà Nội",
      addressCountry: "VN",
    },
    taxID: siteInfo.mst || "0110733916",
    url: "https://phucanminh.vn",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Structured SEO Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header siteInfo={siteInfo} categories={categories} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-600">
          <Link href="/" className="hover:text-[#c8102e] flex items-center gap-1 transition-colors">
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900">Liên hệ</span>
        </div>
      </div>

      {/* Hero Banner Header */}
      <section className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-slate-900/90 to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#c8102e] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            <Building2 className="w-3.5 h-3.5" />
            <span>Phúc An Minh - Đồ Chơi & Thiết Bị Mầm Non</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Thông Tin Liên Hệ & Tư Vấn Báo Giá
          </h1>
          {siteInfo.contactDescription?.trim() && (
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {siteInfo.contactDescription}
            </p>
          )}
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          {/* Contact Details & Google Map Interactive Component */}
          <ContactClient siteInfo={siteInfo} />
        </div>
      </main>

      {/* Quote Form Banner */}
      <QuoteFormBanner siteInfo={siteInfo} />

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
