import { NotFound } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';

export const metadata = {
  title: 'Page not found',
  robots: { index: false },
};

// Region 404 inside the public chrome (header, footer, "Cookie settings"
// consent control) instead of Next's bare built-in 404.
export default function NotFoundPage() {
  return (
    <NotFound
      title={'Page not found'}
      body={"The page you were looking for doesn't exist or has been moved. Use search or go back to the homepage."}
      homeLabel={'Back to the homepage'}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
