import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable, AffiliateDisclosure } from '@nootropic/ui';
import { productsEU } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Meilleurs Nootropiques 2026 Europe: Comparatif Complet',
  description:
    'Comparatif indépendant des meilleurs nootropiques disponibles en Europe. Prix en EUR, conformité réglementaire UE, audit clinique de chaque ingrédient.',
  alternates: {
    languages: {
      en: '/best-nootropics',
      'fr-FR': '/fr/meilleurs-nootropiques',
    },
  },
};

export default function MeilleursNootropiquesFR() {
  return (
    <article className="max-w-5xl mx-auto px-4 py-10" lang="fr">
      <div className="mb-2 text-xs text-gray-500">
        Dernière mise à jour :{' '}
        {new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Meilleurs Nootropiques 2026 :
        <br />
        Comparatif Europe Complet
      </h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        Ce comparatif est spécialement conçu pour les acheteurs européens. Tous les produits
        présentés disposent d&apos;une boutique EU (prix en EUR, pas de droits de douane) et sont
        conformes à la directive européenne 2002/46/CE sur les compléments alimentaires.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-blue-900 mb-2">Réglementation UE</h2>
        <p className="text-sm text-blue-800 leading-relaxed">
          Les nootropiques sont réglementés en Europe en tant que compléments alimentaires
          conformément à la <strong>directive 2002/46/CE</strong>. Les allégations de santé doivent
          respecter le <strong>règlement (CE) 1924/2006</strong> et utiliser uniquement des
          allégations autorisées par l&apos;EFSA.
        </p>
      </div>

      <AffiliateDisclosure />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Comparatif Nootropiques Europe 2026
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
