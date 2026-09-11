import type { Metadata } from 'next';
import { AdminInventory } from '@/components/admin/AdminInventory';

export const metadata: Metadata = {
  title: 'موجودی و انبارداری | والا کامرس',
  description: 'کنترل موجودی فیزیکی، رزرو و اصلاح انبار با ردپای حسابرسی',
};

export default function AdminInventoryPage() {
  return <AdminInventory />;
}
