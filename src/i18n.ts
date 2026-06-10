import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { dashboard: 'Dashboard', calculator: 'Calculator' } },
    hi: { translation: { dashboard: 'डैशबोर्ड', calculator: 'कैलकुलेटर' } },
    es: { translation: { dashboard: 'Panel', calculator: 'Calculadora' } }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
