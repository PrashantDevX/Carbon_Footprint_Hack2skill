import { Bell, LogOut, Moon, Save, Sun, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, SelectField } from '@/components/ui/Field';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { DIET_OPTIONS, LANGUAGE_OPTIONS, THEME_STORAGE_KEY, VEHICLE_OPTIONS } from '@/lib/constants';
import type { UserProfile } from '@/types/user';

export function Settings() {
  const { user, updateProfile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const notifications = useNotifications();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Profile settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Changes are saved automatically and personalise your insights.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Display name" value={user.displayName} onChange={(event) => updateProfile({ displayName: event.target.value })} />
          <Field label="Location" value={user.location} onChange={(event) => updateProfile({ location: event.target.value })} />
          <Field label="Household size" type="number" min={1} value={user.householdSize} onChange={(event) => updateProfile({ householdSize: Number(event.target.value) })} />
          <SelectField label="Diet type" value={user.dietType} onChange={(event) => updateProfile({ dietType: event.target.value as UserProfile['dietType'] })} options={DIET_OPTIONS} />
          <SelectField label="Vehicle" value={user.vehicleType} onChange={(event) => updateProfile({ vehicleType: event.target.value as UserProfile['vehicleType'] })} options={VEHICLE_OPTIONS} />
          <SelectField label="Language" value={user.preferredLanguage} onChange={(event) => updateProfile({ preferredLanguage: event.target.value as UserProfile['preferredLanguage'] })} options={LANGUAGE_OPTIONS} />
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-forest-50 px-4 py-2 text-sm font-medium text-forest-700 dark:bg-forest-900/30 dark:text-forest-300">
          <Save size={16} aria-hidden="true" /> Saved automatically
        </div>
      </Card>

      <div className="grid gap-4 self-start">
        <Card>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Appearance</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Choose how EcoTrack looks.</p>
          <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Theme">
            <ThemeOption active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun size={18} aria-hidden="true" />} label="Light" />
            <ThemeOption active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon size={18} aria-hidden="true" />} label="Dark" />
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(THEME_STORAGE_KEY);
              setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-forest-600 dark:text-gray-400 dark:hover:text-forest-400"
          >
            <Monitor size={14} aria-hidden="true" /> Match system
          </button>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Account</h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-gradient-to-tr from-forest-400 to-forest-600 text-sm font-black text-white">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                user.displayName?.slice(0, 1).toUpperCase()
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user.isGuest ? 'Guest account' : user.email}
              </p>
            </div>
          </div>
          <Button className="mt-4 w-full" variant="danger" icon={<LogOut size={18} />} onClick={() => void handleSignOut()}>
            {user.isGuest ? 'Exit guest mode' : 'Sign out'}
          </Button>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Notifications</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Permission: <span className="font-semibold capitalize">{notifications.permission}</span>
          </p>
          <Button className="mt-4 w-full" icon={<Bell size={18} />} onClick={() => void notifications.requestPermission()}>
            Enable reminders
          </Button>
        </Card>
      </div>
    </div>
  );
}

function ThemeOption({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500',
        active
          ? 'border-forest-500 bg-forest-50 text-forest-700 dark:bg-forest-900/30 dark:text-forest-300'
          : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
