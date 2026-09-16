import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email) return;

    setStatus('loading');

    const { error } = await supabase.
    from('newsletter_subscribers').
    insert({ email });

    if (error) {
      if (error.code === '23505') {
        setMessage('Bu e-posta zaten abone! 🎉');
        setStatus('success');
      } else {
        setMessage('Bir şeyler ters gitti, tekrar dene.');
        setStatus('error');
      }
    } else {
      setMessage('Hoş geldin! Tahin damlası yolda 🥛');
      setStatus('success');
      setEmail('');

      // Confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#E67E22', '#D4A574', '#8FBC8F', '#2D5A3D']
      });
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 4000);
  };

  return (
    <section data-ev-id="ev_1046582fab" id="newsletter" className="py-20 px-4 bg-pine text-cream relative overflow-hidden">
			{/* Background decorations */}
			<div data-ev-id="ev_9945a3439f" className="absolute inset-0 overflow-hidden pointer-events-none">
				<div data-ev-id="ev_4bbf32a6df" className="absolute top-10 left-10 text-6xl opacity-10 rotate-12">🥛</div>
				<div data-ev-id="ev_7af98e193b" className="absolute bottom-10 right-10 text-6xl opacity-10 -rotate-12">🎃</div>
				<div data-ev-id="ev_01e321f8c2" className="absolute top-1/2 right-1/4 text-4xl opacity-10">✨</div>
			</div>

			<motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 100, damping: 12 }}
        className="max-w-xl mx-auto text-center relative z-10">

				<div data-ev-id="ev_381839f62b" className="flex items-center justify-center gap-2 mb-4">
					<Sparkles className="w-6 h-6 text-pumpkin" />
					<span data-ev-id="ev_69a4cd3b22" className="text-pumpkin-light font-medium text-sm uppercase tracking-wider">
						Bülten
					</span>
				</div>

				<h2 data-ev-id="ev_6078d2af57" className="font-display text-3xl md:text-4xl font-bold mb-4">
					Yeni yazılardan haberdar ol
				</h2>
				<p data-ev-id="ev_a1b1e1b09a" className="text-cream/80 mb-8">
					Tahin gibi yayılmayı seven yazılarımız direkt kutuna gelsin.
					Spam yok, sadece güzel şeyler.
				</p>

				<form data-ev-id="ev_185d16c754" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
					<input data-ev-id="ev_0a44179515"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresin"
          required
          className="flex-1 px-5 py-4 rounded-xl bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-pumpkin focus:border-transparent transition-all" />

					<motion.button
            type="submit"
            disabled={status === 'loading'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-pumpkin hover:bg-pumpkin-dark disabled:opacity-50 text-white font-medium rounded-xl transition-colors">

						{status === 'loading' ?
            <div data-ev-id="ev_7bbecabc90" className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :

            <>
								<Send className="w-5 h-5" />
								Abone Ol
							</>
            }
					</motion.button>
				</form>

				{message &&
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-sm ${
          status === 'success' ? 'text-olive-light' : 'text-red-300'}`
          }>

						{message}
					</motion.p>
        }
			</motion.div>
		</section>);

}