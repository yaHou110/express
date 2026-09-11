'use client';

import React, { useState } from 'react';
import { useStore } from '../../services/storeContext';
import { formatMoney, createMoney } from '../../domain/money';
import {
  Building2,
  FileText,
  BadgePercent,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  Send,
} from 'lucide-react';

export function B2BCommercePreview() {
  const { setCurrentView, showToast } = useStore();

  const [companyName, setCompanyName] = useState('شرکت داده‌پردازی سپهر آسیا');
  const [economicCode, setEconomicCode] = useState('۴۱۱۳۵۸۹۴۲۱۶');
  const [productType, setProductType] = useState('MacBook Pro 16 M3 Max (36GB/512GB)');
  const [tierQty, setTierQty] = useState(10);
  const [baseUnitPrice] = useState(194500000); // 194.5M Toman

  // Calculate volume discount (5% for 5-9, 10% for 10-19, 15% for 20+)
  const discountPercent = tierQty >= 20 ? 15 : tierQty >= 10 ? 10 : tierQty >= 5 ? 5 : 0;
  const discountedUnit = baseUnitPrice * (1 - discountPercent / 100);
  const totalSubtotal = discountedUnit * tierQty;
  const tax9Percent = totalSubtotal * 0.09;
  const grandTotal = totalSubtotal + tax9Percent;

  const handleRequestProforma = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('پیش‌فاکتور رسمی سازمانی با کد پیگیری B2B-2026-9041 صادر شد.', 'success');
  };

  return (
    <div className="py-8 space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-slate-900 to-neutral-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              ماژول سطح C پلتفرم والا (Tier C B2B Wholesale & Quoting)
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              درگاه خرید عمده و پیش‌فاکتور رسمی سازمانی (B2B Commerce)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
              طراحی‌شده برای سازمان‌ها، شرکت‌های دانش‌بنیان و هولدینگ‌ها جهت خرید تیراژ با فاکتور رسمی معتبر دارایی، تخفیف پلکانی هوشمند و تسویه از طریق حواله پایا/ساتنا بانکی.
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

      {/* Proforma Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Details (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-neutral-700" />
              شبیه‌ساز سفارش سازمانی و تخفیف پلکانی تیراژ
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              تخفیف تیراژ بر اساس تعداد کالای انتخابی به طور خودکار محاسبه می‌گردد
            </p>
          </div>

          <form onSubmit={handleRequestProforma} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-neutral-700 block mb-1.5">نام رسمی شرکت / نهاد:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1.5">شناسه ملی / کد اقتصادی:</label>
                <input
                  type="text"
                  value={economicCode}
                  onChange={(e) => setEconomicCode(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 font-mono focus:outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1.5">انتخاب تجهیزات کاتالوگ:</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 font-medium focus:outline-hidden focus:border-neutral-900"
              >
                <option>MacBook Pro 16 M3 Max (36GB/512GB)</option>
                <option>iPhone 16 Pro Max 256GB Titanium</option>
                <option>Sony WH-1000XM5 Hi-Fi Headphones</option>
                <option>DeLonghi Magnifica S Professional Machine</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-neutral-700">تعداد تیراژ مورد نیاز (عدد):</label>
                <span className="font-extrabold text-neutral-900 font-mono">{tierQty} دستگاه</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={tierQty}
                onChange={(e) => setTierQty(Number(e.target.value))}
                className="w-full cursor-pointer accent-neutral-950"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>۱ عدد (بدون تخفیف)</span>
                <span>۵ تا ۹ عدد (۵٪ تخفیف)</span>
                <span>۱۰ تا ۱۹ عدد (۱۰٪ تخفیف)</span>
                <span>۲۰+ عدد (۱۵٪ تخفیف سازمانی)</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs sm:text-sm mt-4"
            >
              <FileText className="w-4 h-4" />
              صدور و دانلود پیش‌فاکتور رسمی PDF
            </button>
          </form>
        </div>

        {/* Live Proforma Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-950">
              پیش‌نمایش برآورد مالی پیش‌فاکتور
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              معتبر به مدت ۷۲ ساعت
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>قیمت پایه تک‌فروشی:</span>
              <span>{formatMoney(createMoney(baseUnitPrice))}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>درصد تخفیف تیراژ B2B:</span>
              <span className="font-bold text-emerald-700">{discountPercent}٪ تخفیف شرکتی</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>قیمت واحد پس از تخفیف:</span>
              <span className="font-bold text-neutral-900">{formatMoney(createMoney(discountedUnit))}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>مجموع اقلام ({tierQty} عدد):</span>
              <span className="font-bold text-neutral-900">{formatMoney(createMoney(totalSubtotal))}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>مالیات بر ارزش افزوده (۹٪ قانونی):</span>
              <span>{formatMoney(createMoney(tax9Percent))}</span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm font-black text-neutral-950">
              <span>مبلغ نهایی پیش‌فاکتور:</span>
              <span>{formatMoney(createMoney(grandTotal))}</span>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-[11px] text-neutral-500 space-y-1.5 mt-4">
            <div className="font-bold text-neutral-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              تضمین اصالت و ارائه فاکتور در سامانه مودیان
            </div>
            <p>
              کلیه پیش‌فاکتورها دارای مهر رسمی شرکتی و ثبت اتوماتیک در سامانه مودیان سازمان امور مالیاتی کشور می‌باشند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
