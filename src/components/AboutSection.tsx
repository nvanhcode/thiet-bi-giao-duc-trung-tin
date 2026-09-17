import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
  PackageCheck,
  Building2,
  PhoneCall
} from "lucide-react";

export default function AboutSection() {
  return (
    <section className="w-full bg-white py-12 border-t border-b border-gray-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 text-[#c8102e] font-bold text-xs rounded-full uppercase tracking-wider shadow-sm border border-red-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xưởng Sản Xuất Trực Tiếp - Trung Tín</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              Công ty Thiết bị Giáo dục <span className="text-[#c8102e]">Trung Tín</span> – Giải pháp toàn diện cho Trường Mầm Nông & Khu Vui Chơi
            </h2>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              <strong>Công ty Thiết bị Giáo dục Trung Tín</strong> là đơn vị hàng đầu chuyên trực tiếp sản xuất, nhập khẩu và cung cấp toàn bộ hệ thống <strong>thiết bị mầm non, đồ chơi vận động ngoài trời, nội thất phòng học và thiết bị nhà bếp mầm non</strong> đạt chuẩn quy định của Bộ Giáo dục & Đào tạo.
            </p>

            <p className="text-gray-600 text-sm leading-relaxed">
              Với danh mục <strong>hơn 260+ sản phẩm catalog chính hãng</strong> (từ mã <code>TT-01</code> đến <code>TT-536</code>), Trung Tín cam kết mang đến sản phẩm an toàn tuyệt đối cho trẻ nhỏ, mẫu mã đa dạng phong phú, độ bền vượt trội và giá thành cạnh tranh trực tiếp từ xưởng sản xuất.
            </p>

            {/* Key product category highlights */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Nội thất phòng học</h4>
                  <p className="text-[11px] text-gray-500">Bàn ghế, giá kệ gỗ thông, kệ tủ MDF, tủ tư trang</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Đồ chơi ngoài trời</h4>
                  <p className="text-[11px] text-gray-500">Liên hoàn cầu trượt, xích đu, đu quay, thú nhún</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Thiết bị bếp & nuôi dưỡng</h4>
                  <p className="text-[11px] text-gray-500">Tủ cơm ga, tủ sấy bát, giá phơi khăn, giá úp nồi</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Vườn cổ tích & Học liệu</h4>
                  <p className="text-[11px] text-gray-500">Tượng cổ tích, bộ đèn giao thông, sa bàn học tập</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/san-pham"
                className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Xem catalog 260+ sản phẩm</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lien-he"
                className="border-2 border-[#c8102e] text-[#c8102e] hover:bg-red-50 font-bold text-xs md:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Nhận tư vấn & báo giá xưởng</span>
              </Link>
            </div>
          </div>

          {/* Right Statistics & Visual Showcase Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Feature Banner Card */}
            <div className="bg-gradient-to-br from-[#c8102e] to-[#80081c] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4 border-b border-white/20 pb-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">THIẾT BỊ GIÁO DỤC TRUNG TÍN</h3>
                  <p className="text-xs text-red-100">Uy tín - Chất lượng - Chuẩn Bộ Giáo Dục</p>
                </div>
              </div>

              {/* Grid 4 Stats */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/10 backdrop-blur p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-2xl font-black text-amber-300 block">260+</span>
                  <span className="text-[11px] text-red-100 font-medium">Mã sản phẩm Catalog</span>
                </div>

                <div className="bg-white/10 backdrop-blur p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-2xl font-black text-amber-300 block">100%</span>
                  <span className="text-[11px] text-red-100 font-medium">Chuẩn an toàn mầm non</span>
                </div>

                <div className="bg-white/10 backdrop-blur p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-2xl font-black text-amber-300 block">12 - 24T</span>
                  <span className="text-[11px] text-red-100 font-medium">Bảo hành chính hãng</span>
                </div>

                <div className="bg-white/10 backdrop-blur p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-2xl font-black text-amber-300 block">Toàn Quốc</span>
                  <span className="text-[11px] text-red-100 font-medium">Giao hàng & Lắp đặt</span>
                </div>
              </div>
            </div>

            {/* Catalog Sample Grid Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-xl text-center group hover:border-[#c8102e] transition-colors">
                <img
                  src="/products/catalog/tt-01.jpg"
                  alt="Kệ gỗ mầm non Trung Tín"
                  className="w-full h-20 object-contain rounded-md mb-1 group-hover:scale-105 transition-transform"
                />
                <span className="text-[10px] font-bold text-gray-700 block truncate">Kệ Gỗ Thông</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-2 rounded-xl text-center group hover:border-[#c8102e] transition-colors">
                <img
                  src="/products/catalog/tt-129.jpg"
                  alt="Cầu trượt liên hoàn Trung Tín"
                  className="w-full h-20 object-contain rounded-md mb-1 group-hover:scale-105 transition-transform"
                />
                <span className="text-[10px] font-bold text-gray-700 block truncate">Cầu Trượt</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-2 rounded-xl text-center group hover:border-[#c8102e] transition-colors">
                <img
                  src="/products/catalog/tt-352.jpg"
                  alt="Tủ sấy bát mầm non Trung Tín"
                  className="w-full h-20 object-contain rounded-md mb-1 group-hover:scale-105 transition-transform"
                />
                <span className="text-[10px] font-bold text-gray-700 block truncate">Tủ Bếp Inox</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

