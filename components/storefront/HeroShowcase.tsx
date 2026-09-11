'use client';

import React from 'react';
import { useStore } from '../../services/storeContext';
import { formatMoney } from '../../domain/money';
import { ShieldCheck, Truck, ArrowLeft, Star, Cpu, Sparkles } from 'lucide-react';

export function HeroShowcase() {
  const { navigateToProduct, setCurrentView, products } = useStore();

  // Flagship product for editorial hero: iPhone 16 Pro Max or MacBook Pro
  const flagship = products[0];
  const flagshipVariant = flagship?.variants[0];

  return (
    <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 mb-10 overflow-hidden relative border border-neutral-800" dir="rtl">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Editorial Text & Product Identity */}
        <div className="lg:col-span-7 space-y-5 text-right">
          <div className="inline-flex items-center gap-2 bg-neutral-800/90 border border-neutral-700/80 px-3 py-1 rounded-full text-xs font-semibold text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            پرچمدار کاتالوگ پاییز ۱۴۰۵ • موجود با رجیستری شرکتی
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {flagship.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            {flagship.subtitle}. بدنه مهندسی‌شده با تیتانیوم گرید ۵، دکمه لمسی خازنی Camera Control و سیستم دوربین سه‌گانه ۴۸ مگاپیکسلی حرفه‌ای با زوم اپتیکال ۵ برابری.
          </p>

          {/* Quick Specs Highlight Strip */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-neutral-800/80 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px] mb-0.5">تراشه پردازش</span>
              <span className="font-bold text-white flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-neutral-400" /> Apple A18 Pro
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px] mb-0.5">نرخ نوسازی نمایشگر</span>
              <span className="font-bold text-white">۱۲۰ هرتز انطباقی ProMotion</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px] mb-0.5">ارسال کالا</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> تحویل اختصاصی امروز
              </span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div>
              <span className="text-xs text-neutral-400 block">شروع قیمت از:</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {flagshipVariant ? formatMoney(flagshipVariant.salePrice || flagshipVariant.basePrice) : ''}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateToProduct(flagship.id, flagshipVariant?.id)}
                className="bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                مشاهده مشخصات و خرید
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('catalog')}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold px-5 py-3 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
              >
                کاتالوگ کامل محصولات
              </button>
            </div>
          </div>
        </div>

        {/* Hero Visual Showcase */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="relative w-full max-w-sm aspect-square bg-neutral-800/80 border border-neutral-700/60 rounded-2xl overflow-hidden shadow-2xl p-4 flex items-center justify-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flagship.images[0]}
              alt={flagship.title}
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            />

            {/* Floating Trust Badge */}
            <div className="absolute bottom-4 right-4 bg-neutral-950/90 backdrop-blur-md border border-neutral-700 px-3.5 py-2 rounded-xl text-right shadow-lg">
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>امتیاز ۴.۹ از ۵</span>
              </div>
              <span className="text-[11px] text-neutral-300 block">
                تایید اصالت کالا و گارانتی شرکتی
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
