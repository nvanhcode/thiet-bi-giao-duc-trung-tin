"use client";

import React, { useState } from "react";
import { SiteInfo } from "@/types/site-info";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Building2,
  Factory,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";

interface ContactClientProps {
  siteInfo: SiteInfo;
}

export default function ContactClient({ siteInfo }: ContactClientProps) {
  const officeAddress = siteInfo.address?.trim() || "";
  const factoryAddress = siteInfo.factoryAddress?.trim() || "";

  const hasOffice = Boolean(officeAddress);
  const hasFactory = Boolean(factoryAddress);
  const hasAnyAddress = hasOffice || hasFactory;

  const [activeTab, setActiveTab] = useState<"office" | "factory">(
    hasOffice ? "office" : "factory"
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const rawHotline = (siteInfo.hotline || "").replace(/\s+/g, "");
  const rawLandline = (siteInfo.landline || "").replace(/\s+/g, "");
  const rawZalo = (siteInfo.zaloNumber || "").replace(/\s+/g, "");

  const hasHotline = Boolean(siteInfo.hotline?.trim());
  const hasLandline = Boolean(siteInfo.landline?.trim());
  const hasZalo = Boolean(siteInfo.zaloNumber?.trim());
  const hasCard1 = hasHotline || hasLandline || hasZalo;

  const hasEmail = Boolean(siteInfo.email?.trim());
  const hasMst = Boolean(siteInfo.mst?.trim());
  const hasCard2 = hasEmail || hasMst;

  const hasWorkingHours = Boolean(siteInfo.workingHours?.trim());
  const hasWorkingDesc = Boolean(siteInfo.workingHoursDescription?.trim());
  const hasCard3 = hasWorkingHours || hasWorkingDesc;

  const currentMapAddress =
    activeTab === "office" ? officeAddress : factoryAddress;

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Hotline & Zalo */}
        {hasCard1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#c8102e] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Hotline & Zalo Tư Vấn
                  </h3>
                  <p className="text-xs text-gray-500">
                    Hỗ trợ nhanh 24/7, báo giá trực tiếp
                  </p>
                </div>
              </div>

              <div className="space-y-2 py-2">
                {hasHotline && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Hotline chính
                      </span>
                      <span className="text-lg font-extrabold text-[#c8102e]">
                        {siteInfo.hotline}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(siteInfo.hotline, "hotline")}
                      className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Sao chép hotline"
                    >
                      {copiedField === "hotline" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}

                {hasLandline && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Điện thoại bàn
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {siteInfo.landline}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(siteInfo.landline, "landline")}
                      className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Sao chép điện thoại bàn"
                    >
                      {copiedField === "landline" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {(hasHotline || hasZalo) && (
              <div className={`grid gap-2.5 pt-4 border-t border-gray-100 ${hasHotline && hasZalo ? "grid-cols-2" : "grid-cols-1"}`}>
                {hasHotline && (
                  <a
                    href={`tel:${rawHotline}`}
                    className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi ngay</span>
                  </a>
                )}
                {hasZalo && (
                  <a
                    href={`https://zalo.me/${rawZalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat Zalo</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card 2: Email & MST */}
        {hasCard2 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Email & Pháp Nhân
                  </h3>
                  <p className="text-xs text-gray-500">
                    Gửi hồ sơ thầu, bản vẽ & yêu cầu dự án
                  </p>
                </div>
              </div>

              <div className="space-y-2 py-2">
                {hasEmail && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-xs text-gray-500 block">
                      Email công ty
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 truncate">
                        {siteInfo.email}
                      </span>
                      <button
                        onClick={() => handleCopy(siteInfo.email, "email")}
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-colors shrink-0"
                        title="Sao chép email"
                      >
                        {copiedField === "email" ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {hasMst && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-xs text-gray-500 block">
                      Mã số thuế (MST)
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">
                        {siteInfo.mst}
                      </span>
                      <button
                        onClick={() => handleCopy(siteInfo.mst, "mst")}
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Sao chép MST"
                      >
                        {copiedField === "mst" ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hasEmail && (
              <div className="pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${siteInfo.email}`}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gửi thư điện tử</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Card 3: Giờ làm việc & Cam kết dịch vụ */}
        {hasCard3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between group md:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Thời Gian Hỗ Trợ
                  </h3>
                  <p className="text-xs text-gray-500">
                    Thời gian tiếp nhận thông tin
                  </p>
                </div>
              </div>

              <div className="space-y-3 py-1">
                <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3.5 space-y-1">
                  {hasWorkingHours && (
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 gap-2">
                      <span>Khung giờ:</span>
                      <span className="bg-amber-200/80 px-2 py-0.5 rounded text-[11px] font-bold text-amber-950">
                        {siteInfo.workingHours}
                      </span>
                    </div>
                  )}
                  {hasWorkingDesc && (
                    <p className="text-[11px] text-amber-800 leading-relaxed pt-1">
                      {siteInfo.workingHoursDescription}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-xs text-gray-600 pt-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cung cấp & phân phối thiết bị mầm non chính hãng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Giao hàng và lắp đặt tận nơi toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Đạt tiêu chuẩn an toàn Bộ GD&ĐT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-[11px] text-center text-gray-500 font-medium">
                Uy Tín & Chất Lượng Hàng Đầu
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Addresses & Google Maps Section */}
      {hasAnyAddress && (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-[#c8102e] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                <MapPin className="w-3 h-3" />
                <span>Sơ Đồ Dẫn Đường Google Maps</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                {hasOffice && hasFactory
                  ? "Địa Chỉ Trụ Sở & Văn Phòng Giao Dịch"
                  : hasOffice
                  ? "Địa Chỉ Trụ Sở Chính"
                  : "Địa Chỉ Văn Phòng Giao Dịch"}
              </h2>
              <p className="text-xs md:text-sm text-slate-300">
                {hasOffice && hasFactory
                  ? "Chọn địa điểm bạn muốn tìm đường ghé thăm bên dưới"
                  : "Vị trí bản đồ chỉ đường chi tiết"}
              </p>
            </div>

            {/* Navigation Tab Buttons */}
            {hasOffice && hasFactory && (
              <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700/80 shrink-0 self-start md:self-auto">
                <button
                  onClick={() => setActiveTab("office")}
                  className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === "office"
                      ? "bg-[#c8102e] text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Trụ Sở Chính</span>
                </button>
                <button
                  onClick={() => setActiveTab("factory")}
                  className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === "factory"
                      ? "bg-[#c8102e] text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Văn Phòng Giao Dịch (VPGD)</span>
                </button>
              </div>
            )}
          </div>

          {/* Selected Address Info Bar */}
          {currentMapAddress && (
            <div className="bg-red-50/60 p-4 md:px-8 border-b border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#c8102e] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-[#c8102e] uppercase tracking-wider block">
                    {activeTab === "office"
                      ? "Trụ sở chính & Địa chỉ ĐKKD"
                      : "Văn phòng giao dịch Phúc An Minh"}
                  </span>
                  <p className="text-sm font-bold text-gray-900 leading-snug">
                    {currentMapAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(currentMapAddress, "mapAddress")}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {copiedField === "mapAddress" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>Sao chép địa chỉ</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    currentMapAddress
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#c8102e] hover:bg-[#a00c24] text-white text-xs font-extrabold py-2 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>Xem trên Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Embedded Interactive Map */}
          {currentMapAddress && (
            <div className="w-full h-[400px] md:h-[480px] relative bg-gray-100">
              <iframe
                key={activeTab}
                title={`Bản đồ ${currentMapAddress}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  currentMapAddress
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
