import type { Metadata } from 'next';
import { SubscriptionCancellationPage, PublicShell, buildAlternates } from '@nootropic/ui';
import type { CancellationStep, CancellationFAQ } from '@nootropic/ui';
import { getAuthorBySlug } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://thenootropiclab.com';

export const metadata: Metadata = {
  title: 'How to Cancel Onnit Subscription (Alpha Brain) — Step-by-Step Guide',
  description:
    'Step-by-step instructions to cancel your Onnit Alpha Brain (or any Onnit) subscription. Includes the friction points to watch for and FTC Click-to-Cancel context.',
  alternates: buildAlternates({ regionCode: 'us', path: '/cancel-onnit-subscription/', availableInRegions: ['us'] }),
  openGraph: {
    title: 'How to Cancel Onnit Subscription — Step-by-Step',
    description: 'Onnit subscription cancellation has documented friction. Here is the actual flow + what to watch for.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const steps: CancellationStep[] = [
  {
    title: 'Log into your Onnit account',
    body: 'Go to onnit.com and click "Sign In" in the top-right. Use the email + password you signed up with. If you forgot your password, the reset email arrives within ~5 minutes — check spam.',
    linkUrl: 'https://www.onnit.com/account/',
    linkLabel: 'Open Onnit account login',
  },
  {
    title: 'Navigate to "Subscriptions"',
    body: 'In your account dashboard, click "Subscriptions" in the left-hand nav (sometimes labeled "Auto-Refill" or "Manage Subscriptions" depending on the dashboard version you see). This is where all your active recurring orders are listed.',
  },
  {
    title: 'Click on the active subscription you want to cancel',
    body: 'Each subscription is listed with the product name, next-charge date, and price. Click on the one you want to end (e.g. "Alpha Brain 90-count Auto-Refill"). This opens the subscription detail panel.',
  },
  {
    title: 'Click "Cancel Subscription"',
    body: 'Scroll to the bottom of the subscription detail panel — the cancel link is usually at the bottom in smaller text (NOT a prominent button at the top). It may say "Cancel auto-refill" or "End subscription". Click it.',
  },
  {
    title: 'Decline the retention offers',
    body: 'Onnit will present 1-2 retention pop-ups: a "skip this month" offer and a "save 25% off the next order" offer. To actually cancel, click "No thanks" or "Continue cancelling" on each — read carefully because the buttons are sometimes labeled to make accepting the offer feel like the default.',
  },
  {
    title: 'Confirm cancellation in the email',
    body: 'You should receive a cancellation confirmation email within 5-10 minutes. If you do NOT receive this email, the cancellation likely did not go through — log back in and check the Subscriptions page to verify status changed to "Cancelled" or "Inactive". Take a screenshot for your records.',
  },
];

const watchouts = [
  'The cancel link is at the BOTTOM of the subscription detail panel in small text, not a prominent button — Onnit follows the dark-pattern convention of making cancel hard to find.',
  'Retention offers default-state the buttons to "accept the discount" — read carefully before clicking, especially the second pop-up.',
  '"Skip this month" is NOT the same as cancellation — it pauses the next charge but the subscription remains active and will resume the following month.',
  'If you signed up via a "free trial" promotion, the trial period auto-converts to paid subscription — cancellation must happen BEFORE the trial ends to avoid the first charge.',
  'Onnit was the subject of FTC actions in 2018 around subscription practices — they have since updated, but the user experience of cancellation remains friction-heavy compared to FTC Click-to-Cancel intent.',
];

const faqItems: CancellationFAQ[] = [
  {
    q: 'Will I be charged again after cancellation?',
    a: 'No — once cancellation is confirmed (you receive the email AND the Subscriptions dashboard shows "Cancelled"), no further charges should occur. If you ARE charged after a confirmed cancellation, contact Onnit customer service immediately and dispute the charge with your card issuer.',
  },
  {
    q: 'Can I cancel by phone?',
    a: 'Yes — Onnit\'s customer service line is 1-855-ONNIT-99 (1-855-666-4899), Monday-Friday 9am-6pm CT. Phone cancellation is sometimes faster than the web flow because the dark-pattern friction is removed. Always ask for a cancellation confirmation email before ending the call.',
  },
  {
    q: 'Will I get a refund for the most recent shipment?',
    a: 'Onnit\'s standard return policy: 90-day money-back guarantee on first orders, but auto-renewal shipments past the trial typically have a stricter 30-day return window. Check your specific subscription terms. Return for refund: contact customer service to request an RMA (return merchandise authorization) before shipping anything back.',
  },
  {
    q: 'I cancelled but they still charged me — what now?',
    a: 'Step 1: contact Onnit customer service with your cancellation confirmation email + a screenshot of the dashboard showing cancelled status. Step 2: dispute the charge with your card issuer (most banks have a 60-day dispute window). Step 3: file an FTC complaint at reportfraud.ftc.gov citing the FTC Click-to-Cancel rule.',
  },
  {
    q: 'How do I cancel just the Alpha Brain Black Label or Instant variant?',
    a: 'Each Onnit subscription is managed independently in the Subscriptions dashboard — you can have Alpha Brain Classic auto-refill active while cancelling the Black Label subscription. Cancel each variant separately following the same flow.',
  },
  {
    q: 'Are there alternatives to Onnit Alpha Brain?',
    a: 'Yes. Mind Lab Pro is the most direct comparison — open-formula, fully disclosed doses, no autoship pressure (manual reorder only). NooCube is a lower-priced open-formula option. Read our Mind Lab Pro vs Alpha Brain head-to-head for the full comparison.',
  },
];

const ftcComplaintNote =
  'If Onnit refuses to cancel, charges you after cancellation, or makes the cancellation flow demonstrably harder than the signup flow, file a complaint at https://reportfraud.ftc.gov citing the FTC Click-to-Cancel rule (effective 2024). Include your account email, cancellation attempt timestamps, and screenshots. The FTC actively pursues subscription-trap cases against supplement brands.';

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
    <SubscriptionCancellationPage
      brandName="Onnit"
      productReviewSlug="onnit-alpha-brain-review"
      pageSlug="cancel-onnit-subscription"
      siteUrl={SITE_URL}
      pageTitle="How to Cancel Your Onnit Subscription (Step-by-Step)"
      pageDescription="Cancel your Onnit Alpha Brain or any Onnit subscription. Step-by-step instructions, friction points, and FTC complaint path if it doesn&apos;t work."
      heroParagraph="Onnit's subscription cancellation flow is documented as friction-heavy — retention pop-ups, hidden cancel links, and confusingly-labeled buttons. This guide walks you through the actual steps, what to watch for, and where to escalate if the cancellation doesn't go through. ~6 minutes total."
      steps={steps}
      totalTimeMinutes={6}
      watchouts={watchouts}
      faqItems={faqItems}
      ftcComplaintNote={ftcComplaintNote}
    />
    </PublicShell>
  );
}
