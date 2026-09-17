import React from "react";
import Link from "next/link";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";
import {
  MapPin,
  Factory,
  Phone,
  Mail,
  ShieldAlert,
  UserCog,
} from "lucide-react";

interface FooterProps {
  siteInfo?: SiteInfo;
}

export default function Footer({ siteInfo = defaultSiteInfo }: FooterProps) {
  return (
    <footer className="w-full bg-[#111827] text-gray-300 text-xs pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Column 1: Company Info */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              ĐỒ CHƠI MẦM NON {siteInfo.siteName || "TRUNG TÍN"}
            </h3>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
              <p>
                <span className="font-bold text-gray-200">Địa chỉ:</span> {siteInfo.address}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Factory className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
              <p>
                <span className="font-bold text-gray-200">Xưởng sản xuất:</span> {siteInfo.factoryAddress}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#c8102e] shrink-0" />
              <p>
                <span className="font-bold text-gray-200">Hotline:</span>{" "}
                <a
                  href={`tel:${(siteInfo.hotline || "").replace(/\s+/g, "")}`}
                  className="text-red-400 font-bold hover:underline"
                >
                  {siteInfo.hotline}
                </a>
                {siteInfo.landline && ` | Bàn: ${siteInfo.landline}`}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#c8102e] shrink-0" />
              <p>
                <span className="font-bold text-gray-200">Email:</span> {siteInfo.email}
              </p>
            </div>
          </div>

          {/* Column 2: Product Categories */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              DANH MỤC SẢN PHẨM
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/do-choi-ngoai-troi" className="hover:text-white transition-colors">
                  Đồ chơi ngoài trời
                </Link>
              </li>
              <li>
                <Link href="/noi-that-mam-non" className="hover:text-white transition-colors">
                  Nội thất mầm non
                </Link>
              </li>
              <li>
                <Link href="/do-choi-nhap-khau" className="hover:text-white transition-colors">
                  Đồ chơi nhập khẩu
                </Link>
              </li>
              <li>
                <Link href="/do-choi-go" className="hover:text-white transition-colors">
                  Đồ chơi gỗ
                </Link>
              </li>
              <li>
                <Link href="/do-choi-thong-tu-02" className="hover:text-white transition-colors">
                  Đồ chơi theo thông tư 02
                </Link>
              </li>
              <li>
                <Link href="/do-choi-khu-vui-choi" className="hover:text-white transition-colors">
                  Đồ chơi khu vui chơi trong nhà
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="lg:col-span-2 space-y-2">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              HỖ TRỢ KHÁCH HÀNG
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/chinh-sach-bao-mat" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/huong-dan-mua-hang" className="hover:text-white transition-colors">
                  Hướng dẫn mua hàng, thanh toán
                </Link>
              </li>
              <li>
                <Link href="/phuong-thuc-van-chuyen" className="hover:text-white transition-colors">
                  Phương thức vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="hover:text-white transition-colors">
                  Chính sách đổi trả, hoàn tiền
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-hanh" className="hover:text-white transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span>Trang Quản Trị Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Badges */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              KẾT NỐI VỚI CHÚNG TÔI
            </h3>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={siteInfo.facebookUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#1877f2] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={siteInfo.tiktokUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-black text-white flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <span className="font-extrabold text-xs">TT</span>
              </a>
              <a
                href={siteInfo.pinterestUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#e60023] text-white flex items-center justify-center transition-colors"
                aria-label="Pinterest"
              >
                <span className="font-extrabold text-xs">P</span>
              </a>
              <a
                href={siteInfo.youtubeUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#ff0000] text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Badges */}
            <div className="pt-2 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/60 border border-blue-500/40 rounded text-blue-200 text-[11px] font-bold">
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                <span>ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG</span>
              </div>
              <div>
                <span className="inline-block px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] text-gray-400 font-mono">
                  DMCA PROTECTED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-[11px] text-gray-500">
          {siteInfo.copyrightText}
        </div>
      </div>
    </footer>
  );
}
