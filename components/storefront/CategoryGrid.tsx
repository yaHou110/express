'use client';

import React from 'react';
import { useStore } from '../../services/storeContext';
import { CATEGORIES } from '../../data/catalogData';
import {
  Smartphone,
  Laptop,
  Headphones,
  Coffee,
  Watch,
  Camera,
  ArrowLeft,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6 text-neutral-800" />,
  Laptop: <Laptop className="w-6 h-6 text-neutral-800" />,
  Headphones: <Headphones className="w-6 h-6 text-neutral-800" />,
  Coffee: <Coffee className="w-6 h-6 text-neutral-800" />,
  Watch: <Watch className="w-6 h-6 text-neutral-800" />,
  Camera: <Camera className="w-6 h-6 text-neutral-800" />,
};

export function CategoryGrid() {
  const { setSelectedCategorySlug, setCurrentView } = useStore();

  const handleSelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mb-12" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            دسته‌بندی‌های کاتالوگ والا
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            دسترسی مستقیم به خطوط اصلی کالا با دسته‌بندی فنی و استانداردهای تضمین کیفیت
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategorySlug(null);
            setCurrentView('catalog');
          }}
          className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 cursor-pointer transition-colors"
        >
          مشاهده تمام کالاها
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.slug)}
            className="group bg-white hover:bg-neutral-50 border border-neutral-200/90 hover:border-neutral-400 p-4 rounded-2xl text-right flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-100 group-hover:bg-neutral-200/80 flex items-center justify-center mb-4 transition-colors">
              {ICON_MAP[cat.iconName] || <Smartphone className="w-6 h-6 text-neutral-800" />}
            </div>

            <div>
              <h3 className="font-bold text-sm text-neutral-900 mb-1 group-hover:text-neutral-950">
                {cat.name}
              </h3>
              <span className="text-[11px] font-medium text-neutral-400 block">
                {cat.productCount} کالا در انبار
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
