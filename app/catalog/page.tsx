import type { Metadata } from 'next';
import { ProductCatalog } from '@/components/storefront/ProductCatalog';

export const metadata: Metadata = {
  title: 'کاتالوگ محصولات | والا کامرس',
  description: 'کاتالوگ جامع محصولات والا با جستجو، فیلتر و مقایسه مشخصات فنی',
};

export default function CatalogPage() {
  return <ProductCatalog />;
}
