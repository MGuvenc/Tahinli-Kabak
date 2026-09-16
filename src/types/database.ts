/**
 * Database types for tahinlikabak blog
 * These mirror the Supabase schema
 */

export interface Profile {
	id: string;
	email: string | null;
	full_name: string | null;
	avatar_url: string | null;
	role: 'admin' | 'editor';
	created_at: string;
	updated_at: string;
}

export interface SiteSettings {
	id: string;
	site_title: string;
	logo_url: string | null;
	about_content: string | null;
	about_image_url: string | null;
	footer_text: string | null;
	created_at: string;
	updated_at: string;
}

export interface Tag {
	id: string;
	name: string;
	slug: string;
	created_at: string;
}

export interface Post {
	id: string;
	author_id: string | null;
	title: string;
	slug: string;
	excerpt: string | null;
	cover_image_url: string | null;
	status: 'draft' | 'published';
	is_anonymous_submission: boolean;
	reading_time_minutes: number;
	view_count: number;
	like_count: number;
	seo_title: string | null;
	seo_description: string | null;
	seo_keywords: string | null;
	published_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface PostBlock {
	id: string;
	post_id: string;
	block_type: 'text' | 'image' | 'gallery' | 'quote';
	content: string | null;
	image_url: string | null;
	image_alt: string | null;
	layout: 'image-left' | 'image-right' | 'image-top' | 'image-bottom' | 'full' | 'zigzag' | 'gallery-grid';
	sort_order: number;
	created_at: string;
}

export interface PostTag {
	id: string;
	post_id: string;
	tag_id: string;
}

export interface Like {
	id: string;
	post_id: string;
	visitor_id: string;
	created_at: string;
}

export interface Comment {
	id: string;
	post_id: string;
	visitor_id: string;
	visitor_name: string | null;
	content: string;
	created_at: string;
}

export interface GalleryPost {
	id: string;
	title: string | null;
	description: string | null;
	created_at: string;
	updated_at: string;
}

export interface GalleryImage {
	id: string;
	gallery_post_id: string;
	image_url: string;
	alt_text: string | null;
	sort_order: number;
	created_at: string;
}

export interface AnonymousSubmission {
	id: string;
	title: string;
	content: string;
	cover_image_url: string | null;
	status: 'pending' | 'approved' | 'rejected';
	honeypot: string | null;
	created_at: string;
	reviewed_at: string | null;
	reviewed_by: string | null;
}

export interface NewsletterSubscriber {
	id: string;
	email: string;
	subscribed_at: string;
	unsubscribed_at: string | null;
}

export interface PostView {
	id: string;
	post_id: string;
	visitor_id: string | null;
	viewed_at: string;
}
