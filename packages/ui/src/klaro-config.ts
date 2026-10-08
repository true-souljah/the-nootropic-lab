// Klaro CMP configuration. One config used across all 8 region apps.
// Per-region wording stays generic; the regional YMYL disclaimer + Imprint
// page handle region-specific compliance language.
//
// To add a new tracked script: add a `<Script type="text/plain"
// data-name="..." />` block to the layout (external URL as `data-src`, never
// `src` — next/script preloads `src` before consent), then add a matching
// service entry below with the same `name` field.
//
// Consent purposes (operator decision 6, 2026-10-06 — Cyprus cookie guidance:
// where cookies serve several purposes, visitors must be able to choose each
// one freely): Google Analytics is the "statistics" purpose (Analytics) and
// Impact.com the separate "affiliate" purpose (Affiliate attribution). The
// first layer keeps one-click Accept all / Decline all; "Configure" opens the
// modal with one toggle per purpose, off until the visitor switches it on.
// Klaro stores consent per service (`{"google-analytics":…,"impact-com":…}`),
// so choices stored before the split keep their meaning unchanged.
//
// Every string the notice and the modal render is set here for every locale
// (see consent-basic-mode.test.ts) rather than left to Klaro's bundled
// defaults. Service titles/descriptions live in each service's own
// `translations`: Klaro prefers a service-level `title`/`description` over
// translations, so those fields are not set directly (until 2026-10 they were,
// and the modal showed the English service descriptions in every locale).

import {
  onGoogleAnalyticsAccept,
  onGoogleAnalyticsDecline,
  onImpactDecline,
} from './analytics-consent';

export interface KlaroService {
  name: string;
  purposes: string[];
  cookies?: (string | RegExp)[];
  /** Per-locale title/description (`zz` = every locale). Klaro reads these when the service sets no `title`/`description`. */
  translations: Record<string, { title?: string; description?: string }>;
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
  /**
   * Render `consentNotice.title` as the notice's `<h2 id="id-cookie-title">`.
   * The notice (role="dialog") always sets aria-labelledby="id-cookie-title",
   * so without the heading the dialog has no accessible name.
   */
  showNoticeTitle: boolean;
  /** Hide Klaro's "powered by" link (it rendered as "[missing translation: en/poweredBy]"). */
  disablePoweredBy: boolean;
  privacyPolicy: string;
  translations: Record<string, unknown>;
  services: KlaroService[];
  /** Order of the purpose toggles in the modal. */
  purposeOrder: string[];
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
  // Visually hidden in klaro-overrides.css: it only names the dialog.
  showNoticeTitle: true,
  disablePoweredBy: true,
  privacyPolicy: '/privacy-policy/',
  translations: {
    zz: {
      privacyPolicyUrl: '/privacy-policy/',
    },
    en: {
      consentNotice: {
        title: 'Cookies for analytics and affiliate attribution',
        description:
          'With your consent we use two optional services, each for its own purpose: Google Analytics measures which content readers find useful (Analytics), and Impact.com credits purchases you make on partner sites after following one of our links (Affiliate attribution). Nothing runs until you choose; “Configure” lets you allow each purpose separately. We do not use advertising cookies and do not sell data to third parties.',
        learnMore: 'Configure',
      },
      consentModal: {
        title: 'Cookie preferences',
        description:
          'Analytics and affiliate attribution are separate purposes: switch on only the ones you want. Both stay off until you switch them on. You can change or withdraw your choice for each purpose at any time via the “Cookie settings” link at the bottom of every page.',
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
      privacyPolicy: { name: 'privacy policy', text: 'For details see our {privacyPolicy}.' },
      purposes: {
        statistics: {
          title: 'Analytics',
          description: 'Google Analytics 4 measures which pages are read (cookies _ga, _ga_<id>).',
        },
        affiliate: {
          title: 'Affiliate attribution',
          description:
            'Impact.com credits a purchase on a partner site to this site after you follow one of our links (cookies IR_*).',
        },
      },
      purposeItem: { service: 'service', services: 'services' },
      service: {
        disableAll: { title: 'All purposes', description: 'Switch all optional purposes on or off at once.' },
        required: { title: 'Required', description: 'Required for the site to function.' },
        purposes: 'Purposes',
        purpose: 'Purpose',
        contextualConsent: { description: '', acceptOnce: 'Accept', acceptAlways: 'Accept always' },
      },
    },
    es: {
      consentNotice: {
        title: 'Cookies de análisis y de atribución de afiliados',
        description:
          'Con su consentimiento usamos dos servicios opcionales, cada uno con su propia finalidad: Google Analytics mide qué contenido resulta útil a los lectores (Análisis) e Impact.com atribuye a este sitio las compras que hace en sitios socios después de seguir uno de nuestros enlaces (Atribución de afiliados). No se ejecuta nada hasta que elija; con «Configurar» puede permitir cada finalidad por separado. No usamos cookies publicitarias ni vendemos datos.',
        learnMore: 'Configurar',
      },
      consentModal: {
        title: 'Preferencias de cookies',
        description: 'El análisis y la atribución de afiliados son finalidades separadas: active solo las que quiera. Ambas permanecen desactivadas hasta que las active. Puede cambiar o retirar su elección para cada finalidad en cualquier momento mediante el enlace «Configuración de cookies» al final de cada página.',
      },
      acceptAll: 'Aceptar todo',
      acceptSelected: 'Aceptar selección',
      decline: 'Rechazar todo',
      ok: 'Aceptar todo',
      save: 'Guardar',
      close: 'Cerrar',
      privacyPolicy: { name: 'política de privacidad', text: 'Más información en nuestra {privacyPolicy}.' },
      purposes: {
        statistics: {
          title: 'Análisis',
          description: 'Google Analytics 4 mide qué páginas se leen (cookies _ga, _ga_<id>).',
        },
        affiliate: {
          title: 'Atribución de afiliados',
          description:
            'Impact.com atribuye a este sitio una compra en un sitio socio después de que siga uno de nuestros enlaces (cookies IR_*).',
        },
      },
      purposeItem: { service: 'servicio', services: 'servicios' },
      service: {
        disableAll: { title: 'Todas las finalidades', description: 'Active o desactive todas las finalidades opcionales a la vez.' },
        required: { title: 'Necesario', description: 'Necesario para que el sitio funcione.' },
        purposes: 'Finalidades',
        purpose: 'Finalidad',
      },
    },
    de: {
      consentNotice: {
        title: 'Cookies für Analyse und Affiliate-Zuordnung',
        description:
          'Mit Ihrer Einwilligung nutzen wir zwei optionale Dienste mit jeweils eigenem Zweck: Google Analytics misst, welche Inhalte für Leser nützlich sind (Analyse), und Impact.com ordnet Käufe auf Partnerseiten, die Sie nach einem Klick auf einen unserer Links tätigen, dieser Seite zu (Affiliate-Zuordnung). Nichts wird ausgeführt, bevor Sie wählen; unter „Einstellungen“ können Sie jeden Zweck einzeln erlauben. Wir verwenden keine Werbe-Cookies und verkaufen keine Daten an Dritte.',
        learnMore: 'Einstellungen',
      },
      consentModal: {
        title: 'Cookie-Einstellungen',
        description:
          'Analyse und Affiliate-Zuordnung sind getrennte Zwecke: Aktivieren Sie nur die, die Sie möchten. Beide bleiben deaktiviert, bis Sie sie einschalten. Sie können Ihre Auswahl für jeden Zweck jederzeit über den Link „Cookie-Einstellungen“ am Ende jeder Seite ändern oder widerrufen.',
      },
      acceptAll: 'Alle akzeptieren',
      acceptSelected: 'Auswahl akzeptieren',
      decline: 'Alle ablehnen',
      ok: 'Alle akzeptieren',
      save: 'Speichern',
      close: 'Schließen',
      privacyPolicy: { name: 'Datenschutzerklärung', text: 'Weitere Informationen finden Sie in unserer {privacyPolicy}.' },
      purposes: {
        statistics: {
          title: 'Analyse',
          description: 'Google Analytics 4 misst, welche Seiten gelesen werden (Cookies _ga, _ga_<id>).',
        },
        affiliate: {
          title: 'Affiliate-Zuordnung',
          description:
            'Impact.com ordnet einen Kauf auf einer Partnerseite dieser Seite zu, nachdem Sie einem unserer Links gefolgt sind (Cookies IR_*).',
        },
      },
      purposeItem: { service: 'Dienst', services: 'Dienste' },
      service: {
        disableAll: { title: 'Alle Zwecke', description: 'Alle optionalen Zwecke auf einmal ein- oder ausschalten.' },
        required: { title: 'Erforderlich', description: 'Für die Funktion der Seite erforderlich.' },
        purposes: 'Zwecke',
        purpose: 'Zweck',
      },
    },
    fr: {
      consentNotice: {
        title: 'Cookies d’analyse et d’attribution d’affiliation',
        description:
          'Avec votre consentement, nous utilisons deux services facultatifs, chacun pour sa propre finalité : Google Analytics mesure quels contenus sont utiles aux lecteurs (Analyse) et Impact.com attribue à ce site les achats que vous effectuez sur des sites partenaires après avoir suivi l’un de nos liens (Attribution d’affiliation). Rien ne s’exécute avant votre choix ; « Configurer » vous permet d’autoriser chaque finalité séparément. Nous n’utilisons pas de cookies publicitaires et ne vendons pas de données à des tiers.',
        learnMore: 'Configurer',
      },
      consentModal: {
        title: 'Préférences de cookies',
        description: 'L’analyse et l’attribution d’affiliation sont des finalités distinctes : activez uniquement celles que vous souhaitez. Les deux restent désactivées tant que vous ne les activez pas. Vous pouvez modifier ou retirer votre choix pour chaque finalité à tout moment via le lien « Paramètres des cookies » en bas de chaque page.',
      },
      acceptAll: 'Tout accepter',
      acceptSelected: 'Accepter la sélection',
      decline: 'Tout refuser',
      ok: 'Tout accepter',
      save: 'Enregistrer',
      close: 'Fermer',
      privacyPolicy: { name: 'politique de confidentialité', text: 'Pour plus d’informations, consultez notre {privacyPolicy}.' },
      purposes: {
        statistics: {
          title: 'Analyse',
          description: 'Google Analytics 4 mesure quelles pages sont lues (cookies _ga, _ga_<id>).',
        },
        affiliate: {
          title: 'Attribution d’affiliation',
          description:
            'Impact.com attribue à ce site un achat effectué sur un site partenaire après que vous avez suivi l’un de nos liens (cookies IR_*).',
        },
      },
      purposeItem: { service: 'service', services: 'services' },
      service: {
        disableAll: { title: 'Toutes les finalités', description: 'Activer ou désactiver toutes les finalités facultatives en une seule fois.' },
        required: { title: 'Nécessaire', description: 'Nécessaire au fonctionnement du site.' },
        purposes: 'Finalités',
        purpose: 'Finalité',
      },
    },
    // Quebec French (fr-CA). OQLF-compliant: "témoins" not "cookies",
    // "politique de confidentialité" stays as-is (already correct).
    // Used by the CA app's /fr/* nested routes per PR-C2b.
    'fr-CA': {
      consentNotice: {
        title: 'Témoins d’analyse et d’attribution d’affiliation',
        description:
          'Avec votre consentement, nous utilisons deux services facultatifs, chacun pour sa propre finalité : Google Analytics mesure quels contenus sont utiles aux lecteurs (Analyse) et Impact.com attribue à ce site les achats que vous effectuez sur des sites partenaires après avoir suivi l’un de nos liens (Attribution d’affiliation). Rien ne s’exécute avant votre choix; « Configurer » vous permet d’autoriser chaque finalité séparément. Nous n’utilisons pas de témoins publicitaires et ne vendons pas de données à des tiers.',
        learnMore: 'Configurer',
      },
      consentModal: {
        title: 'Préférences de témoins',
        description: 'L’analyse et l’attribution d’affiliation sont des finalités distinctes : activez uniquement celles que vous souhaitez. Les deux restent désactivées tant que vous ne les activez pas. Vous pouvez modifier ou retirer votre choix pour chaque finalité en tout temps au moyen du lien « Paramètres des témoins » au bas de chaque page.',
      },
      acceptAll: 'Tout accepter',
      acceptSelected: 'Accepter la sélection',
      decline: 'Tout refuser',
      ok: 'Tout accepter',
      save: 'Enregistrer',
      close: 'Fermer',
      privacyPolicy: { name: 'politique de confidentialité', text: 'Pour plus d’informations, consultez notre {privacyPolicy}.' },
      purposes: {
        statistics: {
          title: 'Analyse',
          description: 'Google Analytics 4 mesure quelles pages sont lues (témoins _ga, _ga_<id>).',
        },
        affiliate: {
          title: 'Attribution d’affiliation',
          description:
            'Impact.com attribue à ce site un achat effectué sur un site partenaire après que vous avez suivi l’un de nos liens (témoins IR_*).',
        },
      },
      purposeItem: { service: 'service', services: 'services' },
      service: {
        disableAll: { title: 'Toutes les finalités', description: 'Activer ou désactiver toutes les finalités facultatives en une seule fois.' },
        required: { title: 'Nécessaire', description: 'Nécessaire au fonctionnement du site.' },
        purposes: 'Finalités',
        purpose: 'Finalité',
      },
    },
    pt: {
      consentNotice: {
        title: 'Cookies de análise e de atribuição de afiliados',
        description:
          'Com o seu consentimento, utilizamos dois serviços opcionais, cada um com a sua própria finalidade: o Google Analytics mede que conteúdos são úteis para os leitores (Análise) e a Impact.com atribui a este site as compras que faz em sites parceiros depois de seguir uma das nossas ligações (Atribuição de afiliados). Nada é executado até escolher; em «Configurar» pode permitir cada finalidade separadamente. Não usamos cookies publicitários nem vendemos dados a terceiros.',
        learnMore: 'Configurar',
      },
      consentModal: {
        title: 'Preferências de cookies',
        description: 'A análise e a atribuição de afiliados são finalidades separadas: ative apenas as que pretende. Ambas ficam desativadas até as ativar. Pode alterar ou retirar a sua escolha para cada finalidade a qualquer momento através da ligação «Preferências de cookies» no fim de cada página.',
      },
      acceptAll: 'Aceitar tudo',
      acceptSelected: 'Aceitar seleção',
      decline: 'Recusar tudo',
      ok: 'Aceitar tudo',
      save: 'Guardar',
      close: 'Fechar',
      privacyPolicy: { name: 'política de privacidade', text: 'Mais informações na nossa {privacyPolicy}.' },
      purposes: {
        statistics: {
          title: 'Análise',
          description: 'O Google Analytics 4 mede que páginas são lidas (cookies _ga, _ga_<id>).',
        },
        affiliate: {
          title: 'Atribuição de afiliados',
          description:
            'A Impact.com atribui a este site uma compra num site parceiro depois de seguir uma das nossas ligações (cookies IR_*).',
        },
      },
      purposeItem: { service: 'serviço', services: 'serviços' },
      service: {
        disableAll: { title: 'Todas as finalidades', description: 'Ative ou desative todas as finalidades opcionais de uma só vez.' },
        required: { title: 'Necessário', description: 'Necessário para o funcionamento do site.' },
        purposes: 'Finalidades',
        purpose: 'Finalidade',
      },
    },
    ja: {
      consentNotice: {
        title: '分析とアフィリエイト計測のためのCookie',
        description:
          '同意いただいた場合に限り、目的の異なる2つの任意サービスを使用します。Google Analyticsはどのコンテンツが読者に役立っているかを測定し（分析）、Impact.comは当サイトのリンクから移動した提携サイトでの購入を当サイトに帰属させます（アフィリエイト計測）。選択するまで何も実行されません。「設定」から目的ごとに個別に許可できます。広告クッキーは使用せず、データを第三者に販売することもありません。',
        learnMore: '設定',
      },
      consentModal: {
        title: 'Cookieの設定',
        description: '分析とアフィリエイト計測は別々の目的です。必要なものだけをオンにしてください。どちらもオンにするまでオフのままです。目的ごとの選択は、各ページ下部の「Cookie設定」からいつでも変更・撤回できます。',
      },
      acceptAll: 'すべて受け入れる',
      acceptSelected: '選択を受け入れる',
      decline: 'すべて拒否する',
      ok: 'すべて受け入れる',
      save: '保存',
      close: '閉じる',
      privacyPolicy: { name: 'プライバシーポリシー', text: '詳細は当社の{privacyPolicy}をご覧ください。' },
      purposes: {
        statistics: {
          title: '分析',
          description: 'Google Analytics 4が、どのページが読まれているかを測定します（Cookie：_ga、_ga_<id>）。',
        },
        affiliate: {
          title: 'アフィリエイト計測',
          description:
            '当サイトのリンクから提携サイトに移動して購入した場合、Impact.comがその購入を当サイトに帰属させます（Cookie：IR_*）。',
        },
      },
      purposeItem: { service: 'サービス', services: 'サービス' },
      service: {
        disableAll: { title: 'すべての目的', description: '任意の目的をまとめてオン・オフします。' },
        required: { title: '必須', description: 'サイトの動作に必要です。' },
        purposes: '目的',
        purpose: '目的',
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
      purposes: ['statistics'],
      cookies: [/^_ga/, /^_gid/, /^_gat/],
      translations: {
        zz: { title: 'Google Analytics 4' },
        en: { description: 'Measures site usage to inform editorial improvements. No personalised advertising; data not sold to third parties.' },
        es: { description: 'Mide el uso del sitio para orientar mejoras editoriales. Sin publicidad personalizada; los datos no se venden a terceros.' },
        de: { description: 'Misst die Nutzung der Website, um redaktionelle Verbesserungen zu ermöglichen. Keine personalisierte Werbung; Daten werden nicht an Dritte verkauft.' },
        fr: { description: 'Mesure l’utilisation du site pour orienter les améliorations éditoriales. Aucune publicité personnalisée ; les données ne sont pas vendues à des tiers.' },
        'fr-CA': { description: 'Mesure l’utilisation du site pour orienter les améliorations éditoriales. Aucune publicité personnalisée; les données ne sont pas vendues à des tiers.' },
        pt: { description: 'Mede a utilização do site para orientar melhorias editoriais. Sem publicidade personalizada; os dados não são vendidos a terceiros.' },
        ja: { description: '編集の改善に役立てるため、サイトの利用状況を測定します。パーソナライズ広告は行わず、データを第三者に販売しません。' },
      },
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
      // Its own purpose, never 'statistics': analytics-only consent must not load Impact.
      purposes: ['affiliate'],
      cookies: [/^IR_/, /^_ire/],
      translations: {
        zz: { title: 'Impact.com' },
        en: { description: 'Attributes affiliate clicks to this site so the operator earns commission on partner purchases. No personalised advertising; tracks click-attribution only.' },
        es: { description: 'Atribuye a este sitio los clics en enlaces de afiliados para que el operador cobre una comisión por las compras en sitios socios. Sin publicidad personalizada; solo registra la atribución de clics.' },
        de: { description: 'Ordnet Affiliate-Klicks dieser Website zu, damit der Betreiber Provisionen für Käufe bei Partnern erhält. Keine personalisierte Werbung; erfasst nur die Klick-Zuordnung.' },
        fr: { description: 'Attribue à ce site les clics sur les liens d’affiliation afin que l’exploitant perçoive une commission sur les achats chez les partenaires. Aucune publicité personnalisée ; seule l’attribution des clics est suivie.' },
        'fr-CA': { description: 'Attribue à ce site les clics sur les liens d’affiliation afin que l’exploitant perçoive une commission sur les achats chez les partenaires. Aucune publicité personnalisée; seule l’attribution des clics est suivie.' },
        pt: { description: 'Atribui a este site os cliques em ligações de afiliados para que o operador receba comissão pelas compras nos parceiros. Sem publicidade personalizada; regista apenas a atribuição de cliques.' },
        ja: { description: 'アフィリエイトリンクのクリックを当サイトに帰属させ、提携先での購入に対して運営者が報酬を受け取れるようにします。パーソナライズ広告は行わず、クリックの帰属のみを計測します。' },
      },
      required: false,
      default: false,
      // Not onlyOnce: a withdraw → re-Accept on the same page re-runs the tag
      // so the renewed consent takes effect without a reload.
      onDecline: onImpactDecline,
    },
  ],
  purposeOrder: ['statistics', 'affiliate'],
  purposes: [
    { name: 'statistics', title: 'Analytics' },
    { name: 'affiliate', title: 'Affiliate attribution' },
  ],
};
