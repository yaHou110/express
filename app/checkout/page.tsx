import type { Metadata } from 'next';
import { CheckoutWorkflow } from '@/components/storefront/CheckoutWorkflow';

export const metadata: Metadata = {
  title: 'تسویه و پرداخت | والا کامرس',
  description: 'انتخاب آدرس، روش ارسال و پرداخت امن از طریق درگاه شاپرک',
};

export default function CheckoutPage() {
  return <CheckoutWorkflow />;
}
