import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'The Nootropic Lab CA — Comparatifs Indépendants de Suppléments Cognitifs',
  description:
    'La plateforme indépendante de comparaison de nootropiques pour les acheteurs canadiens. Analyses fondées sur les données probantes, audits de dosage clinique et divulgation transparente des affiliés.',
  alternates: {
    languages: {
      'en-CA': '/',
      'fr-CA': '/fr',
    },
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab CA',
  url: 'https://ca.thenootropiclab.com/fr',
  description: 'Comparatifs indépendants de suppléments cognitifs pour les acheteurs canadiens.',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Nootropic Lab',
  url: 'https://ca.thenootropiclab.com/fr',
  description: 'Comparatifs indépendants de suppléments cognitifs avec audits de dosage clinique et divulgation transparente des affiliés.',
};

const features = [
  {
    icon: '🔬',
    title: 'Audits de dosage clinique',
    desc: 'Chaque analyse de produit comprend un tableau dosage/données probantes comparant chaque ingrédient à la dose minimale efficace tirée d\'essais cliniques révisés par des pairs.',
  },
  {
    icon: '🍁',
    title: 'Livraison au Canada vérifiée',
    desc: 'Tous les produits répertoriés sont expédiés directement au Canada. Nous indiquons le statut d\'importation de Santé Canada et les informations douanières pour chaque marque.',
  },
  {
    icon: '⚖️',
    title: 'Transparence des abonnements',
    desc: 'Nous évaluons chaque marque sur la facilité d\'annulation d\'abonnement. Les cotes Trustpilot sont affichées en ligne — y compris les mauvaises.',
  },
];

const quickLinks = [
  {
    href: '/fr/meilleurs-nootropiques',
    title: 'Les meilleurs nootropiques au Canada 2026',
    desc: 'Comparatif complet des meilleures marques avec livraison au Canada confirmée.',
  },
  {
    href: '/fr/comparer',
    title: 'Outil de comparaison interactif',
    desc: 'Triez et filtrez toutes les grandes marques côte à côte.',
  },
  {
    href: '/methodology',
    title: 'Notre méthodologie',
    desc: 'Comment nous évaluons et analysons les suppléments cognitifs.',
  },
];

export default function FrHomePage() {
  return (
    <div lang="fr-CA">
      <SchemaOrg schema={websiteSchema} />
      <SchemaOrg schema={orgSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Marché canadien · Fondé sur les données probantes · Affiliés déclarés
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Le guide canadien indépendant des
            <br />
            <span className="text-green-700">suppléments cognitifs</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Nous comparons la dose de chaque ingrédient avec les résultats d\'essais cliniques révisés
            par des pairs. Pas d\'auteurs anonymes. Pas de commissions cachées. Livraison au Canada
            vérifiée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/fr/meilleurs-nootropiques"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Les meilleurs nootropiques 2026 →
            </Link>
            <Link
              href="/fr/comparer"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Comparer toutes les marques
            </Link>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <Link href="/" className="text-green-700 underline">
              🇨🇦 Version anglaise
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Pourquoi The Nootropic Lab est différent
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Commencez votre recherche</h2>
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
    </div>
  );
}
