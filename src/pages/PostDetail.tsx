import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useVisitorId } from '@/hooks/useVisitorId';
import { formatDate } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/helpers';

type Post = Tables<'posts'>;
type PostBlock = Tables<'post_blocks'>;
type TagType = Tables<'tags'>;

import LikeButton from '@/components/ui/LikeButton';
import ShareButtons from '@/components/ui/ShareButtons';
import CommentSection from '@/components/comments/CommentSection';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function PostDetail() {
  const { slug } = useParams<{slug: string;}>();
  const { visitorId } = useVisitorId();
  const [post, setPost] = useState<Post | null>(null);
  const [blocks, setBlocks] = useState<PostBlock[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!supabase || !slug) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      // Fetch post
      const { data: postData } = await supabase.
      from('posts').
      select('*').
      eq('slug', slug).
      eq('status', 'published').
      single();

      if (!postData) {
        setLoading(false);
        return;
      }

      setPost(postData);

      // Fetch blocks
      const { data: blocksData } = await supabase.
      from('post_blocks').
      select('*').
      eq('post_id', postData.id).
      order('sort_order', { ascending: true });

      setBlocks(blocksData ?? []);

      // Fetch tags
      const { data: postTags } = await supabase.
      from('post_tags').
      select('tag_id').
      eq('post_id', postData.id);

      if (postTags && postTags.length > 0) {
        const tagIds = postTags.map((pt) => pt.tag_id);
        const { data: tagsData } = await supabase.
        from('tags').
        select('*').
        in('id', tagIds);

        setTags(tagsData ?? []);

        // Fetch related posts
        const { data: relatedData } = await supabase.
        from('posts').
        select('*').
        eq('status', 'published').
        neq('id', postData.id).
        limit(3);

        setRelatedPosts(relatedData ?? []);
      }

      // Record view
      if (visitorId) {
        await supabase.
        from('post_views').
        insert({ post_id: postData.id, visitor_id: visitorId });

        await supabase.
        from('posts').
        update({ view_count: (postData.view_count ?? 0) + 1 }).
        eq('id', postData.id);
      }

      setLoading(false);
    };

    fetchPost();
  }, [slug, visitorId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!post) {
    return (
      <div data-ev-id="ev_4752bcb92b" className="min-h-screen flex items-center justify-center px-4">
				<div data-ev-id="ev_e359b304f7" className="text-center">
					<span data-ev-id="ev_2830832a5c" className="text-6xl mb-4 block">🎃</span>
					<h1 data-ev-id="ev_fbfde2c317" className="font-display text-2xl font-bold text-pine mb-2">Yazı bulunamadı</h1>
					<p data-ev-id="ev_f0242565c9" className="text-muted-foreground mb-4">Bu yazı tahin gibi eriyip gitmiş olabilir.</p>
					<Link to="/" className="text-pumpkin hover:underline">Ana sayfaya dön</Link>
				</div>
			</div>);

  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
			<Helmet>
				<title data-ev-id="ev_4e95f80bd5">{post.seo_title || post.title} | tahinlikabak</title>
				<meta data-ev-id="ev_555fdf31ca" name="description" content={post.seo_description || post.excerpt || ''} />
				<meta data-ev-id="ev_99789b2836" name="keywords" content={post.seo_keywords || ''} />
				<meta data-ev-id="ev_fd83b07eae" property="og:title" content={post.seo_title || post.title} />
				<meta data-ev-id="ev_98f6fdad34" property="og:description" content={post.seo_description || post.excerpt || ''} />
				{post.cover_image_url && <meta data-ev-id="ev_636245f8a1" property="og:image" content={post.cover_image_url} />}
			</Helmet>

			<article data-ev-id="ev_17b0d112b5" className="min-h-screen py-8 px-4">
				<div data-ev-id="ev_2974e756db" className="max-w-3xl mx-auto">
					{/* Back link */}
					<Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-pumpkin transition-colors mb-8">

						<ArrowLeft className="w-4 h-4" />
						Ana sayfaya dön
					</Link>

					{/* Cover image */}
					{post.cover_image_url &&
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">

							<img data-ev-id="ev_0ab5e6350c"
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover" />

						</motion.div>
          }

					{/* Header */}
					<motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8">

						{/* Anonymous badge */}
						{post.is_anonymous_submission &&
            <span data-ev-id="ev_09b1d9858c" className="inline-block px-3 py-1 text-sm font-medium bg-pumpkin/10 text-pumpkin rounded-full mb-4">
								👻 Anonim Yazı
							</span>
            }

						<h1 data-ev-id="ev_873a5fa4c1" className="font-display text-3xl md:text-5xl font-bold text-pine mb-4">
							{post.title}
						</h1>

						{/* Meta */}
						<div data-ev-id="ev_9772d74af0" className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
							{post.published_at &&
              <span data-ev-id="ev_327e514240" className="flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									{formatDate(post.published_at)}
								</span>
              }
							<span data-ev-id="ev_5c0c526dd9" className="flex items-center gap-1">
								<Clock className="w-4 h-4" />
								~{post.reading_time_minutes} dk okuma
							</span>
						</div>

						{/* Tags */}
						{tags.length > 0 &&
            <div data-ev-id="ev_b0bcea53ed" className="flex flex-wrap items-center gap-2 mt-4">
								<Tag className="w-4 h-4 text-muted-foreground" />
								{tags.map((tag) =>
              <Link
                key={tag.id}
                to={`/etiket/${tag.slug}`}
                className="px-3 py-1 text-sm bg-muted hover:bg-pumpkin/10 hover:text-pumpkin rounded-full transition-colors">

										{tag.name}
									</Link>
              )}
							</div>
            }
					</motion.header>

					{/* Content blocks */}
					<motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none">

						{blocks.length > 0 ?
            blocks.map((block) =>
            <ContentBlock key={block.id} block={block} />
            ) :
            post.excerpt ?
            <p data-ev-id="ev_773d76d6e3" className="text-foreground whitespace-pre-wrap">{post.excerpt}</p> :

            <p data-ev-id="ev_92f90f7a9b" className="text-muted-foreground italic">Bu yazının içeriği henüz eklenmemiş.</p>
            }
					</motion.div>

					{/* Actions */}
					<div data-ev-id="ev_cd5fe28bfa" className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
						<LikeButton postId={post.id} initialLikeCount={post.like_count} />
						<ShareButtons url={pageUrl} title={post.title} />
					</div>

					{/* Related posts */}
					{relatedPosts.length > 0 &&
          <section data-ev-id="ev_421eea7c7f" className="mt-12 pt-12 border-t border-border">
							<h3 data-ev-id="ev_2bb2eb7658" className="font-display text-2xl font-bold text-pine mb-6">
								Bunlar da ilginizi çekebilir
							</h3>
							<div data-ev-id="ev_7716850362" className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{relatedPosts.map((relatedPost) =>
              <Link
                key={relatedPost.id}
                to={`/yazi/${relatedPost.slug}`}
                className="bg-card rounded-xl p-4 hover:shadow-card transition-shadow">

										<h4 data-ev-id="ev_085862b285" className="font-display font-semibold text-foreground hover:text-pumpkin transition-colors line-clamp-2">
											{relatedPost.title}
										</h4>
										<p data-ev-id="ev_bbd547a0fd" className="text-sm text-muted-foreground mt-1">
											~{relatedPost.reading_time_minutes} dk
										</p>
									</Link>
              )}
							</div>
						</section>
          }

					{/* Comments */}
					<CommentSection postId={post.id} />
				</div>
			</article>
		</>);

}

// Content block renderer
function ContentBlock({ block }: {block: PostBlock;}) {
  switch (block.block_type) {
    case 'text':
      return (
        <div data-ev-id="ev_fc8969c756"
        className="mb-6 text-foreground"
        dangerouslySetInnerHTML={{ __html: block.content || '' }} />);


    case 'image':
      return (
        <figure data-ev-id="ev_5df2ba732d" className={`mb-6 ${getLayoutClass(block.layout)}`}>
					<img data-ev-id="ev_d72a7c0a5d"
          src={block.image_url || ''}
          alt={block.image_alt || ''}
          className="rounded-xl w-full"
          loading="lazy" />

					{block.image_alt &&
          <figcaption data-ev-id="ev_c3e61c424f" className="text-sm text-muted-foreground text-center mt-2">
							{block.image_alt}
						</figcaption>
          }
				</figure>);

    case 'quote':
      return (
        <blockquote data-ev-id="ev_f4b37157e6" className="mb-6 pl-6 border-l-4 border-pumpkin italic text-muted-foreground">
					{block.content}
				</blockquote>);

    default:
      return null;
  }
}

function getLayoutClass(layout: string | null): string {
  switch (layout) {
    case 'image-left':
      return 'float-left mr-6 w-1/2';
    case 'image-right':
      return 'float-right ml-6 w-1/2';
    default:
      return '';
  }
}