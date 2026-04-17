import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';
import { guides } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Guías de Nootrópicos 2026 — De Principiante a Avanzado',
  description:
    'Aprende todo sobre los nootrópicos disponibles en Latam: qué son, cómo funcionan, cómo combinarlos de forma segura y qué esperar de manera realista.',
};

const categoryLabels: Record<string, string> = {
  beginner: 'Principiante',
  stacking: 'Combinación',
  usage: 'Uso',
  science: 'Ciencia',
};

const categoryColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  stacking: 'bg-blue-100 text-blue-800',
  usage: 'bg-amber-100 text-amber-800',
  science: 'bg-purple-100 text-purple-800',
};

export default function GuidesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Guías de Nootrópicos — Latam',
    numberOfItems: guides.length,
    itemListElement: guides.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      url: `https://latam.thenootropiclab.com/guides/${g.slug}`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Inicio</a>
          {' / '}
          <span>Guías</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Guías de Nootrópicos 2026
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Guías prácticas y basadas en evidencia para entender y usar los nootrópicos de forma efectiva.
          Toda la información es relevante para productos disponibles en Latam.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {guides.map(guide => (
            <a
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[guide.category]}`}>
                  {categoryLabels[guide.category]}
                </span>
                <span className="text-xs text-gray-400">{guide.readingTimeMin} min de lectura</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{guide.description}</p>
              <span className="mt-4 inline-block text-sm text-green-700 font-semibold">
                Leer guía →
              </span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
