import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsCA } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Les meilleurs nootropiques au Canada 2026 — Guide de l\'acheteur canadien',
  description:
    'Les suppléments nootropiques les mieux notés pour les acheteurs canadiens. Livraison au Canada confirmée, analyses fondées sur les données probantes et audit complet de dosage clinique.',
  alternates: {
    languages: {
      'en-CA': '/best-nootropics',
      'fr-CA': '/fr/meilleurs-nootropiques',
    },
  },
};

const faqItems = [
  {
    q: 'Les nootropiques sont-ils légaux au Canada?',
    a: 'La plupart des suppléments nootropiques sont légaux au Canada en tant que produits de santé naturels (PSN) réglementés par Santé Canada. Les produits portant un NPN (numéro de produit naturel) ont été évalués pour leur innocuité. Certains composés (p. ex. les racétams, le modafinil) sont réservés sur ordonnance. Tous les produits que nous recommandons utilisent des ingrédients autorisés par Santé Canada.',
  },
  {
    q: 'Dois-je payer des droits de douane sur les nootropiques commandés des États-Unis ou du Royaume-Uni?',
    a: 'Les commandes de moins de 150 $ CAD en provenance des États-Unis entrent généralement en franchise de droits dans le cadre de l\'ACEUM/CUSMA. Les commandes du Royaume-Uni peuvent être assujetties à des droits après les changements post-Brexit. Les produits expédiés depuis l\'Amérique du Nord constituent votre meilleure option pour éviter les délais d\'importation.',
  },
  {
    q: 'Quel nootropique est livré le plus rapidement au Canada?',
    a: 'Mind Lab Pro et Performance Lab Mind sont tous deux expédiés directement au Canada depuis leurs entrepôts au Royaume-Uni et en Europe, avec une livraison habituelle de 5 à 10 jours ouvrables. Les marques américaines comme Alpha Brain expédient depuis des entrepôts aux États-Unis vers le Canada en 3 à 7 jours.',
  },
];

export default function FrMeilleursNootropiquesPage() {
  const winner = productsCA.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Les meilleurs nootropiques au Canada 2026',
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab CA' },
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

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Les meilleurs suppléments nootropiques au Canada 2026',
    itemListElement: productsCA.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://ca.thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <div lang="fr-CA">
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <StickyCtaBar productName={winner.name} affiliateUrl={winner.affiliateUrl} />

      <article className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-2 text-xs text-gray-500">
          Dernière mise à jour :{' '}
          {new Date().toLocaleDateString('fr-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Les meilleurs nootropiques au Canada 2026
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Tous les produits listés ci-dessous sont expédiés directement au Canada. Nous vérifions
          la disponibilité canadienne, le statut PSN de Santé Canada le cas échéant, et indiquons
          les droits d\'importation pour chaque marque.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-green-900 mb-2">Note pour les acheteurs canadiens</h2>
          <p className="text-sm text-green-800 leading-relaxed">
            Les acheteurs canadiens bénéficient de l\'ACEUM/CUSMA — les commandes de moins de
            150 $ CAD en provenance des États-Unis entrent généralement en franchise de droits. Les
            marques britanniques comme Mind Lab Pro et Performance Lab offrent la livraison
            internationale avec un délai standard de 5 à 10 jours ouvrables.
          </p>
        </div>

        <AffiliateDisclosure />

        <div className="mb-8">
          <a href="#comparison-table" className="text-green-700 underline text-sm font-medium">
            → Aller au tableau comparatif Canada
          </a>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10">
          <div className="editor-badge mb-2 inline-block">Choix de la rédaction — Canada 2026</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h2>
          <p className="text-sm text-gray-600 mb-3">{winner.summary}</p>
          <a
            href={winner.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Voir le prix ({winner.priceMonthlyUSD} $/mois USD) →
          </a>
        </div>

        <section id="comparison-table">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Comparatif de nootropiques au Canada 2026
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Prix en USD (les marques internationales affichent leurs prix en USD pour les commandes canadiennes).
          </p>
          <ComparisonTable products={productsCA} market="us" />
        </section>

        <section className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Comment nous évaluons les nootropiques</h2>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            Chaque produit est évalué selon 5 critères : qualité des ingrédients, dosage par rapport
            aux données cliniques, transparence de la formule, rapport qualité-prix et confiance
            envers la marque.
          </p>
          <a href="/methodology" className="text-green-700 underline text-sm font-medium">
            Lire notre méthodologie complète →
          </a>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ — Nootropiques au Canada</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Lectures recommandées</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="/guides/what-are-nootropics" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Qu\'est-ce que les nootropiques?</div>
              <div className="text-xs text-gray-500">Un guide d\'introduction aux suppléments cognitifs</div>
            </a>
            <a href="/guides/how-to-stack-nootropics" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Comment combiner les nootropiques</div>
              <div className="text-xs text-gray-500">Associez les ingrédients en toute sécurité pour de meilleurs résultats</div>
            </a>
            <a href="/ingredients" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Base de données des ingrédients</div>
              <div className="text-xs text-gray-500">Profils évalués selon les données probantes pour 15 nootropiques clés</div>
            </a>
            <a href="/guides/nootropics-for-focus-vs-memory" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Concentration ou mémoire?</div>
              <div className="text-xs text-gray-500">Quels nootropiques fonctionnent le mieux selon votre objectif?</div>
            </a>
          </div>
        </section>

        <div className="mt-10 text-sm text-gray-500">
          <a href="/best-nootropics" className="text-green-700 underline">
            🇨🇦 Version anglaise : Best Nootropics in Canada 2026
          </a>
        </div>
      </article>
    </div>
  );
}
