// app/layout.tsx

import './globals.css';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { SupportedLocales } from "@/i18n/routing";
import { ClientProviders } from '@/providers/ClientProviders';
import ConsentBanner from "@/components/Legal/ConsentBanner";
import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: SupportedLocales }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <ClientProviders locale={locale} messages={messages}>
          <ConsentBanner />
          <Header />
          <main className="flex flex-col flex-1">
            {children}
            <GoogleAnalytics />
          </main>
          <Footer />          
        </ClientProviders>
      </body>
    </html>
  );
}
