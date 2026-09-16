import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import PostCard from '@/components/home/PostCard';
import LoadingScreen from '@/components/ui/LoadingScreen';

type Post = Tables<'posts'>;
type TagType = Tables<'tags'>;

export default function TagPosts() {
  const { slug } = useParams<{slug: string;}>();
  const [tag, setTag] = useState<TagType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !slug) {
      setLoading(false);
      return;
    }

    const fetchTagPosts = async () => {
      // Fetch tag
      const { data: tagData } = await supabase.
      from('tags').
      select('*').
      eq('slug', slug).
      single();

      if (!tagData) {
        setLoading(false);
        return;
      }

      setTag(tagData);

      // Fetch post IDs with this tag
      const { data: postTags } = await supabase.
      from('post_tags').
      select('post_id').
      eq('tag_id', tagData.id);

      if (!postTags || postTags.length === 0) {
        setLoading(false);
        return;
      }

      const postIds = postTags.map((pt) => pt.post_id);

      // Fetch posts
      const { data: postsData } = await supabase.
      from('posts').
      select('*').
      eq('status', 'published').
      in('id', postIds).
      order('published_at', { ascending: false });

      setPosts(postsData ?? []);
      setLoading(false);
    };

    fetchTagPosts();
  }, [slug]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!tag) {
    return (
      <div data-ev-id="ev_d425b1458d" className="min-h-screen flex items-center justify-center px-4">
				<div data-ev-id="ev_d4fd96dbe3" className="text-center">
					<span data-ev-id="ev_ecdf7c86ee" className="text-6xl mb-4 block">🎃</span>
					<h1 data-ev-id="ev_833d37906e" className="font-display text-2xl font-bold text-pine mb-2">Etiket bulunamadı</h1>
					<p data-ev-id="ev_5db39f5fec" className="text-muted-foreground mb-4">Bu etiket tahin gibi eriyip gitmiş olabilir.</p>
					<Link to="/" className="text-pumpkin hover:underline">Ana sayfaya dön</Link>
				</div>
			</div>);

  }

  return (
    <div data-ev-id="ev_0ed5df1613" className="min-h-screen py-16 px-4">
			<div data-ev-id="ev_e27bee3e75" className="max-w-7xl mx-auto">
				{/* Back link */}
				<Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-pumpkin transition-colors mb-8">

					<ArrowLeft className="w-4 h-4" />
					Ana sayfaya dön
				</Link>

				<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12">

					<div data-ev-id="ev_d844a58f32" className="flex items-center gap-3 mb-2">
						<Tag className="w-8 h-8 text-pumpkin" />
						<h1 data-ev-id="ev_af9a4ecc0c" className="font-display text-4xl md:text-5xl font-bold text-pine">
							{tag.name}
						</h1>
					</div>
					<p data-ev-id="ev_4682834e06" className="text-muted-foreground">
						Bu etikete ait {posts.length} yazı bulundu.
					</p>
				</motion.div>

				{posts.length > 0 ?
        <div data-ev-id="ev_36a293ed37" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{posts.map((post, index) =>
          <PostCard key={post.id} post={post} index={index} />
          )}
					</div> :

        <div data-ev-id="ev_c263aa5fc4" className="bg-card rounded-2xl p-12 text-center">
						<span data-ev-id="ev_03538d9c22" className="text-5xl mb-4 block">📝</span>
						<p data-ev-id="ev_3095969d5f" className="text-muted-foreground">
							Bu etikete ait yayınlanmış yazı yok.
						</p>
					</div>
        }
			</div>
		</div>);

}