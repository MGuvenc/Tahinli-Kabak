import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div data-ev-id="ev_a3c3378acf" className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-pine text-cream">
			<div data-ev-id="ev_896b6acc10" className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
				<p data-ev-id="ev_91e379559e" className="text-sm text-center sm:text-left">
					🍪 Bu site çerez kullanıyor — ama yenilebilir cinsten değil. 
					Ziyaretçi deneyimini iyileştirmek ve anonim takma adını hatırlamak için kullanıyoruz.
				</p>
				<div data-ev-id="ev_71535269a2" className="flex items-center gap-3">
					<button data-ev-id="ev_fbc81505a5"
          onClick={handleAccept}
          className="px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors text-sm">

						Tamam, anladım
					</button>
					<button data-ev-id="ev_562d4893c9"
          onClick={handleAccept}
          className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
          aria-label="Kapat">

						<X className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>);

}