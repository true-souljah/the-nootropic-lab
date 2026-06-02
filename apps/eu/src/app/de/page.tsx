import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter, PublicShell } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search-de';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: 'The Nootropic Lab EU — Unabhängige Bewertungen kognitiver Nahrungsergänzungsmittel in Europa',
  description:
    'Die unabhängige Nootropika-Vergleichsplattform für europäische Käufer. EUR-Preise, EU-konforme Produkte und vollständige regulatorische Orientierung.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/de/', availableInRegions: ['eu'] }),
  openGraph: buildOpenGraph({
    regionCode: 'eu',
    path: '/de/',
    title: 'The Nootropic Lab EU — Unabhängige Bewertungen kognitiver Nahrungsergänzungsmittel in Europa',
    description:
      'Die unabhängige Nootropika-Vergleichsplattform für europäische Käufer. EUR-Preise, EU-konforme Produkte und vollständige regulatorische Orientierung.',
  }),
  twitter: buildTwitter({
    title: 'The Nootropic Lab EU — Unabhängige Bewertungen kognitiver Nahrungsergänzungsmittel in Europa',
    description:
      'Die unabhängige Nootropika-Vergleichsplattform für europäische Käufer. EUR-Preise, EU-konforme Produkte und vollständige regulatorische Orientierung.',
  }),
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab EU',
  url: 'https://eu.thenootropiclab.com/de',
  description: 'Unabhängige Bewertungen kognitiver Nahrungsergänzungsmittel für europäische Käufer.',
  inLanguage: 'de-DE',
};

const features = [
  {
    icon: '🔬',
    title: 'Audits klinischer Dosierungen',
    desc:
      'Jede Bewertung enthält eine Vergleichstabelle zwischen der Wirkstoffdosis im Produkt und den minimal wirksamen Dosen aus peer-reviewten klinischen Studien.',
  },
  {
    icon: '🇪🇺',
    title: 'EU-Konformität verifiziert',
    desc:
      'Wir prüfen jedes Produkt gegen die EU-Richtlinie 2002/46/EG und die EFSA-Verordnung (EG) Nr. 1924/2006 zu gesundheitsbezogenen Angaben. Formulierungen, die nur in den USA erhältlich sind, empfehlen wir nicht.',
  },
  {
    icon: '💶',
    title: 'EUR-Preise und EU-Versand',
    desc:
      'Wir zeigen nur Produkte mit eigenen EU-Storefronts — keine Zollgebühren, Preise in EUR und lokaler Versand innerhalb der EU.',
  },
];

const quickLinks = [
  {
    href: '/de/beste-nootropika',
    title: `Die Besten Nootropika ${CURRENT_YEAR} (EU)`,
    desc: 'Vollständiger EU-Vergleich mit klinischem Dosis-Audit und EUR-Preisen.',
  },
  {
    href: '/nootropic-comparison',
    title: 'Interaktives Vergleichswerkzeug',
    desc: 'Sortieren und filtern Sie alle in der EU verfügbaren Marken nebeneinander.',
  },
  {
    href: '/methodology',
    title: 'Unsere Methodik',
    desc: 'Wie wir Nootropika bewerten.',
  },
];

export default function DEHomePage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={websiteSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            EU-Markt · EUR-Preise · EU-konforme Produkte
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Der unabhängige EU-Ratgeber für
            <br />
            <span className="text-green-700">kognitive Nahrungsergänzungsmittel</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Wir bewerten Nootropika speziell für europäische Käufer. EUR-Preise,
            EU-regulatorische Konformität und keine versteckten Importkosten.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/de/beste-nootropika"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Die Besten Nootropika in Europa {CURRENT_YEAR} →
            </Link>
            <Link
              href="/nootropic-comparison"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Alle EU-Marken vergleichen
            </Link>
          </div>
          <nav aria-label="Sprachauswahl" className="mt-4 flex gap-4 justify-center text-sm text-gray-500">
            <Link href="/" className="text-green-700 underline" hrefLang="en" lang="en">
              🇬🇧 English
            </Link>
            <Link href="/fr/meilleurs-nootropiques" className="text-green-700 underline" hrefLang="fr" lang="fr">
              🇫🇷 Français
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
          Konzipiert für europäische Käufer
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Starten Sie Ihre Recherche</h2>
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
