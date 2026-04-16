import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'The Nootropic Lab — Suplementos Cognitivos Independientes',
  description:
    'Comparativa independiente de suplementos nootrópicos para compradores en EE. UU. Análisis de dosificación clínica y divulgación transparente de afiliados.',
  alternates: {
    languages: {
      'en-US': '/',
      'es-US': '/es',
    },
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab',
  url: 'https://thenootropiclab.com/es',
  description: 'Independent cognitive supplement reviews for US buyers — Spanish.',
};

export default function EsHomePage() {
  return (
    <div lang="es">
      <SchemaOrg schema={websiteSchema} />

      {/* Hero — PLACEHOLDER: replace with Spanish copy */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Mercado EE. UU. · Basado en Evidencia · Afiliados Declarados
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            La Guía Independiente de
            <br />
            <span className="text-green-700">Suplementos Cognitivos</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Comparamos la dosis de cada ingrediente con los resultados de ensayos clínicos
            revisados por expertos. Sin autores anónimos. Sin comisiones ocultas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/es/mejores-nootropicos"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Mejores Nootrópicos 2026 →
            </Link>
            <Link
              href="/es/comparar"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Comparar Todas las Marcas
            </Link>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <Link href="/" className="text-green-700 underline">
              🇺🇸 Versión en inglés
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
