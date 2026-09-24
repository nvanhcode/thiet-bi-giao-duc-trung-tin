"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Star,
  MapPin,
  Calendar,
  Images,
  ExternalLink,
  Ruler,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      showToast("Lỗi tải danh sách công trình!", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa công trình này?")) return;

    const updatedList = projects.filter((p) => p.id !== id);

    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setProjects(updatedList);
        showToast("Xóa công trình thành công!", "success");
      } else {
        showToast("Lỗi xóa công trình!", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ!", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    const updatedProject = { ...project, featured: !project.featured };
    const updatedList = projects.map((p) => (p.id === project.id ? updatedProject : p));

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setProjects(updatedList);
        showToast(
          updatedProject.featured
            ? "Đã đánh dấu công trình NỔI BẬT trang chủ!"
            : "Đã bỏ đánh dấu nổi bật",
          "success"
        );
      }
    } catch (err) {
      showToast("Lỗi cập nhật trạng thái!", "error");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#c8102e]" />
        <span>Đang tải dữ liệu công trình tiêu biểu...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold border ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : "bg-red-600 text-white border-red-500"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Quản Lý Công Trình Tiêu Biểu</h2>
            <p className="text-xs text-gray-500">
              Quản lý danh sách dự án, hình ảnh minh hoạ gallery, thông tin địa chỉ, quy mô & bài viết chi tiết
            </p>
          </div>
        </div>

        <Link
          href="/cong-trinh"
          target="_blank"
          className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-indigo-200"
        >
          <span>Xem danh sách công trình public</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm tên công trình, địa chỉ, loại hình..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-medium text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <Link
          href="/admin/projects/create"
          className="w-full md:w-auto bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Công Trình Mới</span>
        </Link>
      </div>

      {/* Projects Grid / Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase tracking-wider grid grid-cols-12 gap-4">
          <div className="col-span-5">Công Trình</div>
          <div className="col-span-3">Địa Chỉ & Quy Mô</div>
          <div className="col-span-2 text-center">Ảnh Minh Hoạ & Nổi Bật</div>
          <div className="col-span-2 text-right">Thao Tác</div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            Chưa có công trình nào phù hợp. Bấm "Thêm Công Trình Mới" để tạo dự án đầu tiên.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 hover:bg-gray-50/80 transition-colors grid grid-cols-12 gap-4 items-center text-xs"
              >
                {/* Image & Title */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {project.images && project.images.length > 0 && (
                      <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                        <Images className="w-2.5 h-2.5" />
                        <span>{project.images.length}</span>
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <Link
                      href={`/cong-trinh/${project.slug}`}
                      target="_blank"
                      className="font-bold text-gray-900 hover:text-[#c8102e] transition-colors line-clamp-1 flex items-center gap-1"
                    >
                      <span>{project.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-gray-400" />
                    </Link>
                    <span className="inline-block bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      {project.tag}
                    </span>
                  </div>
                </div>

                {/* Address & Scale */}
                <div className="col-span-3 space-y-1 text-gray-600">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-800 line-clamp-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{project.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 line-clamp-1">
                    <Ruler className="w-3 h-3 text-gray-400 shrink-0" />
                    <span>{project.scale}</span>
                  </div>
                </div>

                {/* Gallery Images Count & Featured Toggle */}
                <div className="col-span-2 flex flex-col items-center justify-center space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                    <Images className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{project.images?.length || 0} ảnh minh hoạ</span>
                  </div>

                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      project.featured
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    title="Bật/Tắt hiển thị ở trang chủ"
                  >
                    <Star className={`w-3 h-3 ${project.featured ? "fill-amber-500 text-amber-500" : ""}`} />
                    <span>{project.featured ? "Nổi bật" : "Thường"}</span>
                  </button>
                </div>

                {/* Action buttons */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/projects/edit/${project.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                    title="Chỉnh sửa công trình"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                    title="Xóa công trình"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
