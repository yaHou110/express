'use client';

import React from 'react';
import { Product } from '../../domain/types';
import { formatMoney } from '../../domain/money';
import { useStore } from '../../services/storeContext';
import { Star, Heart, Scale, ShoppingCart, Check, ShieldCheck, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    navigateToProduct,
    addToCart,
    toggleComparison,
    comparisonIds,
    toggleWishlist,
    wishlistIds,
  } = useStore();

  const isCompared = comparisonIds.includes(product.id);
  const isWishlisted = wishlistIds.includes(product.id);

  // Take default or first variant for pricing
  const defaultVariant = product.variants[0];
  const unitPrice = defaultVariant.salePrice || defaultVariant.basePrice;
  const hasDiscount = !!defaultVariant.salePrice && defaultVariant.discountPercent;

  // Calculate available stock across all variants
  const totalAvailable = product.variants.reduce(
    (acc, v) => acc + Math.max(0, v.inventory.onHand - v.inventory.reserved),
    0
  );
  const isOutOfStock = totalAvailable <= 0;

  return (
    <div
      className="group bg-white border border-neutral-200/90 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-400 hover:shadow-md transition-all duration-200 relative text-right"
      dir="rtl"
    >
      {/* Top Badges & Actions */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {product.badges && product.badges.length > 0 && (
              <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {product.badges[0]}
              </span>
            )}
            {hasDiscount && (
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {defaultVariant.discountPercent}٪ تخفیف
              </span>
            )}
          </div>

          {/* Card Utilities (Wishlist + Compare) */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleComparison(product.id);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
              }`}
              title={isCompared ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-rose-600'
              }`}
              title={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Image Stage */}
        <div
          onClick={() => navigateToProduct(product.id, defaultVariant.id)}
          className="w-full aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center cursor-pointer relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-lg border border-neutral-700">
                اتمام موجودی در انبار
              </span>
            </div>
          )}
        </div>

        {/* Brand & Category Info */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
          <span className="font-semibold text-neutral-700">{product.brand.name}</span>
          <span className="text-neutral-400">{product.category.name}</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => navigateToProduct(product.id, defaultVariant.id)}
          className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-neutral-700 transition-colors line-clamp-2 leading-snug mb-2 cursor-pointer h-10"
        >
          {product.title}
        </h3>

        {/* Key Specification Preview */}
        <p className="text-[11px] text-neutral-500 line-clamp-1 mb-3">
          {product.subtitle}
        </p>

        {/* Stock & Rating Indicator */}
        <div className="flex items-center justify-between text-xs py-1.5 border-t border-neutral-100 text-neutral-500 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-neutral-900">{product.rating}</span>
            <span className="text-[10px] text-neutral-400">({product.reviewCount})</span>
          </div>

          <div className="text-[11px]">
            {isOutOfStock ? (
              <span className="text-rose-600 font-medium">ناموجود</span>
            ) : totalAvailable < 5 ? (
              <span className="text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded-sm">
                تنها {totalAvailable} عدد باقیست
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> موجود در انبار
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing and Action Section */}
      <div className="pt-2 border-t border-neutral-100">
        <div className="flex items-end justify-between gap-2 mb-3">
          <div className="text-right">
            {hasDiscount && (
              <span className="text-[11px] text-neutral-400 line-through block leading-none mb-1">
                {formatMoney(defaultVariant.basePrice)}
              </span>
            )}
            <span className="text-sm sm:text-base font-extrabold text-neutral-950 block leading-tight">
              {formatMoney(unitPrice)}
            </span>
          </div>

          {product.variants.length > 1 && (
            <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-md font-medium">
              {product.variants.length} مدل و تنوع
            </span>
          )}
        </div>

        {/* Purchase / Detail Button */}
        <div className="grid grid-cols-5 gap-1.5">
          <button
            onClick={() => navigateToProduct(product.id, defaultVariant.id)}
            className="col-span-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold py-2 px-2.5 rounded-xl transition-colors text-center cursor-pointer"
          >
            بررسی تخصصی
          </button>

          <button
            onClick={() => addToCart(product.id, defaultVariant.id, 1)}
            disabled={isOutOfStock}
            className={`col-span-2 flex items-center justify-center gap-1 text-xs font-semibold py-2 px-2 rounded-xl transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-xs active:scale-95'
            }`}
            title="افزودن مستقیم به سبد خرید"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خرید</span>
          </button>
        </div>
      </div>
    </div>
  );
}
