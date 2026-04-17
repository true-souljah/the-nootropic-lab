import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'The Nootropic Lab Latam — Comparación Independiente de Suplementos Cognitivos',
  description:
    'La plataforma independiente de comparación de nootrópicos para compradores en Latinoamérica. Reseñas basadas en evidencia, auditorías de dosificación clínica y divulgación completa de afiliados.',
  openGraph: {
    title: 'The Nootropic Lab Latam — Suplementos Cognitivos',
    description: 'Reseñas basadas en evidencia. Auditorías de dosificación clínica. Divulgación transparente de afiliados.',
    url: 'https://latam.thenootropiclab.com',
    siteName: 'The Nootropic Lab',
    type: 'website',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab Latam',
  url: 'https://latam.thenootropiclab.com',
  description: 'Reseñas independientes de nootrópicos para compradores en América Latina.',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Nootropic Lab',
  url: 'https://latam.thenootropiclab.com',
  description: 'Reseñas independientes de suplementos cognitivos con auditorías de dosificación clínica y divulgación transparente de afiliados.',
};

const features = [
  {
    icon: '🔬',
    title: 'Auditorías clínicas de dosificación',
    desc: 'Cada revisión de producto incluye una tabla de dosificación frente a evidencia que compara cada ingrediente con la dosis mínima efectiva de los ensayos revisados por expertos.',
  },
  {
    icon: '🌎',
    title: 'Envío a Latam verificado',
    desc: 'Todos los productos se envían internacionalmente a México, Brasil, Argentina, Colombia, Chile y Perú. Se incluyen notas de aduanas y derechos de importación para cada país.',
  },
  {
    icon: '⚖️',
    title: 'Transparencia de suscripción',
    desc: 'Puntuamos cada marca según su experiencia de cancelación de suscripción. Se muestran las puntuaciones de Trustpilot, incluidas las malas.',
  },
];

const quickLinks = [
  {
    href: '/best-nootropics',
    title: 'Los Mejores Nootrópicos en Latam 2026',
    desc: 'Mejores opciones con envío internacional a América Latina confirmado.',
  },
  {
    href: '/nootropic-comparison',
    title: 'Herramienta Interactiva de Comparación',
    desc: 'Ordene y filtre las principales marcas una al lado de la otra.',
  },
  {
    href: '/methodology',
    title: 'Nuestra Metodología',
    desc: 'Cómo puntuamos y revisamos los suplementos cognitivos.',
  },
];

export default function HomePage() {
  return (
    <>
      <SchemaOrg schema={websiteSchema} />
      <SchemaOrg schema={orgSchema} />

      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Mercado Latam · Basado en Evidencia · Afiliados Divulgados
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            La Guía Independiente de
            <br />
            <span className="text-green-700">Suplementos Cognitivos</span>
            <br />
            para América Latina
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Comprobamos la dosis de cada ingrediente con ensayos clínicos revisados por expertos.
            Sin autores anónimos. Sin comisiones ocultas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/best-nootropics"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Los Mejores Nootrópicos 2026 →
            </Link>
            <Link
              href="/nootropic-comparison"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Comparar Todas las Marcas
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Por qué The Nootropic Lab es diferente
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comience su investigación</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block border border-gray-200 rounded-lg p-5 hover:border-green-700 hover:shadow-sm transition-all"
            >
              <div className="font-semibold text-gray-900 mb-1">{l.title}</div>
              <div className="text-sm text-gray-500">{l.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
