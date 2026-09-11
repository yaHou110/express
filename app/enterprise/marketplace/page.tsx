import type { Metadata } from 'next';
import { MarketplacePreview } from '@/components/enterprise/MarketplacePreview';

export const metadata: Metadata = {
  title: 'مارکت‌پلیس چندفروشندگی | والا کامرس',
  description: 'پیش‌نمایش معماری مارکت‌پلیس، تسهیم کارمزد و تسویه تامین‌کنندگان',
};

export default function MarketplacePreviewPage() {
  return <MarketplacePreview />;
}
