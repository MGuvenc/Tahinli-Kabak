import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Image,
  MessageSquare,
  MessageCircle,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Moon,
  Sun } from
'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getLastViewed } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{className?: string;}>;
  exact?: boolean;
  badgeKey?: 'submissions' | 'comments' | 'chat';
}

const navItems: NavItem[] = [
{ href: '/admin', label: 'Panel', icon: LayoutDashboard, exact: true },
{ href: '/admin/yazilar', label: 'Yazılar', icon: FileText },
{ href: '/admin/galeri', label: 'Galeri', icon: Image },
{ href: '/admin/yorumlar', label: 'Yorumlar', icon: MessageSquare, badgeKey: 'comments' },
{ href: '/admin/sohbet', label: 'Sohbet', icon: MessageCircle, badgeKey: 'chat' },
{ href: '/admin/anonim-yazilar', label: 'Anonim Gönderiler', icon: Inbox, badgeKey: 'submissions' },
{ href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings }];


export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  // Notification badges
  const [badges, setBadges] = useState<{submissions: number;comments: number;chat: number;}>({
    submissions: 0,
    comments: 0,
    chat: 0
  });

  // Fetch notification counts - görüntülenmemiş olanlar
  useEffect(() => {
    if (!supabase) return;

    const fetchCounts = async () => {
      // Pending anonymous submissions - sadece son görüntülemeden sonra gelenler
      const { count: submissionsCount } = await supabase.
      from('anonymous_submissions').
      select('*', { count: 'exact', head: true }).
      eq('status', 'pending').
      gt('created_at', getLastViewed('submissions'));

      // Comments - son görüntülemeden sonra gelenler
      const { count: commentsCount } = await supabase.
      from('comments').
      select('*', { count: 'exact', head: true }).
      gt('created_at', getLastViewed('comments'));

      // Chat mesajları - son görüntülemeden sonra gelenler
      const { count: chatCount } = await supabase.
      from('chat_messages').
      select('*', { count: 'exact', head: true }).
      gt('created_at', getLastViewed('chat'));

      setBadges({
        submissions: submissionsCount ?? 0,
        comments: commentsCount ?? 0,
        chat: chatCount ?? 0
      });
    };

    fetchCounts();

    // Subscribe to realtime updates
    const submissionsChannel = supabase.
    channel('admin-submissions').
    on('postgres_changes', { event: '*', schema: 'public', table: 'anonymous_submissions' }, fetchCounts).
    subscribe();

    const commentsChannel = supabase.
    channel('admin-comments').
    on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, fetchCounts).
    subscribe();

    const chatChannel = supabase.
    channel('admin-chat-badge').
    on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, fetchCounts).
    subscribe();

    window.addEventListener('admin-badge-refresh', fetchCounts);

    return () => {
      supabase.removeChannel(submissionsChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(chatChannel);
    };
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/giris');
  };

  const getBadgeCount = (badgeKey?: 'submissions' | 'comments' | 'chat') => {
    if (!badgeKey) return 0;
    return badges[badgeKey];
  };

  return (
    <div data-ev-id="ev_4bdacba964" className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" />

        }
      </AnimatePresence>

      {/* Sidebar */}
      <aside data-ev-id="ev_cf2781054a"
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
      }>

        <div data-ev-id="ev_e73fa49139" className="flex flex-col h-full">
          {/* Logo */}
          <div data-ev-id="ev_cea1e1708e" className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/admin" className="flex items-center gap-2">
              <span data-ev-id="ev_601340e8a8" className="text-2xl">🥛🎃</span>
              <span data-ev-id="ev_edcdbc6414" className="font-display font-bold text-pine">tahinlikabak</span>
            </Link>
            <button data-ev-id="ev_a42eb90eda"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-muted lg:hidden">

              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          {user &&
          <div data-ev-id="ev_1442ccc299" className="px-4 py-3 border-b border-border">
              <p data-ev-id="ev_a87d05b35e" className="text-sm font-medium text-foreground truncate">{user.email}</p>
              <p data-ev-id="ev_434faf84ce" className="text-xs text-muted-foreground">Yönetici</p>
            </div>
          }

          {/* Navigation */}
          <nav data-ev-id="ev_08882a1a51" className="flex-1 p-4 overflow-y-auto">
            <ul data-ev-id="ev_e5c0f18da2" className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                const badgeCount = getBadgeCount(item.badgeKey);

                return (
                  <li data-ev-id="ev_8279160741" key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      active ?
                      'bg-pumpkin text-white' :
                      'text-muted-foreground hover:bg-muted hover:text-foreground'}`
                      }>

                      <div data-ev-id="ev_23de9e5773" className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span data-ev-id="ev_3bd87d0aae" className="font-medium">{item.label}</span>
                      </div>
                      {badgeCount > 0 &&
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full ${
                        active ?
                        'bg-white text-pumpkin' :
                        'bg-pumpkin text-white'}`
                        }>

                          {badgeCount > 99 ? '99+' : badgeCount}
                        </motion.span>
                      }
                    </Link>
                  </li>);

              })}
            </ul>
          </nav>

          {/* Footer */}
          <div data-ev-id="ev_3c7edac9a8" className="p-4 border-t border-border">
            <div data-ev-id="ev_dc853cc02d" className="flex items-center gap-2 mb-3">
              <button data-ev-id="ev_613fece3c3"
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">

                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span data-ev-id="ev_73340a71c8" className="text-sm">{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
              </button>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mb-2">

              <ChevronLeft className="w-4 h-4" />
              <span data-ev-id="ev_aae3c8a143" className="text-sm">Siteye Dön</span>
            </Link>
            <button data-ev-id="ev_c32b50c571"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">

              <LogOut className="w-4 h-4" />
              <span data-ev-id="ev_8235dad9a9" className="text-sm">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div data-ev-id="ev_d5795dd86a" className="lg:pl-64">
        {/* Top bar */}
        <header data-ev-id="ev_1f76210a6b" className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-lg border-b border-border lg:hidden">
          <button data-ev-id="ev_85cde74bd5"
          onClick={() => setSidebarOpen(true)}
          className="relative p-2 rounded-lg hover:bg-muted">

            <Menu className="w-6 h-6" />
            {/* Mobile badge indicator */}
            {badges.submissions + badges.comments + badges.chat > 0 &&
            <span data-ev-id="ev_4197c22ed5" className="absolute -top-1 -right-1 w-4 h-4 bg-pumpkin rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {badges.submissions + badges.comments + badges.chat > 9 ? '!' : badges.submissions + badges.comments + badges.chat}
              </span>
            }
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <span data-ev-id="ev_ed6f3312c5" className="text-xl">🥛🎃</span>
            <span data-ev-id="ev_511e320486" className="font-display font-bold text-pine">Admin</span>
          </Link>
          <button data-ev-id="ev_99e56ae769"
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted">

            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Page content */}
        <main data-ev-id="ev_a7d8434007" className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>);

}