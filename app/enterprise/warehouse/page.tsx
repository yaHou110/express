import type { Metadata } from 'next';
import { MultiWarehousePreview } from '@/components/enterprise/MultiWarehousePreview';

export const metadata: Metadata = {
  title: 'مسیریابی چندانباره | والا کامرس',
  description: 'پیش‌نمایش توزیع موجودی و مسیریابی هوشمند بین انبارهای فیزیکی',
};

export default function MultiWarehousePreviewPage() {
  return <MultiWarehousePreview />;
}
