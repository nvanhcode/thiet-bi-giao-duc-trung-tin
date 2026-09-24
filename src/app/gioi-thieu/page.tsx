import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getSiteInfo } from "@/lib/getSiteInfo";
import { getCategories } from "@/lib/getCategories";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import QuoteFormBanner from "@/components/QuoteFormBanner";
import AboutSection from "@/components/AboutSection";
import {
  Home as HomeIcon,
  ChevronRight,
  Building2,
  Sparkles,
  CheckCircle2,
  Award,
  Target,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  Factory,
} from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();
  const about = siteInfo.aboutSection;

  return {
    title: `Giới Thiệu | ${siteInfo.siteName || "PHÚC AN MINH"} - ${siteInfo.siteSubName || "Đồ Chơi & Thiết Bị Giáo Dục Mầm Non"}`,
    description:
      about?.description1 ||
      `Giới thiệu về Công ty TNHH Thương Mại Công Nghệ Phúc An Minh - Đơn vị hàng đầu phân phối & cung cấp đồ chơi mầm non, thiết bị trường học đạt chuẩn Bộ GD&ĐT.`,
    openGraph: {
      title: `Giới Thiệu | ${siteInfo.siteName} - ${siteInfo.siteSubName}`,
      description: about?.description1,
      images: about?.heroImage || siteInfo.ogImageUrl ? [{ url: about?.heroImage || siteInfo.ogImageUrl! }] : [],
    },
  };
}

export default async function AboutPage() {
  const [siteInfo, categories] = await Promise.all([
    getSiteInfo(),
    getCategories(),
  ]);

  const about = {
    heroTitle: "VỀ CÔNG TY TNHH THƯƠNG MẠI CÔNG NGHỆ PHÚC AN MINH",
    heroSubtitle:
      "Đơn vị uy tín hàng đầu cung cấp & phân phối đồ chơi mầm non, thiết bị trường học, thi công khu vui chơi trọn gói toàn quốc.",
    heroImage:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
    storyTitle: "Câu Chuyện & Năng Lực Cung Cấp",
    storyContent:
      "Công ty TNHH Thương Mại Công Nghệ Phúc An Minh là đơn vị chuyên nghiệp hàng đầu trong lĩnh vực cung cấp và phân phối thiết bị mầm non, đồ chơi vận động ngoài trời, bàn ghế phòng học và thiết bị nuôi dưỡng đạt chuẩn quy định của Bộ Giáo dục & Đào tạo.\n\nVới đội ngũ tư vấn chuyên sâu và mạng lưới đối tác cung ứng uy tín, Phúc An Minh đáp ứng mọi tiêu chuẩn khắt khe về độ an toàn, thẩm mỹ và độ bền cho các trường mầm non công lập, tư thục, khu vui chơi giải trí và các dự án quy mô toàn quốc.\n\nChúng tôi không ngừng cập nhật các mẫu mã mới nhất, tối ưu chi phí cung ứng để mang lại mức giá tốt nhất, tư vấn thiết kế 3D phối cảnh miễn phí và đồng hành bảo hành dài hạn cùng nhà trường.",
    storyImage:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1200&auto=format&fit=crop",
    visionTitle: "Tầm Nhìn Chiến Lược",
    visionContent:
      "Trở thành thương hiệu hàng đầu Việt Nam trong phân phối thiết bị giáo dục mầm non và thi công khu vui chơi trẻ em, mang lại không gian học tập và vui chơi chuẩn mực, an toàn cho thế hệ tương lai.",
    missionTitle: "Sứ Mệnh Cao Cả",
    missionContent:
      "Đồng hành cùng ngành giáo dục mầm non Việt Nam bằng việc cung cấp các sản phẩm thiết bị, đồ chơi sáng tạo, an toàn tuyệt đối và giá thành cạnh tranh tốt nhất.",
    coreValuesTitle: "Giá Trị Cốt Lõi",
    coreValues: [
      {
        title: "Uy Tín & Tiến Độ",
        description:
          "Cam kết đúng tiến độ giao hàng, tư vấn chuẩn kỹ thuật và trách nhiệm bảo hành lâu dài.",
      },
      {
        title: "An Toàn Tuyệt Đối",
        description:
          "Nguyên vật liệu gỗ tự nhiên, nhựa nguyên sinh, sơn không độc hại đạt chuẩn Bộ GD&ĐT.",
      },
      {
        title: "Tối Ưu Chi Phí",
        description:
          "Phân phối trực tiếp tối ưu ngân sách cho nhà trường & đại lý.",
      },
      {
        title: "Đổi Mới & Sáng Tạo",
        description:
          "Liên tục cập nhật mẫu mã mới, thiết kế 3D hiện đại tạo cảm hứng vui học cho trẻ em.",
      },
    ],
    commitmentsTitle: "Cam Kết Chất Lượng Từ Phúc An Minh",
    commitments: [
      {
        title: "100% Đạt chuẩn quy định Bộ GD&ĐT",
        description:
          "Tất cả sản phẩm đều được kiểm định theo tiêu chuẩn thiết bị mầm non hiện hành.",
      },
      {
        title: "Bảo hành chính hãng 12 - 24 tháng",
        description:
          "Chế độ bảo trì tận nơi, hỗ trợ linh kiện thay thế chính hãng nhanh chóng.",
      },
      {
        title: "Tư vấn & Thiết kế 3D miễn phí",
        description:
          "Đội ngũ kiến trúc sư khảo sát tận nơi và cung cấp bản vẽ bố trí 3D phối cảnh hoàn toàn miễn phí.",
      },
      {
        title: "Vận chuyển & Lắp đặt toàn quốc",
        description:
          "Đội ngũ kỹ thuật lắp đặt tận nơi chuyên nghiệp trên 63 tỉnh thành cả nước.",
      },
    ],
    galleryTitle: "Hình Ảnh Dự Án & Công Trình Đã Thi Công",
    galleryImages: [
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop",
    ],
    ...(siteInfo.aboutSection || {}),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Giới thiệu ${siteInfo.siteName}`,
    description: about.heroSubtitle,
    publisher: {
      "@type": "Organization",
      name: "CÔNG TY TNHH THƯƠNG MẠI CÔNG NGHỆ PHÚC AN MINH",
      telephone: siteInfo.hotline,
      email: siteInfo.email,
      address: siteInfo.address,
    },
  };

  const storyParagraphs = (about.storyContent || "")
    .split("\n")
    .filter((p) => p.trim().length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Structured SEO Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header siteInfo={siteInfo} categories={categories} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-600">
          <Link
            href="/"
            className="hover:text-[#c8102e] flex items-center gap-1 transition-colors"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900">Giới thiệu</span>
        </div>
      </div>

      {/* Hero Banner Header */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url(${about.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/80 via-slate-900/95 to-slate-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#c8102e] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>Phúc An Minh - Thiết Bị Giáo Dục & Đồ Chơi Mầm Non</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight max-w-4xl leading-tight">
            {about.heroTitle || "VỀ CÔNG TY TNHH THƯƠNG MẠI CÔNG NGHỆ PHÚC AN MINH"}
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
            {about.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/san-pham"
              className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Xem catalog 260+ sản phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lien-he"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs md:text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-red-400" />
              <span>Liên hệ & Nhận báo giá</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 py-12 space-y-16">
        {/* Section 1: Company Story & Capability */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#c8102e] font-bold text-xs rounded-full uppercase tracking-wider border border-red-100">
                <Building2 className="w-3.5 h-3.5" />
                <span>Năng Lực & Uy Tín Thương Hiệu</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
                {about.storyTitle || "Câu Chuyện & Năng Lực Cung Cấp"}
              </h2>

              <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
                {storyParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Highlight Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-[#c8102e] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      Chuẩn Bộ GD&ĐT
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      100% an toàn cho trẻ mầm non
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      Giá Thành Tốt Nhất
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Tối ưu chi phí cho nhà trường & dự án
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Story Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={
                    about.storyImage ||
                    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={about.storyTitle || "Công ty Phúc An Minh"}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Công ty TNHH Thương Mại Công Nghệ Phúc An Minh
                  </span>
                  <p className="text-sm font-semibold text-gray-200">
                    Chuyên cung cấp bàn ghế, xích đu, liên hoàn cầu trượt & thiết
                    bị bếp mầm non
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-6 -left-6 bg-[#c8102e] text-white p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 border-2 border-white">
                <Building2 className="w-8 h-8 text-amber-300" />
                <div>
                  <span className="text-xl font-black block">10+ Năm</span>
                  <span className="text-[11px] text-red-100 font-medium">
                    Kinh nghiệm ngành thiết bị
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Key Statistics Counter Banner */}
        {about.stats && about.stats.length > 0 && (
          <section className="bg-gradient-to-r from-red-900 via-[#c8102e] to-red-950 py-10 text-white shadow-inner">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {about.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10"
                  >
                    <span className="text-3xl md:text-4xl font-black text-amber-300 block mb-1">
                      {stat.value}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-red-100">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Vision & Mission */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h3 className="text-xs font-black uppercase text-[#c8102e] tracking-widest">
              ĐỊNH HƯỚNG PHÁT TRIỂN
            </h3>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Tầm Nhìn Chiến Lược & Sứ Mệnh Cao Cả
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md space-y-4 hover:border-[#c8102e] transition-colors relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#c8102e] flex items-center justify-center font-bold text-xl group-hover:bg-[#c8102e] group-hover:text-white transition-colors">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {about.visionTitle || "Tầm Nhìn Chiến Lược"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {about.visionContent}
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md space-y-4 hover:border-[#c8102e] transition-colors relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {about.missionTitle || "Sứ Mệnh Cao Cả"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {about.missionContent}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Core Values */}
        {about.coreValues && about.coreValues.length > 0 && (
          <section className="bg-slate-100 py-12 border-t border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h3 className="text-xs font-black uppercase text-[#c8102e] tracking-widest">
                  NỀN TẢNG THƯƠNG HIỆU
                </h3>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                  {about.coreValuesTitle || "Giá Trị Cốt Lõi"}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {about.coreValues.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 relative hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl font-black text-[#c8102e]/20 absolute top-4 right-4">
                      0{idx + 1}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c8102e] flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 5: Quality Commitments */}
        {about.commitments && about.commitments.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-lg space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#c8102e] font-bold text-xs rounded-full uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>An Tâm Tuyệt Đối</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    {about.commitmentsTitle ||
                      "Cam Kết Chất Lượng Từ Trung Tín"}
                  </h2>
                </div>
                <Link
                  href="/lien-he"
                  className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 shrink-0 self-start md:self-auto"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Nhận tư vấn ngay</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {about.commitments.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#c8102e] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 6: Photo Gallery Showcase */}
        {about.galleryImages && about.galleryImages.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-xs font-black uppercase text-[#c8102e] tracking-widest">
                THỰC TẾ SẢN XUẤT
              </h3>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                {about.galleryTitle ||
                  "Hình Ảnh Xưởng Sản Xuất & Dự Án Đã Thi Công"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {about.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden shadow-md border border-gray-200 h-60 bg-gray-100"
                >
                  <img
                    src={imgUrl}
                    alt={`Hình ảnh xưởng & công trình ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold truncate">
                      Công trình & Xưởng Trung Tín #{idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 7: Homepage About Section Embedded Component */}
        <AboutSection aboutSection={siteInfo.aboutSection} categories={categories} />
      </main>

      {/* Quote Form Banner */}
      <QuoteFormBanner siteInfo={siteInfo} />

      <Footer siteInfo={siteInfo} />
      <FloatingWidgets siteInfo={siteInfo} />
    </div>
  );
}
