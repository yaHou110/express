import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/storefront/ProductDetailView';
import { PRODUCTS } from '@/data/catalogData';

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return { title: 'کالای یافت نشد | والا کامرس' };
  }

  return {
    title: `${product.title} | والا کامرس`,
    description: product.subtitle,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  // A shared link to a delisted product should say so rather than show a different item.
  if (!PRODUCTS.some((product) => product.id === productId)) {
    notFound();
  }

  // The store provider and the view both read the selection from the URL.
  return <ProductDetailView />;
}
