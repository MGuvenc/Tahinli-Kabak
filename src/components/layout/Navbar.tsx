import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const navLinks = [
{ href: '/', label: 'Ana Sayfa' },
{ href: '/hakkimda', label: 'Hakkımda' },
{ href: '/galeri', label: 'Galeri' },
{ href: '/sohbet', label: 'Sohbet' },
{ href: '/anonim-yazi-gonder', label: 'Anonim Yazı Gönder' }];


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header data-ev-id="ev_b367c76006" className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
			<nav data-ev-id="ev_ea8c2cd9ad" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div data-ev-id="ev_aaed283800" className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link data-ev-id="ev_55e50499f8"
          to="/"
          className="font-display text-2xl font-bold text-pine hover:text-pumpkin transition-colors">

						<span data-ev-id="ev_d2142ef4e7" className="text-tahini">tahinli</span>
						<span data-ev-id="ev_8e71f6aad8" className="text-pumpkin">kabak</span>
					</Link>

					{/* Desktop Nav */}
					<div data-ev-id="ev_e9f0909d31" className="hidden md:flex items-center gap-6">
						{navLinks.map((link) =>
            <Link data-ev-id="ev_5169771049"
            key={link.href}
            to={link.href}
            className={`font-sans text-sm font-medium transition-colors hover:text-pumpkin ${
            location.pathname === link.href ? 'text-pumpkin' : 'text-foreground'}`
            }>

								{link.label}
							</Link>
            )}
					</div>

					{/* Actions */}
					<div data-ev-id="ev_4a4392263d" className="flex items-center gap-3">
						<Link data-ev-id="ev_f791a4bcc2"
            to="/ara"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Ara">

							<Search className="w-5 h-5" />
						</Link>
						
						<button data-ev-id="ev_13f085c8ca"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Tema değiştir">

							{theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
						</button>

						{/* Mobile menu button */}
						<button data-ev-id="ev_5e3fa2f192"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Menü">

							{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</button>
					</div>
				</div>

				{/* Mobile Nav */}
				{isOpen &&
        <div data-ev-id="ev_2d7da1fc9b" className="md:hidden py-4 border-t border-border">
						<div data-ev-id="ev_09296e3afb" className="flex flex-col gap-3">
							{navLinks.map((link) =>
            <Link data-ev-id="ev_841c8b6937"
            key={link.href}
            to={link.href}
            onClick={() => setIsOpen(false)}
            className={`font-sans text-base font-medium py-2 px-3 rounded-lg transition-colors hover:bg-muted ${
            location.pathname === link.href ? 'text-pumpkin bg-muted' : 'text-foreground'}`
            }>

									{link.label}
								</Link>
            )}
						</div>
					</div>
        }
			</nav>
		</header>);

}