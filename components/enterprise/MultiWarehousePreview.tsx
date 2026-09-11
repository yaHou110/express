'use client';

import React from 'react';
import { useStore } from '../../services/storeContext';
import {
  Boxes,
  MapPin,
  Truck,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function MultiWarehousePreview() {
  const { setCurrentView } = useStore();

  const warehouses = [
    {
      id: 'wh-tehran',
      name: 'انبار مرکزی تهران (شمس‌آباد)',
      capacity: '۸۵,۰۰۰ قلم کالا',
      status: 'OPERATIONAL',
      coverage: 'استان‌های تهران، البرز، قزوین، قم',
      fulfillmentSpeed: 'تحویل ۲ تا ۴ ساعته اکسپرس',
    },
    {
      id: 'wh-isfahan',
      name: 'مرکز توزیع منطقه‌ای اصفهان (محمودآباد)',
      capacity: '۲۲,۰۰۰ قلم کالا',
      status: 'OPERATIONAL',
      coverage: 'استان‌های اصفهان، یزد، چهارمحال و فارس',
      fulfillmentSpeed: 'تحویل ۲۴ ساعته',
    },
    {
      id: 'wh-mashhad',
      name: 'مرکز توزیع شمال شرق مشهد',
      capacity: '۱۸,۰۰۰ قلم کالا',
      status: 'OPERATIONAL',
      coverage: 'استان‌های خراسان رضوی، شمالی و جنوبی',
      fulfillmentSpeed: 'تحویل ۲۴ ساعته',
    },
  ];

  return (
    <div className="py-8 space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-emerald-950 to-neutral-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900/50 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Boxes className="w-3.5 h-3.5" />
              ماژول سطح C پلتفرم والا (Tier C Multi-Warehouse Routing)
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              مسیریابی هوشمند و توزیع چندانباره (Multi-Warehouse Logistics)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
              تخصیص سفارش بر اساس موقعیت جغرافیایی خریدار به نزدیک‌ترین مرکز پردازش، کاهش زمان سیر مرسوله و مدیریت حداقل هزینه لجستیک.
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

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  فعال و متصل به سیستم
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-neutral-900">{wh.name}</h3>
                <span className="text-neutral-500 text-[11px] block mt-0.5">ظرفیت ذخیره‌سازی: {wh.capacity}</span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-neutral-100 text-neutral-600">
                <div>
                  <strong className="text-neutral-900">پوشش جغرافیایی:</strong> {wh.coverage}
                </div>
                <div className="text-emerald-700 font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  {wh.fulfillmentSpeed}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <span className="text-[11px] text-neutral-400 font-mono block">
                ROUTING ALGORITHM: Nearest Geo-Hub Priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
