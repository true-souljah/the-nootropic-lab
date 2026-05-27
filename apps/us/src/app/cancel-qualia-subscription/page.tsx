import type { Metadata } from 'next';
import { SubscriptionCancellationPage, PublicShell, buildAlternates } from '@nootropic/ui';
import type { CancellationStep, CancellationFAQ } from '@nootropic/ui';
import { getAuthorBySlug } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'How to Cancel Qualia Mind Subscription (Neurohacker Collective) — Step-by-Step',
  description:
    'Step-by-step instructions to cancel your Qualia Mind / Neurohacker Collective subscription. Includes the introductory-rate trap and what to watch for at month two.',
  alternates: buildAlternates({ regionCode: 'us', path: '/cancel-qualia-subscription/', availableInRegions: ['us'] }),
  openGraph: {
    title: 'How to Cancel Qualia Mind Subscription — Step-by-Step',
    description: 'The intro $39 first month auto-converts to $139/month. Here is how to cancel before that happens.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const steps: CancellationStep[] = [
  {
    title: 'Log into neurohacker.com',
    body: 'Go to neurohacker.com and click "Sign In" in the top-right. Use the email you signed up with. Neurohacker uses a standard email + password login; password reset emails arrive within ~5 minutes.',
    linkUrl: 'https://neurohacker.com/account/login',
    linkLabel: 'Open Neurohacker account login',
  },
  {
    title: 'Go to "Subscriptions" in your account dashboard',
    body: 'After login, click your account icon → "Manage Subscriptions". Active subscriptions are listed with the product (Qualia Mind, Qualia Mind Caffeine-Free, Qualia Resilience, etc.), next ship date, and per-bottle pricing. Note: Neurohacker also runs separate subscriptions for non-cognitive Qualia products — check carefully.',
  },
  {
    title: 'Click "Manage" on the subscription you want to cancel',
    body: 'Each subscription line has a "Manage" button. Click it to open the detail panel. Inside, you\'ll see options: Pause, Change Frequency, Change Ship Date, and Cancel Subscription. The cancel link is at the bottom of the panel.',
  },
  {
    title: 'Click "Cancel Subscription" and complete the reason form',
    body: 'Neurohacker requires a brief cancellation reason. Pick any option (price, side effect, switching, not effective, etc.) — the choice doesn\'t affect cancellation. The form is one click + one optional comment box.',
  },
  {
    title: 'Decline the retention offer',
    body: 'Neurohacker offers a one-time discount (typically 30-50%) to retain you. To actually cancel, click "No thanks, cancel" or "Continue cancellation". Read the buttons carefully — accept-the-offer is sometimes the default-styled button.',
  },
  {
    title: 'Confirm via email',
    body: 'A cancellation confirmation email arrives within 5-10 minutes. The email should explicitly say "subscription cancelled" — if it says "subscription paused" or "subscription updated", the cancellation did NOT go through. Re-do the flow if needed and take screenshots.',
  },
];

const watchouts = [
  'CRITICAL: The "introductory subscription" rate of $39 first order auto-converts to $139/month at month two. If you signed up for the intro deal, the cancellation deadline is BEFORE the second charge, not after.',
  'Some Qualia variants (Resilience, Night, Vision) have separate subscription lines — cancelling Qualia Mind does not cancel the others.',
  'Neurohacker offers a 100-day money-back guarantee on first orders — but the guarantee window is from order date, not from when you start taking the product. If you delayed starting, the window may close before you finish evaluating.',
  'The "Pause" option lets you delay the next ship date by up to 90 days — useful if you want to take a break, but the subscription remains active and will resume.',
  'Skip-next-order is one-time only — it does NOT cancel future orders. Many users mistake skip for cancellation.',
];

const faqItems: CancellationFAQ[] = [
  {
    q: 'I signed up for the $39 intro — when do I need to cancel to avoid the $139?',
    a: 'You need to cancel BEFORE the second charge processes. Check your account dashboard for the "next ship date" — cancel at least 24 hours before that date to ensure the cancellation processes before the charge attempts. If you are unsure, cancel as soon as you decide you don\'t want to continue.',
  },
  {
    q: 'Can I get a refund on a $139 charge if I forgot to cancel?',
    a: 'Yes, often — Neurohacker has a 100-day money-back guarantee. Contact support@neurohacker.com explaining the situation. They typically refund the second charge if you request within ~30 days and have not consumed the product. Be polite and reference the guarantee. If they refuse: dispute with your card issuer.',
  },
  {
    q: 'How do I cancel by phone?',
    a: 'Neurohacker\'s customer service: 1-833-272-8242 (Monday-Friday 8am-5pm PT). Phone cancellation is often faster than web because dark-pattern friction is reduced. Always request a cancellation confirmation email before ending the call.',
  },
  {
    q: 'Can I cancel just one Qualia variant and keep another?',
    a: 'Yes — each subscription line in the dashboard is independent. Cancelling Qualia Mind does NOT affect Qualia Resilience, Night, Vision, etc. You must cancel each variant individually if you want to fully exit Neurohacker.',
  },
  {
    q: 'I cancelled but was charged anyway',
    a: 'Step 1: email support@neurohacker.com with your cancellation confirmation + the unauthorized charge details. Step 2: if not refunded within 5 business days, dispute with your card issuer. Step 3: file an FTC complaint at reportfraud.ftc.gov citing the Click-to-Cancel rule.',
  },
  {
    q: 'Are there alternatives to Qualia Mind?',
    a: 'Mind Lab Pro is the most direct alternative — single universal formula, every dose disclosed, $69/month with no autoship (manual reorder only). The capsule count is also lower (2/day vs Qualia\'s 7+/day). Read our Mind Lab Pro vs Qualia Mind head-to-head.',
  },
];

const ftcComplaintNote =
  'If Neurohacker fails to honor the 100-day guarantee, charges after cancellation, or makes cancellation demonstrably harder than signup: file at https://reportfraud.ftc.gov citing the FTC Click-to-Cancel rule. Include account email, intro-rate signup date, all charges, cancellation attempt timestamps, and any email correspondence.';

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
    <SubscriptionCancellationPage
      brandName="Qualia Mind"
      productReviewSlug="qualia-mind-review"
      pageSlug="cancel-qualia-subscription"
      siteUrl={SITE_URL}
      pageTitle="How to Cancel Your Qualia Mind / Neurohacker Subscription"
      pageDescription="Cancel your Qualia Mind subscription before the $39 intro auto-converts to $139/month. Step-by-step + friction points + refund path."
      heroParagraph="Qualia Mind's introductory rate ($39 first month) auto-converts to $139/month at month two — this is the most common reason buyers want to cancel. The flow is straightforward but has retention friction at the final step. This guide walks through cancellation + the refund path if you missed the deadline."
      steps={steps}
      totalTimeMinutes={5}
      watchouts={watchouts}
      faqItems={faqItems}
      ftcComplaintNote={ftcComplaintNote}
    />
    </PublicShell>
  );
}
