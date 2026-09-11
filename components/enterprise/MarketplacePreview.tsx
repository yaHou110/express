'use client';

import React, { useState } from 'react';
import { useStore } from '../../services/storeContext';
import { formatMoney, createMoney } from '../../domain/money';
import {
  Sparkles,
  Building2,
  Users,
  Percent,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  ReceiptText,
} from 'lucide-react';

export function MarketplacePreview() {
  const { setCurrentView } = useStore();

  const mockVendors = [
    {
      id: 'ven-1',
      name: 'آوا ارتباطات پارسیان (تامین‌کننده اپل و سونی)',
      rating: 4.9,
      productsCount: 42,
      commissionRate: 4.5,
      activeOrders: 18,
      status: 'VERIFIED',
    },
    {
      id: 'ven-2',
      name: 'تجهیزات هوشمند نوآوران پایتخت',
      rating: 4.7,
      productsCount: 68,
      commissionRate: 5.0,
      activeOrders: 12,
      status: 'VERIFIED',
    },
    {
      id: 'ven-3',
      name: 'بازرگانی برادران رستمی (لوازم خانگی و صوتی)',
      rating: 4.8,
      productsCount: 31,
      commissionRate: 6.0,
      activeOrders: 9,
      status: 'PENDING_APPROVAL',
    },
  ];

  return (
    <div className="py-8 space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-amber-950 to-neutral-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-900/50 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              ماژول سطح C پلتفرم والا (Tier C Enterprise Expansion)
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              معماری مارکت‌پلیس و چندفروشندگی (Multi-Vendor Marketplace)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
              این ماژول زیرساخت لازم برای پذیرش تامین‌کنندگان مجاز، تسهیم درصدی کارمزد در لحظه تسویه شاپرک، و تسویه هفتگی پایا/ساتنا با فروشندگان را فراهم می‌آورد.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs px-5 py-3 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
          >
            بازگشت به فروشگاه
          </button>
        </div>
      </div>

      {/* 3 Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">
            تسهیم کارمزد در لحظه تراکنش (Real-time Split)
          </h3>
          <p className="text-neutral-500 leading-relaxed">
            در لحظه پرداخت خریدار، مبلغ سهم پلتفرم در حساب کارمزد و مانده خالص در سرفصل بستانکاری تامین‌کننده در دفتر کل مالی به صورت اتوماتیک ثبت می‌شود.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">
            احراز هویت و ممیزی تامین‌کنندگان (KYC/KYB)
          </h3>
          <p className="text-neutral-500 leading-relaxed">
            تطبیق شماره ثبت شرکت، پروانه کسب، شماره شبای بانکی و استعلام تعزیراتی برای تضمین اصالت کالاهای بارگذاری شده در مارکت‌پلیس.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">
            تسویه حساب خودکار شاپرک و پایا
          </h3>
          <p className="text-neutral-500 leading-relaxed">
            صدور فایل انتقال وجه گروهی برای خزانه‌داری بانک جهت تسویه دوره‌ای پس از گذشت مهلت ۷ روزه مرجوعی کالا توسط خریدار.
          </p>
        </div>
      </div>

      {/* Vendor Management Console Mock */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-700" />
            فهرست تامین‌کنندگان فعال مارکت‌پلیس (نمونه پنل راهبری)
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            ۳ فروشنده متصل به کاتالوگ
          </span>
        </div>

        <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs">
          {mockVendors.map((vendor) => (
            <div key={vendor.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">{vendor.name}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      vendor.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vendor.status === 'VERIFIED' ? 'احراز هویت شده' : 'در انتظار تایید مدارک'}
                  </span>
                </div>
                <div className="text-neutral-500 text-[11px] mt-1">
                  تعداد کالاهای فعال: <strong>{vendor.productsCount}</strong> | سفارشات جاری: <strong>{vendor.activeOrders}</strong> | امتیاز کیفی: <strong>{vendor.rating} از ۵</strong>
                </div>
              </div>

              <div className="text-left sm:text-left flex items-center gap-4">
                <div>
                  <span className="text-neutral-400 text-[11px] block">نرخ کارمزد پلتفرم:</span>
                  <span className="font-bold text-neutral-900 text-xs sm:text-sm">{vendor.commissionRate}٪</span>
                </div>

                <button className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer">
                  مشاهده صورتحساب و لاگ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
