'use client';

import React from 'react';
import { useStore } from '../../services/storeContext';
import { CATEGORIES, BRANDS } from '../../data/catalogData';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, X, RotateCcw, Check, Sparkles } from 'lucide-react';

export function ProductCatalog() {
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setSelectedCategorySlug,
    selectedBrandSlug,
    setSelectedBrandSlug,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
  } = useStore();

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategorySlug(null);
    setSelectedBrandSlug(null);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeCategory = CATEGORIES.find((c) => c.slug === selectedCategorySlug);
  const activeBrand = BRANDS.find((b) => b.slug === selectedBrandSlug);

  return (
    <div className="py-6" dir="rtl">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            {activeCategory ? activeCategory.name : 'کاتالوگ جامع محصولات والا'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {searchQuery ? (
              <span>
                نتایج جستجو برای: <strong className="text-neutral-900">«{searchQuery}»</strong>
              </span>
            ) : (
              'نمایش و مقایسه برترین کالاهای دیجیتال و تجهیزات تخصصی با گارانتی معتبر'
            )}
            <span className="mr-2 font-semibold text-neutral-700">
              ({filteredProducts.length} کالا یافت شد)
            </span>
          </p>
        </div>

        {/* Sort Controls Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-neutral-500 font-medium shrink-0">مرتب‌سازی بر اساس:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-neutral-300 text-xs font-semibold text-neutral-800 rounded-xl px-3 py-2 focus:outline-hidden focus:border-neutral-900 cursor-pointer shadow-2xs"
          >
            <option value="featured">پیشنهاد والا (برگزیده)</option>
            <option value="newest">جدیدترین محصولات</option>
            <option value="rating">بالاترین امتیاز خریداران</option>
            <option value="price-asc">ارزان‌ترین قیمت</option>
            <option value="price-desc">گران‌ترین قیمت</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategorySlug || selectedBrandSlug || inStockOnly || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
          <span className="text-xs font-bold text-neutral-500 ml-1">فیلترهای فعال:</span>

          {activeCategory && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-800">
              دسته‌بندی: {activeCategory.name}
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {activeBrand && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-800">
              برند: {activeBrand.name}
              <button
                onClick={() => setSelectedBrandSlug(null)}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-800">
              فقط کالاهای موجود در انبار
              <button
                onClick={() => setInStockOnly(false)}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-800">
              جستجو: {searchQuery}
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 mr-auto flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            حذف تمام فیلترها
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
              فیلترهای پیشرفته
            </span>
            {(selectedCategorySlug || selectedBrandSlug || inStockOnly) && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                پاکسازی
              </button>
            )}
          </div>

          {/* In-stock toggle */}
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <div>
              <span className="text-xs font-bold text-neutral-800 block">فقط کالاهای موجود</span>
              <span className="text-[11px] text-neutral-400">کالاهای آماده ارسال در انبار</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
            </label>
          </div>

          {/* Category Tree */}
          <div className="space-y-3 pb-4 border-b border-neutral-100">
            <span className="text-xs font-bold text-neutral-900 block">دسته‌بندی کالاها</span>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className={`w-full text-right px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategorySlug === null
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span>تمام دسته‌بندی‌ها</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`w-full text-right px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] ${selectedCategorySlug === cat.slug ? 'text-neutral-300' : 'text-neutral-400'}`}>
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3 pb-4 border-b border-neutral-100">
            <span className="text-xs font-bold text-neutral-900 block">برندهای تجاری</span>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() =>
                    setSelectedBrandSlug(selectedBrandSlug === brand.slug ? null : brand.slug)
                  }
                  className={`w-full text-right px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedBrandSlug === brand.slug
                      ? 'bg-neutral-100 text-neutral-950 font-bold'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span>{brand.name}</span>
                  <span className="text-[10px] text-neutral-400">{brand.originCountry}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Assurance Box */}
          <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5 text-xs text-neutral-600 space-y-1.5">
            <div className="font-bold text-neutral-900 flex items-center gap-1.5 text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              تضمین اصالت قطعات و رجیستری
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              تمام کالاهای نمایش داده شده در والا دارای شناسه یکتای گمرکی و کد فعال‌سازی سامانه همتا می‌باشند.
            </p>
          </div>
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                هیچ کالایی با فیلترهای انتخابی یافت نشد
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                لطفاً عبارت جستجو را تغییر دهید یا برخی فیلترهای اعمال‌شده (مانند برند یا نمایش کالاهای موجود) را غیرفعال کنید.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                پاک کردن تمام فیلترها و مشاهده کل کاتالوگ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
