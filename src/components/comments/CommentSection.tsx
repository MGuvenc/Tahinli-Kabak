import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useVisitorId } from '@/hooks/useVisitorId';
import { formatRelativeTime } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/helpers';

type Comment = Tables<'comments'>;
import confetti from 'canvas-confetti';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { visitorId, visitorName } = useVisitorId();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      const { data } = await supabase.
      from('comments').
      select('*').
      eq('post_id', postId).
      order('created_at', { ascending: true });

      setComments(data ?? []);
      setLoading(false);
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !newComment.trim() || !visitorId) return;

    setSubmitting(true);

    const commentData = {
      post_id: postId,
      visitor_id: visitorId,
      visitor_name: customName.trim() || visitorName,
      content: newComment.trim()
    };

    const { data, error } = await supabase.
    from('comments').
    insert(commentData).
    select().
    single();

    if (!error && data) {
      setComments((prev) => [...prev, data]);
      setNewComment('');

      // Celebration!
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#E67E22', '#D4A574', '#8FBC8F'],
        scalar: 0.7
      });
    }

    setSubmitting(false);
  };

  return (
    <section data-ev-id="ev_6811e19c8e" className="mt-12 pt-12 border-t border-border">
			<div data-ev-id="ev_8bf3e9576d" className="flex items-center gap-3 mb-8">
				<MessageCircle className="w-6 h-6 text-pine" />
				<h3 data-ev-id="ev_9ea6bb3a63" className="font-display text-2xl font-bold text-pine">
					Yorumlar ({comments.length})
				</h3>
			</div>

			{/* Comment form */}
			<form data-ev-id="ev_6226894c8c" onSubmit={handleSubmit} className="mb-8">
				<div data-ev-id="ev_5de4f08e87" className="flex flex-col gap-4">
					<div data-ev-id="ev_0c141d6b80" className="flex flex-col sm:flex-row gap-4">
						<input data-ev-id="ev_a2a6a42880"
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={`İsim (boş bırakırsan: ${visitorName})`}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pumpkin" />

					</div>
					<div data-ev-id="ev_3ad0dd9702" className="flex gap-3">
						<textarea data-ev-id="ev_a445d401fb"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Düşüncelerini paylaş..."
            rows={3}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none"
            required />

						<motion.button
              type="submit"
              disabled={submitting || !newComment.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="self-end px-6 py-3 bg-pumpkin hover:bg-pumpkin-dark disabled:opacity-50 text-white font-medium rounded-xl transition-colors">

							{submitting ?
              <div data-ev-id="ev_e2ab686842" className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :

              <Send className="w-5 h-5" />
              }
						</motion.button>
					</div>
				</div>
			</form>

			{/* Comments list */}
			{loading ?
      <div data-ev-id="ev_fd48c492a8" className="flex flex-col gap-4">
					{[...Array(3)].map((_, i) =>
        <div data-ev-id="ev_f183d09d3b" key={i} className="bg-card rounded-xl p-4 animate-pulse h-24" />
        )}
				</div> :
      comments.length > 0 ?
      <AnimatePresence>
					<div data-ev-id="ev_ad847c097a" className="flex flex-col gap-4">
						{comments.map((comment, index) =>
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-xl p-5 shadow-soft">

								<div data-ev-id="ev_f592b445b1" className="flex items-start justify-between mb-2">
									<span data-ev-id="ev_c39d5fadde" className="font-display font-semibold text-pine">
										{comment.visitor_name || 'Anonim'}
									</span>
									<span data-ev-id="ev_06aaa59f64" className="text-xs text-muted-foreground">
										{formatRelativeTime(comment.created_at)}
									</span>
								</div>
								<p data-ev-id="ev_68fe66be7a" className="text-foreground whitespace-pre-wrap">{comment.content}</p>
							</motion.div>
          )}
					</div>
				</AnimatePresence> :

      <div data-ev-id="ev_205b212a7a" className="bg-card rounded-xl p-8 text-center">
					<span data-ev-id="ev_16d7f70afa" className="text-4xl mb-4 block">💬</span>
					<p data-ev-id="ev_6719e69b41" className="text-muted-foreground">
						Henüz kimse laf atmamış, ilk sen ol!
					</p>
				</div>
      }
		</section>);

}