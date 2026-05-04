import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@nootropic/data';

const SITE_URL = 'https://sea.thenootropiclab.com';

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Editorial team behind The Nootropic Lab SEA.',
  alternates: { canonical: `${SITE_URL}/authors/` },
};

export default function AuthorsIndex() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Editorial team</h1>
      <p className="text-gray-600 mb-8">
        The Nootropic Lab is operated by Kulik Media UG. Every review is signed by a named editor. No
        anonymous bylines.
      </p>

      <ul className="space-y-6">
        {authors.map(author => (
          <li key={author.slug} className="border border-gray-200 rounded-xl p-5 hover:border-green-700 transition-colors">
            <Link href={`/authors/${author.slug}/`} className="block">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{author.name}</h2>
              <div className="text-sm text-gray-500 mb-2">{author.jobTitle}</div>
              <p className="text-sm text-gray-700">{author.bioShort}</p>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
