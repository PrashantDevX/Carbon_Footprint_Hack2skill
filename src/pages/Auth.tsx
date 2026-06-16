import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, getAuthErrorMessage } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NatureBackdrop } from '@/components/ui/NatureBackdrop';
import { Leaf, LogIn, AlertCircle, Loader2 } from 'lucide-react';

type Pending = 'google' | 'guest' | null;

export function Auth() {
  const { user, signInWithGoogle, signInAnonymously } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [pending, setPending] = useState<Pending>(null);

  // If user is already logged in, redirect to where they came from or dashboard
  if (user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setPending('google');
      await signInWithGoogle();
      navigate('/');
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
    } finally {
      setPending(null);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setError('');
      setPending('guest');
      await signInAnonymously();
      navigate('/');
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
    } finally {
      setPending(null);
    }
  };

  const isLoading = pending !== null;

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-forest-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <NatureBackdrop />
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <div className="mx-auto h-16 w-16 bg-forest-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-forest-500/30 transform rotate-3">
          <Leaf className="w-10 h-10 -rotate-3" />
        </div>
        <h2 className="mt-6 text-3xl font-display font-bold text-gray-900 dark:text-white">
          Welcome to EcoTrack
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your personal AI-powered carbon footprint intelligence platform.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20 dark:border-gray-700/50">
          
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              aria-busy={pending === 'google'}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              )}
              {pending === 'google' ? 'Connecting…' : 'Continue with Google'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
              </div>
            </div>

            <button
              onClick={handleAnonymousSignIn}
              disabled={isLoading}
              aria-busy={pending === 'guest'}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending === 'guest' ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <LogIn className="w-5 h-5" aria-hidden="true" />
              )}
              {pending === 'guest' ? 'Setting up…' : 'Explore as Guest'}
            </button>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
              Guest mode lets you explore instantly. Sign in with Google to sync your
              progress across devices.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
