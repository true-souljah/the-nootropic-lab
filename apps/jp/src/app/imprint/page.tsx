import type { Metadata } from 'next';
import { ImprintPage } from '@nootropic/ui';

const SITE_URL = 'https://jp.thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

export const metadata: Metadata = {
  title: 'Imprint / 運営者情報 — The Nootropic Lab Japan',
  description:
    'Imprint for the Japanese edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: { canonical: `${SITE_URL}/imprint/` },
};

export default function Page() {
  return (
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="Japanese edition"
      contactEmail={CONTACT_EMAIL}
      regionNote="日本国内で販売される機能性表示食品（FFC）および特定保健用食品（FOSHU）は、消費者庁への届出または許可を必要とします。届出のない輸入品については、本サイトは消費者体験および成分研究のレビューとして編集しており、薬機法（旧薬事法）の下で疾病治療を示唆する表現は行いません。 / Foods with Function Claims (FFC) and Foods for Specified Health Uses (FOSHU) sold in Japan require notification or approval from the Consumer Affairs Agency. For imported products without notification, our editorial framing covers consumer experience and ingredient research only — disease-treatment claims under PMD Act are not asserted."
    />
  );
}
