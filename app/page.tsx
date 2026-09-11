'use client';

import React from 'react';
import { useStore } from '../services/storeContext';
import { HeroShowcase } from '../components/storefront/HeroShowcase';
import { CategoryGrid } from '../components/storefront/CategoryGrid';
import { ProductCard } from '../components/storefront/ProductCard';
import { ShieldCheck, Truck, Sparkles, ArrowLeft } from 'lucide-react';

export default function HomePage() {
  const { setCurrentView, products } = useStore();

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="py-6 sm:py-8 space-y-12">
      {/* Editorial Flagship Hero */}
      <HeroShowcase />

      {/* Visual Category Discovery */}
      <CategoryGrid />

      {/* Featured Catalog Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
              محصولات برگزیده و پرفروش والا
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              دستچین برترین پرچمداران دیجیتال با گارانتی معتبر شرکتی و موجودی آماده ارسال
            </p>
          </div>

          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1.5 cursor-pointer py-1 transition-colors self-start sm:self-auto"
          >
            مشاهده همه محصولات کاتالوگ
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Platform Craft & Architecture Assurance Strip */}
      <section className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase">
            استانداردهای مهندسی پلتفرم والا
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-neutral-950">
            تجارت الکترونیک با معماری ماژولار، یکپارچگی مالی و تضمین موجودی
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            بر خلاف قالب‌های سنتی، پلتفرم تجاری والا محاسبات مالی را بر پایه اعداد صحیح، ماشین حالت تغییرناپذیر سفارشات و انبارداری بدون کسری پیاده‌سازی کرده است.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-1.5">
            <div className="font-bold text-xs text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              انضباط محاسبات مالی
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              محاسبه ارزش ریالی فاکتورها، مالیات و تخفیف‌ها به صورت ارزش‌های پولی صحیح، بدون خطای ممیز شناور.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-1.5">
            <div className="font-bold text-xs text-neutral-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              تخصیص اتمیک موجودی انبار
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              منجمدسازی موجودی در لحظه خرید و پیشگیری قطعی از فروش کالای ناموجود در شرایط اوج ترافیک جشنواره‌ها.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-1.5">
            <div className="font-bold text-xs text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              آماده برای توسعه انترپرایز
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              پشتیبانی از ماژول‌های مارکت‌پلیس چندفروشندگی، فروش عمده B2B و توزیع چندانباره بدون دستکاری هسته اصلی.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
