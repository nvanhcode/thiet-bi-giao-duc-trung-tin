"use client";

import React, { useState, useRef, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Product, FILTER_OPTIONS } from "@/types/product";
import { FilterOptionsData } from "@/types/filter";
import { Filter, RotateCcw, ChevronDown, Check, X } from "lucide-react";

interface CategoryProductsClientProps {
  initialProducts: Product[];
  filtersData?: FilterOptionsData;
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
            ? "border-[#c8102e] bg-red-50/60 text-[#c8102e] ring-1 ring-[#c8102e]/30 shadow-sm"
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

export default function CategoryProductsClient({ initialProducts, filtersData }: CategoryProductsClientProps) {
  const options = filtersData || FILTER_OPTIONS;

  const [selectedBlockCount, setSelectedBlockCount] = useState<string[]>([]);
  const [selectedInvestmentLevel, setSelectedInvestmentLevel] = useState<string[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<string[]>([]);
  const [selectedSlideType, setSelectedSlideType] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string[]>([]);

  const resetFilters = () => {
    setSelectedBlockCount([]);
    setSelectedInvestmentLevel([]);
    setSelectedOrigin([]);
    setSelectedSlideType([]);
    setSelectedFeature([]);
  };

  const filteredProducts = initialProducts.filter((p) => {
    if (selectedBlockCount.length > 0 && (!p.blockCount || !selectedBlockCount.includes(p.blockCount))) return false;
    if (selectedInvestmentLevel.length > 0 && (!p.investmentLevel || !selectedInvestmentLevel.includes(p.investmentLevel))) return false;
    if (selectedOrigin.length > 0 && (!p.origin || !selectedOrigin.includes(p.origin))) return false;
    if (selectedSlideType.length > 0 && (!p.slideType || !selectedSlideType.includes(p.slideType))) return false;
    if (selectedFeature.length > 0 && (!p.feature || !selectedFeature.includes(p.feature))) return false;
    return true;
  });

  const hasActiveFilters =
    selectedBlockCount.length > 0 ||
    selectedInvestmentLevel.length > 0 ||
    selectedOrigin.length > 0 ||
    selectedSlideType.length > 0 ||
    selectedFeature.length > 0;

  // Active filter pills list
  const activeChips = [
    ...selectedBlockCount.map((val) => ({ type: "blockCount", label: `Số khối: ${val}`, value: val })),
    ...selectedInvestmentLevel.map((val) => ({ type: "investmentLevel", label: `Mức đầu tư: ${val}`, value: val })),
    ...selectedOrigin.map((val) => ({ type: "origin", label: `Nguồn gốc: ${val}`, value: val })),
    ...selectedSlideType.map((val) => ({ type: "slideType", label: `Kiểu máng: ${val}`, value: val })),
    ...selectedFeature.map((val) => ({ type: "feature", label: `Tính năng: ${val}`, value: val })),
  ];

  const removeChip = (type: string, value: string) => {
    if (type === "blockCount") setSelectedBlockCount(selectedBlockCount.filter((v) => v !== value));
    if (type === "investmentLevel") setSelectedInvestmentLevel(selectedInvestmentLevel.filter((v) => v !== value));
    if (type === "origin") setSelectedOrigin(selectedOrigin.filter((v) => v !== value));
    if (type === "slideType") setSelectedSlideType(selectedSlideType.filter((v) => v !== value));
    if (type === "feature") setSelectedFeature(selectedFeature.filter((v) => v !== value));
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar with Multi-select Dropdowns */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-xs md:text-sm">
            <Filter className="w-4 h-4 text-[#c8102e]" />
            <span>Bộ lọc tìm kiếm sản phẩm (Chọn nhiều lựa chọn)</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa tất cả bộ lọc</span>
            </button>
          )}
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

        {/* Active Filter Chips / Pills */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
            <span className="font-bold text-gray-500 text-[11px]">Đã chọn:</span>
            {activeChips.map((chip, idx) => (
              <span
                key={`${chip.type}-${chip.value}-${idx}`}
                className="px-2.5 py-1 bg-red-50 text-[#c8102e] border border-red-200 rounded-full font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => removeChip(chip.type, chip.value)}
                  className="hover:bg-red-200/60 rounded-full p-0.5 cursor-pointer transition-colors"
                  title="Bỏ chọn"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter Stats & Results */}
      <div className="flex items-center justify-between text-xs text-gray-600 font-semibold px-1">
        <span>
          Hiển thị <span className="font-extrabold text-[#c8102e]">{filteredProducts.length}</span> sản phẩm
        </span>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3">
          <p className="text-sm font-bold text-gray-700">Không tìm thấy sản phẩm nào phù hợp với bộ lọc!</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#c8102e] text-white font-bold text-xs rounded-lg hover:bg-[#a00c24] transition-colors cursor-pointer"
          >
            Xóa bộ lọc để xem lại tất cả
          </button>
        </div>
      )}
    </div>
  );
}
