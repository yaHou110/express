'use client';

import React, { useState } from 'react';
import { useStore } from '../../services/storeContext';
import { AdminLayout } from './AdminLayout';
import { formatMoney } from '../../domain/money';
import { OrderStatus, Order } from '../../domain/types';
import { canTransitionOrder } from '../../domain/stateMachine';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  XCircle,
  Search,
  Filter,
} from 'lucide-react';

const ALL_STATUSES: OrderStatus[] = [
  'CREATED',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export function AdminOrders() {
  const { orders, transitionOrderStatus } = useStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [adminNote, setAdminNote] = useState<string>('');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    return true;
  });

  const handleTransition = (targetStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const res = transitionOrderStatus(selectedOrder.id, targetStatus, adminNote);
    if (res.success) {
      setAdminNote('');
    }
  };

  return (
    <AdminLayout activeTab="orders">
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500">فیلتر وضعیت:</span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                همه ({orders.length})
              </button>
              {ALL_STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                    statusFilter === st
                      ? 'bg-neutral-950 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column: Order List (5 cols) + Order Inspector & State Machine Controller (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Orders Master List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredOrders.map((ord) => {
              const isSelected = ord.id === selectedOrder?.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`p-4 rounded-2xl border text-right cursor-pointer transition-all ${
                    isSelected
                      ? 'border-neutral-950 bg-neutral-50 ring-2 ring-neutral-950/10'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs text-neutral-950">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-900 text-white">
                      {ord.status}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500 mb-2">
                    <div>مشتری: {ord.customerName} ({ord.customerPhone})</div>
                    <div>تاریخ: {ord.createdAt}</div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-neutral-100">
                    <span className="text-neutral-400">{ord.items.length} قلم کالا</span>
                    <span className="font-extrabold text-neutral-950">
                      {formatMoney(ord.financials.totalPayable)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* State Machine Transition Console */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div>
                    <span className="text-xs text-neutral-400">سفارش انتخابی:</span>
                    <h3 className="text-lg font-black text-neutral-950 font-mono">
                      {selectedOrder.orderNumber}
                    </h3>
                  </div>

                  <div className="text-left">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                      وضعیت فعلی: {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* State Machine Actions Box */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        عملیات ماشین حالت سفارش (State Machine Controller)
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        فقط گذارهای مجاز طبق قوانین دامنه فعال می‌باشند (کنترل اعتبارسنجی خودکار)
                      </p>
                    </div>
                  </div>

                  {/* Transition Action Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {ALL_STATUSES.map((target) => {
                      const check = canTransitionOrder(selectedOrder.status, target);
                      const isCurrent = selectedOrder.status === target;

                      return (
                        <button
                          key={target}
                          onClick={() => handleTransition(target)}
                          disabled={!check.allowed || isCurrent}
                          className={`p-2.5 rounded-xl font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            isCurrent
                              ? 'bg-neutral-900 text-white cursor-default'
                              : check.allowed
                              ? 'bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 shadow-2xs active:scale-95'
                              : 'bg-neutral-100/70 text-neutral-400 border border-neutral-200 cursor-not-allowed opacity-50'
                          }`}
                          title={check.reason || `تغییر وضعیت به ${target}`}
                        >
                          <span>{target}</span>
                          <span className="text-[9px] font-normal">
                            {isCurrent ? 'وضعیت فعلی' : check.allowed ? 'گذار مجاز' : 'غیرمجاز'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Admin Audit Note */}
                  <div className="pt-2">
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      یادداشت واحد عملیات (جهت درج در تاریخچه تغییر وضعیت):
                    </label>
                    <input
                      type="text"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="مثال: بسته‌بندی تکمیل و به پیک اکسپرس تحویل شد..."
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* Audit Trail History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-800">
                    تاریخچه ردپای ممیزی سفارش (Audit Trail)
                  </h4>
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs">
                    {selectedOrder.statusHistory.map((sh, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-neutral-900" />
                          <span className="font-bold text-neutral-900">{sh.status}</span>
                          <span className="text-neutral-500 text-[11px]">— {sh.note}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400 font-mono shrink-0">
                          {sh.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Details */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs space-y-2 text-neutral-700">
                  <div className="flex justify-between">
                    <span>کد رهگیری تراکنش شاپرک:</span>
                    <span className="font-mono font-bold text-neutral-950">
                      {selectedOrder.paymentInfo?.transactionTraceNumber || 'در انتظار پرداخت'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>کلید عدم تکرار (Idempotency Key):</span>
                    <span className="font-mono text-neutral-600">
                      {selectedOrder.paymentInfo?.idempotencyKey || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-neutral-200 font-bold text-neutral-950">
                    <span>مبلغ کل فاکتور:</span>
                    <span>{formatMoney(selectedOrder.financials.totalPayable)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 text-xs">
                یک سفارش را انتخاب کنید.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
