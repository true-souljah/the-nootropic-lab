import { NotFound } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';

export const metadata = {
  title: 'ページが見つかりません',
  robots: { index: false },
};

// Region 404 inside the public chrome (header, footer, "Cookie settings"
// consent control) instead of Next's bare built-in 404.
export default function NotFoundPage() {
  return (
    <NotFound
      title={'ページが見つかりません'}
      body={'お探しのページは存在しないか、移動した可能性があります。検索するか、トップページへお戻りください。'}
      homeLabel={'トップページへ戻る'}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
