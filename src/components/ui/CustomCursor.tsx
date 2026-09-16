import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 28 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const hasFineMouse = window.matchMedia('(pointer: fine)').matches;
    setIsMobile(!hasFineMouse);

    if (!hasFineMouse) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.dataset.cursor === 'pointer')
      {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.dataset.cursor === 'pointer')
      {
        setIsHovering(false);
      }
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mouseleave', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseOut);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile) return null;

  return (
    <>
			{/* Hide default cursor */}
			<style data-ev-id="ev_1d7b7d3e1c">{`
				* { cursor: none !important; }
			`}</style>

			{/* Custom cursor */}
			<motion.div
        style={{
          x: cursorXSpring,
          y: cursorYSpring
        }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference">

				<motion.div
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isVisible ? 1 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative -translate-x-1/2 -translate-y-1/2">

					{/* Tahin drop / pumpkin icon */}
					<div data-ev-id="ev_9472d40665" className={`
						text-2xl transition-transform duration-200
						${isHovering ? 'scale-110' : ''}
					`}>
						{isHovering ? '🎃' : '🫂'}
					</div>
				</motion.div>
			</motion.div>
		</>);

}