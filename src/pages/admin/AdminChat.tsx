import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Ban, ShieldOff, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, markAsViewed } from '@/lib/utils';
import Chat from '../Chat';

interface ChatMessage {
	id: string;
	visitor_id: string;
	username: string;
	content: string | null;
	image_url: string | null;
	created_at: string;
}

interface BannedVisitor {
	id: string;
	visitor_id: string;
	reason: string | null;
	banned_at: string;
}

export default function AdminChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [bannedVisitors, setBannedVisitors] = useState<BannedVisitor[]>([]);
	const [loading, setLoading] = useState(true);
	const [showBanned, setShowBanned] = useState(false);

	const fetchData = async () => {
		if (!supabase) return;

		const { data: messagesData } = await supabase
			.from('chat_messages')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(300);

		const { data: bannedData } = await supabase
			.from('banned_visitors')
			.select('*')
			.order('banned_at', { ascending: false });

		setMessages(messagesData ?? []);
		setBannedVisitors(bannedData ?? []);
		setLoading(false);
	};

	useEffect(() => {
		markAsViewed('Chat');
		fetchData();

		if (!supabase) return;

		const channel = supabase
			.channel('admin-chat')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, fetchData)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'banned_visitors' }, fetchData)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const bannedVisitorIds = new Set(bannedVisitors.map((b) => b.visitor_id));

	const handleDeleteMessage = async (id: string) => {
		if (!supabase) return;
		await supabase.from('chat_messages').delete().eq('id', id);
	};

	const handleBanUser = async (visitorId: string, username: string) => {
		if (!supabase) return;
		if (!confirm(`"${username}" adlı kullanıcıyı banlamak istediğine emin misin? Bu kullanıcı artık mesaj gönderemeyecek.`)) {
			return;
		}
		await supabase.from('banned_visitors').insert({
			visitor_id: visitorId,
			reason: `"${username}" kullanıcı adıyla banlandı`,
		});
	};

	const handleUnban = async (id: string) => {
		if (!supabase) return;
		await supabase.from('banned_visitors').delete().eq('id', id);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="animate-spin w-8 h-8 border-4 border-pumpkin border-t-transparent rounded-full" />
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="font-display text-2xl font-bold text-pine flex items-center gap-2">
					<MessageCircle className="w-6 h-6" />
					Sohbet Yönetimi
				</h1>
				<button
					onClick={() => setShowBanned(!showBanned)}
					className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors"
				>
					<Ban className="w-4 h-4" />
					Banlı Kullanıcılar ({bannedVisitors.length})
				</button>
			</div>

			{showBanned && (
				<div className="bg-card rounded-xl p-6 shadow-soft mb-6">
					<h2 className="font-display text-lg font-bold text-pine mb-4">Banlı Kullanıcılar</h2>
					{bannedVisitors.length === 0 ? (
						<p className="text-muted-foreground text-sm">Şu an banlı kimse yok.</p>
					) : (
						<div className="flex flex-col gap-2">
							{bannedVisitors.map((b) => (
								<div
									key={b.id}
									className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg"
								>
									<div>
										<p className="text-sm font-medium">{b.reason ?? 'Sebep belirtilmedi'}</p>
										<p className="text-xs text-muted-foreground">
											{formatDate(b.banned_at)} · {b.visitor_id}
										</p>
									</div>
									<button
										onClick={() => handleUnban(b.id)}
										className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-500/10 rounded-lg transition-colors"
									>
										<ShieldOff className="w-4 h-4" />
										Banı Kaldır
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			<div className="bg-card rounded-xl p-6 shadow-soft">
				<h2 className="font-display text-lg font-bold text-pine mb-4">
					Mesajlar (son 300)
				</h2>
				{messages.length === 0 ? (
					<p className="text-muted-foreground text-sm">Henüz mesaj yok.</p>
				) : (
					<div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
						{messages.map((msg) => {
							const isBanned = bannedVisitorIds.has(msg.visitor_id);
							return (
								<motion.div
									key={msg.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className={`flex items-start justify-between gap-4 p-4 rounded-lg border ${
										isBanned ? 'border-destructive/40 bg-destructive/5' : 'border-border'
									}`}
								>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-medium text-sm">{msg.username}</span>
											{isBanned && (
												<span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive rounded-full">
													Banlı
												</span>
											)}
											<span className="text-xs text-muted-foreground">
												{formatDate(msg.created_at)}
											</span>
										</div>
										{msg.image_url && (
											<img
												src={msg.image_url}
												alt="Gönderilen görsel"
												className="max-h-32 rounded-lg mb-1"
											/>
										)}
										{msg.content && (
											<p className="text-sm text-foreground whitespace-pre-wrap break-words">
												{msg.content}
											</p>
										)}
										<p className="text-xs text-muted-foreground mt-1">{msg.visitor_id}</p>
									</div>
									<div className="flex items-center gap-1 flex-shrink-0">
										{!isBanned && (
											<button
												onClick={() => handleBanUser(msg.visitor_id, msg.username)}
												className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
												title="Kullanıcıyı banla"
											>
												<Ban className="w-4 h-4" />
											</button>
										)}
										<button
											onClick={() => handleDeleteMessage(msg.id)}
											className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
											title="Mesajı sil"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</motion.div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}