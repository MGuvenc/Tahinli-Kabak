import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
}

export default function SectionTitle({ children, subtitle, icon }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, damping: 12 }}
      className="mb-8">

			<div data-ev-id="ev_23c66ace73" className="flex items-center gap-3">
				{icon &&
        <span data-ev-id="ev_42a86adf37" className="text-3xl">{icon}</span>
        }
				<div data-ev-id="ev_6f8b59bf5e" className="relative">
					<h2 data-ev-id="ev_2fef741b40" className="font-display text-3xl md:text-4xl font-bold text-pine">
						{children}
					</h2>
					{/* Hand-drawn underline */}
					<svg data-ev-id="ev_a905510dfa"
          className="absolute -bottom-2 left-0 w-full h-3 text-pumpkin/40"
          viewBox="0 0 100 12"
          preserveAspectRatio="none">

						<path data-ev-id="ev_470ba64c2a"
            d="M2 8 Q 25 2, 50 7 T 98 5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none" />

					</svg>
				</div>
			</div>
			{subtitle &&
      <p data-ev-id="ev_70c19405e0" className="mt-3 text-muted-foreground font-sans max-w-2xl">
					{subtitle}
				</p>
      }
		</motion.div>);

}