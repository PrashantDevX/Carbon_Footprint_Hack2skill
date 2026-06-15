import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from './firebase';

export function initAppCheck() {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!app || !siteKey) return;

  if (!siteKey.startsWith('6L')) {
    console.warn('Firebase App Check skipped: VITE_RECAPTCHA_SITE_KEY is not a reCAPTCHA site key.');
    return;
  }

  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true
    });
  } catch (error) {
    console.warn('Firebase App Check initialization failed:', error);
  }
}
