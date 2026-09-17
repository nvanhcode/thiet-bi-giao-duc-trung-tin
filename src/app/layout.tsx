import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSiteInfo } from "@/lib/getSiteInfo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();

  return {
    title: `${siteInfo.siteName || "TRUNG TÍN"} - ${siteInfo.siteSubName || "Đồ Chơi & Thiết Bị Mầm Non"}`,
    description: `Chuyên sản xuất, cung cấp đồ chơi ngoài trời, nội thất mầm non, đồ chơi nhập khẩu, đồ chơi gỗ cho trường học và khu vui chơi. Hotline: ${siteInfo.hotline}`,
    icons: {
      icon: siteInfo.faviconUrl || "/favicon.ico",
      shortcut: siteInfo.faviconUrl || "/favicon.ico",
      apple: siteInfo.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title: `${siteInfo.siteName} - ${siteInfo.siteSubName}`,
      description: `Chuyên sản xuất, cung cấp đồ chơi ngoài trời, nội thất mầm non, đồ chơi nhập khẩu, đồ chơi gỗ.`,
      images: siteInfo.ogImageUrl ? [{ url: siteInfo.ogImageUrl }] : [],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
