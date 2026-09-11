'use client';

import React, { useState } from 'react';
import { useStore } from '../../services/storeContext';
import { formatMoney } from '../../domain/money';
import {
  ShoppingBag,
  Trash2,
  Tag,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';

export function CartView() {
  const {
    cartItems,
    cartTotals,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
    setCheckoutStep,
    navigateToProduct,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError(null);
    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const proceedToCheckout = () => {
    setCheckoutStep(1);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto space-y-5" dir="rtl">
        <div className="w-20 h-20 bg-neutral-100 text-neutral-400 rounded-3xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">
          سبد خرید شما در حال حاضر خالی است
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          شما هنوز هیچ کالایی به سبد خرید خود اضافه نکرده‌اید. می‌توانید به کاتالوگ محصولات مراجعه کرده و کالاهای مورد نظر خود را انتخاب نمایید.
        </p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          مشاهده کاتالوگ و شروع خرید
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900">
              سبد خرید شما ({cartItems.length} ردیف کالا)
            </h1>
            <p className="text-xs text-neutral-500">
              بررسی اقلام، مدیریت تعداد و اعمال کوپن‌های تخفیف سازمانی و جشنواره
            </p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          تخلیه کامل سبد
        </button>
      </div>

      {/* Main Grid: Items List + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (RTL Items table - 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-3xl divide-y divide-neutral-200 overflow-hidden shadow-2xs">
            {cartItems.map((item) => {
              const availableStock = Math.max(
                0,
                item.variant.inventory.onHand - item.variant.inventory.reserved
              );

              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                >
                  {/* Product Details & Thumbnail */}
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => navigateToProduct(item.productId, item.variantId)}
                      className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-50 border border-neutral-200 rounded-2xl overflow-hidden shrink-0 p-2 cursor-pointer flex items-center justify-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                        {item.product.brand.name}
                      </span>
                      <h3
                        onClick={() => navigateToProduct(item.productId, item.variantId)}
                        className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-neutral-700 cursor-pointer line-clamp-1"
                      >
                        {item.product.title}
                      </h3>
                      <div className="text-xs text-neutral-500 flex items-center gap-2">
                        <span>مدل: <strong className="text-neutral-800">{item.variant.title}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{item.variant.sku}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        قیمت واحد: {formatMoney(item.unitPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper, Subtotal & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-300 rounded-xl bg-white p-0.5 shadow-2xs">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 cursor-pointer font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                        disabled={item.quantity >= availableStock}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-left min-w-28">
                      <span className="text-[10px] text-neutral-400 block">جمع ردیف:</span>
                      <span className="text-sm font-extrabold text-neutral-950">
                        {formatMoney(item.subtotal)}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      className="text-neutral-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                      title="حذف این کالا"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Return to Catalog */}
          <div className="flex justify-start">
            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer py-2"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              ادامه انتخاب کالا از کاتالوگ والا
            </button>
          </div>
        </div>

        {/* Right Financials Box (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Coupon Entry */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
              <Tag className="w-4 h-4 text-neutral-700" />
              کد تخفیف یا هدیه
            </div>

            {activeCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block">
                    کوپن {activeCoupon.code} فعال است ({activeCoupon.discountPercentage}٪ تخفیف)
                  </span>
                  <span className="text-[11px] text-emerald-700">{activeCoupon.description}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="کد تخفیف (مثال: VALA10 یا NOWRUZ)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 uppercase font-mono tracking-wider focus:outline-hidden focus:border-neutral-900"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    ثبت
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {couponError}
                  </p>
                )}
                <div className="text-[11px] text-neutral-400">
                  کدهای فعال آزمایشی: <span className="font-mono text-neutral-700">VALA10</span> (۱۰٪) یا <span className="font-mono text-neutral-700">NOWRUZ</span> (۱۵٪)
                </div>
              </form>
            )}
          </div>

          {/* Invoice Summary */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-950 pb-3 border-b border-neutral-100">
              خلاصه محاسبات مالی سفارش
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-neutral-600">
                <span>قیمت کالاها ({cartItems.length} قلم):</span>
                <span className="font-bold text-neutral-900">
                  {formatMoney(cartTotals.itemsSubtotal)}
                </span>
              </div>

              {cartTotals.promotionalDiscount.amount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>تخفیف اعمال‌شده کوپن:</span>
                  <span className="font-bold">
                    -{formatMoney(cartTotals.promotionalDiscount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-600">
                <span>هزینه بسته‌بندی و ارسال پیش‌فرض:</span>
                <span className="font-bold text-neutral-900">
                  {cartTotals.shippingFee.amount > 0
                    ? formatMoney(cartTotals.shippingFee)
                    : 'رایگان'}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-sm">
                <span className="font-bold text-neutral-950">مبلغ نهایی قابل پرداخت:</span>
                <span className="text-base font-black text-neutral-950">
                  {formatMoney(cartTotals.totalPayable)}
                </span>
              </div>
            </div>

            {/* Primary Checkout CTA */}
            <button
              onClick={proceedToCheckout}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <span>ادامه فرآیند خرید و انتخاب آدرس</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              تضمین اصالت کالا و تسویه ریالی از درگاه شاپرک
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
