import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Bot, Calculator, Camera, Flag, MapPinned, Medal, Settings, Sprout } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SkipLink } from '@/components/ui/SkipLink';
import { cn } from '@/lib/utils';

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

  return (
    <div className="min-h-screen bg-mist text-ink">
      <SkipLink />
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-leaf text-white">
            <Sprout aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-black">EcoTrack</p>
            <p className="text-xs text-slate-500">Carbon intelligence</p>
          </div>
        </div>
        <nav className="grid gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100',
                  isActive && 'bg-teal-50 text-leaf'
                )
              }
            >
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="lg:hidden">
              <p className="text-lg font-black">EcoTrack</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user.displayName}</p>
                <p className="text-xs text-slate-500">{user.points} points</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-sun text-sm font-black text-white">
                {user.displayName.slice(0, 1)}
              </div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-2 py-2 lg:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'grid min-w-16 justify-items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-600',
                    isActive && 'bg-teal-50 text-leaf'
                  )
                }
              >
                <item.icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main id="main-content" className="px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
