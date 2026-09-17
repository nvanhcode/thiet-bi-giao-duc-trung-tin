"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Upload,
  RefreshCw,
} from "lucide-react";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Nhập nội dung bài viết mô tả sản phẩm tại đây...",
}: RichTextEditorProps) {
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync value to contentEditable on initial mount or source switch
  useEffect(() => {
    if (editorRef.current && !showHtmlSource) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, showHtmlSource]);

  const execCommand = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Insert uploaded WebP image into editor
        execCommand("insertImage", data.url);
      } else {
        alert("Lỗi tải lên hình ảnh!");
      }
    } catch (err) {
      alert("Lỗi kết nối server khi tải ảnh!");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const promptLink = () => {
    const url = prompt("Nhập đường dẫn liên kết (URL):", "https://");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const promptImageUrl = () => {
    const url = prompt("Nhập đường dẫn hình ảnh (URL):", "https://");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-bold text-gray-700">{label}</label>}

      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#c8102e] focus-within:border-transparent transition-all">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 text-gray-700">
          {/* Format buttons */}
          <button
            type="button"
            onClick={() => execCommand("bold")}
            className="p-1.5 rounded hover:bg-gray-200 hover:text-black font-bold"
            title="In đậm (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("italic")}
            className="p-1.5 rounded hover:bg-gray-200 hover:text-black"
            title="In nghiêng (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("underline")}
            className="p-1.5 rounded hover:bg-gray-200 hover:text-black"
            title="Gạch chân (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("strikeThrough")}
            className="p-1.5 rounded hover:bg-gray-200 hover:text-black"
            title="Gạch ngang"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-gray-300 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h2>")}
            className="p-1.5 rounded hover:bg-gray-200 text-xs font-bold flex items-center gap-1"
            title="Tiêu đề H2"
          >
            <Heading2 className="w-4 h-4 text-[#c8102e]" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h3>")}
            className="p-1.5 rounded hover:bg-gray-200 text-xs font-bold flex items-center gap-1"
            title="Tiêu đề H3"
          >
            <Heading3 className="w-4 h-4 text-[#c8102e]" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<p>")}
            className="px-2 py-1 rounded hover:bg-gray-200 text-xs font-semibold"
            title="Văn bản thường"
          >
            P
          </button>

          <span className="w-px h-5 bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("insertOrderedList")}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Danh sách số thứ tự"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-gray-300 mx-1" />

          {/* Alignments */}
          <button
            type="button"
            onClick={() => execCommand("justifyLeft")}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Căn trái"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyCenter")}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Căn giữa"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyRight")}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Căn phải"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-gray-300 mx-1" />

          {/* Special Elements */}
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<blockquote>")}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Trích dẫn"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={promptLink}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Chèn đường dẫn (Link)"
          >
            <LinkIcon className="w-4 h-4 text-blue-600" />
          </button>

          {/* Image Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1 transition-colors"
            title="Tải ảnh từ máy tính (Tự nén WebP)"
          >
            {uploadingImage ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span>Chèn ảnh WebP</span>
          </button>

          <button
            type="button"
            onClick={promptImageUrl}
            className="p-1.5 rounded hover:bg-gray-200 text-xs font-semibold"
            title="Chèn ảnh từ URL"
          >
            <ImageIcon className="w-4 h-4 text-purple-600" />
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowHtmlSource(!showHtmlSource)}
              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                showHtmlSource ? "bg-slate-900 text-yellow-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              title="Xem / Sửa Mã HTML Source"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showHtmlSource ? "Visual" : "HTML Code"}</span>
            </button>
          </div>
        </div>

        {/* Editor Content Area */}
        {!showHtmlSource ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto outline-none text-xs md:text-sm text-gray-800 leading-relaxed prose max-w-none"
            style={{ minHeight: "280px" }}
          />
        ) : (
          <textarea
            rows={14}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 text-xs font-mono bg-slate-900 text-emerald-400 outline-none resize-y min-h-[280px]"
            placeholder="Mã HTML..."
          />
        )}
      </div>
    </div>
  );
}
