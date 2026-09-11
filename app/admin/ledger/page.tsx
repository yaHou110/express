import type { Metadata } from 'next';
import { AdminLedger } from '@/components/admin/AdminLedger';

export const metadata: Metadata = {
  title: 'دفتر کل مالی | والا کامرس',
  description: 'اسناد حسابداری دوطرفه و تغییرناپذیر',
};

export default function AdminLedgerPage() {
  return <AdminLedger />;
}
