import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter, PublicShell } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search-fr';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: 'The Nootropic Lab UE — Avis indépendants sur les suppléments cognitifs en Europe',
  description:
    'La plateforme indépendante de comparaison de nootropiques pour les acheteurs européens. Prix en EUR, produits conformes à la réglementation UE et conseils réglementaires complets.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/fr/', availableInRegions: ['eu'] }),
  openGraph: buildOpenGraph({
    regionCode: 'eu',
    path: '/fr/',
    title: 'The Nootropic Lab UE — Avis indépendants sur les suppléments cognitifs en Europe',
    description:
      'La plateforme indépendante de comparaison de nootropiques pour les acheteurs européens. Prix en EUR, produits conformes à la réglementation UE et conseils réglementaires complets.',
  }),
  twitter: buildTwitter({
    title: 'The Nootropic Lab UE — Avis indépendants sur les suppléments cognitifs en Europe',
    description:
      'La plateforme indépendante de comparaison de nootropiques pour les acheteurs européens. Prix en EUR, produits conformes à la réglementation UE et conseils réglementaires complets.',
  }),
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab UE',
  url: 'https://eu.thenootropiclab.com/fr',
  description: 'Avis indépendants sur les suppléments cognitifs pour les acheteurs européens.',
  inLanguage: 'fr-FR',
};

const features = [
  {
    icon: '🔬',
    title: 'Audits de dosage clinique',
    desc:
      "Chaque évaluation inclut un tableau comparant le dosage utilisé dans le produit aux doses minimales efficaces issues d'études cliniques avec comité de lecture.",
  },
  {
    icon: '🇪🇺',
    title: 'Conformité UE vérifiée',
    desc:
      "Nous vérifions chaque produit au regard de la directive UE 2002/46/CE et du règlement (CE) n° 1924/2006 de l'EFSA sur les allégations de santé. Nous ne recommandons pas les formules disponibles uniquement aux États-Unis.",
  },
  {
    icon: '💶',
    title: 'Prix en EUR et livraison UE',
    desc:
      'Nous ne présentons que les produits disposant de boutiques UE dédiées — pas de frais de douane, prix en EUR et livraison locale.',
  },
];

const quickLinks = [
  {
    href: '/fr/meilleurs-nootropiques',
    title: `Les Meilleurs Nootropiques ${CURRENT_YEAR} (UE)`,
    desc: 'Comparaison complète pour l\'UE avec audit de dosage clinique et prix en EUR.',
  },
  {
    href: '/nootropic-comparison',
    title: 'Outil de comparaison interactif',
    desc: 'Triez et filtrez toutes les marques disponibles dans l\'UE côte à côte.',
  },
  {
    href: '/methodology',
    title: 'Notre méthodologie',
    desc: 'Comment nous évaluons les nootropiques.',
  },
];

export default function FRHomePage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={websiteSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Marché UE · Prix en EUR · Produits conformes à la réglementation UE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Le guide UE indépendant des
            <br />
            <span className="text-green-700">suppléments cognitifs</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Nous évaluons les nootropiques spécifiquement pour les acheteurs européens. Prix en EUR,
            conformité à la réglementation UE et aucun frais d&apos;importation caché.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/fr/meilleurs-nootropiques"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Les Meilleurs Nootropiques en Europe {CURRENT_YEAR} →
            </Link>
            <Link
              href="/nootropic-comparison"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Comparer toutes les marques UE
            </Link>
          </div>
          <nav aria-label="Sélecteur de langue" className="mt-4 flex gap-4 justify-center text-sm text-gray-500">
            <Link href="/" className="text-green-700 underline" hrefLang="en" lang="en">
              🇬🇧 English
            </Link>
            <Link href="/de/beste-nootropika" className="text-green-700 underline" hrefLang="de" lang="de">
              🇩🇪 Deutsch
            </Link>
            <Link href="/pt" className="text-green-700 underline" hrefLang="pt" lang="pt">
              🇵🇹 Português
            </Link>
          </nav>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Conçu pour les acheteurs européens
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6">
              <div className="text-3xl mb-3" aria-hidden="true">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Commencez vos recherches</h2>
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
    </PublicShell>
  );
}
