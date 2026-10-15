import { NotFound } from '@nootropic/ui';
import { getStrings } from '@nootropic/data';

export const metadata = {
  title: 'Page not found',
  robots: { index: false },
};

// Region 404 with the persistent "Cookie settings" consent control (Next's
// bare built-in 404 has none). Kept minimal: this tree is serialized into
// every page's RSC payload.
export default function NotFoundPage() {
  return (
    <NotFound
      title={'Page not found'}
      body={"The page you were looking for doesn't exist or has been moved."}
      homeLabel={'Back to the homepage'}
      cookieSettingsLabel={getStrings('en').cookie.settings}
      privacyLabel={getStrings('en').footer.about.privacy}
      cookiePolicyLabel={getStrings('en').footer.about.cookies}
    />
  );
}
