import type { Metadata } from 'next';
import { AdminFeatureGating } from '@/components/admin/AdminFeatureGating';

export const metadata: Metadata = {
  title: 'تنظیمات و Feature Flags | والا کامرس',
  description: 'فعال‌سازی ماژول‌ها و سوئیچ قابلیت‌های پلتفرم',
};

export default function AdminFeaturesPage() {
  return <AdminFeatureGating />;
}
