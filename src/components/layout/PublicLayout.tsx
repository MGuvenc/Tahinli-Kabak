import { Outlet } from 'react-router';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/ui/CookieBanner';
import ScrollToTop from '../ui/Scrolltotop';

export default function PublicLayout() {
  return (
    <div data-ev-id="ev_6668f62915" className="min-h-screen flex flex-col bg-background font-sans">
			<Navbar />
			<main data-ev-id="ev_1aa7b0b84b" className="flex-1">
				<Outlet />
			</main>
			<Footer />
			<CookieBanner />
			<ScrollToTop />
		</div>);

}