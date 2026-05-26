import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg, buildAlternates} from '@nootropic/ui';
import { productsUS } from '@nootropic/data';

const CURRENT_YEAR = new Date().getFullYear();

import LegacyShell from "@/components/LegacyShell";

export const metadata: Metadata = {
  title: `Mejores Nootrópicos ${CURRENT_YEAR}: Comparativa Experta para EE. UU.`,
  description: `Comparativa independiente de los mejores suplementos nootrópicos en ${CURRENT_YEAR}. Cada ingrediente auditado frente a ensayos clínicos. Puntuación transparente y divulgación de afiliados.`,
  alternates: buildAlternates({ regionCode: 'us', path: '/es/mejores-nootropicos/', availableInRegions: ['us'] }),
};

export default function EsMejoresNootropicosPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Mejores Suplementos Nootrópicos ${CURRENT_YEAR}`,
    itemListElement: productsUS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <LegacyShell>
    <div lang="es">
      <SchemaOrg schema={itemListSchema} />
      <article className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-2 text-xs text-gray-500">
          Última actualización:{' '}
          {new Date().toLocaleDateString('es-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mejores Nootrópicos {CURRENT_YEAR}:
          <br />
          Comparativa Experta para EE. UU.
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Hemos analizado {productsUS.length} suplementos nootrópicos, comparando la dosis de
          cada ingrediente con los resultados de ensayos clínicos revisados por expertos. A
          continuación, te presentamos nuestra comparativa con una clasificación y un desglose
          completo de las puntuaciones.
        </p>

        <AffiliateDisclosure />

        <div className="mb-8">
          <a href="#comparison-table" className="text-green-700 underline text-sm font-medium">
            → Ver tabla comparativa
          </a>
        </div>

        <section id="comparison-table">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Comparativa de Nootrópicos {CURRENT_YEAR}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Ordena por puntuación, precio, garantía de devolución del dinero o valoración de Trustpilot.
          </p>
          <ComparisonTable products={productsUS} market="us" />
        </section>

        <div className="mt-10 text-sm text-gray-500">
          <a href="/best-nootropics" className="text-green-700 underline">
            🇺🇸 Versión en inglés: Best Nootropics {CURRENT_YEAR}
          </a>
        </div>
      </article>
    </div>
    </LegacyShell>
  );
}
