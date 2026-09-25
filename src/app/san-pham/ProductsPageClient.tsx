"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { FilterOptionsData } from "@/types/filter";
import { FILTER_OPTIONS } from "@/types/product";
import {
  Armchair,
  Trees,
  Utensils,
  Building2,
  Castle,
  GraduationCap,
  Package,
  Search,
  Filter,
  RotateCcw,
  ChevronRight,
  Grid,
  ListFilter,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Award,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Check,
  X,
  Layers,
} from "lucide-react";

interface ProductsPageClientProps {
  categories: Category[];
  products: Product[];
  filtersData?: FilterOptionsData;
}

// Icon mapper for categories
function CategoryIcon({ iconName, className = "w-6 h-6" }: { iconName?: string; className?: string }) {
  switch (iconName) {
    case "Armchair":
      return <Armchair className={className} />;
    case "Trees":
      return <Trees className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "Castle":
      return <Castle className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    default:
      return <Package className={className} />;
  }
}

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
}

function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((item) => item !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const isAllSelected = options.length > 0 && selectedValues.length === options.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold flex items-center justify-between gap-1 transition-all cursor-pointer ${
          selectedValues.length > 0
            ? "border-[#c8102e] bg-red-50/60 text-[#c8102e] ring-1 ring-[#c8102e]/30 shadow-xs"
            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate">{label}</span>
          {selectedValues.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-black bg-[#c8102e] text-white rounded-full leading-none">
              {selectedValues.length}
            </span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#c8102e]" : "text-gray-400"}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 sm:right-auto top-full mt-1.5 z-40 bg-white rounded-xl border border-gray-200 shadow-xl p-2.5 min-w-[180px] sm:min-w-[200px] max-w-[90vw] space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 px-1 text-[11px]">
            <span className="font-bold text-gray-700">{label}</span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[#c8102e] hover:underline font-semibold"
            >
              {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {options.map((opt) => {
              const isChecked = selectedValues.includes(opt);
              return (
                <label
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    isChecked ? "bg-red-50 text-[#c8102e] font-bold" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? "bg-[#c8102e] border-[#c8102e] text-white" : "border-gray-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>

          <div className="pt-1.5 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-bold"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPageClient({
  categories = [],
  products = [],
  filtersData,
}: ProductsPageClientProps) {
  const options = filtersData || FILTER_OPTIONS;

  // View modes: 'categories' (Category Grid Showcases) or 'all' (Interactive Filterable Products List)
  const [viewMode, setViewMode] = useState<"categories" | "all">("categories");

  // Search query & category filter selection for 'all' mode
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>("all");

  // Multi-select filters
  const [selectedBlockCount, setSelectedBlockCount] = useState<string[]>([]);
  const [selectedInvestmentLevel, setSelectedInvestmentLevel] = useState<string[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<string[]>([]);
  const [selectedSlideType, setSelectedSlideType] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  // Root Categories sorted by order
  const rootCategories = useMemo(() => {
    return categories
      .filter((c) => !c.parentId)
      .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }, [categories]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCatId("all");
    setSelectedBlockCount([]);
    setSelectedInvestmentLevel([]);
    setSelectedOrigin([]);
    setSelectedSlideType([]);
    setSelectedFeature([]);
    setSortBy("default");
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || (p.code && p.code.toLowerCase().includes(q)));
    }

    // Category filter
    if (selectedCatId !== "all") {
      const targetCatIds = [
        selectedCatId,
        ...categories.filter((c) => c.parentId === selectedCatId).map((c) => c.id),
      ];
      result = result.filter((p) => (p.categoryIds || []).some((id) => targetCatIds.includes(id)));
    }

    // Multi-select dropdown filters
    if (selectedBlockCount.length > 0) {
      result = result.filter((p) => p.blockCount && selectedBlockCount.includes(p.blockCount));
    }
    if (selectedInvestmentLevel.length > 0) {
      result = result.filter((p) => p.investmentLevel && selectedInvestmentLevel.includes(p.investmentLevel));
    }
    if (selectedOrigin.length > 0) {
      result = result.filter((p) => p.origin && selectedOrigin.includes(p.origin));
    }
    if (selectedSlideType.length > 0) {
      result = result.filter((p) => p.slideType && selectedSlideType.includes(p.slideType));
    }
    if (selectedFeature.length > 0) {
      result = result.filter((p) => p.feature && selectedFeature.includes(p.feature));
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : 0;
        const priceB = typeof b.price === "number" ? b.price : 0;
        return priceA - priceB;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : 0;
        const priceB = typeof b.price === "number" ? b.price : 0;
        return priceB - priceA;
      });
    }

    return result;
  }, [
    products,
    categories,
    searchQuery,
    selectedCatId,
    selectedBlockCount,
    selectedInvestmentLevel,
    selectedOrigin,
    selectedSlideType,
    selectedFeature,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCatId !== "all" ||
    selectedBlockCount.length > 0 ||
    selectedInvestmentLevel.length > 0 ||
    selectedOrigin.length > 0 ||
    selectedSlideType.length > 0 ||
    selectedFeature.length > 0 ||
    sortBy !== "default";

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Hero Section */}
      <div className="relative bg-gradient-to-r from-red-900 via-[#c8102e] to-red-700 text-white rounded-2xl p-6 md:p-10 shadow-xl overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Danh Mục & Sản Phẩm Đạt Chuẩn GD&ĐT</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight text-white">
            DANH MỤC SẢN PHẨM & THIẾT BỊ GIÁO DỤC
          </h1>

          <p className="text-xs md:text-sm text-red-100 leading-relaxed max-w-2xl">
            Tổng hợp toàn bộ các danh mục thiết bị đồ chơi mầm non, khu vui chơi ngoài trời, nội thất phòng học, thiết bị bếp nuôi dưỡng & đồ dùng học tập chất lượng cao.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/20 text-yellow-300 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black text-white leading-none">{rootCategories.length}</div>
                <div className="text-[11px] text-red-100 font-medium mt-0.5">Danh mục chính</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/20 text-yellow-300 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black text-white leading-none">{products.length}+</div>
                <div className="text-[11px] text-red-100 font-medium mt-0.5">Sản phẩm chất lượng</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/20 text-yellow-300 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black text-white leading-none">100%</div>
                <div className="text-[11px] text-red-100 font-medium mt-0.5">Chuẩn BGD & ĐT</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/20 text-yellow-300 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black text-white leading-none">12-24T</div>
                <div className="text-[11px] text-red-100 font-medium mt-0.5">Bảo hành chính hãng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
        {/* Toggle Mode Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setViewMode("categories")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === "categories"
                ? "bg-[#c8102e] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Xem theo Danh Mục ({rootCategories.length})</span>
          </button>

          <button
            onClick={() => setViewMode("all")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === "all"
                ? "bg-[#c8102e] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Tất Cả Sản Phẩm ({products.length})</span>
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm nhanh sản phẩm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (viewMode !== "all") setViewMode("all");
            }}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#c8102e] text-gray-700"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: CATEGORIES SHOWCASE GRID */}
      {viewMode === "categories" && (
        <div className="space-y-10">
          {rootCategories.map((category) => {
            // Child categories
            const childCategories = categories.filter((c) => c.parentId === category.id);
            const targetCatIds = [category.id, ...childCategories.map((c) => c.id)];

            // Category products
            const categoryProducts = products.filter((p) =>
              (p.categoryIds || []).some((id) => targetCatIds.includes(id))
            );

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Category Header Card */}
                <div className="p-5 md:p-6 bg-gradient-to-r from-gray-50 via-white to-red-50/40 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Category Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        category.color || "bg-red-50 text-[#c8102e]"
                      }`}
                    >
                      <CategoryIcon iconName={category.icon} className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/danh-muc/${category.slug}`}
                          className="text-lg md:text-xl font-extrabold text-gray-900 hover:text-[#c8102e] transition-colors uppercase tracking-tight"
                        >
                          {category.name}
                        </Link>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-[#c8102e]">
                          {categoryProducts.length} sản phẩm
                        </span>
                      </div>

                      {category.description && (
                        <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                          {category.description}
                        </p>
                      )}

                      {/* Subcategories Tags */}
                      {childCategories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-gray-400">Loại sản phẩm:</span>
                          {childCategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/danh-muc/${sub.slug}`}
                              className="px-2.5 py-0.5 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-700 hover:border-[#c8102e] hover:text-[#c8102e] transition-colors shadow-2xs"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View Category Button */}
                  <Link
                    href={`/danh-muc/${category.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#c8102e] text-white hover:bg-[#a00c24] text-xs font-bold rounded-lg transition-colors shrink-0 shadow-xs group"
                  >
                    <span>Xem danh mục</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Category Featured Products Grid */}
                <div className="p-4 md:p-6 bg-gray-50/50">
                  {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {categoryProducts.slice(0, 8).map((prod) => (
                        <ProductCard key={prod.id} product={prod} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-gray-500 font-medium">
                      Đang cập nhật sản phẩm cho danh mục này.
                    </div>
                  )}

                  {categoryProducts.length > 8 && (
                    <div className="mt-4 text-center">
                      <Link
                        href={`/danh-muc/${category.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#c8102e] hover:underline"
                      >
                        <span>Xem thêm {categoryProducts.length - 8} sản phẩm khác thuộc {category.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: INTERACTIVE ALL PRODUCTS LIST WITH FILTERS */}
      {viewMode === "all" && (
        <div className="space-y-6">
          {/* Category Tabs Filter */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
              <button
                onClick={() => setSelectedCatId("all")}
                className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCatId === "all"
                    ? "bg-[#c8102e] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả danh mục ({products.length})
              </button>

              {rootCategories.map((cat) => {
                const isSelected = selectedCatId === cat.id;
                const count = products.filter((p) =>
                  (p.categoryIds || []).includes(cat.id)
                ).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#c8102e] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multi-select Dropdowns & Search Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-gray-800 text-xs md:text-sm">
                <Filter className="w-4 h-4 text-[#c8102e]" />
                <span>Bộ lọc sản phẩm nâng cao</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#c8102e]"
                >
                  <option value="default">Sắp xếp: Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Xóa lọc</span>
                  </button>
                )}
              </div>
            </div>

            {/* 5 Filter Multi-select Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <MultiSelectDropdown
                label="Số khối"
                options={options.blockCount || []}
                selectedValues={selectedBlockCount}
                onChange={setSelectedBlockCount}
              />

              <MultiSelectDropdown
                label="Mức đầu tư"
                options={options.investmentLevel || []}
                selectedValues={selectedInvestmentLevel}
                onChange={setSelectedInvestmentLevel}
              />

              <MultiSelectDropdown
                label="Nguồn gốc"
                options={options.origin || []}
                selectedValues={selectedOrigin}
                onChange={setSelectedOrigin}
              />

              <MultiSelectDropdown
                label="Kiểu máng trượt"
                options={options.slideType || []}
                selectedValues={selectedSlideType}
                onChange={setSelectedSlideType}
              />

              <MultiSelectDropdown
                label="Tính năng tích hợp"
                options={options.feature || []}
                selectedValues={selectedFeature}
                onChange={setSelectedFeature}
              />
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between text-xs text-gray-600 font-semibold px-1">
            <span>
              Tìm thấy <span className="font-extrabold text-[#c8102e]">{filteredProducts.length}</span> sản phẩm phù hợp
            </span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3">
              <p className="text-sm font-bold text-gray-700">Không tìm thấy sản phẩm nào phù hợp!</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#c8102e] text-white font-bold text-xs rounded-lg hover:bg-[#a00c24] transition-colors cursor-pointer"
              >
                Xóa tất cả bộ lọc để xem lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* Commitment Banner / Why Choose Us */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-base md:text-xl font-extrabold text-[#c8102e] uppercase tracking-wide">
            TẠI SAO NÊN CHỌN THIẾT BỊ GIÁO DỤC PHÚC AN MINH?
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            Chúng tôi cam kết mang lại giải pháp toàn diện cho các trường mầm non và khu vui chơi trẻ em trên toàn quốc.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-[#c8102e] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-xs md:text-sm font-bold text-gray-800">Đạt Chuẩn Bộ GD&ĐT</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tất cả các sản phẩm bàn ghế, đồ chơi, kệ gỗ đều sản xuất theo chuẩn quy định mầm non.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-[#c8102e] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs md:text-sm font-bold text-gray-800">Chất Liệu An Toàn</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sử dụng nhựa LLDPE nguyên sinh nhập khẩu, sơn tĩnh điện không độc hại và gỗ tự nhiên cao cấp.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-[#c8102e] flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-xs md:text-sm font-bold text-gray-800">Giao Hàng & Lắp Đặt</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hỗ trợ vận chuyển và thi công lắp đặt tận nơi cho các trường học, khu vui chơi toàn quốc.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-[#c8102e] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xs md:text-sm font-bold text-gray-800">Bảo Hành Dài Hạn</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bảo hành uy tín từ 12 - 24 tháng cho mọi thiết bị, hỗ trợ bảo trì trọn đời.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
