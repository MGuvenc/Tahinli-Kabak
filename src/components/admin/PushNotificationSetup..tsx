import { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; i++) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export default function PushNotificationSetup() {
	const { user } = useAuth();
	const [status, setStatus] = useState<'idle' | 'subscribed' | 'unsupported' | 'denied'>('idle');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const checkStatus = async () => {
			if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
				setStatus('unsupported');
				return;
			}
			if (Notification.permission === 'denied') {
				setStatus('denied');
				return;
			}

			const registration = await navigator.serviceWorker.getRegistration();
			const existingSub = await registration?.pushManager.getSubscription();
			setStatus(existingSub ? 'subscribed' : 'idle');
		};

		checkStatus();
	}, []);

	const handleEnable = async () => {
		if (!supabase || !user) return;
		setLoading(true);

		try {
			const permission = await Notification.requestPermission();
			if (permission !== 'granted') {
				setStatus('denied');
				setLoading(false);
				return;
			}

			const registration = await navigator.serviceWorker.register('/sw.js');
			await navigator.serviceWorker.ready;

			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
			});

			const subJson = subscription.toJSON();

			await supabase.from('push_subscriptions').upsert(
				{
					user_id: user.id,
					endpoint: subJson.endpoint!,
					p256dh: subJson.keys!.p256dh,
					auth: subJson.keys!.auth,
				},
				{ onConflict: 'endpoint' }
			);

			setStatus('subscribed');
		} catch (err) {
			console.error('Push aboneliği başarısız:', err);
			alert('Bildirimler etkinleştirilemedi. Tarayıcı ayarlarını kontrol et.');
		}

		setLoading(false);
	};

	const handleDisable = async () => {
		if (!supabase) return;
		setLoading(true);

		const registration = await navigator.serviceWorker.getRegistration();
		const subscription = await registration?.pushManager.getSubscription();

		if (subscription) {
			await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint);
			await subscription.unsubscribe();
		}

		setStatus('idle');
		setLoading(false);
	};

	if (status === 'unsupported') {
		return (
			<p className="text-sm text-muted-foreground">
				Bu tarayıcı push bildirimlerini desteklemiyor.
			</p>
		);
	}

	if (status === 'denied') {
		return (
			<p className="text-sm text-destructive">
				Bildirim izni engellenmiş. Tarayıcı ayarlarından bu site için bildirimlere izin vermen gerekiyor.
			</p>
		);
	}

	return (
		<div className="flex items-center gap-3">
			{status === 'subscribed' ? (
				<>
					<div className="flex items-center gap-2 text-green-600 text-sm font-medium">
						<BellRing className="w-4 h-4" />
						Bu cihazda bildirimler açık
					</div>
					<button
						onClick={handleDisable}
						disabled={loading}
						className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors disabled:opacity-50"
					>
						<BellOff className="w-4 h-4" />
						Kapat
					</button>
				</>
			) : (
				<button
					onClick={handleEnable}
					disabled={loading}
					className="flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50"
				>
					<Bell className="w-4 h-4" />
					{loading ? 'Ayarlanıyor...' : 'Bu Cihazda Bildirimleri Aç'}
				</button>
			)}
		</div>
	);
}