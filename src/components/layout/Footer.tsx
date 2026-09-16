import { Link } from 'react-router';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer data-ev-id="ev_c7d41bf81d" className="bg-pine text-cream py-12 mt-auto">
			<div data-ev-id="ev_d4c87f8c37" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div data-ev-id="ev_419de34408" className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Brand */}
					<div data-ev-id="ev_98720f1e48" className="flex flex-col gap-4">
						<Link data-ev-id="ev_d5d130dc5f" to="/" className="font-display text-2xl font-bold">
							<span data-ev-id="ev_5e1a3afe8a" className="text-tahini">tahinli</span>
							<span data-ev-id="ev_512a545814" className="text-pumpkin">kabak</span>
						</Link>
						<p data-ev-id="ev_9fa8498288" className="text-cream/80 text-sm font-sans max-w-xs">
							Bu siteyi tahin ve kabakla besledim 🎃
							<br data-ev-id="ev_4ced042288" />
							Hayatın tatlı-tuzlu karışımı burada.
						</p>
					</div>

					{/* Links */}
					<div data-ev-id="ev_2470a76d87" className="flex flex-col gap-3">
						<h4 data-ev-id="ev_1563b38b70" className="font-display font-semibold text-pumpkin-light">Keşfet</h4>
						<nav data-ev-id="ev_b045e4e87c" className="flex flex-col gap-2">
							<Link data-ev-id="ev_cf5bcee255" to="/" className="text-cream/80 hover:text-pumpkin transition-colors text-sm">Ana Sayfa</Link>
							<Link data-ev-id="ev_74411f57fd" to="/hakkimda" className="text-cream/80 hover:text-pumpkin transition-colors text-sm">Hakkımda</Link>
							<Link data-ev-id="ev_6da57376db" to="/galeri" className="text-cream/80 hover:text-pumpkin transition-colors text-sm">Galeri</Link>
							<Link data-ev-id="ev_02a610ea53" to="/anonim-yazi-gonder" className="text-cream/80 hover:text-pumpkin transition-colors text-sm">Anonim Yazı Gönder</Link>
							<Link data-ev-id="ev_4f70ec82d1" to="/site-haritasi" className="text-cream/80 hover:text-pumpkin transition-colors text-sm">Site Haritası</Link>
						</nav>
					</div>

					{/* Newsletter teaser */}
					<div data-ev-id="ev_b3c11942fe" className="flex flex-col gap-3">
						<h4 data-ev-id="ev_1efaec9951" className="font-display font-semibold text-pumpkin-light">Bülten</h4>
						<p data-ev-id="ev_89e81751c9" className="text-cream/80 text-sm">
							Yeni yazılardan haberdar ol, tahin damlasın kutuna.
						</p>
						<Link data-ev-id="ev_8971f7b28d"
            to="/#newsletter"
            className="inline-flex items-center gap-2 text-pumpkin hover:text-pumpkin-light transition-colors text-sm font-medium">

							Abone ol →
						</Link>
					</div>
				</div>

				{/* Bottom */}
				<div data-ev-id="ev_4341831ed9" className="mt-10 pt-6 border-t border-cream/20 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p data-ev-id="ev_1dfa3de779" className="text-cream/60 text-xs flex items-center gap-1">
						<Heart className="w-3 h-3 text-pumpkin" fill="currentColor" /> ile yapılmıştır.
					</p>
					<p data-ev-id="ev_722df36dfd" className="text-cream/60 text-xs">
						© {new Date().getFullYear()} tahinlikabak. Tüm hakları saklıdır (ya da değildir, kim bilir).
					</p>
				</div>
			</div>
		</footer>);

}