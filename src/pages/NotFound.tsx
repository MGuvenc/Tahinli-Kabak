import { Link } from 'react-router';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div data-ev-id="ev_304b3d02b4" className="min-h-screen flex items-center justify-center px-4 bg-cream">
			<div data-ev-id="ev_11fdec624c" className="text-center max-w-md">
				<div data-ev-id="ev_a2bd3be304" className="text-8xl mb-6">🎃</div>
				<h1 data-ev-id="ev_843e4348c9" className="font-display text-4xl md:text-5xl font-bold text-pine mb-4">
					404
				</h1>
				<p data-ev-id="ev_01aeb4a58a" className="font-display text-xl text-pumpkin mb-2">
					Bu sayfa kabak gibi ortadan kayboldu!
				</p>
				<p data-ev-id="ev_c0dbcf6a26" className="text-muted-foreground mb-8">
					Aradığın sayfa tahin gibi eriyip gitmiş olabilir. 
					Ya da hiç var olmadı — kim bilir?
				</p>
				<Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors">

					<Home className="w-5 h-5" />
					Ana Sayfaya Dön
				</Link>
			</div>
		</div>);

}