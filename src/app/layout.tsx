import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { QuoteProvider } from "@/context/QuoteContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();

  return {
    title: `${siteInfo.siteName || "PHÚC AN MINH"} - ${siteInfo.siteSubName || "Đồ Chơi & Thiết Bị Giáo Dục Mầm Non"}`,
    description: `Chuyên phân phối và cung cấp đồ chơi ngoài trời, nội thất mầm non, đồ chơi nhập khẩu, đồ chơi gỗ cho trường học và khu vui chơi. Hotline: ${siteInfo.hotline}`,
    icons: {
      icon: siteInfo.faviconUrl || "/favicon.png",
      shortcut: siteInfo.faviconUrl || "/favicon.png",
      apple: siteInfo.faviconUrl || "/favicon.png",
    },
    openGraph: {
      title: `${siteInfo.siteName} - ${siteInfo.siteSubName}`,
      description: `Chuyên phân phối, cung cấp đồ chơi ngoài trời, nội thất mầm non, đồ chơi nhập khẩu, đồ chơi gỗ.`,
      images: siteInfo.ogImageUrl ? [{ url: siteInfo.ogImageUrl }] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteInfo = await getSiteInfo();
  const primaryColor = siteInfo.primaryColor || "#c8102e";

  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href={siteInfo.faviconUrl || "/favicon.png"} />
        <link rel="shortcut icon" href={siteInfo.faviconUrl || "/favicon.png"} />
        <link rel="apple-touch-icon" href={siteInfo.faviconUrl || "/favicon.png"} />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --primary: ${primaryColor}; --primary-hover: ${primaryColor}; }`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans">
        <QuoteProvider>{children}</QuoteProvider>
      </body>
    </html>
  );
}
