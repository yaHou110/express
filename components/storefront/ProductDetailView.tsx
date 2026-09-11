'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '../../services/storeContext';
import { productIdFromPath } from '../../domain/views';
import { formatMoney, subtractMoney } from '../../domain/money';
import { ProductCard } from './ProductCard';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Heart,
  Scale,
  ShoppingCart,
  Zap,
  ChevronLeft,
  ArrowRight,
  Info,
  Package,
} from 'lucide-react';

export function ProductDetailView() {
  const {
    products,
    selectedProductId,
    selectedVariantId,
    addToCart,
    setCurrentView,
    toggleWishlist,
    wishlistIds,
    toggleComparison,
    comparisonIds,
  } = useStore();

  // The URL is the source of truth for a deep link, Back/Forward or a shared product link;
  // selectedProductId is only the fallback for a selection made off a product route.
  const routedProductId = productIdFromPath(usePathname());
  const product =
    products.find((p) => p.id === (routedProductId ?? selectedProductId)) || products[0];

  // Active variant state
  const [activeVariantId, setActiveVariantId] = useState(
    selectedVariantId || product.variants[0]?.id || ''
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Derive active variant
  const currentVariant =
    product.variants.find((v) => v.id === activeVariantId) || product.variants[0];

  const unitPrice = currentVariant.salePrice || currentVariant.basePrice;
  const hasDiscount = !!currentVariant.salePrice && currentVariant.discountPercent;
  const savings = hasDiscount ? subtractMoney(currentVariant.basePrice, currentVariant.salePrice!) : null;

  // Inventory available invariant
  const availableStock = Math.max(
    0,
    currentVariant.inventory.onHand - currentVariant.inventory.reserved
  );
  const isOutOfStock = availableStock <= 0;

  const isWishlisted = wishlistIds.includes(product.id);
  const isCompared = comparisonIds.includes(product.id);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category.id === product.category.id)
    .slice(0, 3);

  const handleVariantChange = (varId: string) => {
    setActiveVariantId(varId);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    const res = addToCart(product.id, currentVariant.id, quantity);
    if (res.success) {
      setCurrentView('cart');
    }
  };

  return (
    <div className="py-6 space-y-12" dir="rtl">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 pb-2">
        <button
          onClick={() => setCurrentView('home')}
          className="hover:text-neutral-900 transition-colors cursor-pointer"
        >
          صفحه اصلی
        </button>
        <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
        <button
          onClick={() => setCurrentView('catalog')}
          className="hover:text-neutral-900 transition-colors cursor-pointer"
        >
          {product.category.name}
        </button>
        <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-700 font-medium">{product.brand.name}</span>
        <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-950 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs">
        {/* Right Gallery Stage (5 cols on Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="w-full aspect-square bg-neutral-50 border border-neutral-200 rounded-2xl overflow-hidden flex items-center justify-center relative p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover rounded-xl"
            />

            {hasDiscount && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {currentVariant.discountPercent}٪ تخفیف
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-18 h-18 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                    activeImageIdx === idx
                      ? 'border-neutral-950 ring-2 ring-neutral-950/10'
                      : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick SKU & Catalog Information */}
          <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 text-xs text-neutral-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">شناسه اختصاصی انبار (SKU):</span>
              <span className="font-mono font-bold text-neutral-900">{currentVariant.sku}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">کشور مبدا برند:</span>
              <span className="font-medium text-neutral-800">{product.brand.originCountry}</span>
            </div>
          </div>
        </div>

        {/* Left Specification & Purchase Details (7 cols on Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                برند رسمی {product.brand.name}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleComparison(product.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    isCompared
                      ? 'bg-neutral-950 text-white border-neutral-950'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  {isCompared ? 'در لیست مقایسه' : 'افزودن به مقایسه'}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 leading-snug">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              {product.subtitle}
            </p>

            {/* Rating & Review metrics */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-neutral-500">
                بر اساس نظر <strong className="text-neutral-800">{product.reviewCount}</strong> خریدار تایید شده
              </span>
            </div>
          </div>

          {/* Variant Selector: Storage, Color, Warranty */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900">مدل و تنوع کالا:</span>
              <span className="text-neutral-500">
                انتخاب فعلی: <strong className="text-neutral-800">{currentVariant.title}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.variants.map((variant) => {
                const isSelected = variant.id === currentVariant.id;
                const varAvailable = variant.inventory.onHand - variant.inventory.reserved;
                const varOutOfStock = varAvailable <= 0;

                return (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantChange(variant.id)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-start justify-between ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-50 ring-2 ring-neutral-950/10'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    } ${varOutOfStock ? 'opacity-60' : ''}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {variant.attributes.colorHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                            style={{ backgroundColor: variant.attributes.colorHex }}
                          />
                        )}
                        <span className="text-xs font-bold text-neutral-900">
                          {variant.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 block">
                        {variant.attributes.warranty || 'گارانتی رسمی شرکتی'}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-xs font-extrabold text-neutral-950 block">
                        {formatMoney(variant.salePrice || variant.basePrice)}
                      </span>
                      {varOutOfStock ? (
                        <span className="text-[10px] text-rose-600 font-bold">اتمام موجودی</span>
                      ) : varAvailable < 5 ? (
                        <span className="text-[10px] text-amber-700">تنها {varAvailable} عدد</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Stock Availability Box */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-neutral-500 block mb-0.5">قیمت مصرف‌کننده:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-950">
                    {formatMoney(unitPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-neutral-400 line-through">
                      {formatMoney(currentVariant.basePrice)}
                    </span>
                  )}
                </div>
                {savings && (
                  <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                    سود شما از این خرید: {formatMoney(savings)}
                  </span>
                )}
              </div>

              {/* Stock status badge */}
              <div className="sm:text-left">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                    ناموجود در انبار مرکزی
                  </span>
                ) : availableStock < 5 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl">
                    تنها {availableStock} عدد باقی‌مانده در انبار
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-600" />
                    موجود و آماده ارسال فوری ({availableStock} عدد)
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-neutral-200">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  disabled={quantity >= availableStock || isOutOfStock}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={() => addToCart(product.id, currentVariant.id, quantity)}
                disabled={isOutOfStock}
                className="w-full sm:flex-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                افزودن به سبد خرید
              </button>

              {/* Buy Now CTA */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                خرید آنی
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-neutral-600">
            <div className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ضمانت ۱۰۰٪ اصالت و رجیستری</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <Truck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>ارسال اکسپرس بیمه‌شده</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>۷ روز مهلت تست فنی</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Reviews Tabs Section */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 space-y-10 shadow-xs">
        {/* Detailed Product Description */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-3">
            معرفی و بررسی اجمالی کالا
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-2">
            <h3 className="text-sm font-bold text-neutral-800 mb-2">ویژگی‌های برجسته محصول:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-700">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-3">
            مشخصات فنی و استانداردهای سخت‌افزاری
          </h2>

          <div className="border border-neutral-200 rounded-2xl overflow-hidden text-xs divide-y divide-neutral-200">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 p-3 hover:bg-neutral-50/80 transition-colors">
                <span className="sm:col-span-4 font-bold text-neutral-800 mb-1 sm:mb-0">
                  {spec.name}
                  <span className="text-[10px] text-neutral-400 block font-normal">
                    {spec.group}
                  </span>
                </span>
                <span className="sm:col-span-8 text-neutral-600 leading-relaxed">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">کالاهای مرتبط و مکمل</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                سایر پیشنهادهای برگزیده در دسته‌بندی {product.category.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
