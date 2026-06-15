import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Bot, Calculator, Camera, Flag, MapPinned, Medal, Settings, Sprout } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SkipLink } from '@/components/ui/SkipLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/calculator', label: 'Calculator', icon: Calculator },
  { to: '/assistant', label: 'Assistant', icon: Bot },
  { to: '/scanner', label: 'Scanner', icon: Camera },
  { to: '/map', label: 'Map', icon: MapPinned },
  { to: '/goals', label: 'Goals', icon: Flag },
  { to: '/leaderboard', label: 'Leaders', icon: Medal },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function AppLayout() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-forest-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <SkipLink />
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl px-4 py-5 lg:block shadow-2xl shadow-forest-900/5 dark:shadow-black/20">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 text-white shadow-lg shadow-forest-500/30">
            <Sprout aria-hidden="true" className="w-6 h-6" />
          </span>
          <div>
            <p className="text-xl font-display font-black tracking-tight text-gray-900 dark:text-white">EcoTrack</p>
            <p className="text-xs font-medium text-forest-600 dark:text-forest-400">Carbon Intelligence</p>
          </div>
        </div>
        <nav className="grid gap-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all duration-200',
                  isActive 
                    ? 'bg-forest-100 dark:bg-forest-900/40 text-forest-700 dark:text-forest-300 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={20} 
                    aria-hidden="true" 
                    className={cn(
                      "transition-transform duration-200", 
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} 
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl transition-colors duration-300">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 text-white">
                <Sprout aria-hidden="true" className="w-4 h-4" />
              </span>
              <p className="text-lg font-display font-black text-gray-900 dark:text-white">EcoTrack</p>
            </div>
            <div className="ml-auto flex items-center gap-3 sm:gap-4">
              <ThemeToggle />
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.displayName}</p>
                <p className="text-xs font-medium text-forest-600 dark:text-forest-400">{user.points || 0} points</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="grid h-10 w-10 overflow-hidden place-items-center rounded-full bg-gradient-to-tr from-earth-400 to-earth-600 text-sm font-black text-white shadow-md border-2 border-white dark:border-gray-800"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  user.displayName?.slice(0, 1).toUpperCase()
                )}
              </motion.div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-gray-200/50 dark:border-gray-800/50 px-2 py-2 lg:hidden scrollbar-hide" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'grid min-w-[72px] justify-items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition-colors duration-200',
                    isActive 
                      ? 'bg-forest-100 dark:bg-forest-900/40 text-forest-700 dark:text-forest-300' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )
                }
              >
                <item.icon size={20} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
