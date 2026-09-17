/**
 * Utility functions for tahinlikabak blog
 */

/**
 * Format a date string to Turkish locale
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "5 dakika önce")
 */
export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'az önce';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} gün önce`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} hafta önce`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ay önce`;
  }
  
  return formatDate(dateString);
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute) || 1;
}

/**
 * Generate a URL-safe slug from text
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Turkish character replacements
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\u011F/g, 'g')
    .replace(/\u00FC/g, 'u')
    .replace(/\u015F/g, 's')
    .replace(/\u0131/g, 'i')
    .replace(/\u00F6/g, 'o')
    .replace(/\u00E7/g, 'c')
    // Remove special characters
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}
export async function generateUniqueSlug(
	supabase: any,
	baseText: string,
	excludeId?: string
): Promise<string> {
	const base = slugify(baseText) || 'yazi';
	let candidate = base;
	let counter = 1;

	while (true) {
		let query = supabase.from('posts').select('id').eq('slug', candidate).limit(1);
		if (excludeId) {
			query = query.neq('id', excludeId);
		}
		const { data } = await query;

		if (!data || data.length === 0) {
			return candidate;
		}

		counter += 1;
		candidate = `${base}-${counter}`;
	}
}
/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a random fun Turkish nickname
 */
export function generateFunkyName(): string {
  const adjectives = [
    'Uysal', 'Haylaz', 'Tembel', 'Meraklı', 'Çılgın', 'Hayalperest',
    'Mutlu', 'Dalgacı', 'Şapsal', 'Zeki', 'Komik', 'Gizemli',
    'Mağdur', 'Keyifli', 'Serseri', 'Sakin', 'Enerjik', 'Renkli',
  ];
  
  const nouns = [
    'Kabak', 'Tahin', 'Panda', 'Kedi', 'Sincap', 'Penguen',
    'Portakal', 'Limon', 'Kuru Üzm', 'Fındık', 'Ceviz', 'Badem',
    'Balkabak', 'Patates', 'Havuc', 'Domates', 'Biber', 'Maydanoz',
    'Kuş', 'Arı', 'Kelebek', 'Uğur Böceği', 'Kayık', 'Bulut',
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj} ${noun}`;
}

/**
 * Copy text to clipboard (fallback for older browsers)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Create a textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get visitor ID from localStorage or generate new one
 */
export function getOrCreateVisitorId(): string {
  if (!isBrowser()) return '';
  
  const storageKey = 'tahinlikabak_visitor_id';
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
}

/**
 * Get or create visitor name
 */
export function getOrCreateVisitorName(): string {
  if (!isBrowser()) return 'Anonim';
  
  const storageKey = 'tahinlikabak_visitor_name';
  let visitorName = localStorage.getItem(storageKey);
  
  if (!visitorName) {
    visitorName = generateFunkyName();
    localStorage.setItem(storageKey, visitorName);
  }
  
  return visitorName;
}

const LAST_VIEWED_PREFIX = 'admin_last_viewed_';

/**
 * Bir admin sekmesinin (comments, submissions, chat) en son ne zaman görüntülendiği
 */
export function getLastViewed(section: string): string {
	return localStorage.getItem(LAST_VIEWED_PREFIX + section) ?? '2026-01-01T00:00:00.000Z';
}

/**
 * Admin, sekmeyi görüntüleyince güncelle
 */
export function markAsViewed(section: string): void {
	localStorage.setItem(LAST_VIEWED_PREFIX + section, new Date().toISOString());
	window.dispatchEvent(new Event('admin-badge-refresh'));
}