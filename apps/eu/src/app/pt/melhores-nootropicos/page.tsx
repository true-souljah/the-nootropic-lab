import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg } from '@nootropic/ui';
import { productsEU, buildPersonAuthorReference } from '@nootropic/data';

const SITE_URL = 'https://eu.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

import LegacyShell from "@/components/LegacyShell";

export const metadata: Metadata = {
  title: `Melhores Nootrópicos ${CURRENT_YEAR} Europa: Comparação Completa`,
  description:
    'Comparação independente dos melhores nootrópicos disponíveis na Europa. Preços em EUR, conformidade regulamentar da UE, auditoria clínica de cada ingrediente.',
  alternates: {
    languages: {
      en: '/best-nootropics',
      'pt-PT': '/pt/melhores-nootropicos',
    },
  },
};

export default function MelhoresNootropicosPT() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Os Melhores Nootrópicos na Europa ${CURRENT_YEAR}`,
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab EU', url: SITE_URL },
    inLanguage: 'pt-PT',
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Melhores Nootrópicos Europa ${CURRENT_YEAR}`,
    itemListElement: productsEU.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://eu.thenootropiclab.com/${p.slug}/`,
    })),
  };

  return (
    <LegacyShell>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={itemListSchema} />
      <article className="max-w-5xl mx-auto px-4 py-10" lang="pt-PT">
      <div className="mb-2 text-xs text-gray-500">
        Última actualização:{' '}
        {new Date().toLocaleDateString('pt-PT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Os Melhores Nootrópicos {CURRENT_YEAR}:
        <br />
        Comparação Completa para a Europa
      </h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        Esta comparação foi concebida especificamente para compradores europeus. Todos os produtos
        apresentados dispõem de loja UE (preços em EUR, sem direitos aduaneiros) e cumprem a
        Directiva Europeia 2002/46/CE sobre suplementos alimentares. Cada ingrediente foi analisado
        em função de estudos clínicos.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-blue-900 mb-2">Contexto Regulamentar da UE</h2>
        <p className="text-sm text-blue-800 leading-relaxed">
          Os nootrópicos são regulamentados na Europa enquanto suplementos alimentares ao abrigo da{' '}
          <strong>Directiva 2002/46/CE</strong>. As alegações de saúde devem obedecer ao{' '}
          <strong>Regulamento (CE) n.º 1924/2006</strong> e utilizar exclusivamente alegações
          autorizadas pela EFSA. Todos os produtos recomendados utilizam ingredientes aprovados pela
          EFSA.
        </p>
      </div>

      <AffiliateDisclosure />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Comparação de Nootrópicos — Europa {CURRENT_YEAR}
        </h2>
        <ComparisonTable products={productsEU} market="eu" />
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <Link href="/best-nootropics" className="text-green-700 underline">
          → Versão em inglês: Best Nootropics Europe {CURRENT_YEAR}
        </Link>
      </div>
    </article>
    </LegacyShell>
  );
}
