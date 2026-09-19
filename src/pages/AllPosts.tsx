import PostListPage from '@/components/posts/PostListPage';

export default function AllPosts() {
	return (
		<PostListPage
			title="Tüm Yazılar"
			subtitle="tahinlikabak'ta yayınlanan bütün yazılar, en yeniden en eskiye"
			emptyMessage="Henüz yazı yok. İlk yazı için sabırsızlanıyoruz!"
			emptyEmoji="✍️"
		/>
	);
}