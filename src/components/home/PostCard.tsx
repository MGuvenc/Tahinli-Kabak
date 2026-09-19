import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Clock, Eye, MessageCircle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/helpers';

type Post = Tables<'posts'>;
import { formatRelativeTime } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
  index?: number;
  commentCount?: number;
}

export default function PostCard({ post, variant = 'default', index = 0, commentCount }: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth animation
  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Stagger animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
        delay: index * 0.1
      }
    }
  };

  // Random rotation for asymmetric feel
  const randomRotation = (index % 3 - 1) * 1.5;

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformPerspective: 1000,
        rotate: randomRotation
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`
				group relative bg-card rounded-2xl overflow-hidden
				transition-shadow duration-300
				${isHovered ? 'shadow-hover z-10' : 'shadow-card'}
				${variant === 'featured' ? 'md:col-span-2 md:row-span-2' : ''}
				${variant === 'compact' ? 'flex flex-row' : ''}
			`}>

			<Link to={`/yazi/${post.slug}`} className="block">
				{/* Cover Image */}
				{post.cover_image_url &&
        <div data-ev-id="ev_097308d334" className={`relative overflow-hidden ${variant === 'compact' ? 'w-32 h-32' : 'aspect-[16/10]'}`}>
						<motion.img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: 'easeOut' }} />

						{/* Gradient overlay */}
						<div data-ev-id="ev_4e58869a57" className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
        }

				{/* Content */}
				<div data-ev-id="ev_2c7b795d9c" className={`p-5 ${variant === 'compact' ? 'flex-1' : ''}`}>
					{/* Anonymous badge */}
					{post.is_anonymous_submission &&
          <span data-ev-id="ev_c3fdc9f9af" className="inline-block px-2 py-1 text-xs font-medium bg-pumpkin/10 text-pumpkin rounded-full mb-3">
							👻 Anonim
						</span>
          }

					{/* Title */}
					<h3 data-ev-id="ev_3fc7609e02" className={`
						font-display font-bold text-foreground group-hover:text-pumpkin transition-colors
						${variant === 'featured' ? 'text-2xl md:text-3xl' : 'text-lg'}
						${variant === 'compact' ? 'text-base' : ''}
					`}>
						{post.title}
					</h3>

					{/* Excerpt */}
					{post.excerpt && variant !== 'compact' &&
          <p data-ev-id="ev_f57af50510" className="mt-2 text-muted-foreground text-sm line-clamp-2">
							{post.excerpt}
						</p>
          }

					{/* Meta */}
					<div data-ev-id="ev_ba630e87bf" className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
						<span data-ev-id="ev_6904fb6896" className="flex items-center gap-1">
							<Clock className="w-3.5 h-3.5" />
							~{post.reading_time_minutes} dk
						</span>
						<span data-ev-id="ev_d101f6c4f8" className="flex items-center gap-1">
							<Heart className="w-3.5 h-3.5" />
							{post.like_count}
						</span>
            {commentCount !== undefined && (
							<span className="flex items-center gap-1">
								<MessageCircle className="w-3.5 h-3.5" />
								{commentCount}
							</span>
            )}
						<span data-ev-id="ev_455862e420" className="flex items-center gap-1">
							<Eye className="w-3.5 h-3.5" />
							{post.view_count}
						</span>
					</div>

					{/* Date */}
					{post.published_at &&
          <p data-ev-id="ev_1e742521a4" className="mt-2 text-xs text-muted-foreground/70">
							{formatRelativeTime(post.published_at)}
						</p>
          }
				</div>
			</Link>

			{/* Decorative corner */}
			<div data-ev-id="ev_9641e291cf" className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
				<div data-ev-id="ev_4816c32f10" className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pumpkin/10 to-transparent rotate-45 translate-x-16 -translate-y-16" />
			</div>
		</motion.div>);

}