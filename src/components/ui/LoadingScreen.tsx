import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div data-ev-id="ev_f9e3509bdb" className="fixed inset-0 z-[100] flex items-center justify-center bg-cream">
			<div data-ev-id="ev_a4667a3083" className="text-center">
				{/* Animated logo */}
				<div data-ev-id="ev_e1a149ec93" className="flex items-center justify-center gap-4 mb-6">
					<motion.span
            animate={{
              rotate: [0, -10, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="text-6xl">

						🥛
					</motion.span>
					<motion.span
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="text-4xl text-pumpkin">

						✨
					</motion.span>
					<motion.span
            animate={{
              rotate: [0, 10, -10, 10, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3
            }}
            className="text-6xl">

						🎃
					</motion.span>
				</div>

				{/* Loading text */}
				<motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-display text-lg text-muted-foreground">

					Tahin çalkalanıyor...
				</motion.p>

				{/* Progress bar */}
				<div data-ev-id="ev_670054a192" className="mt-6 w-48 h-1 bg-border rounded-full overflow-hidden mx-auto">
					<motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-gradient-to-r from-tahini via-pumpkin to-tahini rounded-full" />

				</div>
			</div>
		</div>);

}