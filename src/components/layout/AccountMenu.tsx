import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function AccountMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 dark:hover:bg-gray-800"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-tr from-forest-400 to-forest-600 text-sm font-black text-white shadow-md ring-2 ring-white dark:ring-gray-800">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            user.displayName?.slice(0, 1).toUpperCase()
          )}
        </span>
        <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
              <p className="truncate font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
              {user.isGuest ? (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-earth-100 px-2 py-0.5 text-xs font-semibold text-earth-700 dark:bg-earth-900/40 dark:text-earth-300">
                  <UserIcon className="h-3 w-3" aria-hidden="true" /> Guest account
                </span>
              ) : (
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              )}
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate('/settings');
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <SettingsIcon className="h-4 w-4" aria-hidden="true" /> Settings
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> {user.isGuest ? 'Exit guest mode' : 'Sign out'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
