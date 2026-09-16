import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FileText, Image, MessageSquare, Inbox, Eye, Heart, Plus, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  galleryImages: number;
  comments: number;
  pendingSubmissions: number;
  totalViews: number;
  totalLikes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    galleryImages: 0,
    comments: 0,
    pendingSubmissions: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      // Fetch all stats in parallel
      const [postsRes, galleryRes, commentsRes, submissionsRes] = await Promise.all([
      supabase.from('posts').select('id, status, view_count, like_count'),
      supabase.from('gallery_images').select('id', { count: 'exact' }),
      supabase.from('comments').select('id', { count: 'exact' }),
      supabase.from('anonymous_submissions').select('id').eq('status', 'pending')]
      );

      const posts = postsRes.data ?? [];
      const publishedPosts = posts.filter((p) => p.status === 'published');
      const draftPosts = posts.filter((p) => p.status === 'draft');
      const totalViews = posts.reduce((sum, p) => sum + (p.view_count || 0), 0);
      const totalLikes = posts.reduce((sum, p) => sum + (p.like_count || 0), 0);

      setStats({
        totalPosts: posts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        galleryImages: galleryRes.count ?? 0,
        comments: commentsRes.count ?? 0,
        pendingSubmissions: submissionsRes.data?.length ?? 0,
        totalViews,
        totalLikes
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
  { label: 'Toplam Yazı', value: stats.totalPosts, icon: FileText, color: 'bg-pine', href: '/admin/yazilar' },
  { label: 'Yayında', value: stats.publishedPosts, icon: TrendingUp, color: 'bg-olive', href: '/admin/yazilar' },
  { label: 'Taslak', value: stats.draftPosts, icon: FileText, color: 'bg-warm-gray', href: '/admin/yazilar' },
  { label: 'Galeri Görseli', value: stats.galleryImages, icon: Image, color: 'bg-pumpkin', href: '/admin/galeri' },
  { label: 'Yorum', value: stats.comments, icon: MessageSquare, color: 'bg-tahini-dark', href: '/admin/yorumlar' },
  { label: 'Bekleyen Anonim', value: stats.pendingSubmissions, icon: Inbox, color: 'bg-destructive', href: '/admin/anonim-yazilar' },
  { label: 'Toplam Görüntülenme', value: stats.totalViews, icon: Eye, color: 'bg-sage', href: null },
  { label: 'Toplam Beğeni', value: stats.totalLikes, icon: Heart, color: 'bg-pumpkin-dark', href: null }];


  return (
    <div data-ev-id="ev_324bcf1630">
      <div data-ev-id="ev_7b3eca11bc" className="flex items-center justify-between mb-8">
        <h1 data-ev-id="ev_626994f9c3" className="font-display text-3xl font-bold text-pine">Panel</h1>
        <Link
          to="/admin/yazilar/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors">

          <Plus className="w-5 h-5" />
          Yeni Yazı
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ?
      <div data-ev-id="ev_f4a4c76617" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(8)].map((_, i) =>
        <div data-ev-id="ev_a4598be372" key={i} className="bg-card rounded-xl p-6 animate-pulse h-24" />
        )}
        </div> :

      <div data-ev-id="ev_a957bd78bd" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const content =
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-card rounded-xl p-6 shadow-soft ${stat.href ? 'hover:shadow-card transition-shadow cursor-pointer' : ''}`}>

                <div data-ev-id="ev_2eaca0a3f4" className="flex items-center gap-4">
                  <div data-ev-id="ev_75eedbc676" className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div data-ev-id="ev_463b91250b">
                    <p data-ev-id="ev_9e768b7819" className="text-muted-foreground text-sm">{stat.label}</p>
                    <p data-ev-id="ev_d8227c4da5" className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </motion.div>;


          return stat.href ?
          <Link key={stat.label} to={stat.href}>{content}</Link> :

          <div data-ev-id="ev_01d1ce6eb9" key={stat.label}>{content}</div>;

        })}
        </div>
      }

      {/* Quick Actions */}
      <div data-ev-id="ev_979212cf5b" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div data-ev-id="ev_138eb08c8c" className="bg-card rounded-xl p-6 shadow-soft">
          <h2 data-ev-id="ev_6f51b1fef9" className="font-display text-xl font-bold text-pine mb-4">Hızlı İşlemler</h2>
          <div data-ev-id="ev_2613a35d83" className="flex flex-col gap-3">
            <Link
              to="/admin/yazilar/yeni"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">

              <Plus className="w-5 h-5 text-pumpkin" />
              <span data-ev-id="ev_8004e73e45">Yeni yazı oluştur</span>
            </Link>
            <Link
              to="/admin/galeri"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">

              <Image className="w-5 h-5 text-pumpkin" />
              <span data-ev-id="ev_1bd8ae751f">Galeriye görsel ekle</span>
            </Link>
            <Link
              to="/admin/anonim-yazilar"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">

              <Inbox className="w-5 h-5 text-pumpkin" />
              <span data-ev-id="ev_e9df62d3dc">Anonim yazıları kontrol et</span>
            </Link>
          </div>
        </div>

        <div data-ev-id="ev_71b0b5dbfb" className="bg-card rounded-xl p-6 shadow-soft">
          <h2 data-ev-id="ev_e141029bcd" className="font-display text-xl font-bold text-pine mb-4">Hoş geldin! 👋</h2>
          <p data-ev-id="ev_1dc4360421" className="text-muted-foreground mb-4">
            tahinlikabak admin paneline hoş geldin. Buradan yazılarını yönetebilir,
            galeri ekleyebilir ve anonim gönderileri onaylayabilirsin.
          </p>
          <p data-ev-id="ev_d00a090a82" className="text-sm text-muted-foreground/70">
            İpucu: Soldaki menüden tüm bölümlere ulaşabilirsin.
          </p>
        </div>
      </div>
    </div>);

}