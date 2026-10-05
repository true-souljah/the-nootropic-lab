// Klaro CMP configuration. One config used across all 8 region apps.
// Per-region wording stays generic; the regional YMYL disclaimer + Imprint
// page handle region-specific compliance language.
//
// To add a new tracked script: add a `<Script type="text/plain"
// data-name="..." />` block to the layout (external URL as `data-src`, never
// `src` — next/script preloads `src` before consent), then add a matching
// service entry below with the same `name` field.

import {
  onGoogleAnalyticsAccept,
  onGoogleAnalyticsDecline,
  onImpactDecline,
} from './analytics-consent';

export interface KlaroService {
  name: string;
  title: string;
  purposes: string[];
  cookies?: (string | RegExp)[];
  description: string;
  required?: boolean;
  default?: boolean;
  /** Activate the service's scripts at most once per page load. */
  onlyOnce?: boolean;
  /** Klaro runs these on every consent application (initial load included). */
  onAccept?: () => void;
  onDecline?: () => void;
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
          'Choose which analytics services may run on this site. You can change or withdraw your choice at any time via the “Cookie settings” link at the bottom of every page.',
      },
      acceptAll: 'Accept all',
      acceptSelected: 'Accept selected',
      decline: 'Decline all',
      // `ok` labels the accept button on the first-layer notice (Klaro
      // renders t(['ok']) there when acceptAll is on) — it must read as
      // consent, identical to the modal's accept-all label.
      ok: 'Accept all',
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
        description: 'Elija qué servicios de análisis pueden ejecutarse en este sitio. Puede cambiar o retirar su elección en cualquier momento mediante el enlace «Configuración de cookies» al final de cada página.',
      },
      acceptAll: 'Aceptar todo',
      acceptSelected: 'Aceptar selección',
      decline: 'Rechazar todo',
      ok: 'Aceptar todo',
      save: 'Guardar',
      close: 'Cerrar',
      privacyPolicy: { name: 'política de privacidad', text: 'Más información en nuestra {privacyPolicy}.' },
      purposes: {
        statistics: { title: 'Análisis y estadísticas', description: 'Medición de uso del sitio.' },
      },
    },
    de: {
      consentNotice: {
        title: 'Wir verwenden Analysetools zur Verbesserung dieser Seite',
        description:
          'Wir verwenden datenschutzfreundliche Analysetools, um zu verstehen, welche Inhalte nützlich sind. Wir verwenden keine Werbe-Cookies und verkaufen keine Daten an Dritte.',
        learnMore: 'Einstellungen',
      },
      consentModal: {
        title: 'Cookie- und Analyse-Einstellungen',
        description:
          'Wählen Sie aus, welche Analysedienste auf dieser Seite ausgeführt werden dürfen. Sie können Ihre Auswahl jederzeit über den Link „Cookie-Einstellungen“ am Ende jeder Seite ändern oder widerrufen.',
      },
      acceptAll: 'Alle akzeptieren',
      acceptSelected: 'Auswahl akzeptieren',
      decline: 'Alle ablehnen',
      ok: 'Alle akzeptieren',
      save: 'Speichern',
      close: 'Schließen',
      privacyPolicy: { name: 'Datenschutzerklärung', text: 'Weitere Informationen finden Sie in unserer {privacyPolicy}.' },
      purposes: {
        statistics: { title: 'Analyse und Statistik', description: 'Messung der Website-Nutzung.' },
      },
    },
    fr: {
      consentNotice: {
        title: 'Nous utilisons des outils d’analyse pour améliorer ce site',
        description:
          'Nous utilisons des outils d’analyse respectueux de la vie privée pour comprendre quels contenus sont utiles. Nous n’utilisons pas de cookies publicitaires et ne vendons pas de données à des tiers.',
        learnMore: 'Configurer',
      },
      consentModal: {
        title: 'Préférences de cookies et d’analyse',
        description: 'Choisissez quels services d’analyse peuvent s’exécuter sur ce site. Vous pouvez modifier ou retirer votre choix à tout moment via le lien « Paramètres des cookies » en bas de chaque page.',
      },
      acceptAll: 'Tout accepter',
      acceptSelected: 'Accepter la sélection',
      decline: 'Tout refuser',
      ok: 'Tout accepter',
      save: 'Enregistrer',
      close: 'Fermer',
      privacyPolicy: { name: 'politique de confidentialité', text: 'Pour plus d’informations, consultez notre {privacyPolicy}.' },
      purposes: {
        statistics: { title: 'Analyse et statistiques', description: 'Mesure de l’utilisation du site.' },
      },
    },
    // Quebec French (fr-CA). OQLF-compliant: "témoins" not "cookies",
    // "politique de confidentialité" stays as-is (already correct).
    // Used by the CA app's /fr/* nested routes per PR-C2b.
    'fr-CA': {
      consentNotice: {
        title: 'Nous utilisons des outils d’analyse pour améliorer ce site',
        description:
          'Nous utilisons des outils d’analyse respectueux de la vie privée pour comprendre quels contenus sont utiles. Nous n’utilisons pas de témoins publicitaires et ne vendons pas de données à des tiers.',
        learnMore: 'Configurer',
      },
      consentModal: {
        title: 'Préférences de témoins et d’analyse',
        description: 'Choisissez quels services d’analyse peuvent s’exécuter sur ce site. Vous pouvez modifier ou retirer votre choix en tout temps au moyen du lien « Paramètres des témoins » au bas de chaque page.',
      },
      acceptAll: 'Tout accepter',
      acceptSelected: 'Accepter la sélection',
      decline: 'Tout refuser',
      ok: 'Tout accepter',
      save: 'Enregistrer',
      close: 'Fermer',
      privacyPolicy: { name: 'politique de confidentialité', text: 'Pour plus d’informations, consultez notre {privacyPolicy}.' },
      purposes: {
        statistics: { title: 'Analyse et statistiques', description: 'Mesure de l’utilisation du site.' },
      },
    },
    pt: {
      consentNotice: {
        title: 'Usamos análise para melhorar este site',
        description:
          'Utilizamos ferramentas de análise que respeitam a privacidade para entender quais conteúdos são úteis. Não usamos cookies publicitários nem vendemos dados a terceiros.',
        learnMore: 'Configurar',
      },
      consentModal: {
        title: 'Preferências de cookies e análise',
        description: 'Escolha quais serviços de análise podem ser executados neste site. Pode alterar ou retirar a sua escolha a qualquer momento através da ligação «Preferências de cookies» no fim de cada página.',
      },
      acceptAll: 'Aceitar tudo',
      acceptSelected: 'Aceitar seleção',
      decline: 'Recusar tudo',
      ok: 'Aceitar tudo',
      save: 'Guardar',
      close: 'Fechar',
      privacyPolicy: { name: 'política de privacidade', text: 'Mais informações na nossa {privacyPolicy}.' },
      purposes: {
        statistics: { title: 'Análise e estatísticas', description: 'Medição de utilização do site.' },
      },
    },
    ja: {
      consentNotice: {
        title: 'サイト改善のために分析ツールを使用しています',
        description:
          'プライバシーに配慮した分析ツールを使い、どのコンテンツが読者に役立っているかを把握しています。広告クッキーは使用せず、データを第三者に販売することもありません。',
        learnMore: '設定',
      },
      consentModal: {
        title: 'Cookieと分析の設定',
        description: 'このサイトで実行できる分析サービスを選択してください。選択内容は、各ページ下部の「Cookie設定」からいつでも変更・撤回できます。',
      },
      acceptAll: 'すべて受け入れる',
      acceptSelected: '選択を受け入れる',
      decline: 'すべて拒否する',
      ok: 'すべて受け入れる',
      save: '保存',
      close: '閉じる',
      privacyPolicy: { name: 'プライバシーポリシー', text: '詳細は当社の{privacyPolicy}をご覧ください。' },
      purposes: {
        statistics: { title: '分析と統計', description: 'サイト利用状況の測定。' },
      },
    },
  },
  services: [
    // Cloudflare Web Analytics was declared here until 2026-10 but its beacon
    // token was never configured (layouts shipped the literal placeholder
    // REPLACE_WITH_CF_ANALYTICS_TOKEN_<REGION>), so it measured nothing —
    // removed rather than asking visitors to consent to a dead purpose.
    {
      name: 'google-analytics',
      title: 'Google Analytics 4',
      purposes: ['statistics'],
      cookies: [/^_ga/, /^_gid/, /^_gat/],
      description:
        'Measures site usage to inform editorial improvements. No personalised advertising; data not sold to third parties.',
      required: false,
      default: false,
      // Scripts run once per page; a withdraw → re-Accept on the same page
      // re-grants via onAccept instead of re-running gtag.js + config.
      onlyOnce: true,
      onAccept: onGoogleAnalyticsAccept,
      onDecline: onGoogleAnalyticsDecline,
    },
    {
      name: 'impact-com',
      title: 'Impact.com Affiliate Attribution',
      purposes: ['statistics'],
      cookies: [/^IR_/, /^_ire/],
      description:
        'Attributes affiliate clicks to this site so the operator earns commission on partner purchases. No personalised advertising; tracks click-attribution only.',
      required: false,
      default: false,
      onlyOnce: true,
      onDecline: onImpactDecline,
    },
  ],
  purposes: [
    { name: 'statistics', title: 'Analytics & statistics' },
  ],
};
