import { OrderStatus } from './types';

export const ORDER_STATE_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CREATED: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'CANCELLED'],
  PAID: ['CONFIRMED', 'CANCELLED', 'REFUNDED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURN_REQUESTED'],
  DELIVERED: ['RETURN_REQUESTED'],
  CANCELLED: [],
  RETURN_REQUESTED: ['REFUNDED', 'DELIVERED'],
  REFUNDED: [],
};

export interface StateTransitionResult {
  allowed: boolean;
  reason?: string;
}

export function canTransitionOrder(current: OrderStatus, target: OrderStatus): StateTransitionResult {
  if (current === target) {
    return { allowed: false, reason: 'وضعیت فعلی و وضعیت هدف یکسان هستند.' };
  }

  const validNextStates = ORDER_STATE_TRANSITIONS[current] || [];
  if (!validNextStates.includes(target)) {
    return {
      allowed: false,
      reason: `انتقال غیرمجاز وضعیت: تغییر از "${getOrderStatusLabel(current)}" به "${getOrderStatusLabel(target)}" در چرخه عملیات سیستم تعریف نشده است.`,
    };
  }

  return { allowed: true };
}

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'CREATED':
      return 'ثبت سفارش';
    case 'PAYMENT_PENDING':
      return 'در انتظار پرداخت';
    case 'PAID':
      return 'پرداخت موفق';
    case 'CONFIRMED':
      return 'تایید انبارداری';
    case 'PROCESSING':
      return 'در حال پردازش و بسته‌بندی';
    case 'SHIPPED':
      return 'تحویل به ناوگان حمل';
    case 'DELIVERED':
      return 'تحویل نهایی به مشتری';
    case 'CANCELLED':
      return 'لغو شده';
    case 'RETURN_REQUESTED':
      return 'درخواست مرجوعی';
    case 'REFUNDED':
      return 'وجه مسترد شده';
    default:
      return status;
  }
}

export function getOrderStatusColor(status: OrderStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'CREATED':
    case 'PAYMENT_PENDING':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'PAID':
    case 'CONFIRMED':
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
    case 'PROCESSING':
      return { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' };
    case 'SHIPPED':
      return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' };
    case 'DELIVERED':
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
    case 'CANCELLED':
    case 'REFUNDED':
      return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' };
    case 'RETURN_REQUESTED':
      return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' };
    default:
      return { bg: 'bg-neutral-50', text: 'text-neutral-800', border: 'border-neutral-200' };
  }
}
