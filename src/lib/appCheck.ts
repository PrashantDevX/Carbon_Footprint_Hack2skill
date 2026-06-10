import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from './firebase';

export function initAppCheck() {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!app || !siteKey) return;

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true
  });
}
