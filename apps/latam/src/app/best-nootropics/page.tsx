import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsLatam } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Los Mejores Nootrópicos en Latinoamérica 2026 — Guía del Comprador',
  description:
    'Los mejores suplementos nootrópicos para compradores en Latinoamérica. Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú.',
};

const faqItems = [
  {
    q: '¿Son legales los nootrópicos en Latinoamérica?',
    a: 'La mayoría de los suplementos nootrópicos son legales en Latinoamérica como suplementos alimenticios. La regulación varía por país: COFEPRIS en México, ANVISA en Brasil, ANMAT en Argentina, INVIMA en Colombia, ISP en Chile y DIGEMID en Perú. Los productos que recomendamos usan ingredientes permitidos en todos los mercados.',
  },
  {
    q: '¿Cuánto tarda el envío a Latinoamérica?',
    a: 'Las marcas internacionales generalmente envían desde Estados Unidos o el Reino Unido, y el paquete llega a la mayoría de los países latinoamericanos en 7 a 21 días hábiles, según el proceso aduanero. Brasil suele tener los mayores retrasos por las inspecciones de la Receita Federal. Colombia y Chile son generalmente los más rápidos (7 a 12 días).',
  },
  {
    q: '¿Se cobran aranceles de importación en los pedidos de suplementos?',
    a: 'Brasil aplica hasta un 60% de impuesto de importación sobre suplementos, el más alto de Latinoamérica. México suele estar libre de aranceles en compras menores a 50 dólares. Argentina, Colombia, Chile y Perú cobran entre el 6 y el 20% según la clasificación del producto. Pedir un suministro de 1 mes te mantiene dentro de los límites de importación personal.',
  },
];

export default function BestNootropicsLatamPage() {
  const winner = productsLatam.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Los Mejores Nootrópicos en Latinoamérica 2026',
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab Latam' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <StickyCtaBar productName={winner.name} affiliateUrl={winner.affiliateUrl} />

      <article className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Los Mejores Nootrópicos en Latam 2026
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú.
          Notas sobre aduanas e impuestos de importación incluidas para cada país.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-amber-900 mb-2">Nota de importación en Latam</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            Los aranceles de importación varían considerablemente según el país. <strong>Brasil</strong> aplica el impuesto
            de importación más alto (hasta el 60%). <strong>México</strong> es el más amigable para importaciones. Recomendamos
            pedir el suministro de 1 mes a la vez para mantenerse dentro de los límites de importación personal.
          </p>
        </div>

        <AffiliateDisclosure />

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10 mt-6">
          <div className="editor-badge mb-2 inline-block">Elección del Editor — Latam 2026</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h2>
          <p className="text-sm text-gray-600 mb-3">{winner.summary}</p>
          <a
            href={winner.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Ver Precio Actual (${winner.priceMonthlyUSD}/mes USD) →
          </a>
        </div>

        <section id="comparison-table">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparativa de Nootrópicos en Latam 2026</h2>
          <ComparisonTable products={productsLatam} market="us" />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes — Nootrópicos en Latam</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Reading */}
        <section className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Lectura Recomendada</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="/guides/what-are-nootropics" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">¿Qué son los nootrópicos?</div>
              <div className="text-xs text-gray-500">Guía para principiantes sobre suplementos cognitivos</div>
            </a>
            <a href="/guides/how-to-stack-nootropics" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Cómo combinar nootrópicos</div>
              <div className="text-xs text-gray-500">Combina ingredientes de forma segura para mejores resultados</div>
            </a>
            <a href="/ingredients" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Base de datos de ingredientes</div>
              <div className="text-xs text-gray-500">Perfiles con clasificación de evidencia para 15 nootrópicos clave</div>
            </a>
            <a href="/guides/nootropics-for-focus-vs-memory" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Enfoque vs. Memoria</div>
              <div className="text-xs text-gray-500">¿Qué nootrópicos funcionan mejor según tu objetivo?</div>
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
