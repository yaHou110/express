import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'داشبورد عملیات | والا کامرس',
  description: 'شاخص‌های فروش، سفارشات، موجودی و دفتر کل مالی',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
