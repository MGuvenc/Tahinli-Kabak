import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section data-ev-id="ev_b98eaaf0f1" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decorations */}
      <div data-ev-id="ev_608ed77c8d" className="absolute inset-0 pointer-events-none">
        <div data-ev-id="ev_6a748f3711" className="absolute top-10 left-10 w-32 h-32 bg-olive/10 rounded-full blur-3xl" />
        <div data-ev-id="ev_a0a609b4ef" className="absolute bottom-10 right-10 w-40 h-40 bg-pumpkin/10 rounded-full blur-3xl" />
        <div data-ev-id="ev_2435ba52b7" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-tahini/5 rounded-full blur-3xl" />
      </div>

      <div data-ev-id="ev_999d63d6e5" className="container mx-auto px-4 relative z-10">
        <motion.div data-ev-id="ev_9b87593112"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center">

          {/* Emoji duo with sparkle */}
          <motion.div data-ev-id="ev_dfcfe230be"
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>

            <motion.span data-ev-id="ev_a5a7e56727"
            className="text-6xl md:text-7xl"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>

              🍭
            </motion.span>
            <motion.div data-ev-id="ev_893bab004b"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}>

              <Sparkles className="w-8 h-8 text-pumpkin" />
            </motion.div>
            <motion.span data-ev-id="ev_9f786db65c"
            className="text-6xl md:text-7xl"
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>

              🎃
            </motion.span>
          </motion.div>

          {/* Title */}
          <motion.h1 data-ev-id="ev_f2732e2017"
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>

            <span data-ev-id="ev_6ad0265188" className="text-tahini-dark">tahinli</span>
            <span data-ev-id="ev_faf41b7b01" className="text-pumpkin">kabak</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p data-ev-id="ev_96b09cf92d"
          className="font-sans text-lg md:text-xl text-muted-foreground max-w-md mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>

            Hayatın tatlı-tuzlu karışımı — düşünceler, hikayeler ve sürprizler.
          </motion.p>

          {/* Fun animated tags */}
          <motion.div data-ev-id="ev_d65ce71794"
          className="flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}>

            {['✍️ yazılar', '🎭 anonim hikayeler', '📸 galeri', '💭 düşünceler'].map((tag, i) =>
            <motion.span data-ev-id="ev_bd75a76a94"
            key={tag}
            className="px-3 py-1.5 bg-card rounded-full text-sm font-medium text-muted-foreground border border-border shadow-soft"
            whileHover={{ scale: 1.05, backgroundColor: 'var(--pumpkin)', color: 'white' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}>

                {tag}
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative hand-drawn line */}
      <motion.svg data-ev-id="ev_c1dd93734f"
      className="absolute bottom-0 left-0 right-0 w-full h-8 text-pumpkin/20"
      viewBox="0 0 1200 30"
      preserveAspectRatio="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}>

        <path data-ev-id="ev_0bfc7bd74d"
        d="M0 20 Q 300 5, 600 15 T 1200 10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round" />

      </motion.svg>
    </section>);

}