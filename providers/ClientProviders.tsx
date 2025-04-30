"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { TourProvider } from '@/contexts/TourContext';

const queryClient = new QueryClient();

interface ClientProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export function ClientProviders({ children, locale, messages }: ClientProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider timeZone={'Europe/Vienna'} locale={locale} messages={messages}>
        <TourProvider>
          {children}
        </TourProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}