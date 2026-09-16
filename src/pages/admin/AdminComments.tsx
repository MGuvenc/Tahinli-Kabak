import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, MessageSquare, ExternalLink, User } from 'lucide-react';
import { Link } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import { formatDate, markAsViewed } from '@/lib/utils';

type Comment = Tables<'comments'> & {
  posts?: {title: string;slug: string;} | null;
};

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
    markAsViewed('comments');
  }, []);

  const fetchComments = async () => {
    if (!supabase) return;

    const { data } = await supabase.
    from('comments').
    select('*, posts(title, slug)').
    order('created_at', { ascending: false });

    setComments(data ?? []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Bu yorumu silmek istediğinden emin misin?')) return;

    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) {
      setComments(comments.filter((c) => c.id !== id));
    }
  };

  return (
    <div data-ev-id="ev_37fc45c743">
      <div data-ev-id="ev_5abe08f0e7" className="flex items-center justify-between mb-8">
        <h1 data-ev-id="ev_8b2b7fd1d7" className="font-display text-3xl font-bold text-pine">Yorumlar</h1>
        <span data-ev-id="ev_1118758e2a" className="text-muted-foreground">
          {comments.length} yorum
        </span>
      </div>

      {loading ?
      <div data-ev-id="ev_238a139be9" className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) =>
        <div data-ev-id="ev_ae524714db" key={i} className="bg-card rounded-xl p-4 animate-pulse h-24" />
        )}
        </div> :
      comments.length > 0 ?
      <div data-ev-id="ev_695038e0fe" className="flex flex-col gap-4">
          {comments.map((comment, index) =>
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="bg-card rounded-xl p-4 shadow-soft">

              <div data-ev-id="ev_691472c470" className="flex items-start justify-between gap-4">
                <div data-ev-id="ev_dfb4986834" className="flex-1 min-w-0">
                  <div data-ev-id="ev_8cc42bc09c" className="flex items-center gap-2 mb-2">
                    <span data-ev-id="ev_04c2a400c0" className="flex items-center gap-1 text-sm font-medium text-foreground">
                      <User className="w-4 h-4" />
                      {comment.visitor_name}
                    </span>
                    {comment.posts &&
                <Link
                  to={`/yazi/${comment.posts.slug}`}
                  className="flex items-center gap-1 text-sm text-pumpkin hover:underline">

                        <MessageSquare className="w-3 h-3" />
                        {comment.posts.title}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                }
                  </div>
                  <p data-ev-id="ev_1d34f7efe7" className="text-foreground mb-2">{comment.content}</p>
                  <span data-ev-id="ev_debaffe51a" className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <button data-ev-id="ev_4bd9e8060c"
            onClick={() => handleDelete(comment.id)}
            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            title="Sil">

                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
        )}
        </div> :

      <div data-ev-id="ev_77a635ef57" className="bg-card rounded-xl p-12 text-center">
          <span data-ev-id="ev_5fc577641a" className="text-5xl mb-4 block">💬</span>
          <p data-ev-id="ev_18d9cfe919" className="text-muted-foreground">
            Henüz yorum yok. Yazılar yayınlandığında yorumlar burada görünecek.
          </p>
        </div>
      }
    </div>);

}