import { Bell, LogIn, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, SelectField } from '@/components/ui/Field';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import type { UserProfile } from '@/types/user';

export function Settings() {
  const { user, updateProfile, signInAnonymously } = useAuth();
  const notifications = useNotifications();

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card>
        <h1 className="text-2xl font-black">Profile settings</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Display name" value={user.displayName} onChange={(event) => updateProfile({ displayName: event.target.value })} />
          <Field label="Location" value={user.location} onChange={(event) => updateProfile({ location: event.target.value })} />
          <Field label="Household size" type="number" value={user.householdSize} onChange={(event) => updateProfile({ householdSize: Number(event.target.value) })} />
          <SelectField label="Diet type" value={user.dietType} onChange={(event) => updateProfile({ dietType: event.target.value as UserProfile['dietType'] })} options={[
            { value: 'vegan', label: 'Vegan' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'mixed', label: 'Mixed' },
            { value: 'meat-heavy', label: 'Meat-heavy' }
          ]} />
          <SelectField label="Vehicle" value={user.vehicleType} onChange={(event) => updateProfile({ vehicleType: event.target.value as UserProfile['vehicleType'] })} options={[
            { value: 'petrol', label: 'Petrol' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'electric', label: 'Electric' }
          ]} />
          <SelectField label="Language" value={user.preferredLanguage} onChange={(event) => updateProfile({ preferredLanguage: event.target.value as UserProfile['preferredLanguage'] })} options={[
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'Hindi' },
            { value: 'es', label: 'Spanish' }
          ]} />
        </div>
        <Button className="mt-5" icon={<Save size={18} />}>Saved automatically</Button>
      </Card>
      <div className="grid gap-4 self-start">
        <Card>
          <h2 className="text-xl font-black">Authentication</h2>
          <p className="mt-2 text-sm text-slate-600">Firebase Auth can be enabled with Google, email/password, and anonymous trial mode.</p>
          <Button className="mt-4 w-full" variant="secondary" icon={<LogIn size={18} />} onClick={signInAnonymously}>Use trial profile</Button>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Notifications</h2>
          <p className="mt-2 text-sm text-slate-600">Permission: {notifications.permission}</p>
          <Button className="mt-4 w-full" icon={<Bell size={18} />} onClick={() => void notifications.requestPermission()}>Enable reminders</Button>
        </Card>
      </div>
    </div>
  );
}
