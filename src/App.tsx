/**
 * ⚠️ ROUTING RULES:
 * - Router is in main.tsx. Do NOT add another <BrowserRouter> here or anywhere.
 * - Use <Routes> + <Route> components ONLY. Do NOT use useRoutes().
 * - STATIC IMPORTS ONLY — no React.lazy() or dynamic import().
 * - Import from 'react-router' — NOT 'react-router-dom' (does not exist).
 */
import { Routes, Route } from 'react-router';

// Public Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import PostDetail from '@/pages/PostDetail';
import Gallery from '@/pages/Gallery';
import SubmitAnonymous from '@/pages/SubmitAnonymous';
import TagPosts from '@/pages/TagPosts';
import Search from '@/pages/Search';
import Sitemap from '@/pages/Sitemap';
import NotFound from '@/pages/NotFound';

// Auth Pages
import AdminLogin from '@/pages/admin/AdminLogin';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminPosts from '@/pages/admin/AdminPosts';
import AdminPostEditor from '@/pages/admin/AdminPostEditor';
import AdminGallery from '@/pages/admin/AdminGallery';
import AdminComments from '@/pages/admin/AdminComments';
import AdminSubmissions from '@/pages/admin/AdminSubmissions';
import AdminSettings from '@/pages/admin/AdminSettings';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function App() {
	return (
		<Routes>
			{/* Public Routes */}
			<Route element={<PublicLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/hakkimda" element={<About />} />
				<Route path="/yazi/:slug" element={<PostDetail />} />
				<Route path="/galeri" element={<Gallery />} />
				<Route path="/anonim-yazi-gonder" element={<SubmitAnonymous />} />
				<Route path="/etiket/:slug" element={<TagPosts />} />
				<Route path="/ara" element={<Search />} />
				<Route path="/site-haritasi" element={<Sitemap />} />
			</Route>
			
			{/* Admin Auth */}
			<Route path="/admin/giris" element={<AdminLogin />} />
			
			{/* Admin Routes - Protected */}
			<Route path="/admin" element={
				<ProtectedRoute>
					<AdminLayout />
				</ProtectedRoute>
			}>
				<Route index element={<AdminDashboard />} />
				<Route path="yazilar" element={<AdminPosts />} />
				<Route path="yazilar/yeni" element={<AdminPostEditor />} />
				<Route path="yazilar/:id" element={<AdminPostEditor />} />
				<Route path="galeri" element={<AdminGallery />} />
				<Route path="yorumlar" element={<AdminComments />} />
				<Route path="anonim-yazilar" element={<AdminSubmissions />} />
				<Route path="ayarlar" element={<AdminSettings />} />
			</Route>
			
			{/* 404 */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
