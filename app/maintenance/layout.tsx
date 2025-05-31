import '@/app/[locale]/globals.css';
import { ClientProviders } from '@/providers/ClientProviders';
import { getMessages } from 'next-intl/server';

export default async function MaintenanceRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages({ locale: 'en' });

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <ClientProviders locale="en" messages={messages}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}