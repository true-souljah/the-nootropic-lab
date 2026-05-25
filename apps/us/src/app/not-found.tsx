import Link from 'next/link';
import { PublicShell, Card } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';

export const metadata = {
  title: 'Page not found',
  description: "The page you were looking for doesn't exist or has been moved.",
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
      <div className="max-w-[640px] mx-auto px-6 pt-16 pb-16 text-center">
        <div
          className="text-[12px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-3"
          aria-hidden="true"
        >
          404
        </div>
        <h1 className="text-[36px] font-bold tracking-[-0.02em] text-ds-ink m-0 mb-3 leading-[1.1]">
          Page not found
        </h1>
        <p className="text-[15px] text-ds-ink-soft m-0 mb-8 leading-[1.6]">
          The page you were looking for doesn&apos;t exist or has been moved. Try one of the
          surfaces below, or use search (⌘K) to find what you need.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 text-left">
          {[
            { href: '/', title: 'Home', desc: 'The main discovery surface.' },
            { href: '/best-nootropics', title: 'Best Nootropics', desc: 'Full ranked comparison.' },
            { href: '/nootropic-comparison', title: 'Comparator', desc: 'Filter and compare side-by-side.' },
            { href: '/ingredients', title: 'Ingredient library', desc: 'Every ingredient, graded.' },
          ].map((link) => (
            <Card key={link.href} padding={16}>
              <Link
                href={link.href}
                className="block text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
              >
                <div className="font-semibold text-[14px]">{link.title}</div>
                <div className="text-[12px] text-ds-muted mt-[2px]">{link.desc}</div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
