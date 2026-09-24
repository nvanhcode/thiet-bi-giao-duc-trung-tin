"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import {
  MapPin,
  Ruler,
  UserCheck,
  Calendar,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  ArrowRight,
  Share2,
  Building2,
  CheckCircle2,
} from "lucide-react";

interface ProjectDetailClientProps {
  project: Project;
  relatedProjects: Project[];
}

export default function ProjectDetailClient({ project, relatedProjects }: ProjectDetailClientProps) {
  // Lightbox Modal state
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryList = project.images && project.images.length > 0 ? project.images : [project.image];

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % galleryList.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + galleryList.length) % galleryList.length);
    }
  };

  return (
    <div className="space-y-8">
      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-red-400 p-2 rounded-full bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Đóng ảnh"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-red-400 p-3 rounded-full bg-white/10 transition-colors cursor-pointer"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] relative flex flex-col items-center justify-center">
            <img
              src={galleryList[selectedImageIndex]}
              alt={`Hình ảnh minh hoạ ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            <span className="mt-3 text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-full">
              Ảnh minh hoạ {selectedImageIndex + 1} / {galleryList.length}
            </span>
          </div>

          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-red-400 p-3 rounded-full bg-white/10 transition-colors cursor-pointer"
            aria-label="Ảnh tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Title Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#c8102e] text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
            {project.tag}
          </span>
          {project.featured && (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
              ⭐ Công Trình Tiêu Biểu Nổi Bật
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
          {project.title}
        </h1>

        {/* Quick Info Grid Badge Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-start gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Địa chỉ</span>
              <span className="text-xs font-bold text-gray-900 leading-snug">{project.address}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-start gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Quy mô công trình</span>
              <span className="text-xs font-bold text-gray-900 leading-snug">{project.scale}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Chủ đầu tư / Đối tác</span>
              <span className="text-xs font-bold text-gray-900 leading-snug">{project.client || "Chưa cập nhật"}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Năm hoàn thành</span>
              <span className="text-xs font-bold text-gray-900 leading-snug">{project.completionYear || "2024"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Content + Gallery vs Sidebar CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Description & Gallery (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Thumbnail Image */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative aspect-[16/10]">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>

          {/* Excerpt Summary Box */}
          {project.excerpt && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-[#c8102e] p-5 rounded-2xl text-xs md:text-sm text-gray-800 leading-relaxed font-semibold">
              {project.excerpt}
            </div>
          )}

          {/* Gallery Section: Danh sách hình ảnh minh hoạ */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4 border-gray-100">
              <div className="flex items-center gap-2 font-black text-gray-900 text-lg">
                <Images className="w-6 h-6 text-[#c8102e]" />
                <h2>Danh Sách Hình Ảnh Minh Hoạ Chi Tiết ({galleryList.length})</h2>
              </div>
              <span className="text-xs text-gray-500 font-semibold hidden sm:block">Click vào ảnh để phóng to xem gallery</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryList.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-all"
                >
                  <img
                    src={imgUrl}
                    alt={`Minh hoạ công trình ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <Images className="w-4 h-4" />
                    <span>Xem ảnh #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Article Description Content */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Nội Dung Chi Tiết Bài Viết Mô Tả Công Trình</span>
              </h2>
            </div>

            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-normal
              [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-l-4 [&_h2]:border-[#c8102e] [&_h2]:pl-3
              [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-2
              [&_p]:mb-3 [&_p]:text-xs [&_p]:md:text-sm [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
              [&_li]:text-xs [&_li]:md:text-sm
              [&_img]:rounded-2xl [&_img]:my-4 [&_img]:shadow-md [&_img]:w-full"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
        </div>

        {/* Right Sidebar: Contact CTA & Related Projects (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CTA Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-4 border border-slate-700 sticky top-20">
            <div className="w-12 h-12 rounded-2xl bg-[#c8102e] flex items-center justify-center font-bold shadow-lg">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Bạn Cần Tư Vấn Sân Chơi / Dự Án?</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Liên hệ ngay với bộ phận kỹ sư thiết kế để nhận tư vấn bóc tách khối lượng & báo giá ưu đãi trực tiếp cho công trình của bạn.
              </p>
            </div>

            <div className="space-y-2 text-xs font-semibold pt-2">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Khảo sát mặt bằng miễn phí</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thiết kế phối cảnh 3D tiêu chuẩn</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bảo hành thiết bị lên tới 36 tháng</span>
              </div>
            </div>

            <Link
              href="/lien-he"
              className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Gửi Yêu Cầu Báo Giá Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Related Projects Box */}
          {relatedProjects.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-gray-900 border-b pb-3 border-gray-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#c8102e]" />
                <span>Các Công Trình Khác</span>
              </h3>

              <div className="space-y-4">
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/cong-trinh/${rel.slug}`}
                    className="flex gap-3 group items-center"
                  >
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2 leading-tight">
                        {rel.title}
                      </h4>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span className="line-clamp-1">{rel.tag || rel.address}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
