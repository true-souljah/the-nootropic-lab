import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Autores',
  description: 'Equipo editorial detrás de The Nootropic Lab Latam.',
  alternates: { canonical: 'https://latam.thenootropiclab.com/authors/' },
};

export default function AuthorsIndex() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Equipo editorial</h1>
      <p className="text-gray-600 mb-8">
        The Nootropic Lab es operado por Kulik Media UG. Cada reseña está firmada por un editor con nombre.
        Sin firmas anónimas.
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
