import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaOrg } from '@nootropic/ui';
import { guides } from '@nootropic/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map(g => ({ guide: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guide: string }>;
}): Promise<Metadata> {
  const { guide } = await params;
  const g = guides.find(x => x.slug === guide);
  if (!g) return {};
  return {
    title: `${g.title} — The Nootropic Lab`,
    description: g.description,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ guide: string }>;
}) {
  const { guide } = await params;
  const g = guides.find(x => x.slug === guide);
  if (!g) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.description,
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    timeRequired: `PT${g.readingTimeMin}M`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thenootropiclab.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://thenootropiclab.com/guides' },
      { '@type': 'ListItem', position: 3, name: g.title },
    ],
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <SchemaOrg schema={breadcrumbSchema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Home</a>
          {' / '}
          <a href="/guides" className="hover:text-green-700">Guides</a>
          {' / '}
          <span>{g.title}</span>
        </nav>

        <div className="mb-2 flex items-center gap-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
            {g.category}
          </span>
          <span className="text-xs text-gray-400">{g.readingTimeMin} min read</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{g.title}</h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">{g.description}</p>

        {g.sections.map(section => (
          <section key={section.heading} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </section>
        ))}

        <div className="mt-10 text-sm text-gray-500">
          <a href="/guides" className="text-green-700 underline">
            ← Back to Guides
          </a>
        </div>
      </article>
    </>
  );
}
