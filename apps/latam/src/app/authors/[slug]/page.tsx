import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaOrg } from '@nootropic/ui';
import { authors, getAuthorBySlug, buildPersonSchema } from '@nootropic/data';

const SITE_URL = 'https://latam.thenootropiclab.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return authors.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: `${author.name} — ${author.jobTitle}`,
    description: author.bioShort,
    alternates: { canonical: `${SITE_URL}/authors/${author.slug}/` },
    openGraph: {
      title: `${author.name} — The Nootropic Lab`,
      description: author.bioShort,
      type: 'profile',
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const personSchema = buildPersonSchema(author, SITE_URL);

  return (
    <>
      <SchemaOrg schema={personSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Inicio</a>
          {' / '}
          <a href="/authors/" className="hover:text-green-700">Autores</a>
          {' / '}
          <span>{author.name}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{author.name}</h1>
          <p className="text-gray-500">{author.jobTitle}</p>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Acerca de</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{author.bio}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Áreas de especialización</h2>
          <ul className="space-y-2 text-gray-700">
            {author.expertise.map(e => (
              <li key={e} className="flex gap-2">
                <span className="shrink-0 text-green-700">✓</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </section>

        {author.education.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Calificaciones editoriales</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              {author.education.map(e => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contacto y perfiles</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              Correo: <a href={`mailto:${author.email}`} className="text-green-700 underline">{author.email}</a>
            </li>
            {author.sameAs.map(url => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                  {new URL(url).hostname.replace('www.', '')}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Política editorial de conflictos de interés</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            The Nootropic Lab gana comisiones de afiliado cuando los lectores compran productos a través de
            enlaces salientes. Estas comisiones <strong>no</strong> influyen en la puntuación editorial ni en
            los rankings. Ninguna marca paga por una reseña. Todas las relaciones comerciales se divulgan en
            cada página donde apliquen. Lee nuestra{' '}
            <a href="/methodology" className="text-green-700 underline">metodología completa</a>.
          </p>
        </section>
      </article>
    </>
  );
}
