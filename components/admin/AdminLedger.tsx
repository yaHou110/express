'use client';

import React, { useState } from 'react';
import { useStore } from '../../services/storeContext';
import { AdminLayout } from './AdminLayout';
import { formatMoney } from '../../domain/money';
import { ReceiptText, ArrowDownLeft, ArrowUpRight, ShieldCheck, Filter } from 'lucide-react';

export function AdminLedger() {
  const { ledgerEntries } = useStore();
  const [accountFilter, setAccountFilter] = useState<string>('ALL');

  const filteredEntries = ledgerEntries.filter((entry) => {
    if (accountFilter !== 'ALL' && entry.accountType !== accountFilter) return false;
    return true;
  });

  return (
    <AdminLayout activeTab="ledger">
      <div className="space-y-6">
        {/* Header & Explanation */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-neutral-700" />
                دفتر کل حسابداری و ردپای مالی تراکنش‌ها (Immutable Financial Ledger)
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                ثبت دوطرفه بدون قابلیت حذف یا ویرایش (Append-Only) جهت تطبیق حساب‌های بانکی و شاپرک
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">فیلتر سرفصل حساب:</span>
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 focus:outline-hidden"
              >
                <option value="ALL">تمام سرفصل‌های حسابداری</option>
                <option value="CUSTOMER_PAYMENT">دریافت از مشتری (CUSTOMER_PAYMENT)</option>
                <option value="SHIPPING_CARRIER">تخصیص کرایه حمل (SHIPPING_CARRIER)</option>
                <option value="REFUND_DEBIT">استرداد وجه (REFUND_DEBIT)</option>
                <option value="PLATFORM_COMMISSION">کارمزد پلتفرم (PLATFORM_COMMISSION)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ledger Entries Table */}
        <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
                <tr>
                  <th className="p-4">نوع سند</th>
                  <th className="p-4">سرفصل حسابداری</th>
                  <th className="p-4">شرح تراکنش</th>
                  <th className="p-4">شناسه رهگیری بانکی</th>
                  <th className="p-4">مبلغ (تومان)</th>
                  <th className="p-4">زمان ثبت سند</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-sans">
                {filteredEntries.map((entry) => {
                  const isCredit = entry.type === 'CREDIT';
                  return (
                    <tr key={entry.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            isCredit
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {isCredit ? (
                            <>
                              <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                              بستانکار (CREDIT)
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3 h-3 text-rose-600" />
                              بدهکار (DEBIT)
                            </>
                          )}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-neutral-800">
                        {entry.accountType}
                      </td>

                      <td className="p-4 text-neutral-700 max-w-sm">
                        {entry.description}
                      </td>

                      <td className="p-4 font-mono text-neutral-500">
                        {entry.transactionRef}
                      </td>

                      <td className="p-4 font-mono font-extrabold text-neutral-950">
                        <span className={isCredit ? 'text-emerald-700' : 'text-neutral-900'}>
                          {isCredit ? '+' : '-'}
                          {formatMoney(entry.amount)}
                        </span>
                      </td>

                      <td className="p-4 text-neutral-400 font-mono text-[11px]">
                        {entry.timestamp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
