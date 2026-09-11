import type { Metadata } from 'next';
import { CartView } from '@/components/storefront/CartView';

export const metadata: Metadata = {
  title: 'سبد خرید | والا کامرس',
  description: 'بررسی اقلام سبد خرید، اعمال کوپن و ادامه فرآیند پرداخت',
};

export default function CartPage() {
  return <CartView />;
}
