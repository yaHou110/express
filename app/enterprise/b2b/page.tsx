import type { Metadata } from 'next';
import { B2BCommercePreview } from '@/components/enterprise/B2BCommercePreview';

export const metadata: Metadata = {
  title: 'فروش سازمانی و عمده B2B | والا کامرس',
  description: 'پیش‌نمایش خرید عمده، پیش‌فاکتور رسمی و قیمت‌گذاری پله‌ای',
};

export default function B2BPreviewPage() {
  return <B2BCommercePreview />;
}
