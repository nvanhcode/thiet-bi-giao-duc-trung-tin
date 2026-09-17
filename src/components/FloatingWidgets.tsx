"use client";

import React, { useState } from "react";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";
import { PhoneCall, MessageCircle, Phone, X } from "lucide-react";

interface FloatingWidgetsProps {
  siteInfo?: SiteInfo;
}

export default function FloatingWidgets({ siteInfo = defaultSiteInfo }: FloatingWidgetsProps) {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  const rawPhone = (siteInfo.hotline || "0862888679").replace(/\s+/g, "");
  const zaloPhone = (siteInfo.zaloNumber || rawPhone).replace(/\s+/g, "");

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Cảm ơn bạn! Đồ Chơi Trung Tín sẽ gọi lại số ${phoneInput} ngay lập tức!`);
    setPhoneInput("");
    setIsCallbackOpen(false);
  };

  return (
    <>
      {/* Bottom Left Floating Icons */}
      <div className="fixed bottom-16 md:bottom-6 left-3 md:left-6 z-40 flex flex-col gap-2.5 sm:gap-3">
        {/* Zalo Icon */}
        <a
          href={`https://zalo.me/${zaloPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 group relative"
          title="Chat Zalo"
        >
          <span className="font-black text-[11px] md:text-xs">Zalo</span>
          <span className="hidden md:block absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Zalo ({zaloPhone})
          </span>
        </a>

        {/* Phone Call Icon */}
        <a
          href={`tel:${rawPhone}`}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c8102e] hover:bg-[#a00c24] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 group relative animate-bounce"
          title="Gọi điện trực tiếp"
        >
          <PhoneCall className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden md:block absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Gọi ngay {siteInfo.hotline}
          </span>
        </a>

        {/* Messenger Icon */}
        <a
          href={siteInfo.facebookUrl || "https://m.me/"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 group relative"
          title="Messenger"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden md:block absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Messenger
          </span>
        </a>
      </div>

      {/* Bottom Right Floating Callback Bar */}
      <div className="fixed bottom-14 md:bottom-0 right-2 md:right-4 z-40">
        {!isCallbackOpen ? (
          <button
            onClick={() => setIsCallbackOpen(true)}
            className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-[11px] md:text-sm px-3.5 py-2 md:px-5 md:py-3 rounded-t-xl shadow-2xl flex items-center gap-1.5 cursor-pointer transition-all uppercase tracking-wide border-t border-l border-r border-red-400"
          >
            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse" />
            <span>Yêu Cầu Gọi Lại</span>
          </button>
        ) : (
          <div className="bg-white rounded-t-xl shadow-2xl p-3.5 sm:p-4 border-2 border-[#c8102e] w-72 sm:w-80 max-w-[90vw] text-gray-800">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <h4 className="text-xs font-bold text-[#c8102e] uppercase flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                <span>Yêu cầu tư vấn gọi lại</span>
              </h4>
              <button
                onClick={() => setIsCallbackOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCallbackSubmit} className="space-y-3">
              <p className="text-[11px] text-gray-600">
                Nhập số điện thoại của bạn, Đồ Chơi Trung Tín sẽ gọi tư vấn ngay lập tức!
              </p>
              <input
                type="tel"
                required
                placeholder="Nhập số điện thoại..."
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs focus:ring-2 focus:ring-[#c8102e] outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs py-2 rounded transition-colors uppercase"
              >
                Gửi Yêu Cầu Gọi Lại
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
