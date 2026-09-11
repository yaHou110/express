import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'صفحه یافت نشد | والا کامرس',
};

export default function NotFound() {
  return (
    <div className="py-20 flex flex-col items-center text-center gap-4" dir="rtl">
      <span className="text-5xl font-black text-neutral-900">۴۰۴</span>
      <h1 className="text-lg font-bold text-neutral-950">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
      <p className="text-xs sm:text-sm text-neutral-500 max-w-md leading-relaxed">
        ممکن است نشانی تغییر کرده باشد یا کالای مورد نظر از کاتالوگ حذف شده باشد.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/"
          className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          بازگشت به فروشگاه
        </Link>
        <Link
          href="/catalog"
          className="bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          مشاهده کاتالوگ محصولات
        </Link>
      </div>
    </div>
  );
}
