import React from "react";
import Link from "next/link";
import { ChevronRight, Newspaper } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Hướng dẫn bóc tách khối lượng và lập dự toán thú nhún lò xo cho dự án",
    excerpt: "Tổng chi phí lắp đặt hoàn thiện cho một thiết bị thú nhún lò xo cho dự án trường học, công viên...",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Yêu cầu bắt buộc khi lựa chọn thiết bị thú nhún lò xo cho khu đô thị và chung cư",
    excerpt: "Thiết bị thú nhún lò xo ngoài trời dành cho khu đô thị và chung cư cần đáp ứng độ bền và tiêu chuẩn an toàn...",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Tiêu chí chọn thú nhún lò xo chịu tải lớn cho các khu vui chơi trẻ em kinh doanh",
    excerpt: "Trong ngành kinh doanh khu vui chơi trẻ em (Kidzone / Commercial Playground), bài toán tối ưu linh kiện...",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Tiêu chí kỹ thuật và thẩm mỹ khi chọn thú nhún lò xo nhựa HDPE cho trường mầm non quốc tế",
    excerpt: "Trong mô hình giáo dục mầm non hiện đại, đặc biệt là tại các trường mầm non quốc tế, tiêu chuẩn chất lượng...",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=400&auto=format&fit=crop",
  },
];

export default function NewsSection() {
  return (
    <section className="w-full bg-gray-50 py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#c8102e] text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-r-full tracking-wider uppercase shadow">
              TƯ VẤN SẢN PHẨM
            </span>
          </div>
          <Link
            href="/tin-tuc"
            className="text-xs md:text-sm font-semibold text-gray-500 hover:text-[#c8102e] flex items-center gap-1 transition-colors"
          >
            <span>Xem thêm</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2x2 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group cursor-pointer"
            >
              <div className="w-28 h-24 sm:w-36 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-2 leading-relaxed">
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
