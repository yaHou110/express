'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '../../services/storeContext';
import { StorefrontHeader } from './StorefrontHeader';
import { StorefrontFooter } from './StorefrontFooter';
import { ProductComparisonModal } from '../storefront/ProductComparisonModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

/**
 * The persistent chrome around every route: header, footer, comparison modal and the
 * toast stack. Living in the root layout keeps it mounted across navigations, so the
 * store, the search box and the toast queue survive route changes.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { toasts } = useStore();
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen flex flex-col bg-neutral-100/60 text-neutral-900 selection:bg-neutral-900 selection:text-white"
      dir="rtl"
    >
      <StorefrontHeader />

      {/* Remounting the view on route change keeps per-view local state (gallery index,
          variant picker, …) from leaking between products and views. */}
      <main key={pathname} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        {children}
      </main>

      <ProductComparisonModal />

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

      <StorefrontFooter />
    </div>
  );
}
