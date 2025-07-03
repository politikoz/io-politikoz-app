'use client';

import { useEffect } from 'react';
import { monitoring } from '@/app/lib/monitoring';

export default function MonitoringInitializer() {
  useEffect(() => {
    monitoring.initializeWebVitals();
    monitoring.trackPageLoad();
  }, []);

  return null;
}
