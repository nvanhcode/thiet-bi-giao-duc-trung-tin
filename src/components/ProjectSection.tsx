"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Ruler, Images } from "lucide-react";
import { Project } from "@/types/project";

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data: Project[] = await res.json();
        // Filter featured projects or take top 3
        const featured = data.filter((p) => p.featured);
        setProjects(featured.length > 0 ? featured.slice(0, 3) : data.slice(0, 3));
      }
    } catch (err) {
      console.error("Lỗi nạp danh sách công trình:", err);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-72"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">Chưa có dữ liệu công trình.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((item) => (
              <Link
                key={item.id}
                href={`/cong-trinh/${item.slug}`}
                className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="line-clamp-1">{item.tag || item.address}</span>
                  </span>

                  {item.images && item.images.length > 0 && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-bold backdrop-blur">
                      <Images className="w-3 h-3 text-indigo-400" />
                      <span>{item.images.length} ảnh</span>
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  {item.scale && (
                    <div className="pt-2 border-t border-gray-200/60 text-[11px] text-gray-500 flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="line-clamp-1">{item.scale}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
