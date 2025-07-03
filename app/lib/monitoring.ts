import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

class FrontendMonitoring {
    private async sendMetrics(name: string, value: number, path?: string) {
        try {
            await fetch('http://localhost:3001/metrics/frontend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    value,
                    path: path || (typeof window !== 'undefined' ? window.location.pathname : '/') 
                })
            });
        } catch (error) {
            console.error('Failed to send metrics:', error);
        }
    }

    public initializeWebVitals() {
        if (typeof window === 'undefined') return;
        
        onCLS(metric => this.sendMetrics('CLS', metric.value), { reportAllChanges: true });
        onLCP(metric => this.sendMetrics('LCP', metric.value), { reportAllChanges: true });
        onFCP(metric => this.sendMetrics('FCP', metric.value));
        onTTFB(metric => this.sendMetrics('TTFB', metric.value));
    }

    public trackPageLoad() {
        if (typeof window === 'undefined') return;

        const startTime = performance.now();
        
        // Use window load event for more accurate timing
        window.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            this.sendMetrics('PageLoad', loadTime);
        });
    }

    public trackRouteChange(path: string) {
        const timestamp = performance.now();
        this.sendMetrics('RouteChange', timestamp, path);
    }

    public trackError(error: Error, componentName: string) {
        this.sendMetrics('Error', 1, componentName);
        console.error(`Error in ${componentName}:`, error);
    }
}

export const monitoring = new FrontendMonitoring();