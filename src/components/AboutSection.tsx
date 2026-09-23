import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  PhoneCall
} from "lucide-react";
import { AboutSectionConfig, defaultAboutSection } from "@/types/site-info";
import { Category } from "@/types/category";

interface AboutSectionProps {
  aboutSection?: AboutSectionConfig;
  categories?: Category[];
}

export default function AboutSection({
  aboutSection,
  categories = [],
}: AboutSectionProps) {
  const config = { ...defaultAboutSection, ...aboutSection };

  // Get matching sample categories based on sampleCategoryIds
  const sampleCategories = (config.sampleCategoryIds || [])
    .map((id) => categories.find((cat) => cat.id === id))
    .filter((cat): cat is Category => Boolean(cat));

  // Fallback to first 3 categories if none found or configured
  const displayCategories =
    sampleCategories.length > 0 ? sampleCategories : categories.slice(0, 3);

  return (
    <section className="w-full bg-white py-12 border-t border-b border-gray-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            {config.badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 text-[#c8102e] font-bold text-xs rounded-full uppercase tracking-wider shadow-sm border border-red-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{config.badgeText}</span>
              </div>
            )}

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {config.title}{" "}
              {config.titleHighlight && (
                <span className="text-[#c8102e]">{config.titleHighlight}</span>
              )}
            </h2>

            {config.description1 && (
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {config.description1}
              </p>
            )}

            {config.description2 && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {config.description2}
              </p>
            )}

            {/* Key product category highlights */}
            {config.highlights && config.highlights.length > 0 && (
              <div className="grid grid-cols-2 gap-3 py-2">
                {config.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {config.primaryButtonText && (
                <Link
                  href={config.primaryButtonLink || "/san-pham"}
                  className="bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>{config.primaryButtonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {config.secondaryButtonText && (
                <Link
                  href={config.secondaryButtonLink || "/lien-he"}
                  className="border-2 border-[#c8102e] text-[#c8102e] hover:bg-red-50 font-bold text-xs md:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{config.secondaryButtonText}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Statistics & Visual Showcase Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Feature Banner Card */}
            <div className="bg-gradient-to-br from-[#c8102e] to-[#80081c] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-4 border-b border-white/20 pb-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    {config.cardTitle}
                  </h3>
                  <p className="text-xs text-red-100">{config.cardSubtitle}</p>
                </div>
              </div>

              {/* Grid 4 Stats */}
              {config.stats && config.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {config.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur p-3 rounded-xl border border-white/10 text-center"
                    >
                      <span className="text-2xl font-black text-amber-300 block">
                        {stat.value}
                      </span>
                      <span className="text-[11px] text-red-100 font-medium">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Sample Grid Cards */}
            {displayCategories.length > 0 && (
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    displayCategories.length,
                    4
                  )}, minmax(0, 1fr))`,
                }}
              >
                {displayCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/danh-muc/${cat.slug}`}
                    className="bg-gray-50 border border-gray-200 p-2 rounded-xl text-center group hover:border-[#c8102e] transition-colors block"
                  >
                    <img
                      src={cat.image || "/products/catalog/tt-01.jpg"}
                      alt={cat.name}
                      className="w-full h-20 object-contain rounded-md mb-1 group-hover:scale-105 transition-transform"
                    />
                    <span
                      className="text-[10px] font-bold text-gray-700 block truncate"
                      title={cat.name}
                    >
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


