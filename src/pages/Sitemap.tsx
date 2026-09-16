import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FileText, Tag, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SitemapSection {
  title: string;
  icon: React.ComponentType<{className?: string;}>;
  links: {href: string;label: string;}[];
}

export default function Sitemap() {
  const [sections, setSections] = useState<SitemapSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const staticSections: SitemapSection[] = [
      {
        title: 'Ana Sayfalar',
        icon: Home,
        links: [
        { href: '/', label: 'Ana Sayfa' },
        { href: '/hakkimda', label: 'Hakkımda' },
        { href: '/galeri', label: 'Galeri' },
        { href: '/ara', label: 'Arama' },
        { href: '/anonim-yazi-gonder', label: 'Anonim Yazı Gönder' }]

      }];


      if (supabase) {
        // Fetch published posts
        const { data: posts } = await supabase.
        from('posts').
        select('slug, title').
        eq('status', 'published').
        order('published_at', { ascending: false });

        if (posts && posts.length > 0) {
          staticSections.push({
            title: 'Yazılar',
            icon: FileText,
            links: posts.map((post) => ({
              href: `/yazi/${post.slug}`,
              label: post.title
            }))
          });
        }

        // Fetch tags
        const { data: tags } = await supabase.
        from('tags').
        select('slug, name').
        order('name');

        if (tags && tags.length > 0) {
          staticSections.push({
            title: 'Etiketler',
            icon: Tag,
            links: tags.map((tag) => ({
              href: `/etiket/${tag.slug}`,
              label: tag.name
            }))
          });
        }
      }

      setSections(staticSections);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div data-ev-id="ev_aa5b22eb36" className="min-h-screen py-16 px-4">
      <div data-ev-id="ev_32259cbd09" className="max-w-4xl mx-auto">
        <motion.div data-ev-id="ev_d24f0b5c9c"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12">

          <h1 data-ev-id="ev_736f738a54" className="font-display text-4xl md:text-5xl font-bold text-pine mb-4">
            Site Haritası
          </h1>
          <p data-ev-id="ev_bc92f283d2" className="text-muted-foreground">
            tahinlikabak'taki tüm sayfaların listesi.
          </p>
        </motion.div>

        {loading ?
        <div data-ev-id="ev_a0d0c20d47" className="flex flex-col gap-8">
            {[...Array(3)].map((_, i) =>
          <div data-ev-id="ev_daf00e4313" key={i} className="bg-card rounded-xl p-6 animate-pulse h-40" />
          )}
          </div> :

        <div data-ev-id="ev_fbc5e9cf8b" className="flex flex-col gap-8">
            {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div data-ev-id="ev_96d43ba78b"
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-soft">

                  <div data-ev-id="ev_b375920c0a" className="flex items-center gap-3 mb-4">
                    <div data-ev-id="ev_6854124d95" className="p-2 bg-pumpkin/10 rounded-lg">
                      <Icon className="w-5 h-5 text-pumpkin" />
                    </div>
                    <h2 data-ev-id="ev_fff01d457c" className="font-display text-xl font-bold text-pine">
                      {section.title}
                    </h2>
                    <span data-ev-id="ev_4c876716c9" className="text-sm text-muted-foreground">
                      ({section.links.length})
                    </span>
                  </div>
                  <ul data-ev-id="ev_af59511d8a" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {section.links.map((link) =>
                  <li data-ev-id="ev_3b828d7024" key={link.href}>
                        <Link data-ev-id="ev_259beaced5"
                    to={link.href}
                    className="block px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors truncate">

                          {link.label}
                        </Link>
                      </li>
                  )}
                  </ul>
                </motion.div>);

          })}
          </div>
        }
      </div>
    </div>);

}