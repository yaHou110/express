import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { StoreProvider } from '../services/storeContext';
import { AppShell } from '../components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Vala Commerce',
  description: 'پلتفرم پیشرفته و یکپارچه تجارت الکترونیک',
  openGraph: {
    title: 'Vala Commerce',
    description: 'پلتفرم پیشرفته و یکپارچه تجارت الکترونیک',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vala Commerce',
    description: 'پلتفرم پیشرفته و یکپارچه تجارت الکترونیک',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl">
      <body suppressHydrationWarning className="font-sans antialiased bg-neutral-100/60">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
