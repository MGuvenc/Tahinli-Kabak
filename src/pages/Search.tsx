import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import PostCard from '@/components/home/PostCard';

type Post = Tables<'posts'>;

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!supabase || !query.trim()) {
      setResults([]);
      return;
    }

    const delaySearch = setTimeout(async () => {
      setLoading(true);
      setSearched(true);

      const { data } = await supabase.
      from('posts').
      select('*').
      eq('status', 'published').
      or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`).
      order('published_at', { ascending: false }).
      limit(20);

      setResults(data ?? []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  return (
    <div data-ev-id="ev_eca4e95952" className="min-h-screen py-16 px-4">
			<div data-ev-id="ev_6a0ebac4b1" className="max-w-4xl mx-auto">
				<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12">

					<h1 data-ev-id="ev_132469925a" className="font-display text-4xl md:text-5xl font-bold text-pine mb-4">Ara</h1>
					<p data-ev-id="ev_0e9ecdc09e" className="text-muted-foreground">
						Yazılarda bir şeyler mi arıyorsun? Yaz bakalım.
					</p>
				</motion.div>

				{/* Search input */}
				<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-12">

					<SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
					<input data-ev-id="ev_df253022ef"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yazılarda ara..."
          autoFocus
          className="w-full pl-14 pr-6 py-5 rounded-2xl border border-border bg-card text-lg focus:outline-none focus:ring-2 focus:ring-pumpkin shadow-soft transition-all" />

				</motion.div>

				{/* Results */}
				{loading ?
        <div data-ev-id="ev_2501b72669" className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[...Array(4)].map((_, i) =>
          <div data-ev-id="ev_fb409ff33c" key={i} className="bg-card rounded-2xl h-48 animate-pulse" />
          )}
					</div> :
        results.length > 0 ?
        <div data-ev-id="ev_3a5c44bfc1" className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{results.map((post, index) =>
          <PostCard key={post.id} post={post} index={index} />
          )}
					</div> :
        searched && query.trim() ?
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-2xl p-12 text-center">

						<span data-ev-id="ev_bd7d2fc5d5" className="text-5xl mb-4 block">🔍</span>
						<p data-ev-id="ev_1ef0002f5f" className="text-muted-foreground">
							"{query}" için sonuç bulunamadı.
							<br data-ev-id="ev_f3e1461480" />
							Başka bir şey dene?
						</p>
					</motion.div> :

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12">

						<p data-ev-id="ev_309e8cb0c9" className="text-muted-foreground">
							Aramak istediğin kelimeyi yaz, biz de tahin gibi yayılalım.
						</p>
					</motion.div>
        }
			</div>
		</div>);

}