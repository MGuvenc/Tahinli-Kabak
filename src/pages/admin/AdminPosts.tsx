import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import { formatDate } from '@/lib/utils';

type Post = Tables<'posts'>;

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!supabase) return;

    const { data } = await supabase.
    from('posts').
    select('*').
    order('created_at', { ascending: false });

    setPosts(data ?? []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Bu yazıyı silmek istediğinden emin misin?')) return;

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const toggleStatus = async (post: Post) => {
    if (!supabase) return;

    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const updates: Partial<Post> = { status: newStatus };

    if (newStatus === 'published' && !post.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { error } = await supabase.
    from('posts').
    update(updates).
    eq('id', post.id);

    if (!error) {
      setPosts(posts.map((p) => p.id === post.id ? { ...p, ...updates } : p));
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || post.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div data-ev-id="ev_acec5bdc4f">
      <div data-ev-id="ev_446cf7653d" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 data-ev-id="ev_395e5ae97b" className="font-display text-3xl font-bold text-pine">Yazılar</h1>
        <Link
          to="/admin/yazilar/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors">

          <Plus className="w-5 h-5" />
          Yeni Yazı
        </Link>
      </div>

      {/* Filters */}
      <div data-ev-id="ev_3b4d7c0c87" className="flex flex-col sm:flex-row gap-4 mb-6">
        <div data-ev-id="ev_94a874248e" className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input data-ev-id="ev_6a640eb451"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Yazı ara..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pumpkin" />

        </div>
        <div data-ev-id="ev_d1f2103ac0" className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((f) =>
          <button data-ev-id="ev_24358345ed"
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          filter === f ?
          'bg-pumpkin text-white' :
          'bg-card text-muted-foreground hover:bg-muted'}`
          }>

              {f === 'all' ? 'Tümü' : f === 'published' ? 'Yayında' : 'Taslak'}
            </button>
          )}
        </div>
      </div>

      {/* Posts list */}
      {loading ?
      <div data-ev-id="ev_63a4451654" className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) =>
        <div data-ev-id="ev_e6cce20776" key={i} className="bg-card rounded-xl p-4 animate-pulse h-20" />
        )}
        </div> :
      filteredPosts.length > 0 ?
      <div data-ev-id="ev_03f21a2d2c" className="flex flex-col gap-4">
          {filteredPosts.map((post, index) =>
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-card rounded-xl p-4 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              <div data-ev-id="ev_3709b10acf" className="flex-1 min-w-0">
                <div data-ev-id="ev_98dd0dac5d" className="flex items-center gap-2 mb-1">
                  <h3 data-ev-id="ev_e2a85788c2" className="font-display font-semibold text-foreground truncate">
                    {post.title}
                  </h3>
                  {post.is_anonymous_submission &&
              <span data-ev-id="ev_9025058a23" className="px-2 py-0.5 text-xs bg-pumpkin/10 text-pumpkin rounded-full">
                      Anonim
                    </span>
              }
                </div>
                <div data-ev-id="ev_253a114c61" className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span data-ev-id="ev_04495e6abd" className={`flex items-center gap-1 ${
              post.status === 'published' ? 'text-olive' : 'text-muted-foreground'}`
              }>
                    {post.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {post.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                  <span data-ev-id="ev_c644fc79cd">{formatDate(post.created_at)}</span>
                  <span data-ev-id="ev_754718625b" className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.like_count}
                  </span>
                  <span data-ev-id="ev_a285855f37" className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.view_count}
                  </span>
                </div>
              </div>
              <div data-ev-id="ev_e878364fd5" className="flex items-center gap-2">
                <button data-ev-id="ev_6dd0217432"
            onClick={() => toggleStatus(post)}
            className={`p-2 rounded-lg transition-colors ${
            post.status === 'published' ?
            'text-olive hover:bg-olive/10' :
            'text-muted-foreground hover:bg-muted'}`
            }
            title={post.status === 'published' ? 'Taslağa çevir' : 'Yayınla'}>

                  {post.status === 'published' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <Link
              to={`/admin/yazilar/${post.id}`}
              className="p-2 rounded-lg text-pumpkin hover:bg-pumpkin/10 transition-colors"
              title="Düzenle">

                  <Edit className="w-5 h-5" />
                </Link>
                <button data-ev-id="ev_ad6fe86b75"
            onClick={() => handleDelete(post.id)}
            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            title="Sil">

                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
        )}
        </div> :

      <div data-ev-id="ev_4adde5a593" className="bg-card rounded-xl p-12 text-center">
          <span data-ev-id="ev_7a21641c44" className="text-5xl mb-4 block">📝</span>
          <p data-ev-id="ev_23f3d35e6f" className="text-muted-foreground mb-4">
            {searchQuery ? `"${searchQuery}" için sonuç bulunamadı.` : 'Henüz yazı yok.'}
          </p>
          <Link
          to="/admin/yazilar/yeni"
          className="inline-flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors">

            <Plus className="w-5 h-5" />
            İlk Yazını Oluştur
          </Link>
        </div>
      }
    </div>);

}