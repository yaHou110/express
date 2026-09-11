import type { Metadata } from 'next';
import { AdminOrders } from '@/components/admin/AdminOrders';

export const metadata: Metadata = {
  title: 'مدیریت سفارشات | والا کامرس',
  description: 'فیلتر سفارشات و تغییر وضعیت از طریق ماشین حالت سفارش',
};

export default function AdminOrdersPage() {
  return <AdminOrders />;
}
