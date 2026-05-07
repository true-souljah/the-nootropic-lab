// Klaro CMP configuration. One config used across all 8 region apps.
// Per-region wording stays generic; the regional YMYL disclaimer + Imprint
// page handle region-specific compliance language.
//
// To add a new tracked script: add a `<Script type="text/plain"
// data-name="..." />` block to the layout, then add a matching service
// entry below with the same `name` field.

export interface KlaroService {
  name: string;
  title: string;
  purposes: string[];
  cookies?: (string | RegExp)[];
  description: string;
  required?: boolean;
  default?: boolean;
}

export interface KlaroConfig {
  version: number;
  elementID: string;
  storageMethod: 'cookie' | 'localStorage';
  cookieName: string;
  cookieExpiresAfterDays: number;
  default: boolean;
  mustConsent: boolean;
  acceptAll: boolean;
  hideDeclineAll: boolean;
  hideLearnMore: boolean;
  noticeAsModal: boolean;
  privacyPolicy: string;
  translations: Record<string, unknown>;
  services: KlaroService[];
  purposes: { name: string; title: string }[];
}

export const klaroConfig: KlaroConfig = {
  version: 1,
  elementID: 'klaro',
  storageMethod: 'cookie',
  cookieName: 'klaro',
  cookieExpiresAfterDays: 365,
  default: false,
  mustConsent: false,
  acceptAll: true,
  hideDeclineAll: false,
  hideLearnMore: false,
  noticeAsModal: false,
  privacyPolicy: '/privacy-policy/',
  translations: {
    zz: {
      privacyPolicyUrl: '/privacy-policy/',
    },
    en: {
      consentNotice: {
        title: 'We use analytics to improve this site',
        description:
          'We use privacy-respecting analytics to understand which content readers find useful. We do not use advertising cookies and do not sell data to third parties.',
        learnMore: 'Configure',
      },
      consentModal: {
        title: 'Cookie & analytics preferences',
        description:
          'Choose which analytics services may run on this site. You can change this later via the privacy policy footer link.',
      },
      acceptAll: 'Accept all',
      acceptSelected: 'Accept selected',
      decline: 'Decline all',
      ok: 'Save',
      save: 'Save',
      close: 'Close',
      poweredBy: '',
      privacyPolicy: { name: 'privacy policy', text: 'For details see our {privacyPolicy}.' },
      purposes: {
        statistics: { title: 'Analytics & statistics', description: 'Site-usage measurement.' },
      },
      service: {
        disableAll: { title: 'Disable all', description: 'Disable all services.' },
        required: { title: 'Required', description: 'Required for the site to function.' },
        purposes: 'Purposes',
        purpose: 'Purpose',
        contextualConsent: { description: '', acceptOnce: 'Accept', acceptAlways: 'Accept always' },
      },
    },
    es: {
      consentNotice: {
        title: 'Usamos análisis para mejorar este sitio',
        description:
          'Utilizamos análisis respetuosos con la privacidad para entender qué contenido es útil. No usamos cookies publicitarias ni vendemos datos.',
        learnMore: 'Configurar',
      },
      consentModal: {
        title: 'Preferencias de cookies y análisis',
        description: 'Elija qué servicios de análisis pueden ejecutarse en este sitio.',
      },
      acceptAll: 'Aceptar todo',
      acceptSelected: 'Aceptar selección',
      decline: 'Rechazar todo',
      ok: 'Guardar',
      save: 'Guardar',
      close: 'Cerrar',
      privacyPolicy: { name: 'política de privacidad', text: 'Más información en nuestra {privacyPolicy}.' },
      purposes: {
        statistics: { title: 'Análisis y estadísticas', description: 'Medición de uso del sitio.' },
      },
    },
  },
  services: [
    {
      name: 'cloudflare-insights',
      title: 'Cloudflare Web Analytics',
      purposes: ['statistics'],
      cookies: [],
      description:
        'Privacy-respecting visitor counting. No cross-site tracking, no cookies.',
      required: false,
      default: false,
    },
    {
      name: 'google-analytics',
      title: 'Google Analytics 4',
      purposes: ['statistics'],
      cookies: [/^_ga/, /^_gid/, /^_gat/],
      description:
        'Measures site usage to inform editorial improvements. No personalised advertising; data not sold to third parties.',
      required: false,
      default: false,
    },
  ],
  purposes: [
    { name: 'statistics', title: 'Analytics & statistics' },
  ],
};
