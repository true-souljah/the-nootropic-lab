import type { Metadata } from 'next';
import { SubscriptionCancellationPage, buildAlternates} from '@nootropic/ui';
import type { CancellationStep, CancellationFAQ } from '@nootropic/ui';
import { getAuthorBySlug } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';

import LegacyShell from "@/components/LegacyShell";

export const metadata: Metadata = {
  title: 'How to Cancel Thesis Nootropics Subscription — Step-by-Step Guide',
  description:
    'Step-by-step instructions to cancel your Thesis Nootropics subscription. Includes the per-formula cancellation flow and what to do if you want a refund on unopened formulas.',
  alternates: buildAlternates({ regionCode: 'us', path: '/cancel-thesis-subscription/', availableInRegions: ['us'] }),
  openGraph: {
    title: 'How to Cancel Thesis Subscription — Step-by-Step',
    description: 'Thesis bills per-formula. Here is how to cancel one or all.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const steps: CancellationStep[] = [
  {
    title: 'Log into takethesis.com',
    body: 'Go to takethesis.com and click "Sign In" in the top-right. Use the email you signed up with. Thesis sends a magic-link login by default — check your email for the sign-in link if you don\'t have a password set.',
    linkUrl: 'https://takethesis.com/account/login',
    linkLabel: 'Open Thesis account login',
  },
  {
    title: 'Go to "My Subscription"',
    body: 'In the account menu (top-right after login), select "My Subscription". This shows your active formulas (Energy, Clarity, Logic, Motivation, Confidence, Creativity), next ship date, and per-formula pricing. Each formula is its own subscription line.',
  },
  {
    title: 'Identify which formula(s) to cancel',
    body: 'Thesis bills $59/month per formula. If you took the 4-week starter and continued with 2-3 formulas, you have 2-3 separate subscription lines — each must be cancelled individually OR you can cancel the entire account.',
  },
  {
    title: 'Click "Manage" on the formula you want to cancel',
    body: 'For each formula line, click "Manage" or "Edit". A panel opens showing options: Pause, Change Frequency, Skip Next Order, or Cancel Subscription. The Cancel link is usually at the bottom in smaller text.',
  },
  {
    title: 'Click "Cancel Subscription" and complete the exit survey',
    body: 'Thesis will show an exit survey asking why you\'re cancelling. Answer briefly (or select any reason — it doesn\'t affect the cancellation). The survey is required to complete the flow.',
  },
  {
    title: 'Decline the retention offer',
    body: 'After the survey, Thesis offers 25-40% off the next order to retain you. To actually cancel, click "No thanks, cancel anyway" — read carefully because the accept-the-offer button is sometimes the visually default action.',
  },
  {
    title: 'Confirm via email',
    body: 'A cancellation confirmation email arrives within 5-10 minutes. If you cancelled multiple formulas, you should receive one email per formula (or one consolidated email — varies). Save the confirmation. Repeat steps 4-7 for any other formulas you want to cancel.',
  },
];

const watchouts = [
  'Each formula is a separate subscription — cancelling Energy does NOT cancel Clarity. You may have 2-3 active subscriptions and only realize after cancelling one and seeing the next charge for another.',
  'Thesis "Pause" is NOT cancellation — it skips one shipment and resumes. Read the option carefully.',
  'Thesis offers a "switch formula" option as an alternative to cancellation — useful if you want to try something else before fully leaving, but if you actually want out, decline this offer.',
  'The 4-week starter pack is non-refundable in most cases — your money-back window typically applies to the first FULL month of single-formula subscription, not the starter trial.',
  'If you cancel and reactivate within 30 days, Thesis sometimes restores your subscription at the original price — useful if you want to take a break without losing the rate.',
];

const faqItems: CancellationFAQ[] = [
  {
    q: 'Can I get a refund on the starter pack?',
    a: 'Generally no — the 4-week starter pack ($119) is positioned as a trial rather than a full-cost subscription, and Thesis\'s satisfaction guarantee typically applies to full single-formula months, not the starter. Contact customer support if you have unopened formula packets — they may offer partial refund as goodwill.',
  },
  {
    q: 'How do I cancel ALL formulas at once?',
    a: 'Thesis does not have a one-click "cancel everything" button — you must cancel each formula individually. As an alternative, contact customer service via support@takethesis.com or live chat (during business hours) and request full account cancellation. Always get email confirmation.',
  },
  {
    q: 'I just received a shipment. Can I return it?',
    a: 'Thesis\'s return policy: unopened formula packs can typically be returned within 30 days of receipt for a refund (minus shipping). Contact support@takethesis.com to request an RMA before shipping anything back.',
  },
  {
    q: 'Will I keep getting charged for the formulas I haven\'t used?',
    a: 'Yes, until each formula\'s subscription is individually cancelled. Thesis ships and charges per-formula on its own monthly cycle — pausing or cancelling does not retroactively credit unused formula packs.',
  },
  {
    q: 'I cancelled but was charged anyway',
    a: 'Step 1: contact support@takethesis.com with your cancellation confirmation email and the date of the unauthorized charge. Step 2: dispute with your card issuer if Thesis does not refund within 7-10 days. Step 3: FTC complaint at reportfraud.ftc.gov citing Click-to-Cancel rule.',
  },
  {
    q: 'Are there alternatives to Thesis?',
    a: 'Mind Lab Pro is a single universal formula at $69/month with no autoship — manual reorder only, no per-formula proliferation. Read our Mind Lab Pro vs Thesis head-to-head for the universal-vs-personalised comparison.',
  },
];

const ftcComplaintNote =
  'If Thesis refuses to cancel, requires multiple support contacts, or charges after cancellation: file at https://reportfraud.ftc.gov citing the FTC Click-to-Cancel rule. Include your account email, all cancellation attempt timestamps, and screenshots of the dashboard showing each formula\'s subscription status.';

export default function Page() {
  return (
    <LegacyShell>
    <SubscriptionCancellationPage
      brandName="Thesis"
      productReviewSlug="thesis-nootropics-review"
      pageSlug="cancel-thesis-subscription"
      siteUrl={SITE_URL}
      pageTitle="How to Cancel Your Thesis Nootropics Subscription"
      pageDescription="Cancel your Thesis Nootropics subscription per-formula. Step-by-step, with the friction points and FTC complaint path."
      heroParagraph="Thesis bills $59/month per formula. If you signed up for the starter and continued with 2-3 formulas, each is its own subscription that must be cancelled separately. This guide walks through the per-formula cancellation flow and what to do if you want a refund on unopened packets."
      steps={steps}
      totalTimeMinutes={8}
      watchouts={watchouts}
      faqItems={faqItems}
      ftcComplaintNote={ftcComplaintNote}
    />
    </LegacyShell>
  );
}
