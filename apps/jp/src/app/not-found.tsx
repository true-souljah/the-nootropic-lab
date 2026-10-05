import { NotFound } from '@nootropic/ui';
import { getStrings } from '@nootropic/data';

export const metadata = {
  title: 'ページが見つかりません',
  robots: { index: false },
};

// Region 404 with the persistent "Cookie settings" consent control (Next's
// bare built-in 404 has none). Kept minimal: this tree is serialized into
// every page's RSC payload.
export default function NotFoundPage() {
  return (
    <NotFound
      title={'ページが見つかりません'}
      body={'お探しのページは存在しないか、移動した可能性があります。'}
      homeLabel={'トップページへ戻る'}
      cookieSettingsLabel={getStrings('ja').cookie.settings}
    />
  );
}
