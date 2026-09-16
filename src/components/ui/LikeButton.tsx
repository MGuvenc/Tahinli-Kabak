import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useVisitorId } from '@/hooks/useVisitorId';
import confetti from 'canvas-confetti';

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
}

export default function LikeButton({ postId, initialLikeCount }: LikeButtonProps) {
  const { visitorId } = useVisitorId();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch fresh like count and check if already liked
  useEffect(() => {
    if (!supabase || !visitorId) {
      setIsLoading(false);
      return;
    }

    const fetchLikeData = async () => {
      // Get fresh like count from posts table
      const { data: postData } = await supabase.
      from('posts').
      select('like_count').
      eq('id', postId).
      single();

      if (postData) {
        setLikeCount(postData.like_count ?? 0);
      }

      // Check if user already liked
      const { data: likeData } = await supabase.
      from('likes').
      select('id').
      eq('post_id', postId).
      eq('visitor_id', visitorId).
      single();

      setLiked(!!likeData);
      setIsLoading(false);
    };

    fetchLikeData();
  }, [postId, visitorId]);

  const handleLike = async () => {
    if (!supabase || !visitorId || isLoading) return;

    setIsAnimating(true);

    if (liked) {
      // Unlike - optimistic update
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));

      // Delete from likes table
      const { error: deleteError } = await supabase.
      from('likes').
      delete().
      eq('post_id', postId).
      eq('visitor_id', visitorId);

      if (deleteError) {
        // Revert on error
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        // Update post like_count
        await supabase.
        from('posts').
        update({ like_count: Math.max(0, likeCount - 1) }).
        eq('id', postId);
      }
    } else {
      // Like - optimistic update
      setLiked(true);
      setLikeCount((prev) => prev + 1);

      // Insert into likes table
      const { error: insertError } = await supabase.
      from('likes').
      insert({ post_id: postId, visitor_id: visitorId });

      if (insertError) {
        // Revert on error
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // Update post like_count
        await supabase.
        from('posts').
        update({ like_count: likeCount + 1 }).
        eq('id', postId);

        // Mini confetti burst!
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#E67E22', '#D4A574', '#F39C12'],
          scalar: 0.8
        });
      }
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      whileTap={{ scale: 0.9 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors
        ${liked ?
      'bg-pumpkin/10 text-pumpkin' :
      'bg-muted text-muted-foreground hover:bg-pumpkin/10 hover:text-pumpkin'}
        ${isLoading ? 'opacity-50 cursor-wait' : ''}
      `}>

      <AnimatePresence mode="wait">
        <motion.div
          key={liked ? 'liked' : 'not-liked'}
          initial={{ scale: 0 }}
          animate={{ scale: isAnimating ? [1, 1.3, 1] : 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring' as const, stiffness: 400, damping: 10 }}>

          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
        </motion.div>
      </AnimatePresence>
      <span data-ev-id="ev_4f2db4a760" className="text-sm">{likeCount}</span>
    </motion.button>);

}