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
  ANMAT_DISPOSICION_2105_2022,
  anmatProhibitedCompounds,
  anmatProhibitedProducts,
  auditProductsForAnmat,
  productsLatam,
  getRegionalHealthDisclaimer,
} from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const PAGE_URL = `${SITE_URL}/anmat-disposicion-2105-2022-prohibidos/`;


const PAGE_TITLE = 'ANMAT Disposición 2105/2022: los siete productos prohibidos en Argentina';
const PAGE_DESCRIPTION =
  'La Disposición 2105/2022 de la ANMAT prohíbe siete productos con nombre propio (Noopept, F-Phenibut y Bacopa de las marcas Newmind y PURENOOTROPICS). No prohíbe una clase de compuestos. Texto, alcance y verificación de nuestro catálogo LATAM.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'latam', path: '/anmat-disposicion-2105-2022-prohibidos/', availableInRegions: ['latam'] }),
  openGraph: {
    title: 'ANMAT 2105/2022: siete productos prohibidos, no una clase de compuestos',
    description: 'Qué prohíbe exactamente la Disposición 2105/2022 de la ANMAT, según el Boletín Oficial del 22 de marzo de 2022.',
    type: 'article',
  },
  twitter: buildTwitter({ title: PAGE_TITLE, description: PAGE_DESCRIPTION }),
};

const audit = auditProductsForAnmat(productsLatam);
const compliantCount = audit.filter(a => a.bannedCompounds.length === 0).length;
const nonCompliantCount = audit.length - compliantCount;
// Artículo 1 names products of two brands; the ingredient matcher cannot see
// a brand, so check it separately before claiming no catalogue product is one.
const catalogueBrandMatches = productsLatam.filter(p => /newmind|pure\s*nootropics/i.test(`${p.brand} ${p.name}`));
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
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  datePublished: '2026-05-05',
  dateModified: auditDateIso,
  author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
};

// Dataset schema — the seven products named in Artículo 1 as structured data
const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'ANMAT Disposición 2105/2022 — Prohibited products (Artículo 1)',
  description:
    'The seven named products whose use, distribution and sale ANMAT Disposición 2105/2022 prohibits nationwide in Argentina (all lots and presentations), as written in Artículo 1 of the Boletín Oficial text of 22 March 2022. The disposition is a product-specific prohibition, not a ban on a class of compounds.',
  url: PAGE_URL,
  keywords: ['ANMAT', 'Argentina', 'Disposición 2105/2022', 'Boletín Oficial', 'Noopept', 'F-Phenibut', 'Newmind', 'PURENOOTROPICS'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  distribution: {
    '@type': 'DataDownload',
    encodingFormat: 'text/html',
    contentUrl: PAGE_URL,
  },
  variableMeasured: anmatProhibitedProducts.map(p => ({
    '@type': 'PropertyValue',
    name: p.nameAsWritten,
    description: `Brand: ${p.brand}. Basis: named in Artículo 1.`,
  })),
  citation: `ANMAT Disposición ${ANMAT_DISPOSICION_2105_2022.number} (${ANMAT_DISPOSICION_2105_2022.gdeReference}), Boletín Oficial de la República Argentina, ${ANMAT_DISPOSICION_2105_2022.publishedDate}, ${ANMAT_DISPOSICION_2105_2022.sourceUrl}`,
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
    q: '¿Qué es la Disposición 2105/2022 de la ANMAT?',
    a: 'Es una disposición de la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT) de Argentina, firmada el 21 de marzo de 2022 y publicada en el Boletín Oficial el 22 de marzo de 2022. Su Artículo 1 prohíbe el uso, la distribución y la comercialización en todo el territorio nacional de todos los lotes y presentaciones de siete productos con nombre propio de las marcas Newmind y PURENOOTROPICS, ofrecidos en el sitio web noopept.com.ar.',
  },
  {
    q: '¿Prohíbe una clase de compuestos nootrópicos?',
    a: 'No. El Artículo 1 enumera siete productos concretos y no prohíbe ninguna clase de compuestos. Los considerandos también citan textualmente una afirmación publicitaria de esos productos ("será hasta mil veces más potente que el piracetam"); es una cita del material promocional, no una prohibición. La disposición tampoco menciona el fenibut sin flúor.',
  },
  {
    q: '¿Por qué la ANMAT prohibió estos productos?',
    a: 'Según los considerandos, los productos declaraban en su composición sustancias no autorizadas en el Código Alimentario Argentino (CAA), entre ellas "4-Amino-3 (4-fluorophenyl) butyric acid HCL", "Noopept" y "Bacopa Monnieri whole herb extract"; no tenían registro ante la ANMAT; se promocionaban con afirmaciones terapéuticas; y no podían encuadrarse como suplementos dietarios. La ANMAT los consideró productos peligrosos para la salud.',
  },
  {
    q: '¿Afecta a los suplementos con Bacopa monnieri?',
    a: 'La disposición prohíbe un producto concreto, "PURENOOTROPICS BACOGNIZE Bacopa Monnieri", y cita el "Bacopa Monnieri whole herb extract" declarado en los productos de ese sitio web. No prohíbe la bacopa como ingrediente en general, por lo que nuestra verificación de catálogo no marca productos por contener bacopa.',
  },
  {
    q: '¿Por qué este sitio web hace esta verificación?',
    a: 'Como sitio editorial de comparación de nootrópicos que opera en LATAM, comprobamos si algún producto de nuestro catálogo contiene las sustancias que dan nombre a los productos prohibidos (Noopept y F-Phenibut). Esta verificación no sustituye el registro ante la ANMAT ni el encuadre de cada producto en el CAA.',
  },
];

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={datasetSchema} />
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
          {PAGE_TITLE}
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          La <strong>Disposición 2105/2022</strong> de la <abbr title="Administración Nacional de Medicamentos, Alimentos y Tecnología Médica">ANMAT</abbr> (Administración Nacional de Medicamentos, Alimentos y Tecnología Médica), publicada en el
          Boletín Oficial (BO) de la República Argentina el 22 de marzo de 2022, prohíbe{' '}
          <strong>siete productos con nombre propio</strong> de las marcas Newmind y PURENOOTROPICS,
          ofrecidos en el sitio web noopept.com.ar. No es una prohibición de una clase de compuestos.
          Esta página resume qué dice el texto oficial y verifica si algún producto de nuestro catálogo
          LATAM contiene las sustancias que dan nombre a esos productos.
        </p>

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mb-6 text-sm text-amber-900">
          <strong className="block mb-1">Alcance de la disposición</strong>
          La prohibición alcanza a todos los lotes y presentaciones de los siete productos citados en su
          Artículo 1. No prohíbe ninguna clase de compuestos nootrópicos ni ninguna sustancia en
          general: fuera de esos siete productos, la disposición no declara prohibido ningún otro
          producto ni ingrediente.
        </aside>

        <AffiliateDisclosure />

        {/* What Artículo 1 prohibits */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Qué prohíbe: los siete productos del Artículo 1</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Texto del Artículo 1: &ldquo;Prohíbese el uso, distribución y comercialización en todo el
            territorio nacional de todos los lotes y presentaciones de los siguientes productos:
            {' '}Newmind – Noopept – GVS -111 polvo; Newmind – F-Phenibut polvo; PURENOOTROPICS Noopept
            cápsulas; PURENOOTROPICS Noopept polvo; NOOPEPT sublingual, PURE NOOTROPICS; B-12 sublingual
            PURENOOTROPICS; y PURENOOTROPICS BACOGNIZE Bacopa Monnieri.&rdquo;
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-800">
            {anmatProhibitedProducts.map(p => (
              <li key={p.nameAsWritten}>
                <strong>{p.nameAsWritten}</strong>
                <span className="text-gray-500"> — marca {p.brand}{p.presentation ? `, presentación: ${p.presentation}` : ''}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-gray-500 mt-3">
            Según los considerandos, los productos se ofrecían en el sitio web {ANMAT_DISPOSICION_2105_2022.offeringWebsite}.
          </p>
        </section>

        {/* Why: the recitals */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Por qué: lo que dicen los considerandos</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              Los productos se ofrecían como suplementos dietarios, pero la ANMAT concluyó que, por su
              composición, presentación (sublingual) e indicación, no pueden encuadrarse en el artículo 1381
              del Código Alimentario Argentino (CAA), que regula los suplementos dietarios.
            </li>
            <li>
              Declaraban en su composición sustancias no autorizadas en el CAA, &ldquo;entre ellas&rdquo;
              las tres que se detallan más abajo.
            </li>
            <li>
              No existían antecedentes de registro de los productos ni de la firma, ni registro en el
              Registro de Especialidades Medicinales de la ANMAT con los nombres comerciales
              &ldquo;Noopept&rdquo;, &ldquo;F-Phenibut&rdquo;, &ldquo;Newmind&rdquo; ni &ldquo;Pure nootropics&rdquo;.
            </li>
            <li>
              Se promocionaban con afirmaciones terapéuticas, por ejemplo &ldquo;ayuda el mejoramiento en
              pacientes con Alzheimer&rdquo; y &ldquo;será hasta mil veces más potente que el piracetam&rdquo;
              (citas textuales del material promocional recogidas en la disposición).
            </li>
            <li>
              La ANMAT consideró que se trataba de productos peligrosos para la salud y que, para obtener
              registro, deberían evaluarse en la categoría de medicamentos.
            </li>
          </ul>
        </section>

        {/* Substances cited in the recitals */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sustancias citadas en los considerandos</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Estas sustancias aparecen en los considerandos como declaradas en la composición de los
            productos y no autorizadas en el CAA. La disposición prohíbe los siete productos, no estas
            sustancias como tales.
          </p>
          <div className="space-y-4">
            {anmatProhibitedCompounds.map(c => (
              <div key={c.name} className="border border-gray-200 rounded-lg p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{c.nameEs}</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    Citada en los considerandos
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{c.noteEs}</p>
                <p className="text-xs text-gray-500">
                  <strong>Texto de la disposición:</strong> &ldquo;{c.declaredAs}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Catalogue check summary */}
        <section className="my-10 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Verificación de nuestro catálogo LATAM
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Comprobamos si alguno de los <strong>{audit.length} productos</strong> de nuestro catálogo
            LATAM declara Noopept o F-Phenibut, las sustancias que dan nombre a los productos prohibidos.
            No marcamos productos por contener Bacopa monnieri: la disposición prohíbe un producto concreto
            de bacopa, no la bacopa como ingrediente.{' '}
            {catalogueBrandMatches.length === 0
              ? 'Ningún producto de nuestro catálogo es de las marcas Newmind o PURENOOTROPICS citadas en el Artículo 1.'
              : `Productos de nuestro catálogo de las marcas citadas en el Artículo 1: ${catalogueBrandMatches.map(p => p.name).join(', ')}.`}{' '}
            Estado actual:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-green-300 rounded-lg p-4">
              <div className="text-3xl font-black text-green-700">{compliantCount}</div>
              <div className="text-sm font-medium text-gray-900 mt-1">Sin Noopept ni F-Phenibut</div>
              <div className="text-xs text-gray-500 mt-1">Según la lista de ingredientes declarada.</div>
            </div>
            <div className={`bg-white border ${nonCompliantCount > 0 ? 'border-red-300' : 'border-gray-200'} rounded-lg p-4`}>
              <div className={`text-3xl font-black ${nonCompliantCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                {nonCompliantCount}
              </div>
              <div className="text-sm font-medium text-gray-900 mt-1">Con Noopept o F-Phenibut</div>
              <div className="text-xs text-gray-500 mt-1">
                {nonCompliantCount > 0
                  ? 'Declaran al menos una de esas dos sustancias.'
                  : 'Ningún producto de nuestro catálogo declara esas sustancias.'}
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
                  <th className="px-3 py-2 font-semibold text-gray-700">Noopept / F-Phenibut</th>
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
                          ✓ No declara
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
            Verificación automatizada basada en las listas de ingredientes declaradas por cada
            fabricante; no sustituye el registro ante la ANMAT ni el encuadre de cada producto en el CAA.
            Última verificación: {auditDate}.
          </p>
        </section>

        {/* What it does not do */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Qué no hace la disposición</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>No prohíbe una clase de compuestos nootrópicos ni publica una lista abierta de sustancias.</li>
            <li>
              Un compuesto que solo aparece dentro de una afirmación publicitaria citada textualmente en
              los considerandos no queda prohibido por esa mención.
            </li>
            <li>No prohíbe la Bacopa monnieri como ingrediente: prohíbe un producto concreto que la declara.</li>
            <li>No menciona el fenibut sin flúor; el producto prohibido es &ldquo;Newmind – F-Phenibut polvo&rdquo;.</li>
          </ul>
        </section>

        {/* What this means for readers */}
        <section className="my-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-3">Qué significa para lectores en Argentina</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Los siete productos citados</strong> (marcas Newmind y PURENOOTROPICS) no pueden
              usarse, distribuirse ni comercializarse en Argentina, en ningún lote ni presentación.
            </li>
            <li>
              <strong>Regla general del CAA.</strong> El artículo 1381 del CAA define los suplementos
              dietarios como &ldquo;productos destinados a incrementar la ingesta dietaria habitual,
              suplementando la incorporación de nutrientes en la dieta de las personas sanas&rdquo;. La
              disposición concluyó que productos con esa composición, presentación e indicación no encajan
              en esa definición.
            </li>
            <li>
              <strong>Consulte con un profesional de la salud</strong> antes de iniciar cualquier
              suplemento cognitivo.
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
              label: 'ANMAT Disposición 2105/2022 (DI-2022-2105-APN-ANMAT#MS) — Texto completo, Boletín Oficial de la República Argentina, 22/03/2022, aviso N° 17097/22',
              url: ANMAT_DISPOSICION_2105_2022.sourceUrl,
            },
            {
              type: 'Regulatorio',
              label: 'Código Alimentario Argentino (CAA), artículo 1381 — Suplementos dietarios (texto incorporado por la Resolución 74/98, InfoLEG)',
              url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/50000-54999/50664/norma.htm',
            },
            {
              type: 'Regulatorio',
              label: 'ANMAT — Administración Nacional de Medicamentos, Alimentos y Tecnología Médica',
              url: 'https://www.argentina.gob.ar/anmat',
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
