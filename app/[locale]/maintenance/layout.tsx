import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SupportedLocales } from "@/i18n/routing";
import { ClientProviders } from '@/providers/ClientProviders';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function MaintenanceLayout({
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
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}