import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, X, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useVisitorId } from '@/hooks/useVisitorId';

const CHAT_USERNAME_KEY = 'tahinlikabak_chat_username';
const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 24;
const SEND_COOLDOWN_MS = 3000;
const MAX_IMAGE_SIZE_MB = 25;
const PAGE_SIZE = 100;

interface ChatMessage {
	id: string;
	visitor_id: string;
	username: string;
	content: string | null;
	image_url: string | null;
	created_at: string;
}

export default function Chat() {
	const { visitorId } = useVisitorId();

	const [username, setUsername] = useState<string>('');
	const [usernameInput, setUsernameInput] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingOlder, setLoadingOlder] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [text, setText] = useState('');
	const [sending, setSending] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [pendingImageUrl, setPendingImageUrl] = useState('');
	const [error, setError] = useState('');
	const [lastSentAt, setLastSentAt] = useState(0);
	// Honeypot - botlar bu alanı doldurur, insanlar görmez
	const [honeypot, setHoneypot] = useState('');

	const containerRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const lastMessageIdRef = useRef<string | null>(null);
	const didInitialScrollRef = useRef(false);

	useEffect(() => {
		const saved = localStorage.getItem(CHAT_USERNAME_KEY);
		if (saved) setUsername(saved);
	}, []);

	// İlk 100 mesajı yükle (en yeniden en eskiye çekip, ekranda eskiden yeniye sırala)
	useEffect(() => {
		if (!supabase) return;

		const fetchInitialMessages = async () => {
			const { data } = await supabase
				.from('chat_messages')
				.select('*')
				.order('created_at', { ascending: false })
				.limit(PAGE_SIZE);

			const ordered = (data ?? []).slice().reverse();
			setMessages(ordered);
			setHasMore((data ?? []).length === PAGE_SIZE);
			setLoading(false);
		};

		fetchInitialMessages();

		const channel = supabase
			.channel('public-chat')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'chat_messages' },
				(payload) => {
					setMessages((prev) => [...prev, payload.new as ChatMessage]);
				}
			)
			.on(
				'postgres_changes',
				{ event: 'DELETE', schema: 'public', table: 'chat_messages' },
				(payload) => {
					setMessages((prev) => prev.filter((m) => m.id !== (payload.old as ChatMessage).id));
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	// İlk yükleme bittiğinde SADECE mesaj kutusunun içini en alta kaydır
	// (window/sayfa scroll'una hiç dokunmaz, footer'a atlama sorununu çözer)
	useEffect(() => {
		if (!loading && !didInitialScrollRef.current && containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
			didInitialScrollRef.current = true;
			if (messages.length > 0) {
				lastMessageIdRef.current = messages[messages.length - 1].id;
			}
		}
	}, [loading, messages]);

	// Yeni mesaj sona eklendiğinde (realtime), sadece kutunun içini yumuşakça en alta kaydır
	useEffect(() => {
		if (!didInitialScrollRef.current || messages.length === 0) return;

		const currentLastId = messages[messages.length - 1].id;
		if (lastMessageIdRef.current !== currentLastId) {
			const container = containerRef.current;
			if (container) {
				const nearBottom =
					container.scrollHeight - container.scrollTop - container.clientHeight < 150;
				if (nearBottom) {
					container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
				}
			}
			lastMessageIdRef.current = currentLastId;
		}
	}, [messages]);

	// Yukarı kaydırınca eski mesajları yükle, scroll konumunu koru
	const loadOlderMessages = async () => {
		if (!supabase || loadingOlder || !hasMore || messages.length === 0) return;

		setLoadingOlder(true);
		const oldest = messages[0];
		const container = containerRef.current;
		const prevScrollHeight = container?.scrollHeight ?? 0;

		const { data } = await supabase
			.from('chat_messages')
			.select('*')
			.lt('created_at', oldest.created_at)
			.order('created_at', { ascending: false })
			.limit(PAGE_SIZE);

		const older = (data ?? []).slice().reverse();

		setMessages((prev) => [...older, ...prev]);
		setHasMore(older.length === PAGE_SIZE);

		// Yeni mesajlar eklenince kullanıcı olduğu yerde kalsın (yukarı fırlamasın)
		requestAnimationFrame(() => {
			if (container) {
				const newScrollHeight = container.scrollHeight;
				container.scrollTop = newScrollHeight - prevScrollHeight;
			}
		});

		setLoadingOlder(false);
	};

	const handleScroll = () => {
		const container = containerRef.current;
		if (!container) return;
		if (container.scrollTop < 60) {
			loadOlderMessages();
		}
	};

	const handleSetUsername = () => {
		const trimmed = usernameInput.trim().slice(0, MAX_USERNAME_LENGTH);
		if (!trimmed) return;
		localStorage.setItem(CHAT_USERNAME_KEY, trimmed);
		setUsername(trimmed);
	};

	const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !supabase) return;

		if (!file.type.startsWith('image/')) {
			setError('Sadece görsel dosyaları yükleyebilirsin.');
			return;
		}
		if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
			setError(`Görsel en fazla ${MAX_IMAGE_SIZE_MB}MB olabilir.`);
			return;
		}

		setUploadingImage(true);
		setError('');

		const fileExt = file.name.split('.').pop();
		const fileName = `chat/${visitorId}-${Date.now()}.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from('images')
			.upload(fileName, file);

		if (uploadError) {
			setError('Görsel yüklenemedi, tekrar dene.');
			setUploadingImage(false);
			return;
		}

		const { data } = supabase.storage.from('images').getPublicUrl(fileName);
		setPendingImageUrl(data.publicUrl);
		setUploadingImage(false);
	};

	const handleSend = async () => {
		if (!supabase || !visitorId || !username) return;
		if (!text.trim() && !pendingImageUrl) return;

		// Honeypot doluysa (bot) sessizce hiçbir şey yapma
		if (honeypot) return;

		// Basit rate limit - spam'i önle
		const now = Date.now();
		if (now - lastSentAt < SEND_COOLDOWN_MS) {
			setError('Çok hızlı mesaj gönderiyorsun, biraz yavaşla 🙂');
			return;
		}

		setSending(true);
		setError('');

		const { error: insertError } = await supabase.from('chat_messages').insert({
			visitor_id: visitorId,
			username,
			content: text.trim() || null,
			image_url: pendingImageUrl || null,
		});

		if (insertError) {
			setError('Mesaj gönderilemedi. Yasaklanmış olabilirsin.');
		} else {
			setText('');
			setPendingImageUrl('');
			setLastSentAt(now);
		}

		setSending(false);
	};

	// Kullanıcı adı henüz seçilmemişse önce onu iste
	if (!username) {
		return (
			<div className="min-h-[70vh] flex items-center justify-center px-4">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card rounded-2xl p-8 shadow-soft max-w-sm w-full text-center"
				>
					<MessageCircle className="w-12 h-12 text-pumpkin mx-auto mb-4" />
					<h1 className="font-display text-xl font-bold text-pine mb-2">Sohbete Katıl</h1>
					<p className="text-muted-foreground text-sm mb-6">
						Sohbete başlamak için bir kullanıcı adı seç.
					</p>
					<input
						type="text"
						value={usernameInput}
						onChange={(e) => setUsernameInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSetUsername()}
						maxLength={MAX_USERNAME_LENGTH}
						placeholder="Kullanıcı adın"
						className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin mb-4 text-center"
					/>
					<button
						onClick={handleSetUsername}
						disabled={!usernameInput.trim()}
						className="w-full px-4 py-3 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50"
					>
						Sohbete Başla
					</button>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto px-4 py-8 flex flex-col h-[85vh]">
			<div className="flex items-center justify-between mb-4">
				<h1 className="font-display text-2xl font-bold text-pine flex items-center gap-2">
					<MessageCircle className="w-6 h-6" />
					Sohbet
				</h1>
				<p className="text-sm text-muted-foreground">
					<span className="font-medium text-foreground">{username}</span> olarak yazıyorsun
				</p>
			</div>

			{/* Messages */}
			<div
				ref={containerRef}
				onScroll={handleScroll}
				className="flex-1 overflow-y-auto bg-card rounded-xl p-4 shadow-soft mb-4 flex flex-col gap-3"
			>
				{loadingOlder && (
					<p className="text-center text-xs text-muted-foreground py-2">
						Daha eski mesajlar yükleniyor...
					</p>
				)}

				{loading ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="animate-spin w-6 h-6 border-4 border-pumpkin border-t-transparent rounded-full" />
					</div>
				) : messages.length === 0 ? (
					<p className="text-center text-muted-foreground text-sm py-8">
						Henüz mesaj yok. İlk mesajı sen yaz! 👋
					</p>
				) : (
					<AnimatePresence initial={false}>
						{messages.map((msg) => {
							const isMe = msg.visitor_id === visitorId;
							return (
								<motion.div
									key={msg.id}
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
								>
									<span className="text-xs text-muted-foreground mb-1 px-1">
										{msg.username}
									</span>
									<div
										className={`rounded-2xl px-4 py-2 ${
											isMe ? 'bg-pumpkin text-white' : 'bg-muted text-foreground'
										}`}
									>
										{msg.image_url && (
											<img
												src={msg.image_url}
												alt="Gönderilen görsel"
												className="rounded-lg max-w-full max-h-64 object-cover mb-1"
											/>
										)}
										{msg.content && <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>}
									</div>
								</motion.div>
							);
						})}
					</AnimatePresence>
				)}
			</div>

			{error && (
				<p className="text-destructive text-sm mb-2 px-1">{error}</p>
			)}

			{pendingImageUrl && (
				<div className="relative inline-block mb-2 self-start">
					<img src={pendingImageUrl} alt="Önizleme" className="h-20 rounded-lg" />
					<button
						onClick={() => setPendingImageUrl('')}
						className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
					>
						<X className="w-3 h-3" />
					</button>
				</div>
			)}

			{/* Honeypot - ekran okuyucular ve insanlar için gizli */}
			<input
				type="text"
				value={honeypot}
				onChange={(e) => setHoneypot(e.target.value)}
				tabIndex={-1}
				autoComplete="off"
				className="absolute opacity-0 pointer-events-none h-0 w-0"
				aria-hidden="true"
			/>

			<div className="flex items-end gap-2">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleImageSelect}
					className="hidden"
				/>
				<button
					onClick={() => fileInputRef.current?.click()}
					disabled={uploadingImage}
					className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
					title="Görsel ekle"
				>
					<ImageIcon className="w-5 h-5" />
				</button>
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					rows={1}
					placeholder="Bir şeyler yaz..."
					className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none"
				/>
				<button
					onClick={handleSend}
					disabled={sending || uploadingImage || (!text.trim() && !pendingImageUrl)}
					className="p-3 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-white transition-colors disabled:opacity-50"
				>
					<Send className="w-5 h-5" />
				</button>
			</div>
			<p className="text-xs text-muted-foreground mt-1 px-1">
				{text.length}/{MAX_MESSAGE_LENGTH}
			</p>
		</div>
	);
}