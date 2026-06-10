import { useState } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification === 'undefined' ? 'denied' : Notification.permission
  );

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return 'denied' as NotificationPermission;
    const next = await Notification.requestPermission();
    setPermission(next);
    if (next === 'granted') {
      new Notification('EcoTrack reminders enabled', {
        body: 'We will nudge you when a goal needs attention.'
      });
    }
    return next;
  };

  return {
    permission,
    enabled: permission === 'granted',
    requestPermission
  };
}
