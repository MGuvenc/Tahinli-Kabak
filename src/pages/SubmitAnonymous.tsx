import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Ghost, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

export default function SubmitAnonymous() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam protection
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      setMessage('Yolladık, tahinle kabak arasında bir yerde süzülüyor şu an!');
      setStatus('success');
      return;
    }

    if (!supabase) {
      setMessage('Veritabanı bağlantısı kurulamadı.');
      setStatus('error');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setMessage('Başlık ve içerik gerekli.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    const { error } = await supabase.
    from('anonymous_submissions').
    insert({
      title: title.trim(),
      content: content.trim(),
      status: 'pending'
    });

    if (error) {
      setMessage('Bir şeyler ters gitti. Tekrar dene.');
      setStatus('error');
    } else {
      setMessage('Yolladık, tahinle kabak arasında bir yerde süzülüyor şu an! Onaylanince yayınlanacak.');
      setStatus('success');
      setTitle('');
      setContent('');

      // Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#E67E22', '#D4A574', '#8FBC8F', '#2D5A3D']
      });
    }
  };

  return (
    <div data-ev-id="ev_d156e14815" className="min-h-screen py-16 px-4">
			<div data-ev-id="ev_69ab7a3ec8" className="max-w-2xl mx-auto">
				<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">

					<div data-ev-id="ev_7adf41034f" className="flex items-center gap-3 mb-4">
						<Ghost className="w-10 h-10 text-pumpkin" />
						<h1 data-ev-id="ev_386c26b0ef" className="font-display text-4xl md:text-5xl font-bold text-pine">
							Anonim Yazı Gönder
						</h1>
					</div>
					<p data-ev-id="ev_ed74a400cc" className="text-muted-foreground">
						Kimliğin gizli kalacak, sadece yazın konuşacak. Onayladıktan sonra 
						<span data-ev-id="ev_a00793151c" className="text-pumpkin"> "👻 Anonim" </span>
						imzasıyla yayınlanacak.
					</p>
				</motion.div>

				{status === 'success' ?
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-olive/10 rounded-2xl p-8 text-center">

						<span data-ev-id="ev_d7f8ac322b" className="text-6xl mb-4 block">🎉</span>
						<h2 data-ev-id="ev_a0b3c73d95" className="font-display text-2xl font-bold text-pine mb-2">
							Yazın Gönderildi!
						</h2>
						<p data-ev-id="ev_3a913ed914" className="text-muted-foreground mb-6">{message}</p>
						<button data-ev-id="ev_e141133e17"
          onClick={() => setStatus('idle')}
          className="px-6 py-3 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-xl transition-colors">

							Bir Tane Daha Gönder
						</button>
					</motion.div> :

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-8 shadow-card">

						{/* Honeypot field - hidden from users, visible to bots */}
						<input data-ev-id="ev_d074208942"
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute opacity-0 pointer-events-none"
          tabIndex={-1}
          autoComplete="off" />


						<div data-ev-id="ev_9917f049a4" className="flex flex-col gap-6">
							{/* Title */}
							<div data-ev-id="ev_c963ddd33a">
								<label data-ev-id="ev_0e1763dcc4" className="block font-sans font-medium text-foreground mb-2">
									Başlık
								</label>
								<input data-ev-id="ev_4de003cc1c"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin transition-all"
              placeholder="Yazının başlığı"
              required />

							</div>

							{/* Content */}
							<div data-ev-id="ev_2e273abb1e">
								<label data-ev-id="ev_936941350f" className="block font-sans font-medium text-foreground mb-2">
									İçerik
								</label>
								<textarea data-ev-id="ev_5728e1af9a"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none transition-all"
              placeholder="Hikayeni, düşüncelerini, itiraflarını yaz... Kimse kim olduğunu bilmeyecek."
              required />

							</div>

							{/* Error message */}
							{status === 'error' &&
            <div data-ev-id="ev_7d6e154853" className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
									<AlertCircle className="w-4 h-4" />
									{message}
								</div>
            }

							{/* Submit */}
							<motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-pumpkin hover:bg-pumpkin-dark disabled:opacity-50 text-white font-medium rounded-xl transition-colors">

								{status === 'loading' ?
              <>
										<div data-ev-id="ev_41d36906e9" className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Gönderiliyor...
									</> :

              <>
										<Send className="w-5 h-5" />
										Anonim Olarak Gönder
									</>
              }
							</motion.button>
						</div>

						{/* Info */}
						<p data-ev-id="ev_eb70a54baf" className="mt-6 text-xs text-muted-foreground text-center">
							Yazın onaylanmadan yayınlanmaz. İstenmeyen içerikler reddedilir.
							<br data-ev-id="ev_19d14c5000" />
							Kimliğin hiçbir zaman ifşa edilmez.
						</p>
					</motion.form>
        }
			</div>
		</div>);

}