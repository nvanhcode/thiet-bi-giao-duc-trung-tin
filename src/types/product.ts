export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  code?: string;
  categoryIds: string[]; // List of category IDs
  price?: number | string | null; // string or null for 'Giá: Liên hệ'
  oldPrice?: number | null;
  discount?: number | null;
  thumbnail: string;
  images: string[];
  summary?: string;
  description?: string;
  specifications?: ProductSpecification[];
  inStock?: boolean;
  isHot?: boolean;

  // Filter tags
  blockCount?: string;       // Số khối: e.g. "1 khối", "2 khối", "3 khối"
  investmentLevel?: string;  // Mức đầu tư: e.g. "Dưới 10 triệu", "10 - 25 triệu"
  origin?: string;           // Nguồn gốc: e.g. "Sản xuất trực tiếp", "Nhập khẩu"
  slideType?: string;        // Kiểu máng trượt: e.g. "Máng đơn", "Máng đôi", "Máng xoắn"
  feature?: string;          // Tính năng tích hợp: e.g. "Kèm xà đu tay", "Kèm vách leo núi"
}

export const FILTER_OPTIONS = {
  blockCount: ["1 khối", "2 khối", "3 khối", "4 khối", "Liên hoàn"],
  investmentLevel: ["Dưới 10 triệu", "10 - 25 triệu", "25 - 50 triệu", "Trên 50 triệu"],
  origin: ["Sản xuất trực tiếp", "Nhập khẩu"],
  slideType: ["Máng đơn", "Máng đôi", "Máng xoắn", "Máng ống"],
  feature: ["Kèm xà đu tay", "Kèm vách leo núi", "Kèm xích đu", "Kèm quây bóng"],
};
