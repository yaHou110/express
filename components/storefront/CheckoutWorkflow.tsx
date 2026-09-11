'use client';

import React, { useState } from 'react';
import { useStore } from '../../services/storeContext';
import { formatMoney } from '../../domain/money';
import { Address, ShippingMethod } from '../../domain/types';
import {
  CheckCircle2,
  Truck,
  CreditCard,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Receipt,
  FileCheck,
  Building,
  Lock,
  Phone,
  User,
} from 'lucide-react';

export function CheckoutWorkflow() {
  const {
    checkoutStep,
    setCheckoutStep,
    cartItems,
    cartTotals,
    addresses,
    selectedAddress,
    setSelectedAddress,
    shippingMethods,
    selectedShippingMethod,
    setSelectedShippingMethod,
    customerInfo,
    setCustomerInfo,
    lastCreatedOrder,
    processPaymentAndCreateOrder,
    setCurrentView,
  } = useStore();

  const [selectedGateway, setSelectedGateway] = useState<'ZARINPAL' | 'MELLAT' | 'SAMAN'>('MELLAT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // If order was created and we are in step 4
  const isCompleted = checkoutStep === 4 && !!lastCreatedOrder;

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setPaymentError(null);

    // Simulate real gateway handshake & response latency
    setTimeout(() => {
      const res = processPaymentAndCreateOrder(selectedGateway);
      setIsProcessing(false);
      if (!res.success) {
        setPaymentError(res.error || 'خطا در برقراری ارتباط با درگاه شاپرک.');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 700);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8" dir="rtl">
      {/* 4-Step Stepper Bar */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-2xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {/* Step 1 */}
          <div
            className={`flex flex-col items-center gap-1.5 ${
              checkoutStep >= 1 ? 'text-neutral-950 font-bold' : 'text-neutral-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                checkoutStep > 1
                  ? 'bg-emerald-600 text-white'
                  : checkoutStep === 1
                  ? 'bg-neutral-950 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {checkoutStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '۱'}
            </div>
            <span>آدرس و تحویل‌گیرنده</span>
          </div>

          {/* Step 2 */}
          <div
            className={`flex flex-col items-center gap-1.5 ${
              checkoutStep >= 2 ? 'text-neutral-950 font-bold' : 'text-neutral-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                checkoutStep > 2
                  ? 'bg-emerald-600 text-white'
                  : checkoutStep === 2
                  ? 'bg-neutral-950 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {checkoutStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '۲'}
            </div>
            <span>روش و زمان‌بندی ارسال</span>
          </div>

          {/* Step 3 */}
          <div
            className={`flex flex-col items-center gap-1.5 ${
              checkoutStep >= 3 ? 'text-neutral-950 font-bold' : 'text-neutral-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                checkoutStep > 3
                  ? 'bg-emerald-600 text-white'
                  : checkoutStep === 3
                  ? 'bg-neutral-950 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {checkoutStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : '۳'}
            </div>
            <span>درگاه و پرداخت امن</span>
          </div>

          {/* Step 4 */}
          <div
            className={`flex flex-col items-center gap-1.5 ${
              checkoutStep === 4 ? 'text-emerald-700 font-bold' : 'text-neutral-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                checkoutStep === 4
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              ۴
            </div>
            <span>صدور فاکتور و ثبت سند</span>
          </div>
        </div>
      </div>

      {/* Step 1: Address & Customer Details */}
      {checkoutStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-6 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                  <User className="w-5 h-5 text-neutral-700" />
                  اطلاعات تحویل‌گیرنده سفارش
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  مشخصات فردی جهت صدور فاکتور رسمی و ارسال پیامک رهگیری مرسوله
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1.5">
                    نام و نام خانوادگی خریدار:
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                    placeholder="مثال: دانیال رادمنش"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1.5">
                    شماره تلفن همراه (جهت دریافت کد پیامکی):
                  </label>
                  <input
                    type="text"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 font-mono"
                    placeholder="۰۹۱۲..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1.5">
                    کد ملی خریدار (الزامی برای ثبت رجیستری در سامانه همتا):
                  </label>
                  <input
                    type="text"
                    value={customerInfo.nationalCode}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, nationalCode: e.target.value })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 font-mono"
                    placeholder="۰۰۱۲۳۴۵۶۷۸"
                  />
                </div>
              </div>
            </div>

            {/* Address Selector */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neutral-700" />
                    انتخاب نشانی تحویل مرسوله
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    مرسوله شما به این آدرس ارسال خواهد شد
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddress.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-2xl border text-right cursor-pointer transition-all ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-50 ring-2 ring-neutral-950/10'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-neutral-950 bg-neutral-950'
                                : 'border-neutral-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          {addr.title}
                        </span>

                        <span className="text-[11px] text-neutral-500">
                          گیرنده: {addr.receiverName} ({addr.phone})
                        </span>
                      </div>

                      <p className="text-xs text-neutral-700 leading-relaxed pr-5">
                        {addr.province}، {addr.city}، {addr.postalAddress}
                      </p>

                      <div className="mt-2 pr-5 text-[11px] text-neutral-400 font-mono">
                        کد پستی ۱۰ رقمی: {addr.postalCode}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checkout Mini Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-neutral-950 pb-3 border-b border-neutral-100">
                فاکتور اولیه
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>مجموع اقلام:</span>
                  <span className="font-bold text-neutral-900">{formatMoney(cartTotals.itemsSubtotal)}</span>
                </div>
                {cartTotals.promotionalDiscount.amount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>تخفیف کوپن:</span>
                    <span className="font-bold">-{formatMoney(cartTotals.promotionalDiscount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-950">
                  <span>مبلغ قابل پرداخت:</span>
                  <span>{formatMoney(cartTotals.totalPayable)}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep(2)}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <span>تایید آدرس و انتخاب روش ارسال</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Shipping Method & Schedule */}
      {checkoutStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-neutral-700" />
                  روش‌های ارسال و باربری کالا
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  ارسال با ناوگان اختصاصی، بسته‌بندی پلمپ و بیمه کامل باربری
                </p>
              </div>

              <div className="space-y-3">
                {shippingMethods.map((method) => {
                  const isSelected = method.id === selectedShippingMethod.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedShippingMethod(method)}
                      className={`p-4 rounded-2xl border text-right cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-50 ring-2 ring-neutral-950/10'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-neutral-950 bg-neutral-950'
                                : 'border-neutral-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-neutral-950">
                            {method.name}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 pr-5">
                          {method.description}
                        </p>
                        <span className="text-[11px] text-emerald-700 font-semibold pr-5 block">
                          زمان تحویل تقریبی: {method.estimatedDelivery}
                        </span>
                      </div>

                      <div className="text-left font-bold text-xs sm:text-sm text-neutral-950">
                        {method.cost.amount === 0 ? 'رایگان' : formatMoney(method.cost)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCheckoutStep(1)}
                className="text-xs font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer py-2"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به اطلاعات آدرس
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-neutral-950 pb-3 border-b border-neutral-100">
                صورتحساب با هزینه حمل
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>مجموع اقلام:</span>
                  <span className="font-bold text-neutral-900">{formatMoney(cartTotals.itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>کرایه حمل منتخب:</span>
                  <span className="font-bold text-neutral-900">
                    {selectedShippingMethod.cost.amount === 0 ? 'رایگان' : formatMoney(selectedShippingMethod.cost)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-950">
                  <span>مبلغ کل قابل پرداخت:</span>
                  <span>{formatMoney(cartTotals.totalPayable)}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep(3)}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <span>انتخاب درگاه و پرداخت اینترنتی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment Gateway & Settlement */}
      {checkoutStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-5 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neutral-700" />
                  انتخاب درگاه پرداخت آنلاین شاپرک
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  پرداخت امن با کلیه کارت‌های عضو شبکه شتاب با رمز دوم پویا
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'MELLAT', name: 'به‌پرداخت ملت', desc: 'تسویه رسمی و مستقیم بانکی', badge: 'پیشنهادی' },
                  { id: 'ZARINPAL', name: 'زرین‌پال اختصاصی', desc: 'درگاه پرداخت پایدار با تضمین تراکنش', badge: 'آنی' },
                  { id: 'SAMAN', name: 'سامان کیش (سپ)', desc: 'درگاه هوشمند بانکی شاپرک', badge: 'شتاب' },
                ].map((gw) => {
                  const isSelected = selectedGateway === gw.id;
                  return (
                    <button
                      key={gw.id}
                      onClick={() => setSelectedGateway(gw.id as any)}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between h-28 ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-50 ring-2 ring-neutral-950/10'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs text-neutral-900">{gw.name}</span>
                        <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                          {gw.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 leading-snug">{gw.desc}</span>
                    </button>
                  );
                })}
              </div>

              {paymentError && (
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-700 font-medium">
                  {paymentError}
                </div>
              )}

              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs space-y-2 text-neutral-600">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  امنیت تراکنش و کنترل عدم تکرار (Idempotency Key)
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  تراکنش شما با کلید یکتا و منجمدسازی موجودی ثبت می‌شود. در صورت بروز هرگونه قطعی شبکه، هیچ مبلغ مضاعفی از حساب شما کسر نخواهد شد.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCheckoutStep(2)}
                className="text-xs font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer py-2"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به انتخاب شیوه ارسال
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-neutral-950 pb-3 border-b border-neutral-100">
                فاکتور نهایی تسویه
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>مجموع اقلام:</span>
                  <span className="font-bold text-neutral-900">{formatMoney(cartTotals.itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>کرایه حمل:</span>
                  <span className="font-bold text-neutral-900">{formatMoney(cartTotals.shippingFee)}</span>
                </div>
                {cartTotals.promotionalDiscount.amount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>تخفیف:</span>
                    <span className="font-bold">-{formatMoney(cartTotals.promotionalDiscount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-950">
                  <span>مبلغ نهایی:</span>
                  <span className="text-base font-black">{formatMoney(cartTotals.totalPayable)}</span>
                </div>
              </div>

              <button
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:bg-neutral-300"
              >
                {isProcessing ? (
                  <span>در حال تایید تراکنش در شاپرک...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>پرداخت امن شاپرک و ثبت سفارش</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Final Confirmation & Immutable Invoice */}
      {isCompleted && lastCreatedOrder && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
          {/* Success Banner */}
          <div className="text-center space-y-3 pb-6 border-b border-neutral-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950">
              سفارش شما با موفقیت ثبت و پرداخت گردید
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              تراکنش مالی تایید شد، فاکتور منجمد و به دفتر کل سیستم ثبت گردید و کالاهای شما در انبار برای ارسال بسته‌بندی می‌شوند.
            </p>

            <div className="inline-flex items-center gap-4 bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-xl text-xs">
              <span>
                شماره سفارش رسمی: <strong className="text-neutral-950 font-mono">{lastCreatedOrder.orderNumber}</strong>
              </span>
              <span className="text-neutral-300">|</span>
              <span>
                کد رهگیری شاپرک: <strong className="text-neutral-950 font-mono">{lastCreatedOrder.paymentInfo?.transactionTraceNumber || '—'}</strong>
              </span>
            </div>
          </div>

          {/* Frozen Line Items Snapshot */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-neutral-700" />
              اقلام منجمدشده در فاکتور رسمی
            </h3>

            <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs">
              {lastCreatedOrder.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neutral-50 rounded-xl overflow-hidden shrink-0 border border-neutral-100 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900">{item.productTitle}</h4>
                      <div className="text-neutral-400 text-[11px]">
                        مدل: {item.variantTitle} | SKU: <span className="font-mono">{item.sku}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-neutral-400 text-[11px] block">{item.quantity} عدد × {formatMoney(item.finalPrice)}</span>
                    <span className="font-bold text-neutral-950 text-xs sm:text-sm">{formatMoney(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Financials grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
              <span className="font-bold text-neutral-900 block">نشانی و شیوه تحویل:</span>
              <p className="text-neutral-700 leading-relaxed">
                {lastCreatedOrder.shippingAddress.province}، {lastCreatedOrder.shippingAddress.city}، {lastCreatedOrder.shippingAddress.postalAddress}
              </p>
              <div className="text-neutral-500 text-[11px]">
                روش ارسال: {lastCreatedOrder.shippingMethod.name} ({lastCreatedOrder.shippingMethod.estimatedDelivery})
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
              <span className="font-bold text-neutral-900 block">مشخصات سند مالی دفتر کل:</span>
              <div className="space-y-1 text-neutral-600 text-[11px]">
                <div className="flex justify-between">
                  <span>درگاه تسویه:</span>
                  <span className="font-mono font-bold text-neutral-900">{lastCreatedOrder.paymentInfo?.gateway || 'شاپرک'}</span>
                </div>
                <div className="flex justify-between">
                  <span>کلید تطابق (Idempotency):</span>
                  <span className="font-mono text-neutral-700 truncate max-w-44">{lastCreatedOrder.paymentInfo?.idempotencyKey || '—'}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-200 font-bold text-neutral-950 text-xs">
                  <span>کل مبلغ پرداختی:</span>
                  <span>{formatMoney(lastCreatedOrder.financials.totalPayable)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentView('account')}
              className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              مشاهده وضعیت در پنل کاربری من
            </button>

            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 cursor-pointer"
            >
              بازگشت به فروشگاه و ادامه خرید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
