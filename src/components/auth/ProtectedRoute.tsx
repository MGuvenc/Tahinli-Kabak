import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div data-ev-id="ev_f002288ac9" className="min-h-screen bg-background flex items-center justify-center">
        <div data-ev-id="ev_3cd7c3e078" className="text-center">
          <div data-ev-id="ev_8bcf082764" className="animate-spin w-10 h-10 border-4 border-pumpkin border-t-transparent rounded-full mx-auto mb-4" />
          <p data-ev-id="ev_2d698b0dd0" className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>);

  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/giris" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}