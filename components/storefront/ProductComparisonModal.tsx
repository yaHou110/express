'use client';

import React from 'react';
import { useStore } from '../../services/storeContext';
import { formatMoney } from '../../domain/money';
import { X, Scale, ShoppingCart, Star, Trash2, Check, ArrowLeft } from 'lucide-react';

export function ProductComparisonModal() {
  const {
    comparisonIds,
    toggleComparison,
    clearComparison,
    isComparisonOpen,
    setIsComparisonOpen,
    products,
    addToCart,
    navigateToProduct,
  } = useStore();

  if (!isComparisonOpen) return null;

  const comparedProducts = products.filter((p) => comparisonIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-950">
                میز مقایسه تخصصی محصولات ({comparedProducts.length} کالا)
              </h2>
              <p className="text-xs text-neutral-500">
                بررسی تطبیقی مشخصات فنی، قیمت، تنوع و امتیاز خریداران
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearComparison}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                حذف همه
              </button>
            )}
            <button
              onClick={() => setIsComparisonOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Table */}
        <div className="flex-1 overflow-auto p-5 sm:p-6">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                لیست مقایسه شما خالی است
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                برای مقایسه کالاها، روی آیکون ترازو در کارت محصول یا صفحه اختصاصی کالا کلیک کنید.
              </p>
              <button
                onClick={() => setIsComparisonOpen(false)}
                className="bg-neutral-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                بازگشت به فروشگاه
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="p-3 w-40 text-neutral-500 font-bold bg-neutral-50/50">
                      مشخصه / ویژگی
                    </th>
                    {comparedProducts.map((prod) => {
                      const defVar = prod.variants[0];
                      const price = defVar.salePrice || defVar.basePrice;
                      return (
                        <th key={prod.id} className="p-4 w-64 align-top">
                          <div className="space-y-3 text-right">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                                {prod.brand.name}
                              </span>
                              <button
                                onClick={() => toggleComparison(prod.id)}
                                className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                                title="حذف از مقایسه"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="w-28 h-28 mx-auto bg-neutral-50 rounded-xl p-2 border border-neutral-100 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={prod.images[0]}
                                alt={prod.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>

                            <h4
                              onClick={() => {
                                setIsComparisonOpen(false);
                                navigateToProduct(prod.id, defVar.id);
                              }}
                              className="font-bold text-neutral-950 hover:text-neutral-700 line-clamp-2 cursor-pointer h-9"
                            >
                              {prod.title}
                            </h4>

                            <div>
                              <span className="text-xs text-neutral-400 block">شروع قیمت:</span>
                              <span className="text-sm font-extrabold text-neutral-950 block">
                                {formatMoney(price)}
                              </span>
                            </div>

                            <button
                              onClick={() => addToCart(prod.id, defVar.id, 1)}
                              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              افزودن به سبد
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {/* Rating row */}
                  <tr className="hover:bg-neutral-50/50">
                    <td className="p-3 font-bold text-neutral-700 bg-neutral-50/50">امتیاز کاربران</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-neutral-800">
                        <div className="flex items-center gap-1 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{p.rating}</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            ({p.reviewCount} نظر)
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category row */}
                  <tr className="hover:bg-neutral-50/50">
                    <td className="p-3 font-bold text-neutral-700 bg-neutral-50/50">دسته‌بندی اصلی</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-neutral-800 font-medium">
                        {p.category.name}
                      </td>
                    ))}
                  </tr>

                  {/* Variants row */}
                  <tr className="hover:bg-neutral-50/50">
                    <td className="p-3 font-bold text-neutral-700 bg-neutral-50/50">تنوع‌های موجود</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-neutral-700">
                        <div className="space-y-1">
                          {p.variants.map((v) => (
                            <div key={v.id} className="text-[11px] flex items-center justify-between">
                              <span>• {v.title}</span>
                              <span className="font-semibold text-neutral-900">
                                {formatMoney(v.salePrice || v.basePrice)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Availability row */}
                  <tr className="hover:bg-neutral-50/50">
                    <td className="p-3 font-bold text-neutral-700 bg-neutral-50/50">وضعیت موجودی انبار</td>
                    {comparedProducts.map((p) => {
                      const totalAvailable = p.variants.reduce(
                        (acc, v) => acc + Math.max(0, v.inventory.onHand - v.inventory.reserved),
                        0
                      );
                      return (
                        <td key={p.id} className="p-3">
                          {totalAvailable > 0 ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> موجود در انبار مرکزی ({totalAvailable} عدد)
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold">اتمام موجودی</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Specifications rows (Dynamic across common specs) */}
                  {['تراشه مرکزی', 'نوع و اندازه نمایشگر', 'رزولوشن دوربین‌ها', 'عمر باتری با ANC', 'توان مصرفی', 'ابعاد و وزن'].map((specKey) => {
                    const hasAny = comparedProducts.some((p) =>
                      p.specifications.some((s) => s.name.includes(specKey))
                    );
                    if (!hasAny) return null;

                    return (
                      <tr key={specKey} className="hover:bg-neutral-50/50">
                        <td className="p-3 font-bold text-neutral-700 bg-neutral-50/50">{specKey}</td>
                        {comparedProducts.map((p) => {
                          const spec = p.specifications.find((s) => s.name.includes(specKey));
                          return (
                            <td key={p.id} className="p-3 text-neutral-700 leading-relaxed">
                              {spec ? spec.value : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-end">
          <button
            onClick={() => setIsComparisonOpen(false)}
            className="bg-neutral-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            بستن جدول مقایسه
          </button>
        </div>
      </div>
    </div>
  );
}
