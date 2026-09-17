import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Đồ Chơi & Thiết Bị Mầm Non Trung Tín | Sản Xuất & Cung Cấp Toàn Quốc",
  description: "Đồ Chơi Trung Tín - Chuyên sản xuất, cung cấp đồ chơi ngoài trời, nội thất mầm non, đồ chơi nhập khẩu, đồ chơi gỗ, thiết bị Thông tư 02 cho trường học và khu vui chơi.",
};

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
