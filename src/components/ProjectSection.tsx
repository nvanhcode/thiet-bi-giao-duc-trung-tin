import React from "react";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Công trình thi công lắp đặt sân chơi trẻ em ngoài trời khu tập thể tại Hải Dương",
    tag: "Khu tập thể | Hải Dương",
    excerpt: "Một khu tập thể trẻ sẽ trở nên đáng sống hơn khi có những không gian vui chơi bổ ích cho con trẻ...",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Thi công lắp đặt cầu trượt gỗ ngoài trời và thiết bị thể dục ngoài trời cho khu đô thị tại Đắk Lắk",
    tag: "Khu đô thị | Đắk Lắk",
    excerpt: "Ngày nay, một khu đô thị đáng sống không chỉ được đánh giá qua hạ tầng mà còn từ tiện ích sân chơi...",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Công trình lắp đặt đồ chơi ngoài trời cho khách sạn tại Sầm Sơn, Thanh Hoá",
    tag: "Resort / Khu nghỉ dưỡng | Thanh Hoá",
    excerpt: "Một khu vui chơi ngoài trời được thiết kế đẹp mắt, an toàn sẽ giúp khách sạn thu hút các gia đình...",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop",
  },
];

export default function ProjectSection() {
  return (
    <section className="w-full bg-white py-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#c8102e] text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-r-full tracking-wider uppercase shadow">
              CÔNG TRÌNH TIÊU BIỂU
            </span>
          </div>
          <Link
            href="/cong-trinh"
            className="text-xs md:text-sm font-semibold text-gray-500 hover:text-[#c8102e] flex items-center gap-1 transition-colors"
          >
            <span>Xem thêm</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>{item.tag}</span>
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
