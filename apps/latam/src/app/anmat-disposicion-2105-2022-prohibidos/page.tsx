import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AffiliateDisclosure,
  SchemaOrg,
  Sources,
  buildAlternates,
  buildTwitter,
  PublicShell,
} from '@nootropic/ui';
import {
  anmatProhibitedCompounds,
  auditProductsForAnmat,
  productsLatam,
  getRegionalHealthDisclaimer,
} from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const PAGE_URL = `${SITE_URL}/anmat-disposicion-2105-2022-prohibidos/`;


export const metadata: Metadata = {
  title: 'ANMAT Disposición 2105/2022: Nootrópicos prohibidos en Argentina',
  description:
    'Lista completa de nootrópicos prohibidos por ANMAT bajo la Disposición 2105/2022 (Noopept, racetams, fenibut, tianeptina, adrafinilo). Auditoría de nuestro catálogo LATAM contra esta lista. Guía para consumidores argentinos.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/anmat-disposicion-2105-2022-prohibidos/', availableInRegions: ['latam'] }),
  openGraph: {
    title: 'Nootrópicos prohibidos en Argentina — ANMAT 2105/2022',
    description: 'Auditoría independiente de nuestro catálogo LATAM contra los compuestos prohibidos por ANMAT.',
    type: 'article',
  },
  twitter: buildTwitter({ title: 'ANMAT Disposición 2105/2022: Nootrópicos prohibidos en Argentina', description: 'Lista completa de nootrópicos prohibidos por ANMAT bajo la Disposición 2105/2022 (Noopept, racetams, fenibut, tianeptina, adrafinilo). Auditoría de nuestro catálogo LATAM contra esta lista. Guía para consumidores argentinos.' }),
};

const audit = auditProductsForAnmat(productsLatam);
const compliantCount = audit.filter(a => a.bannedCompounds.length === 0).length;
const nonCompliantCount = audit.length - compliantCount;
const auditDate = new Date().toLocaleDateString('es-AR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const auditDateIso = new Date().toISOString().split('T')[0];

// Schema.org Article
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ANMAT Disposición 2105/2022: Nootrópicos prohibidos en Argentina',
  description:
    'Lista completa de compuestos nootrópicos prohibidos por ANMAT en Argentina, con auditoría de nuestro catálogo LATAM.',
  datePublished: '2026-05-05',
  dateModified: auditDateIso,
  author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['#hero-paragraph', '.faq-question'],
  },
};

// Dataset schema — the prohibited compound list as structured data
const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'ANMAT Disposición 2105/2022 — Prohibited Nootropic Compounds',
  description:
    'Structured list of nootropic compounds prohibited from sale as dietary supplements in Argentina under ANMAT Disposición 2105/2022, with mechanism and chemical-alias mappings.',
  url: PAGE_URL,
  keywords: ['ANMAT', 'Argentina', 'Disposición 2105/2022', 'nootropics', 'prohibited supplements', 'noopept', 'piracetam', 'phenibut', 'tianeptine'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  distribution: {
    '@type': 'DataDownload',
    encodingFormat: 'text/html',
    contentUrl: PAGE_URL,
  },
  variableMeasured: anmatProhibitedCompounds.map(c => ({
    '@type': 'PropertyValue',
    name: c.name,
    description: c.mechanismEn,
    alternateName: c.aliases,
  })),
  citation: 'ANMAT Disposición 2105/2022, Boletín Oficial República Argentina, 2022-04-08',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'ANMAT 2105/2022', item: PAGE_URL },
  ],
};

const faqs = [
  {
    q: '¿Qué es la Disposición 2105/2022 de ANMAT?',
    a: 'Es una resolución regulatoria emitida por la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica de Argentina, publicada en el Boletín Oficial el 8 de abril de 2022. Prohíbe la comercialización de varios compuestos nootrópicos sintéticos (incluyendo Noopept, racetams como piracetam y aniracetam, fenibut, tianeptina y adrafinilo) como suplementos dietarios en Argentina.',
  },
  {
    q: '¿Por qué ANMAT prohíbe estos compuestos?',
    a: 'Los compuestos listados son sustancias farmacológicamente activas con perfiles de seguridad que requieren supervisión médica. Algunos (piracetam, tianeptina) están aprobados como medicamentos bajo prescripción en Argentina pero no como suplementos. Otros (Noopept, racetams sintéticos) carecen de aprobación regulatoria local y presentan riesgos de tolerancia, dependencia o interacciones medicamentosas.',
  },
  {
    q: '¿Puedo importar estos compuestos para uso personal?',
    a: 'La importación personal de medicamentos no autorizados está restringida en Argentina. Los compuestos prohibidos por ANMAT no pueden importarse legalmente como suplementos. La compra a través de Mercado Libre cross-border o iHerb puede resultar en retenciones aduaneras, especialmente para envíos que contengan racetams, Noopept o fenibut.',
  },
  {
    q: '¿Mis vitaminas o suplementos comunes están afectados?',
    a: 'No. La Disposición 2105/2022 se aplica específicamente a compuestos nootrópicos sintéticos. Suplementos comunes (omega-3, vitaminas del complejo B, magnesio, hierbas adaptógenas como ashwagandha o rhodiola, ginkgo biloba, bacopa monnieri, L-teanina) no están afectados.',
  },
  {
    q: '¿Por qué este sitio web hace esta auditoría?',
    a: 'Como sitio editorial de comparación de nootrópicos que opera en LATAM, consideramos importante verificar que los productos que recomendamos a lectores argentinos cumplan con la regulación local. Auditamos cada producto de nuestro catálogo contra la lista de ANMAT y nunca recomendamos productos que contengan compuestos prohibidos a tráfico procedente de Argentina.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const compoundClassLabels: Record<string, string> = {
  'racetam': 'Racetam',
  'gabapentinoid': 'Gabapentinoide',
  'modafinil-prodrug': 'Profármaco de modafinilo',
  'antidepressant-derivative': 'Derivado antidepresivo',
  'peptide-nootropic': 'Nootrópico peptídico',
  'cholinergic-prescription': 'Colinérgico de prescripción',
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={datasetSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Inicio</Link>
          {' / '}
          <span>ANMAT Disposición 2105/2022</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>
            Revisado por{' '}
            <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong>
          </span>
          <span>·</span>
          <span>Última auditoría: {auditDate}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          ANMAT Disposición 2105/2022: Nootrópicos prohibidos en Argentina
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          La <strong>Disposición 2105/2022</strong> de ANMAT (<abbr title="Administración Nacional de Medicamentos, Alimentos y Tecnología Médica">Administración Nacional de Medicamentos, Alimentos y Tecnología Médica</abbr>) prohíbe la comercialización de varios
          nootrópicos sintéticos (Noopept, racetams, fenibut, tianeptina, adrafinilo) como suplementos
          dietarios en Argentina. Esta página lista los compuestos prohibidos y audita cada producto de
          nuestro catálogo LATAM contra esta lista, para garantizar que los lectores argentinos no sean
          dirigidos hacia productos que contengan ingredientes regulados.
        </p>

        {/* AR-targeted regulatory warning */}
        <aside className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 mb-6 text-sm text-red-900">
          <strong className="block mb-1">Aviso para lectores en Argentina</strong>
          Los compuestos listados a continuación no pueden venderse legalmente en Argentina como
          suplementos. Si compra a través de Mercado Libre cross-border, iHerb u otras plataformas
          internacionales, los envíos que contengan estos ingredientes pueden ser retenidos por la Aduana
          Nacional. Recomendamos verificar la lista de ingredientes de cualquier producto antes de
          importarlo.
        </aside>

        <AffiliateDisclosure />

        {/* Audit summary */}
        <section className="my-10 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Auditoría de nuestro catálogo LATAM
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Verificamos cada uno de los <strong>{audit.length} productos</strong> en nuestro catálogo
            LATAM contra los <strong>{anmatProhibitedCompounds.length} compuestos prohibidos</strong>{' '}
            por ANMAT. Estado actual:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-green-300 rounded-lg p-4">
              <div className="text-3xl font-black text-green-700">{compliantCount}</div>
              <div className="text-sm font-medium text-gray-900 mt-1">Productos compatibles</div>
              <div className="text-xs text-gray-500 mt-1">Sin compuestos prohibidos por ANMAT.</div>
            </div>
            <div className={`bg-white border ${nonCompliantCount > 0 ? 'border-red-300' : 'border-gray-200'} rounded-lg p-4`}>
              <div className={`text-3xl font-black ${nonCompliantCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                {nonCompliantCount}
              </div>
              <div className="text-sm font-medium text-gray-900 mt-1">Productos no recomendados para AR</div>
              <div className="text-xs text-gray-500 mt-1">
                {nonCompliantCount > 0
                  ? 'Contienen al menos un compuesto prohibido por ANMAT.'
                  : 'Ningún producto en nuestro catálogo contiene compuestos prohibidos.'}
              </div>
            </div>
          </div>
        </section>

        {/* Per-product audit table */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Estado por producto</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Producto</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Marca</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Estado ANMAT</th>
                </tr>
              </thead>
              <tbody>
                {audit.map(({ product, bannedCompounds }, i) => (
                  <tr key={product.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      <Link href={`/${product.slug}/`} className="hover:text-green-700">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{product.brand}</td>
                    <td className="px-3 py-2">
                      {bannedCompounds.length === 0 ? (
                        <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          ✓ Compatible
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          ✗ Contiene: {bannedCompounds.map(c => c.nameEs).join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">
            Auditoría automatizada basada en las listas de ingredientes declaradas por cada fabricante.
            Última verificación: {auditDate}.
          </p>
        </section>

        {/* Prohibited-compound catalogue */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Compuestos prohibidos por ANMAT</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            La Disposición 2105/2022 prohíbe los siguientes compuestos como suplementos dietarios en
            Argentina. La lista se actualiza con resoluciones posteriores de ANMAT.
          </p>
          <div className="space-y-4">
            {anmatProhibitedCompounds.map(c => (
              <div key={c.name} className="border border-gray-200 rounded-lg p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{c.nameEs}</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {compoundClassLabels[c.class]}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{c.mechanismEs}</p>
                {c.aliases.length > 0 && (
                  <p className="text-xs text-gray-500">
                    <strong>Alias / nombres químicos:</strong> {c.aliases.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* What this means for AR consumers */}
        <section className="my-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-3">Qué hacer si vive en Argentina</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Verifique la lista de ingredientes</strong> de cualquier suplemento que esté
              considerando importar. Busque los nombres listados arriba (incluidos los alias químicos).
            </li>
            <li>
              <strong>Considere el riesgo aduanero.</strong> Los envíos cross-border que contengan
              compuestos prohibidos pueden ser retenidos en la Aduana Nacional Argentina, especialmente
              en aeropuertos internacionales (Ezeiza, Aeroparque).
            </li>
            <li>
              <strong>Consulte con un profesional médico</strong> antes de iniciar cualquier suplemento
              cognitivo. Los compuestos prohibidos por ANMAT generalmente requieren supervisión médica
              por razones de seguridad.
            </li>
            <li>
              <strong>Revise nuestros productos compatibles.</strong> Los {compliantCount} productos
              listados arriba como "Compatible" no contienen compuestos prohibidos por ANMAT y pueden
              importarse legalmente para uso personal.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="faq-question font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        <Sources
          defaultOpen
          heading="Fuentes regulatorias"
          sources={[
            {
              type: 'Regulatorio',
              label: 'ANMAT Disposición 2105/2022 — Texto completo (Boletín Oficial República Argentina)',
              url: 'https://www.argentina.gob.ar/normativa/nacional/disposici%C3%B3n-2105-2022-364076',
            },
            {
              type: 'Regulatorio',
              label: 'ANMAT — Administración Nacional de Medicamentos, Alimentos y Tecnología Médica',
              url: 'https://www.argentina.gob.ar/anmat',
            },
            {
              type: 'Regulatorio',
              label: 'ANMAT — Listado de productos prohibidos (consulta pública)',
              url: 'https://www.argentina.gob.ar/anmat/regulados/productos-prohibidos',
            },
            {
              type: 'Cientifico',
              label: 'Malykh AG, Sadaie MR. Piracetam and piracetam-like drugs: from basic science to novel clinical applications to CNS disorders. Drugs. 2010 (PubMed PMID: 20166767)',
              url: 'https://pubmed.ncbi.nlm.nih.gov/20166767/',
            },
            {
              type: 'Cientifico',
              label: 'Owen GN et al. The combined effects of L-theanine and caffeine on cognitive performance and mood. Nutritional Neuroscience. 2008 (PubMed PMID: 18681988)',
              url: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
            },
            {
              type: 'Editorial',
              label: 'The Nootropic Lab — Metodología editorial',
              url: `${SITE_URL}/methodology/`,
            },
          ]}
        />

        {/* Health disclaimer */}
        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Aviso de salud y regulatorio</strong>
          {getRegionalHealthDisclaimer('latam')}
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/" className="text-green-700 underline">← Volver al inicio</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Ver metodología</Link>
          {' · '}
          <Link href="/imprint/" className="text-green-700 underline">Imprint</Link>
        </div>
      </article>
    </PublicShell>
  );
}
