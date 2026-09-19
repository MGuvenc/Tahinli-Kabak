import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';

type Post = Tables<'posts'>;
type GalleryImage = Tables<'gallery_images'>;

import HeroSection from '@/components/home/HeroSection';
import PostCard from '@/components/home/PostCard';
import SectionTitle from '@/components/home/SectionTitle';
import GalleryPreview from '@/components/home/GalleryPreview';
import NewsletterSection from '@/components/home/NewsletterSection';
import { FileText, Heart, Ghost } from 'lucide-react';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [anonymousPosts, setAnonymousPosts] = useState<Post[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // Fetch latest posts
      const { data: latest } = await supabase.
      from('posts').
      select('*').
      eq('status', 'published').
      order('published_at', { ascending: false }).
      limit(6);

      // Fetch popular posts
      const { data: popular } = await supabase.
      from('posts').
      select('*').
      eq('status', 'published').
      order('like_count', { ascending: false }).
      limit(4);

      // Fetch anonymous posts
      const { data: anonymous } = await supabase.
      from('posts').
      select('*').
      eq('status', 'published').
      eq('is_anonymous_submission', true).
      order('published_at', { ascending: false }).
      limit(3);

      // Fetch gallery images
      const { data: gallery } = await supabase.
      from('gallery_images').
      select('*').
      order('created_at', { ascending: false }).
      limit(4);

      setLatestPosts(latest ?? []);
      setPopularPosts(popular ?? []);
      setAnonymousPosts(anonymous ?? []);
      
      // Yorum sayılarını hesapla
      const allPostIds = [
        ...(latest ?? []).map((p) => p.id),
        ...(popular ?? []).map((p) => p.id),
        ...(anonymous ?? []).map((p) => p.id)
      ];
      const uniquePostIds = [...new Set(allPostIds)];

      if (uniquePostIds.length > 0) {
        const { data: commentsData } = await supabase.
        from('comments').
        select('post_id').
        in('post_id', uniquePostIds);

        const countMap = new Map<string, number>();
        (commentsData ?? []).forEach((c) => {
          countMap.set(c.post_id, (countMap.get(c.post_id) ?? 0) + 1);
        });
        setCommentCounts(countMap);
      }
      setGalleryImages(gallery ?? []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div data-ev-id="ev_a21b4bc990" className="min-h-screen">
			{/* Hero Section with scroll animation */}
			<HeroSection />

			{/* Latest Posts */}
			<section data-ev-id="ev_4417681551" className="py-16 px-4">
				<div data-ev-id="ev_37351734e1" className="max-w-7xl mx-auto">
					<SectionTitle
            icon={<FileText className="w-8 h-8 text-pine" />}
            subtitle="En taze tahinli kabak yazıları burada">

						Son Yazılar
					</SectionTitle>

					{loading ?
          <div data-ev-id="ev_d7f726e63c" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(6)].map((_, i) =>
            <div data-ev-id="ev_cac9ca4c5f" key={i} className="bg-card rounded-2xl h-72 animate-pulse" />
            )}
						</div> :
          latestPosts.length > 0 ?
          <div data-ev-id="ev_3f8e84e1c6" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{latestPosts.map((post, index) =>
            <PostCard
              key={post.id}
              post={post}
              index={index}
              variant={index === 0 ? 'featured' : 'default'}
              commentCount={commentCounts.get(post.id) ?? 0} />

            )}
						</div> :

          <EmptyState
            message="Henüz yazı yok. İlk yazı için sabırsızlanıyoruz!"
            emoji="✍️" />

          }
				</div>
			</section>

			{/* Popular Posts */}
			<section data-ev-id="ev_3c62ab59db" className="py-16 px-4 bg-cream-dark">
				<div data-ev-id="ev_930e670ea1" className="max-w-7xl mx-auto">
					<SectionTitle
            icon={<Heart className="w-8 h-8 text-pumpkin" />}
            subtitle="Okuyucuların en çok sevdiği yazılar">

						En Beğenilenler
					</SectionTitle>

					{loading ?
          <div data-ev-id="ev_8692d13e60" className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[...Array(4)].map((_, i) =>
            <div data-ev-id="ev_46bac6c3ad" key={i} className="bg-card rounded-2xl h-48 animate-pulse" />
            )}
						</div> :
          popularPosts.length > 0 ?
          <div data-ev-id="ev_b2a2e766d2" className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{popularPosts.map((post, index) =>
            <PostCard key={post.id} post={post} index={index}
              commentCount={commentCounts.get(post.id) ?? 0} />
            )}
						</div> :

          <EmptyState
            message="Henüz beğenilen yazı yok. İlk beğeniyi sen koy!"
            emoji="💛" />

          }
				</div>
			</section>

			{/* Anonymous Posts */}
			<section data-ev-id="ev_70d9042373" className="py-16 px-4">
				<div data-ev-id="ev_1a1058e824" className="max-w-7xl mx-auto">
					<SectionTitle
            icon={<Ghost className="w-8 h-8 text-muted-foreground" />}
            subtitle="Kimliği meçhul, hikayesi gerçek">

						Anonim Yazılar
					</SectionTitle>

					{loading ?
          <div data-ev-id="ev_4748511449" className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{[...Array(3)].map((_, i) =>
            <div data-ev-id="ev_b6439324c3" key={i} className="bg-card rounded-2xl h-48 animate-pulse" />
            )}
						</div> :
          anonymousPosts.length > 0 ?
          <div data-ev-id="ev_5e10f033f6" className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{anonymousPosts.map((post, index) =>
            <PostCard key={post.id} post={post} index={index}
              commentCount={commentCounts.get(post.id) ?? 0} />
            )}
						</div> :

          <EmptyState
            message="Henüz kimse laf atmamış. İlk sen ol!"
            emoji="👻"
            actionLink="/anonim-yazi-gonder"
            actionLabel="Anonim Yazı Gönder" />

          }
				</div>
			</section>

			{/* Gallery Preview */}
			<GalleryPreview images={galleryImages} />

			{/* Newsletter */}
			<NewsletterSection />
		</div>);

}

// Empty state component
function EmptyState({
  message,
  emoji,
  actionLink,
  actionLabel





}: {message: string;emoji: string;actionLink?: string;actionLabel?: string;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-12 text-center shadow-soft">

			<span data-ev-id="ev_5c40bcb967" className="text-5xl mb-4 block">{emoji}</span>
			<p data-ev-id="ev_94298d57e1" className="text-muted-foreground mb-4">{message}</p>
			{actionLink && actionLabel &&
      <a data-ev-id="ev_b0d21e2659"
      href={actionLink}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-xl transition-colors">

					{actionLabel}
				</a>
      }
		</motion.div>);

}