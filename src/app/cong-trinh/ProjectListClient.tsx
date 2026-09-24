"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { MapPin, Ruler, Images, Search, ChevronRight, Building2, UserCheck, Calendar } from "lucide-react";

interface ProjectListClientProps {
  projects: Project[];
}

export default function ProjectListClient({ projects }: ProjectListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Get unique tags
  const tags = Array.from(new Set(projects.map((p) => p.tag).filter(Boolean)));

  const filteredProjects = projects.filter((item) => {
    const matchesTag = selectedTag === "all" || item.tag === selectedTag;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scale.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Tag Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedTag("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTag === "all"
                ? "bg-[#c8102e] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả công trình ({projects.length})
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-[#c8102e] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag} ({projects.filter((p) => p.tag === tag).length})
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            placeholder="Tìm theo tên, địa chỉ công trình..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 text-sm font-semibold border border-gray-200 shadow-sm">
          Không tìm thấy công trình nào phù hợp với từ khóa tìm kiếm.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((item) => (
            <Link
              key={item.id}
              href={`/cong-trinh/${item.slug}`}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Location Badge */}
                <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="line-clamp-1">{item.tag || item.address}</span>
                </span>

                {/* Gallery Images Count */}
                {item.images && item.images.length > 0 && (
                  <span className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                    <Images className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.images.length} ảnh</span>
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                {/* Info Footer */}
                <div className="pt-3 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{item.address}</span>
                  </div>

                  {item.scale && (
                    <div className="flex items-center gap-1.5 text-gray-600 line-clamp-1">
                      <Ruler className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{item.scale}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    {item.client && (
                      <span className="text-gray-500 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-500" />
                        <span className="line-clamp-1">{item.client}</span>
                      </span>
                    )}
                    <span className="font-bold text-[#c8102e] group-hover:translate-x-1 transition-transform flex items-center gap-0.5 ml-auto text-xs">
                      Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
