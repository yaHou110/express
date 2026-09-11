'use client';

import React from 'react';
import { StoreProvider, useStore } from '../services/storeContext';
import { StorefrontHeader } from '../components/layout/StorefrontHeader';
import { StorefrontFooter } from '../components/layout/StorefrontFooter';
import { HeroShowcase } from '../components/storefront/HeroShowcase';
import { CategoryGrid } from '../components/storefront/CategoryGrid';
import { ProductCatalog } from '../components/storefront/ProductCatalog';
import { ProductDetailView } from '../components/storefront/ProductDetailView';
import { ProductComparisonModal } from '../components/storefront/ProductComparisonModal';
import { CartView } from '../components/storefront/CartView';
import { CheckoutWorkflow } from '../components/storefront/CheckoutWorkflow';
import { CustomerAccount } from '../components/storefront/CustomerAccount';
import { ProductCard } from '../components/storefront/ProductCard';

// Admin operations views
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminInventory } from '../components/admin/AdminInventory';
import { AdminLedger } from '../components/admin/AdminLedger';
import { AdminFeatureGating } from '../components/admin/AdminFeatureGating';

// Tier C Enterprise previews
import { MarketplacePreview } from '../components/enterprise/MarketplacePreview';
import { B2BCommercePreview } from '../components/enterprise/B2BCommercePreview';
import { MultiWarehousePreview } from '../components/enterprise/MultiWarehousePreview';

import {
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
} from 'lucide-react';

function StoreApp() {
  const { currentView, setCurrentView, products, toasts } = useStore();

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100/60 text-neutral-900 selection:bg-neutral-900 selection:text-white" dir="rtl">
      {/* Universal Header */}
      <StorefrontHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* Dynamic View Router */}
        {currentView === 'home' && (
          <div className="py-6 sm:py-8 space-y-12">
            {/* Editorial Flagship Hero */}
            <HeroShowcase />

            {/* Visual Category Discovery */}
            <CategoryGrid />

            {/* Featured Catalog Grid */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                    محصولات برگزیده و پرفروش والا
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                    دستچین برترین پرچمداران دیجیتال با گارانتی معتبر شرکتی و موجودی آماده ارسال
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('catalog')}
                  className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1.5 cursor-pointer py-1 transition-colors self-start sm:self-auto"
                >
                  مشاهده همه محصولات کاتالوگ
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </section>

            {/* Platform Craft & Architecture Assurance Strip */}
            <section className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-bold text-neutral-500 uppercase">
                  استانداردهای مهندسی پلتفرم والا
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-neutral-950">
                  تجارت الکترونیک با معماری ماژولار، یکپارچگی مالی و تضمین موجودی
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  بر خلاف قالب‌های سنتی، پلتفرم تجاری والا محاسبات مالی را بر پایه اعداد صحیح، ماشین حالت تغییرناپذیر سفارشات و انبارداری بدون کسری پیاده‌سازی کرده است.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-1.5">
                  <div className="font-bold text-xs text-neutral-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    انضباط محاسبات مالی
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    محاسبه ارزش ریالی فاکتورها، مالیات و تخفیف‌ها به صورت ارزش‌های پولی صحیح، بدون خطای ممیز شناور.
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-1.5">
                  <div className="font-bold text-xs text-neutral-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600" />
                    تخصیص اتمیک موجودی انبار
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    منجمدسازی موجودی در لحظه خرید و پیشگیری قطعی از فروش کالای ناموجود در شرایط اوج ترافیک جشنواره‌ها.
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-1.5">
                  <div className="font-bold text-xs text-neutral-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    آماده برای توسعه انترپرایز
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    پشتیبانی از ماژول‌های مارکت‌پلیس چندفروشندگی، فروش عمده B2B و توزیع چندانباره بدون دستکاری هسته اصلی.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'catalog' && <ProductCatalog />}
        {currentView === 'product-detail' && <ProductDetailView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'checkout' && <CheckoutWorkflow />}
        {currentView === 'account' && <CustomerAccount />}

        {/* Admin Operations Views */}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
        {currentView === 'admin-orders' && <AdminOrders />}
        {currentView === 'admin-inventory' && <AdminInventory />}
        {currentView === 'admin-ledger' && <AdminLedger />}
        {currentView === 'admin-features' && <AdminFeatureGating />}

        {/* Tier C Enterprise Previews */}
        {currentView === 'preview-marketplace' && <MarketplacePreview />}
        {currentView === 'preview-b2b' && <B2BCommercePreview />}
        {currentView === 'preview-warehouse' && <MultiWarehousePreview />}
      </main>

      {/* Universal Comparison Modal */}
      <ProductComparisonModal />

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none" dir="rtl">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all animate-in slide-in-from-bottom-2 duration-200 ${
              t.type === 'success'
                ? 'bg-neutral-950 text-white border-neutral-800'
                : t.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-white text-neutral-900 border-neutral-300'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-sky-500 shrink-0" />}
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Universal Footer */}
      <StorefrontFooter />
    </div>
  );
}

export default function Page() {
  return (
    <StoreProvider>
      <StoreApp />
    </StoreProvider>
  );
}
