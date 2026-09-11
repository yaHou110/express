'use client';

import React from 'react';
import { useStore } from '../../services/storeContext';
import { AdminLayout } from './AdminLayout';
import { formatMoney, createMoney } from '../../domain/money';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Receipt,
  Boxes,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function AdminDashboard() {
  const { orders, products, ledgerEntries, setCurrentView } = useStore();

  // Compute Total GMV from PAID/SHIPPED/DELIVERED orders
  const paidOrders = orders.filter((o) => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status));
  const totalGmvAmount = paidOrders.reduce((acc, o) => acc + o.financials.totalPayable.amount, 0);
  const totalGmv = createMoney(totalGmvAmount);

  // Compute inventory status
  const lowStockItems: { productTitle: string; variantTitle: string; sku: string; available: number }[] = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      const avail = v.inventory.onHand - v.inventory.reserved;
      if (avail <= 4) {
        lowStockItems.push({
          productTitle: p.title,
          variantTitle: v.title,
          sku: v.sku,
          available: avail,
        });
      }
    });
  });

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs">
              <span>حجم کل فروش ناخالص (GMV)</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-neutral-950">
              {formatMoney(totalGmv)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              محاسبه دقیق بر اساس دفاتر مالی و شاپرک
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs">
              <span>کل سفارشات ثبت‌شده</span>
              <Package className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-neutral-950">
              {orders.length} سفارش
            </div>
            <div className="text-[11px] text-neutral-500 font-medium">
              {paidOrders.length} سفارش موفق و در گردش
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs">
              <span>هشدارهای کسری انبار</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-neutral-950">
              {lowStockItems.length} ردیف کالا
            </div>
            <div className="text-[11px] text-amber-700 font-medium">
              کمتر از ۵ عدد موجودی قابل تخصیص
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs">
              <span>تراکنش‌های دفتر کل مالی</span>
              <Receipt className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-neutral-950">
              {ledgerEntries.length} سند حسابداری
            </div>
            <div className="text-[11px] text-neutral-500 font-medium">
              ثبت دوطرفه و تغییرناپذیر
            </div>
          </div>
        </div>

        {/* 2-Column: Recent Orders + Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Orders Overview (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-sm font-bold text-neutral-950">
                آخرین سفارشات ثبتی در جریان
              </h2>
              <button
                onClick={() => setCurrentView('admin-orders')}
                className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 cursor-pointer"
              >
                مشاهده همه
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-neutral-100 text-xs">
              {orders.slice(0, 4).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-neutral-900 block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      خریدار: {ord.customerName} ({ord.customerPhone})
                    </span>
                  </div>

                  <div className="text-left">
                    <span className="font-bold text-neutral-950 block">
                      {formatMoney(ord.financials.totalPayable)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-amber-600" />
                کالاهای نیازمند شارژ انبار
              </h2>
              <button
                onClick={() => setCurrentView('admin-inventory')}
                className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 cursor-pointer"
              >
                مدیریت موجودی
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="text-center py-6 text-neutral-400 text-xs">
                موجودی تمام کالاها در سطح مطمئن قرار دارد.
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                {lowStockItems.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 block truncate max-w-xs">
                        {item.productTitle}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {item.variantTitle} | {item.sku}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        item.available <= 0
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.available} عدد
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
