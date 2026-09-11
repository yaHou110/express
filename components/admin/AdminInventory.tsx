'use client';

import React, { useState } from 'react';
import { useStore } from '../../services/storeContext';
import { AdminLayout } from './AdminLayout';
import { formatMoney } from '../../domain/money';
import { Boxes, Plus, Minus, AlertCircle, Check, Search } from 'lucide-react';

export function AdminInventory() {
  const { products, adjustStock } = useStore();
  const [search, setSearch] = useState('');
  const [adjustReason, setAdjustReason] = useState('شارژ فیزیکی محموله جدید از گمرک');

  return (
    <AdminLayout activeTab="inventory">
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <h2 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-neutral-700" />
              مدیریت فیزیکی انبار و تخصیص موجودی (Warehouse Inventory)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              فرمول تخصیص موجودی: <span className="font-mono text-neutral-800 font-bold">Available = OnHand - Reserved</span> (عدم فروش بیش از موجودی)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="جستجوی نام یا SKU کالا..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 w-56"
            />
          </div>
        </div>

        {/* Reason Selector */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-neutral-700">دلیل تعدیل موجودی انبار:</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              'شارژ فیزیکی محموله جدید از گمرک',
              'انبارگردانی و رفع مغایرت فیزیکی',
              'خروج کالای معیوب یا مرجوعی به تامین‌کننده',
            ].map((reason) => (
              <button
                key={reason}
                onClick={() => setAdjustReason(reason)}
                className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                  adjustReason === reason
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
                <tr>
                  <th className="p-4">کالا و تنوع</th>
                  <th className="p-4">شناسه انبار (SKU)</th>
                  <th className="p-4">قیمت واحد</th>
                  <th className="p-4">موجودی فیزیکی (OnHand)</th>
                  <th className="p-4">رزرو شده (Reserved)</th>
                  <th className="p-4">قابل فروش (Available)</th>
                  <th className="p-4 text-center">عملیات تعدیل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products.flatMap((prod) =>
                  prod.variants
                    .filter((v) => {
                      if (!search) return true;
                      const q = search.toLowerCase();
                      return prod.title.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q);
                    })
                    .map((variant) => {
                      const available = variant.inventory.onHand - variant.inventory.reserved;
                      const isLow = available <= 4 && available > 0;
                      const isOut = available <= 0;

                      return (
                        <tr key={variant.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-neutral-950">{prod.title}</div>
                            <div className="text-[11px] text-neutral-500">
                              مدل: {variant.title} ({prod.brand.name})
                            </div>
                          </td>

                          <td className="p-4 font-mono text-neutral-700">{variant.sku}</td>

                          <td className="p-4 font-extrabold text-neutral-950">
                            {formatMoney(variant.salePrice || variant.basePrice)}
                          </td>

                          <td className="p-4 font-mono font-bold text-neutral-900">
                            {variant.inventory.onHand} عدد
                          </td>

                          <td className="p-4 font-mono text-amber-700">
                            {variant.inventory.reserved} عدد
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-block font-mono font-extrabold px-2.5 py-1 rounded-lg ${
                                isOut
                                  ? 'bg-rose-100 text-rose-800'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {available} عدد
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => adjustStock(prod.id, variant.id, 5, adjustReason)}
                                className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                title="افزایش ۵ عدد به موجودی"
                              >
                                <Plus className="w-3 h-3" />
                                ۵+
                              </button>

                              <button
                                onClick={() => adjustStock(prod.id, variant.id, -1, adjustReason)}
                                disabled={variant.inventory.onHand <= variant.inventory.reserved}
                                className="px-2 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-bold text-xs disabled:opacity-40 cursor-pointer transition-colors"
                                title="کاهش ۱ عدد از موجودی"
                              >
                                <Minus className="w-3 h-3" />
                                ۱-
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
