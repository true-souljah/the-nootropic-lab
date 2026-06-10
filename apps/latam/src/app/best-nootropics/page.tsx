import type { Metadata } from 'next';
import Link from 'next/link';
import { BestOf, SchemaOrg, Card, Chip, FaqAccordion, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsLatam, buildPersonAuthorReference } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Los Mejores Nootrópicos en Latinoamérica ${CURRENT_YEAR} — Guía del Comprador`,
  description: 'Los mejores suplementos nootrópicos para compradores en Latinoamérica. Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/best-nootropics/' }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/best-nootropics/', title: `Los Mejores Nootrópicos en Latinoamérica ${CURRENT_YEAR} — Guía del Comprador`, description: 'Los mejores suplementos nootrópicos para compradores en Latinoamérica. Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú.' }),
  twitter: buildTwitter({ title: `Los Mejores Nootrópicos en Latinoamérica ${CURRENT_YEAR} — Guía del Comprador`, description: 'Los mejores suplementos nootrópicos para compradores en Latinoamérica. Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú.' }),
};

const faqItems = [
  { q: '¿Son legales los nootrópicos en Latinoamérica?', a: 'La mayoría de los suplementos nootrópicos son legales en Latinoamérica como suplementos alimenticios. La regulación varía por país: COFEPRIS en México, ANVISA en Brasil, ANMAT en Argentina, INVIMA en Colombia, ISP en Chile y DIGEMID en Perú. Los productos que recomendamos usan ingredientes permitidos en todos los mercados.' },
  { q: '¿Cuánto tarda el envío a Latinoamérica?', a: 'Las marcas internacionales generalmente envían desde Estados Unidos o el Reino Unido, y el paquete llega a la mayoría de los países latinoamericanos en 7 a 21 días hábiles, según el proceso aduanero. Brasil suele tener los mayores retrasos por las inspecciones de la Receita Federal. Colombia y Chile son generalmente los más rápidos (7 a 12 días).' },
  { q: '¿Se cobran aranceles de importación en los pedidos de suplementos?', a: 'Brasil aplica hasta un 60% de impuesto de importación sobre suplementos, el más alto de Latinoamérica. México suele estar libre de aranceles en compras menores a 50 dólares. Argentina, Colombia, Chile y Perú cobran entre el 6 y el 20% según la clasificación del producto. Pedir un suministro de 1 mes te mantiene dentro de los límites de importación personal.' },
];

export default function BestNootropicsLatamPage() {
  const winner = productsLatam.find((p) => p.editorChoice)!;
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: `Los Mejores Nootrópicos en Latinoamérica ${CURRENT_YEAR}`, datePublished: '2026-01-15', dateModified: new Date().toISOString().split('T')[0], author: buildPersonAuthorReference(undefined, SITE_URL), publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) };
  const itemListSchema = { '@context': 'https://schema.org', '@type': 'ItemList', name: `Best Nootropic Supplements Latam ${CURRENT_YEAR}`, itemListElement: productsLatam.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/${p.slug}/` })) };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <BestOf
        products={productsLatam}
        breadcrumbs={[{ label: 'Best of', href: '/best-nootropics' }]}
        hero={{ eyebrow: `Latinoamérica · Auditado ${CURRENT_YEAR}`, h1: `Los Mejores Nootrópicos en Latinoamérica ${CURRENT_YEAR}`, dek: 'Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú. Marcas que cumplen con COFEPRIS, ANVISA, ANMAT, INVIMA, ISP y DIGEMID.' }}
        searchItems={searchItems} uiStrings={uiStrings} trackingSurface="best_of_latam"
        preList={
          <div className="flex flex-col gap-5">
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-warn" as="aside" aria-labelledby="latam-note-heading">
              <h2 id="latam-note-heading" className="text-[16px] font-bold text-ds-warn-ink m-0 mb-2">Nota de importación</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 leading-[1.65]">
                La regulación varía por país: COFEPRIS (MX), ANVISA (BR), ANMAT (AR), INVIMA (CO), ISP (CL), DIGEMID (PE). Brasil aplica hasta 60% de impuesto de importación sobre suplementos; México suele estar libre de aranceles en pedidos menores a USD $50. Pide solo 1 mes de suministro por envío para mantenerte dentro de los límites de importación personal.
              </p>
            </Card>
            <Card variant="subdued" padding={20} className="border-l-[3px] border-l-ds-accent">
              <Chip tone="accent">★ Elección Editorial — Latinoamérica {CURRENT_YEAR}</Chip>
              <h2 className="text-[20px] font-bold text-ds-ink m-0 mt-2 mb-1">{winner.name}</h2>
              <p className="text-[13.5px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">{winner.summary}</p>
              <a href={winner.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white font-semibold px-5 py-[10px] rounded-[8px] text-[13px] no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2">
                {winner.priceMonthlyUSD ? `Ver precio ($${winner.priceMonthlyUSD}/mes USD) →` : 'Ver precio →'}
              </a>
            </Card>
          </div>
        }
        postList={
          <section>
            <h2 className="text-[22px] font-bold text-ds-ink m-0 mb-4 tracking-[-0.01em]">Preguntas frecuentes — Latinoamérica</h2>
            <FaqAccordion items={faqItems} />
          </section>
        }
              regulatoryPillar={{ label: 'Nootrópicos prohibidos por ANMAT (Argentina)', href: '/anmat-disposicion-2105-2022-prohibidos/' }}
      />
    </>
  );
}
