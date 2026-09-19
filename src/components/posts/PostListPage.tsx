import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import PostCard from '@/components/home/PostCard';

type Post = Tables<'posts'>;

const PAGE_SIZE = 12;

interface PostListPageProps {
	title: string;
	subtitle: string;
	anonymousOnly?: boolean;
	emptyMessage: string;
	emptyEmoji: string;
}

export default function PostListPage({ title, subtitle, anonymousOnly = false, emptyMessage, emptyEmoji }: PostListPageProps) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [commentCounts, setCommentCounts] = useState<Map<string, number>>(new Map());
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(0);

	const sentinelRef = useRef<HTMLDivElement>(null);

	const fetchCommentCounts = async (postIds: string[]) => {
		if (!supabase || postIds.length === 0) return;

		const { data } = await supabase.from('comments').select('post_id').in('post_id', postIds);

		setCommentCounts((prev) => {
			const next = new Map(prev);
			(data ?? []).forEach((c) => {
				next.set(c.post_id, (next.get(c.post_id) ?? 0) + 1);
			});
			return next;
		});
	};

	const fetchPage = useCallback(
		async (pageIndex: number) => {
			if (!supabase) return;

			const from = pageIndex * PAGE_SIZE;
			const to = from + PAGE_SIZE - 1;

			let query = supabase
				.from('posts')
				.select('*')
				.eq('status', 'published')
				.order('published_at', { ascending: false })
				.range(from, to);

			if (anonymousOnly) {
				query = query.eq('is_anonymous_submission', true);
			}

			const { data } = await query;
			const newPosts = data ?? [];

			setPosts((prev) => (pageIndex === 0 ? newPosts : [...prev, ...newPosts]));
			setHasMore(newPosts.length === PAGE_SIZE);
			fetchCommentCounts(newPosts.map((p) => p.id));
		},
		[anonymousOnly]
	);

	// İlk yükleme
	useEffect(() => {
		setLoading(true);
		setPosts([]);
		setPage(0);
		setHasMore(true);

		fetchPage(0).then(() => setLoading(false));
	}, [fetchPage]);

	// Aşağı kaydırınca otomatik yükle
	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
					setLoadingMore(true);
					const nextPage = page + 1;
					fetchPage(nextPage).then(() => {
						setPage(nextPage);
						setLoadingMore(false);
					});
				}
			},
			{ rootMargin: '400px' }
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasMore, loadingMore, loading, page, fetchPage]);

	return (
		<div className="min-h-screen py-12 px-4">
			<div className="max-w-3xl mx-auto">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-pumpkin transition-colors mb-6"
				>
					<ArrowLeft className="w-4 h-4" />
					Ana Sayfaya Dön
				</Link>

				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
					<h1 className="font-display text-3xl md:text-4xl font-bold text-pine mb-2">{title}</h1>
					<p className="text-muted-foreground">{subtitle}</p>
				</motion.div>

				{loading ? (
					<div className="flex flex-col gap-6">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="bg-card rounded-2xl h-40 animate-pulse" />
						))}
					</div>
				) : posts.length === 0 ? (
					<div className="bg-card rounded-2xl p-12 text-center shadow-soft">
						<span className="text-5xl mb-4 block">{emptyEmoji}</span>
						<p className="text-muted-foreground">{emptyMessage}</p>
					</div>
				) : (
					<div className="flex flex-col gap-6">
						{posts.map((post, index) => (
							<PostCard
								key={post.id}
								post={post}
								index={index % PAGE_SIZE}
								commentCount={commentCounts.get(post.id) ?? 0}
							/>
						))}
					</div>
				)}

				{/* Sonsuz kaydırma tetikleyicisi */}
				<div ref={sentinelRef} className="h-4" />

				{loadingMore && (
					<div className="flex justify-center py-8">
						<div className="animate-spin w-8 h-8 border-4 border-pumpkin border-t-transparent rounded-full" />
					</div>
				)}

				{!hasMore && posts.length > 0 && (
					<p className="text-center text-sm text-muted-foreground/70 py-8">
						Tüm yazılar yüklendi 🎉
					</p>
				)}
			</div>
		</div>
	);
}