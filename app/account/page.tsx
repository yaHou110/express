import type { Metadata } from 'next';
import { CustomerAccount } from '@/components/storefront/CustomerAccount';

export const metadata: Metadata = {
  title: 'حساب کاربری | والا کامرس',
  description: 'سفارشات، علاقه‌مندی‌ها و آدرس‌های مشتری',
};

export default function AccountPage() {
  return <CustomerAccount />;
}
