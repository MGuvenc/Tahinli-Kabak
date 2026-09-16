import { type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import CustomCursor from '@/components/ui/CustomCursor';

/**
 * ⚠️ App-wide providers. Add new providers here — they'll be available in all routes.
 *
 * If you need to add:
 * - A Theme provider → wrap children
 * - A QueryClientProvider → wrap children
 * - Global state providers → wrap children
 *
 * Keep this file simple and focused on providers only.
 */

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<HelmetProvider>
			<AuthProvider>
				{/* Custom cursor for desktop */}
				<CustomCursor />
				{children}
			</AuthProvider>
		</HelmetProvider>
	);
}
