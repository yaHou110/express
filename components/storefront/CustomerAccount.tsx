'use client';

import React, { useState } from 'react';
import { useStore } from '../../services/storeContext';
import { formatMoney } from '../../domain/money';
import { Order, OrderStatus } from '../../domain/types';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Receipt,
  Heart,
  MapPin,
  ChevronLeft,
  XCircle,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

const STATUS_LABELS: Record<OrderStatus, { text: string; bg: string; color: string }> = {
  CREATED: { text: 'ایجاد شده', bg: 'bg-neutral-100', color: 'text-neutral-700' },
  PAYMENT_PENDING: { text: 'در انتظار پرداخت', bg: 'bg-amber-50 border border-amber-200', color: 'text-amber-800' },
  PAID: { text: 'پرداخت‌شده / آماده پردازش', bg: 'bg-emerald-50 border border-emerald-200', color: 'text-emerald-800' },
  CONFIRMED: { text: 'تایید انبار', bg: 'bg-blue-50 border border-blue-200', color: 'text-blue-800' },
  PROCESSING: { text: 'در حال بسته‌بندی در انبار', bg: 'bg-sky-50 border border-sky-200', color: 'text-sky-800' },
  SHIPPED: { text: 'تحویل به ناوگان ارسال', bg: 'bg-purple-50 border border-purple-200', color: 'text-purple-800' },
  DELIVERED: { text: 'تحویل داده شده به خریدار', bg: 'bg-emerald-100 border border-emerald-300', color: 'text-emerald-900' },
  CANCELLED: { text: 'لغو شده', bg: 'bg-neutral-100 border border-neutral-300', color: 'text-neutral-600' },
  RETURN_REQUESTED: { text: 'درخواست مرجوعی', bg: 'bg-rose-50 border border-rose-200', color: 'text-rose-800' },
  REFUNDED: { text: 'مبلغ استرداد گردید', bg: 'bg-amber-50 border border-amber-200', color: 'text-amber-800' },
};

export function CustomerAccount() {
  const {
    orders,
    selectedOrderForDetail,
    setSelectedOrderForDetail,
    wishlistIds,
    toggleWishlist,
    products,
    addToCart,
    navigateToProduct,
    addresses,
    setCurrentView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses'>('orders');

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="py-8 space-y-8" dir="rtl">
      {/* Account Overview Header */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl">
            د.ر
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-neutral-950">
              دانیال رادمنش
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              ۰۹۱۲۳۴۵۶۷۸۹ • مشتری تایید شده والا
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-2xl border border-neutral-200 text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            تاریخچه سفارشات ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            علاقه‌مندی‌ها ({wishlistIds.length})
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'addresses'
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            نشانی‌ها ({addresses.length})
          </button>
        </div>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Orders List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-bold text-neutral-900 pb-1">
              فهرست فاکتورها و سفارشات شما
            </h2>

            {orders.map((ord) => {
              const isSelected = selectedOrderForDetail?.id === ord.id;
              const statusInfo = STATUS_LABELS[ord.status] || STATUS_LABELS.CREATED;

              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderForDetail(ord)}
                  className={`p-4 rounded-2xl border text-right cursor-pointer transition-all ${
                    isSelected
                      ? 'border-neutral-950 bg-neutral-50 ring-2 ring-neutral-950/10'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-neutral-950">
                      {ord.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusInfo.bg} ${statusInfo.color}`}
                    >
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500 space-y-1 mb-2">
                    <div>تاریخ ثبت: {ord.createdAt}</div>
                    <div>تعداد اقلام: {ord.items.length} قلم کالا</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                    <span className="text-neutral-400">مبلغ پرداخت شده:</span>
                    <span className="font-extrabold text-neutral-950">
                      {formatMoney(ord.financials.totalPayable)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Order Detailed Inspector (7 cols) */}
          <div className="lg:col-span-7">
            {selectedOrderForDetail ? (
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200">
                  <div>
                    <span className="text-xs text-neutral-400 block">جزئیات سفارش:</span>
                    <h3 className="text-base font-bold text-neutral-950 font-mono">
                      {selectedOrderForDetail.orderNumber}
                    </h3>
                  </div>

                  <div className="text-left">
                    <span
                      className={`inline-block text-xs font-bold px-3 py-1 rounded-xl ${
                        STATUS_LABELS[selectedOrderForDetail.status]?.bg
                      } ${STATUS_LABELS[selectedOrderForDetail.status]?.color}`}
                    >
                      {STATUS_LABELS[selectedOrderForDetail.status]?.text}
                    </span>
                  </div>
                </div>

                {/* State Machine History / Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-600" />
                    روند گردش وضعیت سفارش در سیستم والا
                  </h4>

                  <div className="relative pr-4 space-y-3 before:absolute before:right-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                    {selectedOrderForDetail.statusHistory.map((h, idx) => (
                      <div key={idx} className="relative flex items-start gap-3 text-xs">
                        <div className="w-3 h-3 rounded-full bg-neutral-900 border-2 border-white shrink-0 mt-0.5 ring-2 ring-neutral-300" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900">
                              {STATUS_LABELS[h.status]?.text || h.status}
                            </span>
                            <span className="text-[10px] text-neutral-400">{h.timestamp}</span>
                          </div>
                          {h.note && (
                            <p className="text-[11px] text-neutral-500 mt-0.5">{h.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frozen Snapshots Table */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-neutral-600" />
                    اقلام ثبت‌شده در فاکتور
                  </h4>

                  <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs">
                    {selectedOrderForDetail.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 p-1 shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold text-neutral-900">{item.productTitle}</h5>
                            <span className="text-[11px] text-neutral-500">
                              {item.variantTitle} | کد: <span className="font-mono">{item.sku}</span>
                            </span>
                          </div>
                        </div>

                        <div className="text-left">
                          <span className="text-[11px] text-neutral-400 block">{item.quantity} عدد</span>
                          <span className="font-bold text-neutral-950">{formatMoney(item.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>جمع اقلام فاکتور:</span>
                    <span>{formatMoney(selectedOrderForDetail.financials.itemsSubtotal)}</span>
                  </div>
                  {selectedOrderForDetail.financials.promotionalDiscount.amount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>تخفیف اعمال‌شده:</span>
                      <span>-{formatMoney(selectedOrderForDetail.financials.promotionalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>هزینه حمل و باربری:</span>
                    <span>{formatMoney(selectedOrderForDetail.financials.shippingFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 flex justify-between font-extrabold text-sm text-neutral-950">
                    <span>مبلغ پرداخت‌شده نهایی:</span>
                    <span>{formatMoney(selectedOrderForDetail.financials.totalPayable)}</span>
                  </div>
                </div>

                {/* Payment & Delivery details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="font-bold text-neutral-900 block mb-1">مشخصات تراکنش:</span>
                    <div>درگاه: {selectedOrderForDetail.paymentInfo?.gateway || 'شاپرک'}</div>
                    <div>کد رهگیری: <span className="font-mono">{selectedOrderForDetail.paymentInfo?.transactionTraceNumber || '—'}</span></div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="font-bold text-neutral-900 block mb-1">شیوه ارسال:</span>
                    <div>{selectedOrderForDetail.shippingMethod.name}</div>
                    <div className="truncate">{selectedOrderForDetail.shippingAddress.postalAddress}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 text-xs">
                یک سفارش را از ستون کناری برای مشاهده جزئیات انتخاب کنید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900">
            کالاهای برگزیده و مورد علاقه شما ({wishlistedProducts.length} کالا)
          </h2>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center text-xs text-neutral-500">
              لیست علاقه‌مندی‌های شما در حال حاضر خالی است.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistedProducts.map((p) => {
                const defVar = p.variants[0];
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 rounded-xl bg-neutral-50 border border-neutral-200 p-1 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3
                          onClick={() => navigateToProduct(p.id, defVar.id)}
                          className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer line-clamp-2"
                        >
                          {p.title}
                        </h3>
                        <span className="text-xs font-extrabold text-neutral-950 block mt-1">
                          {formatMoney(defVar.salePrice || defVar.basePrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                      <button
                        onClick={() => addToCart(p.id, defVar.id, 1)}
                        className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        افزودن به سبد خرید
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="حذف از لیست"
                      >
                        <Heart className="w-4 h-4 fill-rose-600" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900">
            نشانی‌های ثبت‌شده برای تحویل سفارشات ({addresses.length} آدرس)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-neutral-950">
                  <span>{addr.title}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-md">
                      پیش‌فرض
                    </span>
                  )}
                </div>

                <p className="text-neutral-700 leading-relaxed">
                  {addr.province}، {addr.city}، {addr.postalAddress}
                </p>

                <div className="pt-2 text-neutral-400 space-y-1 font-mono text-[11px]">
                  <div>کد پستی: {addr.postalCode}</div>
                  <div>تحویل‌گیرنده: {addr.receiverName} ({addr.phone})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
