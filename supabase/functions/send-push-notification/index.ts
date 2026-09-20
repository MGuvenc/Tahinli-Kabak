// Supabase Edge Function: send-push-notification
// Database Webhook tarafından tetiklenir (INSERT olayları için)
// Tüm kayıtlı admin cihazlarına push bildirimi gönderir.

import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:admin@example.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function buildNotification(table: string, record: any) {
	switch (table) {
		case 'anonymous_submissions':
			return {
				title: '👻 Yeni Anonim Yazı',
				body: record.title || 'Yeni bir anonim yazı gönderildi.',
				url: '/admin/anonim-yazilar',
			};
		case 'comments':
			return {
				title: '💬 Yeni Yorum',
				body: record.content?.slice(0, 100) || 'Yeni bir yorum geldi.',
				url: '/admin/yorumlar',
			};
		case 'chat_messages':
			return {
				title: `💬 ${record.username ?? 'Biri'} sohbette yazdı`,
				body: record.content?.slice(0, 100) || 'Bir görsel gönderdi.',
				url: '/admin/sohbet',
			};
		default:
			return { title: 'tahinlikabak', body: 'Yeni bir bildirim var.', url: '/admin' };
	}
}

Deno.serve(async (req) => {
	try {
		const payload = await req.json();
		const table = payload.table;
		const record = payload.record;

		const notification = buildNotification(table, record);

		const { data: subscriptions, error } = await supabase.from('push_subscriptions').select('*');

		if (error) throw error;

		const results = await Promise.allSettled(
			(subscriptions ?? []).map((sub) =>
				webpush.sendNotification(
					{
						endpoint: sub.endpoint,
						keys: { p256dh: sub.p256dh, auth: sub.auth },
					},
					JSON.stringify(notification)
				)
			)
		);

		// Artık geçersiz (410 Gone) abonelikleri temizle
		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			if (result.status === 'rejected' && String(result.reason).includes('410')) {
				await supabase.from('push_subscriptions').delete().eq('id', subscriptions[i].id);
			}
		}

		return new Response(JSON.stringify({ sent: results.length }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: String(err) }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
});