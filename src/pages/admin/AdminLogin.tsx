import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Home, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get the page user was trying to access
  const from = (location.state as {from?: {pathname: string;};})?.from?.pathname || '/admin';

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setSubmitting(false);
    }
    // If successful, the useEffect will handle redirect
  };

  // Show loading while checking initial auth state
  if (loading) {
    return (
      <div data-ev-id="ev_99ebf47520" className="min-h-screen bg-background flex items-center justify-center">
        <div data-ev-id="ev_49d6683b50" className="animate-spin w-10 h-10 border-4 border-pumpkin border-t-transparent rounded-full" />
      </div>);

  }

  return (
    <div data-ev-id="ev_d39c675544" className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">

        {/* Logo */}
        <div data-ev-id="ev_9835842b01" className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span data-ev-id="ev_61ea460859" className="text-4xl">🥛🎃</span>
          </Link>
          <h1 data-ev-id="ev_ac9a9a5c60" className="font-display text-3xl font-bold text-pine">tahinlikabak</h1>
          <p data-ev-id="ev_28fbddfa4d" className="text-muted-foreground mt-2">Admin Paneli</p>
        </div>

        {/* Login Form */}
        <div data-ev-id="ev_fc38ed8e8e" className="bg-card rounded-2xl p-8 shadow-soft border border-border">
          <h2 data-ev-id="ev_daee191360" className="font-display text-xl font-bold text-center mb-6">Giriş Yap</h2>

          <form data-ev-id="ev_1e3ef99567" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error &&
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">

                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span data-ev-id="ev_48df7f1b13">{error}</span>
              </motion.div>
            }

            <div data-ev-id="ev_76a3aa9fe2">
              <label data-ev-id="ev_8e1c1fa8ba" className="block text-sm font-medium mb-1">E-posta</label>
              <input data-ev-id="ev_b9be90eff7"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
              placeholder="admin@tahinlikabak.com"
              autoComplete="email"
              disabled={submitting} />

            </div>

            <div data-ev-id="ev_a9f4a58990">
              <label data-ev-id="ev_ac61ce05fe" className="block text-sm font-medium mb-1">Şifre</label>
              <div data-ev-id="ev_f902e54613" className="relative">
                <input data-ev-id="ev_be453a0a6d"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={submitting} />

                <button data-ev-id="ev_609d0a2fc6"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                tabIndex={-1}>

                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button data-ev-id="ev_a6705fb379"
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 w-full py-3 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 mt-2">

              {submitting ?
              <div data-ev-id="ev_7ee488455d" className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :

              <>
                  Giriş Yap
                  <ArrowRight className="w-5 h-5" />
                </>
              }
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div data-ev-id="ev_0e8450c3de" className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">

            <Home className="w-4 h-4" />
            <span data-ev-id="ev_1df6ea26b9">Siteye Dön</span>
          </Link>
        </div>

        {/* Security notice */}
        <div data-ev-id="ev_cd61ad28e1" className="mt-8 p-4 bg-muted/50 rounded-xl text-center">
          <p data-ev-id="ev_958d42fb31" className="text-sm text-muted-foreground">
            🔒 Bu alan sadece yetkili kullanıcılar içindir.
          </p>
        </div>
      </motion.div>
    </div>);

}