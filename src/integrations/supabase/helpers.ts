import type {
	Profile,
	SiteSettings,
	Tag,
	Post,
	PostBlock,
	PostTag,
	Like,
	Comment,
	GalleryPost,
	GalleryImage,
	AnonymousSubmission,
	NewsletterSubscriber,
	PostView,
} from '@/types/database';

/**
 * Tablo adını, database.ts'deki karşılık gelen TypeScript interface'ine eşler.
 * Supabase'in normalde otomatik ürettiği "generated types" dosyasının
 * yerine geçen basit bir eşleme.
 */
interface TableMap {
	profiles: Profile;
	site_settings: SiteSettings;
	tags: Tag;
	posts: Post;
	post_blocks: PostBlock;
	post_tags: PostTag;
	likes: Like;
	comments: Comment;
	gallery_posts: GalleryPost;
	gallery_images: GalleryImage;
	anonymous_submissions: AnonymousSubmission;
	newsletter_subscribers: NewsletterSubscriber;
	post_views: PostView;
}

export type Tables<T extends keyof TableMap> = TableMap[T];