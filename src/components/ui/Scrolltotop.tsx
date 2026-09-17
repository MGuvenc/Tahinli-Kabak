import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > 400);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<AnimatePresence>
			{visible && (
				<motion.button
					initial={{ opacity: 0, scale: 0.8, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: 10 }}
					onClick={scrollToTop}
					className="fixed bottom-6 right-6 z-40 p-3 bg-pumpkin hover:bg-pumpkin-dark text-white rounded-full shadow-hover transition-colors"
					aria-label="Yukarı çık"
				>
					<ArrowUp className="w-5 h-5" />
				</motion.button>
			)}
		</AnimatePresence>
	);
}