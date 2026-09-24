"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { Project } from "@/types/project";
import { RefreshCw } from "lucide-react";

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data: Project[] = await res.json();
        const found = data.find((p) => p.id === id);
        if (found) {
          setProject(found);
        }
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu công trình", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#c8102e]" />
        <span>Đang tải dữ liệu công trình...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center text-gray-500 text-sm font-bold">
        Không tìm thấy công trình này!
      </div>
    );
  }

  return <ProjectForm initialData={project} isEdit={true} />;
}
