export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

export interface AboutHighlight {
  title: string;
  subtitle: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutCommitment {
  title: string;
  description: string;
}

export interface AboutSectionConfig {
  badgeText: string;
  title: string;
  titleHighlight: string;
  description1: string;
  description2: string;
  highlights: AboutHighlight[];
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  cardTitle: string;
  cardSubtitle: string;
  stats: AboutStat[];
  sampleCategoryIds: string[];

  // Config fields for full /gioi-thieu page
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  storyTitle?: string;
  storyContent?: string;
  storyImage?: string;
  visionTitle?: string;
  visionContent?: string;
  missionTitle?: string;
  missionContent?: string;
  coreValuesTitle?: string;
  coreValues?: AboutValue[];
  commitmentsTitle?: string;
  commitments?: AboutCommitment[];
  galleryTitle?: string;
  galleryImages?: string[];
}

export interface SiteInfo {
  siteName: string;
  siteSubName: string;
  logoText: string;
  hotline: string;
  landline: string;
  email: string;
  address: string;
  factoryAddress: string;
  zaloNumber: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  pinterestUrl: string;
  mst: string;
  copyrightText: string;
  primaryColor?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  workingHours?: string;
  workingHoursDescription?: string;
  contactDescription?: string;
  bannerSlides?: BannerSlide[];
  aboutSection?: AboutSectionConfig;
}

export const defaultBannerSlides: BannerSlide[] = [
  {
    id: "slide-1",
    title: "THIẾT BỊ & ĐỒ CHƠI MẦM NON CAO CẤP",
    subtitle: "Chất lượng vượt trội - An toàn tuyệt đối cho trẻ em",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "slide-2",
    title: "SẢN XUẤT TRỰC TIẾP TẠI XƯỞNG TRUNG TÍN",
    subtitle: "Đạt chuẩn Bộ Giáo Dục & Đào Tạo - Giá tận gốc",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "slide-3",
    title: "THI CÔNG KHU VUI CHƠI TRỌN GÓI TOÀN QUỐC",
    subtitle: "Tư vấn thiết kế 3D miễn phí & Bảo hành lâu dài",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop",
  },
];

export const defaultAboutSection: AboutSectionConfig = {
  badgeText: "Xưởng Sản Xuất Trực Tiếp - Trung Tín",
  title: "Công ty Thiết bị Giáo dục",
  titleHighlight: "Trung Tín – Giải pháp toàn diện cho Trường Mầm Non & Khu Vui Chơi",
  description1: "Công ty Thiết bị Giáo dục Trung Tín là đơn vị hàng đầu chuyên trực tiếp sản xuất, nhập khẩu và cung cấp toàn bộ hệ thống thiết bị mầm non, đồ chơi vận động ngoài trời, nội thất phòng học và thiết bị nhà bếp mầm non đạt chuẩn quy định của Bộ Giáo dục & Đào tạo.",
  description2: "Với danh mục hơn 260+ sản phẩm catalog chính hãng (từ mã TT-01 đến TT-536), Trung Tín cam kết mang đến sản phẩm an toàn tuyệt đối cho trẻ nhỏ, mẫu mã đa dạng phong phú, độ bền vượt trội và giá thành cạnh tranh trực tiếp từ xưởng sản xuất.",
  highlights: [
    { title: "Nội thất phòng học", subtitle: "Bàn ghế, giá kệ gỗ thông, kệ tủ MDF, tủ tư trang" },
    { title: "Đồ chơi ngoài trời", subtitle: "Liên hoàn cầu trượt, xích đu, đu quay, thú nhún" },
    { title: "Thiết bị bếp & nuôi dưỡng", subtitle: "Tủ cơm ga, tủ sấy bát, giá phơi khăn, giá úp nồi" },
    { title: "Vườn cổ tích & Học liệu", subtitle: "Tượng cổ tích, bộ đèn giao thông, sa bàn học tập" },
  ],
  primaryButtonText: "Xem catalog 260+ sản phẩm",
  primaryButtonLink: "/san-pham",
  secondaryButtonText: "Nhận tư vấn & báo giá xưởng",
  secondaryButtonLink: "/lien-he",
  cardTitle: "THIẾT BỊ GIÁO DỤC TRUNG TÍN",
  cardSubtitle: "Uy tín - Chất lượng - Chuẩn Bộ Giáo Dục",
  stats: [
    { value: "260+", label: "Mã sản phẩm Catalog" },
    { value: "100%", label: "Chuẩn an toàn mầm non" },
    { value: "12 - 24T", label: "Bảo hành chính hãng" },
    { value: "Toàn Quốc", label: "Giao hàng & Lắp đặt" },
  ],
  sampleCategoryIds: [
    "cat-noi-that-phong-hoc",
    "cat-do-choi-ngoai-troi",
    "cat-thiet-bi-bep",
  ],

  // Defaults for /gioi-thieu page
  heroTitle: "VỀ CÔNG TY THIẾT BỊ GIÁO DỤC TRUNG TÍN",
  heroSubtitle: "Đơn vị uy tín hàng đầu sản xuất & phân phối đồ chơi mầm non, thiết bị trường học, thi công khu vui chơi trọn gói toàn quốc.",
  heroImage: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
  storyTitle: "Câu Chuyện & Năng Lực Sản Xuất",
  storyContent: "Công ty TNHH Thương Mại & Sản Xuất Trung Tín là đơn vị chuyên nghiệp hàng đầu trong lĩnh vực sản xuất và cung cấp thiết bị mầm non, đồ chơi vận động ngoài trời, bàn ghế phòng học và thiết bị nuôi dưỡng đạt chuẩn quy định của Bộ Giáo dục & Đào tạo.\n\nSở hữu xưởng sản xuất quy mô lớn tại Hà Nội với quy trình gia công cơ khí, cắt sấy gỗ và sơn tĩnh điện hiện đại, Trung Tín đáp ứng mọi tiêu chuẩn khắt khe về độ an toàn, thẩm mỹ và độ bền cho các trường mầm non công lập, tư thục, khu vui chơi giải trí và các dự án quy mô toàn quốc.\n\nChúng tôi không ngừng đổi mới mẫu mã, tối ưu quy trình sản xuất trực tiếp để mang lại giá tận gốc nhà xưởng, tư vấn thiết kế 3D phối cảnh miễn phí và đồng hành bảo hành dài hạn cùng nhà trường.",
  storyImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1200&auto=format&fit=crop",
  visionTitle: "Tầm Nhìn Chiến Lược",
  visionContent: "Trở thành thương hiệu hàng đầu Việt Nam trong sản xuất thiết bị giáo dục mầm non và thi công khu vui chơi trẻ em, mang lại không gian học tập và vui chơi chuẩn mực, an toàn cho thế hệ tương lai.",
  missionTitle: "Sứ Mệnh Cao Cả",
  missionContent: "Đồng hành cùng ngành giáo dục mầm non Việt Nam bằng việc cung cấp các sản phẩm thiết bị, đồ chơi sáng tạo, an toàn tuyệt đối và giá thành cạnh tranh trực tiếp từ xưởng sản xuất.",
  coreValuesTitle: "Giá Trị Cốt Lõi",
  coreValues: [
    { title: "Uy Tín & Tiến Độ", description: "Cam kết đúng tiến độ giao hàng, thi công chuẩn kỹ thuật và trách nhiệm bảo hành lâu dài." },
    { title: "An Toàn Tuyệt Đối", description: "Nguyên vật liệu gỗ tự nhiên, nhựa nguyên sinh, sơn không độc hại đạt chuẩn Bộ GD&ĐT." },
    { title: "Giá Tận Gốc Xưởng", description: "Sản xuất trực tiếp tại xưởng không qua trung gian, tối ưu ngân sách cho nhà trường & đại lý." },
    { title: "Đổi Mới & Sáng Tạo", description: "Liên tục cập nhật mẫu mã mới, thiết kế 3D hiện đại tạo cảm hứng vui học cho trẻ em." },
  ],
  commitmentsTitle: "Cam Kết Chất Lượng Từ Trung Tín",
  commitments: [
    { title: "100% Đạt chuẩn quy định Bộ GD&ĐT", description: "Tất cả sản phẩm đều được sản xuất và kiểm định theo tiêu chuẩn thiết bị mầm non hiện hành." },
    { title: "Bảo hành chính hãng 12 - 24 tháng", description: "Chế độ bảo trì tận nơi, hỗ trợ linh kiện thay thế chính hãng nhanh chóng." },
    { title: "Tư vấn & Thiết kế 3D miễn phí", description: "Đội ngũ kiến trúc sư khảo sát tận nơi và cung cấp bản vẽ bố trí 3D phối cảnh hoàn toàn miễn phí." },
    { title: "Vận chuyển & Lắp đặt toàn quốc", description: "Đội ngũ kỹ thuật lắp đặt tận nơi chuyên nghiệp trên 63 tỉnh thành cả nước." },
  ],
  galleryTitle: "Hình Ảnh Xưởng Sản Xuất & Dự Án Đã Thi Công",
  galleryImages: [
    "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop",
  ],
};

export const defaultSiteInfo: SiteInfo = {
  siteName: "TRUNG TÍN",
  siteSubName: "Đồ Chơi & Thiết Bị Mầm Non",
  logoText: "TRUNG TÍN",
  hotline: "0862 888 679",
  landline: "0246 291 3035",
  email: "dochoitamphuc@gmail.com",
  address: "Số 30A ngõ 346 Phố Nam Dư, Phường Lĩnh Nam, Quận Hoàng Mai, Hà Nội.",
  factoryAddress: "Số 55, ngõ 92 Thúy Lĩnh, Lĩnh Nam, Hoàng Mai, Hà Nội.",
  zaloNumber: "0862888679",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",
  tiktokUrl: "https://tiktok.com",
  pinterestUrl: "https://pinterest.com",
  mst: "0110515643",
  copyrightText: "Copyright 2026 © CÔNG TY TNHH THƯƠNG MẠI & SẢN XUẤT TRUNG TÍN - MST: 0110515643 - DO SỞ KHĐT TP. HÀ NỘI CẤP NGÀY 20/01/2026.",
  primaryColor: "#c8102e",
  faviconUrl: "/favicon.ico",
  ogImageUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop",
  workingHours: "07:30 - 18:00 (Từ Thứ 2 đến Chủ Nhật)",
  workingHoursDescription: "Đội ngũ kỹ thuật & tư vấn luôn sẵn sàng tiếp nhận yêu cầu báo giá xưởng và khảo sát công trình.",
  contactDescription: "Công ty TNHH Thương Mại & Sản Xuất Trung Tín sẵn sàng hỗ trợ tư vấn thiết kế, gửi catalog 260+ sản phẩm mầm non và báo giá trực tiếp từ xưởng sản xuất cho quý trường, đại lý và chủ đầu tư.",
  bannerSlides: defaultBannerSlides,
  aboutSection: defaultAboutSection,
};

