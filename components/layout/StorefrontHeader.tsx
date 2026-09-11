'use client';

import React, { useState } from 'react';
import { useStore, AppView } from '../../services/storeContext';
import { CATEGORIES } from '../../data/catalogData';
import { formatMoney } from '../../domain/money';
import {
  Search,
  ShoppingBag,
  Heart,
  Scale,
  User,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Sparkles,
  Building2,
  PackageCheck,
  ShieldCheck,
  Truck,
  PhoneCall,
  Menu,
  X,
} from 'lucide-react';

export function StorefrontHeader() {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    setSelectedCategorySlug,
    cartItems,
    cartTotals,
    comparisonIds,
    setIsComparisonOpen,
    wishlistIds,
    featureFlags,
  } = useStore();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('catalog');
    setIsMegaMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 shadow-xs" dir="rtl">
      {/* Top Notification Bar */}
      <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ضمانت اصالت و رجیستری ۱۰۰٪ رسمی
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-neutral-400">
              <Truck className="w-4 h-4 text-sky-400" />
              ارسال اکسپرس همان‌روز در کلان‌شهرها
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 text-xs">
            <span className="hidden sm:inline">پشتیبانی متمرکز: ۰۲۱-۹۱۰۰۸۴۰۰</span>
            <div className="h-3 w-px bg-neutral-700 hidden sm:block" />
            <button
              onClick={() => setCurrentView('account')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              پیگیری سفارشات
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo and Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
              aria-label="منوی اصلی"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setSearchQuery('');
                setCurrentView('home');
              }}
              className="flex items-center gap-2.5 text-right text-neutral-900 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-lg tracking-wider shadow-sm group-hover:bg-neutral-800 transition-colors">
                V
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight block leading-tight text-neutral-950">
                  VALA COMMERCE
                </span>
                <span className="text-[11px] font-medium text-neutral-500 block leading-tight">
                  پلتفرم تخصصی تجارت مدرن
                </span>
              </div>
            </button>
          </div>

          {/* Search Input with Dynamic Auto-complete */}
          <div className="flex-1 max-w-2xl hidden md:block relative">
            <div
              className={`flex items-center bg-neutral-50 border rounded-xl px-3.5 py-2 transition-all ${
                isSearchFocused
                  ? 'border-neutral-900 bg-white ring-2 ring-neutral-900/10'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <Search className="w-4 h-4 text-neutral-400 ml-2 shrink-0" />
              <input
                type="text"
                placeholder="جستجوی نام کالا، برند، کد کاتالوگ (مثال: آیفون ۱۶، سونی، اسپرسوساز)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'catalog') {
                    setCurrentView('catalog');
                  }
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Icons & Portal Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mode Switcher Pill */}
            <div className="hidden xl:flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/80 text-xs">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  !currentView.startsWith('admin') && !currentView.startsWith('preview')
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                فروشگاه
              </button>
              <button
                onClick={() => setCurrentView('admin-dashboard')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView.startsWith('admin')
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                مدیریت عملیات (Admin)
              </button>
              <button
                onClick={() => setCurrentView('preview-marketplace')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  currentView.startsWith('preview')
                    ? 'bg-amber-900 text-amber-100 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                قابلیت‌های سازمانی
              </button>
            </div>

            {/* Comparison Tray Action */}
            {featureFlags.productComparison && (
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="relative p-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                title="مقایسه مشخصات کالاها"
              >
                <Scale className="w-5 h-5" />
                {comparisonIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {comparisonIds.length}
                  </span>
                )}
              </button>
            )}

            {/* Wishlist Action */}
            {featureFlags.wishlist && (
              <button
                onClick={() => setCurrentView('account')}
                className="relative p-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                title="لیست علاقه‌مندی‌ها"
              >
                <Heart className="w-5 h-5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistIds.length}
                  </span>
                )}
              </button>
            )}

            {/* User Account Portal */}
            <button
              onClick={() => setCurrentView('account')}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-neutral-200"
            >
              <User className="w-5 h-5 text-neutral-700" />
              <span className="hidden sm:inline text-xs font-semibold">حساب کاربری</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCurrentView('cart')}
              className="flex items-center gap-2.5 bg-neutral-950 text-white hover:bg-neutral-800 px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 bg-emerald-500 text-neutral-950 text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-right leading-none">
                <span className="text-[11px] text-neutral-400">سبد خرید</span>
                <span className="text-xs font-bold text-white mt-0.5">
                  {cartTotals.itemsSubtotal.amount > 0 ? formatMoney(cartTotals.totalPayable) : 'خالی'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-neutral-400 ml-2 shrink-0" />
            <input
              type="text"
              placeholder="جستجوی کالا و برند در والا..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') setCurrentView('catalog');
              }}
              className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar with Mega Menu */}
      <div className="bg-neutral-50/70 border-t border-neutral-200/60 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-700">
            {/* Mega Menu Toggle and Categories */}
            <div className="flex items-center gap-6 py-2.5">
              <div className="relative">
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className="flex items-center gap-2 font-bold text-neutral-900 hover:text-neutral-700 py-1 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-neutral-900" />
                  دسته‌بندی‌های کالا
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                {isMegaMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow-xl p-3 grid gap-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                  >
                    <div className="px-3 py-2 text-[11px] font-bold text-neutral-400 border-b border-neutral-100 mb-1">
                      کاتالوگ تخصصی محصولات والا
                    </div>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-right cursor-pointer group"
                      >
                        <span className="font-semibold text-neutral-800 group-hover:text-neutral-950">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-neutral-400 bg-neutral-100 group-hover:bg-neutral-200/70 px-2 py-0.5 rounded-md">
                          {cat.productCount} کالا
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-neutral-200" />

              {/* Direct Category Shortcuts */}
              {CATEGORIES.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer py-1"
                >
                  {cat.name}
                </button>
              ))}

              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setCurrentView('catalog');
                }}
                className="text-neutral-900 font-semibold hover:underline cursor-pointer py-1"
              >
                کاتالوگ کامل کالاها
              </button>
            </div>

            {/* Quick Links & Enterprise Preview link */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => setCurrentView('preview-b2b')}
                className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                فروش سازمانی B2B
              </button>
              <button
                onClick={() => setCurrentView('account')}
                className="text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
              >
                سفارشات من
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="text-xs font-bold text-neutral-500">انتخاب حالت پلتفرم:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  !currentView.startsWith('admin') ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                فروشگاه
              </button>
              <button
                onClick={() => {
                  setCurrentView('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  currentView.startsWith('admin') ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                پنل ادمین
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-neutral-400 px-2 py-1">دسته‌بندی‌های کالا:</div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="w-full text-right px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50 rounded-lg flex items-center justify-between"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-neutral-400">{cat.productCount} کالا</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-100 space-y-2">
            <button
              onClick={() => {
                setCurrentView('preview-marketplace');
                setMobileMenuOpen(false);
              }}
              className="w-full text-right px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              پیش‌نمایش امکانات Enterprise (مارکت‌پلیس و B2B)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
