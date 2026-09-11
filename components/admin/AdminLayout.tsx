'use client';

import React from 'react';
import { useStore, AppView } from '../../services/storeContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ReceiptText,
  ToggleRight,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'orders' | 'inventory' | 'ledger' | 'features';
}

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const { setCurrentView, orders, ledgerEntries, featureFlags } = useStore();

  const navItems: { id: AppView; key: string; label: string; icon: React.ReactNode }[] = [
    {
      id: 'admin-dashboard',
      key: 'dashboard',
      label: 'داشبورد شاخص‌ها',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'admin-orders',
      key: 'orders',
      label: `مدیریت سفارشات (${orders.length})`,
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: 'admin-inventory',
      key: 'inventory',
      label: 'موجودی و انبارداری',
      icon: <Boxes className="w-4 h-4" />,
    },
    {
      id: 'admin-ledger',
      key: 'ledger',
      label: `دفتر کل مالی (${ledgerEntries.length})`,
      icon: <ReceiptText className="w-4 h-4" />,
    },
    {
      id: 'admin-features',
      key: 'features',
      label: 'تنظیمات و Feature Flags',
      icon: <ToggleRight className="w-4 h-4" />,
    },
  ];

  return (
    <div className="py-6 space-y-6" dir="rtl">
      {/* Top Banner & Return to Storefront */}
      <div className="bg-neutral-900 text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-neutral-800 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-black text-white text-lg">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold">پنل مدیریت عملیات و دفاتر مالی والا</h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
                Production Control
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              مدیریت ماشین حالت سفارشات، دفاتر مالی دوطرفه و بالانس انبارهای فیزیکی
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('home')}
          className="bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          مشاهده نمای فروشگاه
        </button>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setCurrentView(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Body */}
      <div>{children}</div>
    </div>
  );
}
