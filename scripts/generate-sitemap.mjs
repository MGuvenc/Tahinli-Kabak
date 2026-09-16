import { writeFileSync, mkdirSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://tahinlikabak.vercel.app';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const staticRoutes = [
	{ path: '/', priority: '1.0', changefreq: 'daily' },
	{ path: '/hakkimda', priority: '0.5', changefreq: 'monthly' },
	{ path: '/galeri', priority: '0.7', changefreq: 'weekly' },
	{ path: '/ara', priority: '0.3', changefreq: 'monthly' },
	{ path: '/anonim-yazi-gonder', priority: '0.3', changefreq: 'monthly' },
	{ path: '/site-haritasi', priority: '0.2', changefreq: 'monthly' },
];

function urlEntry(loc, priority, changefreq, lastmod) {
	return (
		`\t<url>\n` +
		`\t\t<loc>${loc}</loc>\n` +
		(lastmod ? `\t\t<lastmod>${lastmod}</lastmod>\n` : '') +
		`\t\t<changefreq>${changefreq}</changefreq>\n` +
		`\t\t<priority>${priority}</priority>\n` +
		`\t</url>`
	);
}

async function generate() {
	const entries = staticRoutes.map((r) =>
		urlEntry(`${SITE_URL}${r.path}`, r.priority, r.changefreq)
	);

	if (supabaseUrl && supabaseKey) {
		try {
			const supabase = createClient(supabaseUrl, supabaseKey);

			const { data: posts } = await supabase
				.from('posts')
				.select('slug, updated_at, published_at')
				.eq('status', 'published');

			(posts ?? []).forEach((post) => {
				const lastmod = (post.updated_at ?? post.published_at ?? '').substring(0, 10) || undefined;
				entries.push(urlEntry(`${SITE_URL}/yazi/${post.slug}`, '0.8', 'weekly', lastmod));
			});

			const { data: tags } = await supabase.from('tags').select('slug');

			(tags ?? []).forEach((tag) => {
				entries.push(urlEntry(`${SITE_URL}/etiket/${tag.slug}`, '0.4', 'weekly'));
			});

			console.log(`Sitemap: ${posts?.length ?? 0} yazı, ${tags?.length ?? 0} etiket eklendi.`);
		} catch (err) {
			console.warn('Sitemap: Supabase verisi alınamadı, sadece statik sayfalar eklendi.', err);
		}
	} else {
		console.warn('Sitemap: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY bulunamadı, sadece statik sayfalar eklendi.');
	}

	const xml =
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		entries.join('\n') +
		`\n</urlset>\n`;

	mkdirSync('public', { recursive: true });
	writeFileSync('public/sitemap.xml', xml, 'utf-8');
	console.log(`✔ public/sitemap.xml oluşturuldu (${entries.length} adres).`);
}

generate();
