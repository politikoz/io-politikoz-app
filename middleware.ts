import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  matcher: [
    // Skip maintenance route
    '/((?!maintenance|_next|.*\\..*).*)',
    // Include root
    '/',
  ]
};