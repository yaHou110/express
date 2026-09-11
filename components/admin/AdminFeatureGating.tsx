'use client';

import React from 'react';
import { useStore } from '../../services/storeContext';
import { AdminLayout } from './AdminLayout';
import { FeatureFlags } from '../../domain/types';
import { ToggleRight, Sparkles, ShieldCheck, Check, Layers } from 'lucide-react';

export function AdminFeatureGating() {
  const { featureFlags, toggleFeatureFlag, setCurrentView } = useStore();

  const tiers: {
    tier: string;
    title: string;
    description: string;
    flags: { key: keyof FeatureFlags; label: string; desc: string }[];
  }[] = [
    {
      tier: 'Tier A',
      title: 'قابلیت‌های سطح پایه و الزامی (Core Retail Engine)',
      description: 'هسته مرکزی معماری پلتفرم شامل کاتالوگ، انبارداری و تسویه مالی',
      flags: [
        {
          key: 'coreStorefront',
          label: 'فروشگاه تک‌فروشنده (Single-Vendor Storefront)',
          desc: 'کاتالوگ متمرکز، مدیریت برندها، دسته‌بندی و سفارش‌گیری آنلاین',
        },
        {
          key: 'coreCatalog',
          label: 'کاتالوگ و تنوع کالا (Catalog & Variants)',
          desc: 'ساختار درختی دسته‌بندی، مشخصات فنی و تنوع رنگ و ظرفیت',
        },
        {
          key: 'coreInventory',
          label: 'مدیریت موجودی انبار و تخصیص (Stock Management)',
          desc: 'کنترل سخت‌گیرانه موجودی و پیشگیری از فروش مازاد بر انبار',
        },
      ],
    },
    {
      tier: 'Tier B',
      title: 'قابلیت‌های خرده‌فروشی پیشرفته (Advanced Commerce)',
      description: 'امکانات ارتقای نرخ تبدیل و تجربه کاربری خریدار',
      flags: [
        {
          key: 'productComparison',
          label: 'میز مقایسه تطبیقی کالاها (Product Comparison)',
          desc: 'جدول مقایسه مشخصات فنی، تنوع و قیمت تا ۴ کالا',
        },
        {
          key: 'wishlist',
          label: 'لیست علاقه‌مندی‌ها و بوک‌مارک (Wishlist)',
          desc: 'ذخیره‌سازی کالاهای مورد علاقه خریدار در پنل کاربری',
        },
        {
          key: 'financialLedger',
          label: 'دفتر کل مالی دوطرفه (Double-Entry Ledger)',
          desc: 'ثبت تغییرناپذیر اسناد حسابداری و کنترل عدم تکرار تراکنش‌ها',
        },
        {
          key: 'orderStateMachine',
          label: 'ماشین حالت تغییرناپذیر سفارشات (Order State Machine)',
          desc: 'مدیریت چرخه حیات سفارش با جلوگیری خودکار از گذارهای غیرمجاز',
        },
      ],
    },
    {
      tier: 'Tier C',
      title: 'اکستنشن‌های سازمانی و انترپرایز (Enterprise Modules)',
      description: 'معماری مقیاس‌پذیر برای گسترش به بازارهای بین‌المللی و B2B',
      flags: [
        {
          key: 'marketplaceMultiVendor',
          label: 'پلتفرم چندفروشندگی و مارکت‌پلیس (Multi-Vendor)',
          desc: 'پنل اختصاصی تامین‌کنندگان، تخصیص کارمزد و تسویه دوره‌ای',
        },
        {
          key: 'b2bOrganization',
          label: 'تجارت سازمانی و قیمت‌گذاری عمده (B2B & Wholesale)',
          desc: 'صدور پیش‌فاکتور رسمی، تخفیف پلکانی تیراژ و تایید اعتباری',
        },
        {
          key: 'multiWarehouse',
          label: 'مسیریابی هوشمند چندانباره (Multi-Warehouse Routing)',
          desc: 'توزیع کالا بین انبارهای منطقه‌ای و تحویل از نزدیک‌ترین انبار',
        },
      ],
    },
  ];

  return (
    <AdminLayout activeTab="features">
      <div className="space-y-6">
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-2 shadow-2xs">
          <h2 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
            <ToggleRight className="w-4 h-4 text-neutral-700" />
            مدیریت فعال‌سازی ماژول‌ها و سوئیچ قابلیت‌ها (Feature Flags Engine)
          </h2>
          <p className="text-xs text-neutral-500">
            بر اساس مستندات مهندسی والا، کلیه ویژگی‌های پیشرفته به جای کدنویسی پراکنده، از طریق سامانه Feature Gating کنترل می‌شوند.
          </p>
        </div>

        <div className="space-y-6">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-neutral-900 text-white">
                      {t.tier}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900">{t.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{t.description}</p>
                </div>

                {t.tier === 'Tier C' && (
                  <button
                    onClick={() => setCurrentView('preview-marketplace')}
                    className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    مشاهده صفحات پیش‌نمایش سازمانی
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {t.flags.map((flag) => {
                  const isEnabled = featureFlags[flag.key];
                  return (
                    <div
                      key={String(flag.key)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-neutral-900 flex items-center gap-2">
                          <span>{flag.label}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isEnabled
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {isEnabled ? 'فعال' : 'غیرفعال'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">{flag.desc}</p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => toggleFeatureFlag(flag.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-950"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
