'use client';

import React from 'react';
import { useStore } from '../../services/storeContext';
import { ShieldCheck, Truck, RotateCcw, Headphones, CreditCard, ChevronLeft } from 'lucide-react';

export function StorefrontFooter() {
  const { setCurrentView, setSelectedCategorySlug } = useStore();

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-14 pb-8 border-t border-neutral-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-neutral-800/80">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">ضمانت اصالت ۱۰۰٪</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                ارائه کالاهای کاملاً اورجینال با شماره سریال ثبت‌شده و گارانتی معتبر شرکتی
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">ارسال سریع و بیمه‌شده</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                تحویل همان‌روز با ناوگان اختصاصی اکسپرس و ارسال سراسری با بسته‌بندی ایمن
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">۷ روز ضمانت بازگشت</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                امکان استرداد کالا در صورت عدم تطابق با مشخصات فنی یا نقص فنی اولیه
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-purple-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">مشاوره تخصصی خرید</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                پاسخگویی کارشناسان فنی در تمام ساعات کاری برای راهنمایی دقیق قبل از خرید
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-neutral-800/80 text-xs">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-neutral-950 flex items-center justify-center font-bold text-base">
                V
              </div>
              <span className="text-base font-bold text-white tracking-wide">VALA COMMERCE</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs">
              پلتفرم تجارت الکترونیک والا، محصولی مستقل و توسعه‌یافته بر اساس استانداردهای مدرن خرده‌فروشی است که تجربه خرید مطمئن، شفاف و بدون حواس‌پرتی را برای خریداران کالاهای دیجیتال و تجهیزات تخصصی فراهم می‌سازد.
            </p>
            <div className="text-[11px] text-neutral-500">
              تلفن پشتیبانی: ۰۲۱-۹۱۰۰۸۴۰۰ | ایمیل: support@valacommerce.ir
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">دسته‌بندی‌های برتر</h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('digital-devices');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  گوشی‌های هوشمند پرچمدار
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('laptops-computing');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  لپ‌تاپ‌های مهندسی و اولترابوک
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('audio-visual');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  هدفون و اسپیکرهای های‌فای
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('home-appliances');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  اسپرسوسازهای صنعتی و خانگی
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Workflows */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">خدمات مشتریان و پیگیری</h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  پیگیری وضعیت سفارشات و بارنامه
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('cart')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  مشاهده سبد خرید و فاکتور
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('preview-b2b')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-amber-400 font-medium"
                >
                  <ChevronLeft className="w-3 h-3 text-amber-500" />
                  درخواست پیش‌فاکتور رسمی B2B
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin-dashboard')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-neutral-400"
                >
                  <ChevronLeft className="w-3 h-3 text-neutral-600" />
                  ورود به پنل مدیریت عملیات (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture Trust & Enterprise statement */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">معماری پلتفرم تجاری</h5>
            <p className="text-neutral-400 leading-relaxed mb-4 text-[11px]">
              پلتفرم والا به صورت یک ماژولار مونولیت پیشرفته با تفکیک دقیق دامنه‌ها، ماشین حالت تغییرناپذیر سفارشات و دفتر کل حسابداری ثبت تراکنش طراحی شده است.
            </p>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
              <span className="text-[10px] text-neutral-400 block font-mono">
                ENGINE: Modular Monolith v2.6
              </span>
              <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">
                STATUS: Production Ready
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© ۱۴۰۵ کلیه حقوق مادی و معنوی برای پلتفرم تجارت الکترونیک والا محفوظ است.</p>
          <div className="flex items-center gap-4">
            <span>توسعه‌یافته بر اساس استانداردهای مدرن مهندسی</span>
            <div className="h-3 w-px bg-neutral-800" />
            <span>تسویه آنی از طریق شاپرک</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
