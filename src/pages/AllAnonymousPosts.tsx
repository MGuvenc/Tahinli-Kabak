import PostListPage from '@/components/posts/PostListPage';

export default function AllAnonymousPosts() {
	return (
		<PostListPage
			title="Anonim Yazılar"
			subtitle="Kimliği meçhul, hikayesi gerçek — tüm anonim gönderiler"
			anonymousOnly
			emptyMessage="Henüz kimse laf atmamış. İlk sen ol!"
			emptyEmoji="👻"
		/>
	);
}