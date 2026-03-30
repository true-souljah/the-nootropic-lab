import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable, AffiliateDisclosure } from '@nootropic/ui';
import { productsEU } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Beste Nootropika 2026: Getestet & Verglichen für Deutschland',
  description:
    'Unabhängiger Nootropika Vergleich für Deutschland, Österreich und die Schweiz. EU-konforme Produkte, EUR-Preise, klinische Dosierungsanalyse.',
  alternates: {
    languages: {
      en: '/best-nootropics',
      'de-DE': '/de/beste-nootropika',
    },
  },
};

export default function BestNootropikaDE() {
  return (
    <article className="max-w-5xl mx-auto px-4 py-10" lang="de">
      <div className="mb-2 text-xs text-gray-500">
        Zuletzt aktualisiert:{' '}
        {new Date().toLocaleDateString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Beste Nootropika 2026:
        <br />
        Getestet &amp; Verglichen für Deutschland
      </h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        Alle Produkte in dieser Übersicht sind EU-konform (Richtlinie 2002/46/EG), in EUR
        bepreist und über einen EU-Shop erhältlich — keine Importzölle. Jede Zutat wurde gegen
        klinische Studien geprüft.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-blue-900 mb-2">EU-Regulierung</h2>
        <p className="text-sm text-blue-800 leading-relaxed">
          Nootropika werden in der EU als Nahrungsergänzungsmittel gemäß{' '}
          <strong>Richtlinie 2002/46/EG</strong> reguliert. Gesundheitsbezogene Angaben müssen
          der <strong>Verordnung (EG) 1924/2006</strong> entsprechen und ausschließlich EFSA-
          zugelassene Angaben verwenden. Alle empfohlenen Produkte verwenden EFSA-zugelassene
          Zutaten.
        </p>
      </div>

      <AffiliateDisclosure />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Nootropika Vergleich — EU/DACH 2026
        </h2>
        <ComparisonTable products={productsEU} market="eu" />
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <Link href="/best-nootropics" className="text-green-700 underline">
          → English version: Best Nootropics Europe 2026
        </Link>
      </div>
    </article>
  );
}
