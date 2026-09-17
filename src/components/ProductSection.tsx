import React from "react";
import Link from "next/link";
import ProductCard, { Product } from "./ProductCard";
import { ChevronRight } from "lucide-react";

const outdoorProducts: Product[] = [
  {
    id: "1",
    title: "Thú nhún lò xo cho bé con Voi nhập khẩu TP2-025",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&auto=format&fit=crop",
    oldPrice: 10500000,
    price: 8500000,
    discount: 34,
  },
  {
    id: "2",
    title: "Bập bấp đôi 2 chỗ ngồi ngoài trời cho bé TP3-001",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
    price: 3590000,
  },
  {
    id: "3",
    title: "Bập bấp đôi 4 chỗ ngồi ngoài trời cho bé TP3-002",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=400&auto=format&fit=crop",
    oldPrice: 4550000,
    price: 4200000,
    discount: 8,
  },
  {
    id: "4",
    title: "Xích đu lốp xe cho bé mầm non phi 60 TP4-001",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=400&auto=format&fit=crop",
    oldPrice: 3500000,
    price: 2850000,
    discount: 19,
  },
  {
    id: "5",
    title: "Xích đu ngoài trời 3 con giống cho bé TP4-002",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop",
    oldPrice: 3900000,
    price: 3490000,
    discount: 19,
  },
  {
    id: "6",
    title: "Thang leo cầu trượt ngoài trời mảng đơn Composite TP5-001",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&auto=format&fit=crop",
    oldPrice: 3590000,
    price: 3490000,
    discount: 3,
  },
  {
    id: "7",
    title: "Cầu trượt liên hoàn ngoài trời 1 khối kèm bộ xà đu tay TP1-189",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
    oldPrice: 24500000,
    price: 18900000,
    discount: 23,
  },
  {
    id: "8",
    title: "Nhà khối cầu trượt ngoài trời 1 khối mái Mèo mảng đơn TP1-129",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=400&auto=format&fit=crop",
    oldPrice: 32000000,
    price: 16920000,
    discount: 47,
  },
];

const furnitureProducts: Product[] = [
  {
    id: "9",
    title: "Kệ gỗ mầm non 2 tầng NT4-003 28cm",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=400&auto=format&fit=crop",
    oldPrice: 1250000,
    price: 925000,
    discount: 26,
  },
  {
    id: "10",
    title: "Kệ gỗ mầm non 3 tầng NT4-004",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=400&auto=format&fit=crop",
    oldPrice: 1600000,
    price: 1420000,
    discount: 11,
  },
  {
    id: "11",
    title: "Bàn gỗ mầm non hình bán nguyệt cho bé NT1-013",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop",
    oldPrice: 850000,
    price: 750000,
    discount: 12,
  },
  {
    id: "12",
    title: "Bàn gỗ mầm non hình vuông đẹp, giá rẻ NT1-012",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop",
    oldPrice: 550000,
    price: 450000,
    discount: 18,
  },
  {
    id: "13",
    title: "Ghế gỗ cho bé mầm non chân gỗ 28cm NT1-009",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=400&auto=format&fit=crop",
    oldPrice: 450000,
    price: 250000,
    discount: 44,
  },
  {
    id: "14",
    title: "Ghế gỗ chân sắt mầm non giá rẻ NT1-006",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?q=80&w=400&auto=format&fit=crop",
    oldPrice: 350000,
    price: 240000,
    discount: 31,
  },
  {
    id: "15",
    title: "Giường lưới cho bé mầm non chân vuông NT2-001",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=400&auto=format&fit=crop",
    oldPrice: 290000,
    price: 190000,
    discount: 34,
  },
  {
    id: "16",
    title: "Phản gỗ cho bé mầm non NT2-002",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=400&auto=format&fit=crop",
    oldPrice: 425000,
    price: 385000,
    discount: 9,
  },
];

const importedProducts: Product[] = [
  {
    id: "17",
    title: "Bộ luyện tập cứ tay cho bé mầm non NK2-007",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=400&auto=format&fit=crop",
    oldPrice: 2100000,
    price: 2025000,
    discount: 4,
  },
  {
    id: "18",
    title: "Máy tập gym đi bộ trên không cho bé NK2-003",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&auto=format&fit=crop",
    oldPrice: 2250000,
    price: 1950000,
    discount: 13,
  },
  {
    id: "19",
    title: "Bàn nhựa đúc vuông nhập khẩu cho bé mầm non NK1-001",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop",
    oldPrice: 850000,
    price: 630000,
    discount: 26,
  },
  {
    id: "20",
    title: "Bàn nhựa đúc hình bán nguyệt cho bé nhập khẩu NK1-004",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop",
    oldPrice: 1850000,
    price: 1450000,
    discount: 22,
  },
  {
    id: "21",
    title: "Bóng nhựa cho bé chất lượng cao NK5-001",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
    oldPrice: 1800000,
    price: 1500000,
    discount: 17,
  },
  {
    id: "22",
    title: "Hầm chui cho bé con Mèo nhựa nhập khẩu NK11-001",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=400&auto=format&fit=crop",
    oldPrice: 2850000,
    price: 2250000,
    discount: 21,
  },
  {
    id: "23",
    title: "Hầm chui cho bé con Sâu nhựa nhập khẩu NK11-002",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=400&auto=format&fit=crop",
    oldPrice: 2950000,
    price: 2350000,
    discount: 18,
  },
  {
    id: "24",
    title: "Quây bóng nhựa nhập khẩu hình lục giác 2 màu NK9-003",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop",
    oldPrice: 2150000,
    price: 1580000,
    discount: 26,
  },
];

const woodenProducts: Product[] = [
  {
    id: "25",
    title: "Cầu trượt gỗ trong nhà cho bé mầm non 2 khối TPG2-010",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&auto=format&fit=crop",
    price: null,
  },
  {
    id: "26",
    title: "Mẫu vận động liên hoàn thể chất bằng gỗ cho bé TPG3-002",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
    price: null,
  },
  {
    id: "27",
    title: "Cầu trượt liên hoàn gỗ ngoài trời cho bé 3 khối TPG1-010",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=400&auto=format&fit=crop",
    price: null,
  },
  {
    id: "28",
    title: "Xích đu gỗ cho trẻ em 3 ghế kèm vách leo thể chất TPG4-011",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=400&auto=format&fit=crop",
    price: null,
  },
  {
    id: "29",
    title: "Bộ đồ chơi vận động thể chất bằng gỗ cho bé TPG3-004",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop",
    price: null,
  },
  {
    id: "30",
    title: "Nhà khối cầu trượt gỗ ngoài trời cho bé 1 khối TPG1-003",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&auto=format&fit=crop",
    price: 46000000,
  },
  {
    id: "31",
    title: "Xích đu gỗ cho bé 2 ghế lốp xe kèm cầu trượt và vách leo TPG4-018",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
    price: null,
  },
  {
    id: "32",
    title: "Cầu trượt liên hoàn gỗ trong nhà kèm vách leo núi cho bé TPG2-004",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=400&auto=format&fit=crop",
    price: null,
    discount: 9,
  },
];

interface ProductGroupProps {
  title: string;
  href: string;
  products: Product[];
}

function ProductGroup({ title, href, products }: ProductGroupProps) {
  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#c8102e] text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-r-full tracking-wider uppercase shadow">
            {title}
          </span>
        </div>
        <Link
          href={href}
          className="text-xs md:text-sm font-semibold text-gray-500 hover:text-[#c8102e] flex items-center gap-1 transition-colors"
        >
          <span>Xem thêm</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid 4 columns desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

export default function ProductSection() {
  return (
    <section className="w-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <ProductGroup
          title="ĐỒ CHƠI NGOÀI TRỜI"
          href="/do-choi-ngoai-troi"
          products={outdoorProducts}
        />
        <ProductGroup
          title="NỘI THẤT MẦM NON"
          href="/noi-that-mam-non"
          products={furnitureProducts}
        />
        <ProductGroup
          title="ĐỒ CHƠI NHẬP KHẨU"
          href="/do-choi-nhap-khau"
          products={importedProducts}
        />
        <ProductGroup
          title="ĐỒ CHƠI GỖ CHO BÉ"
          href="/do-choi-go"
          products={woodenProducts}
        />
      </div>
    </section>
  );
}
