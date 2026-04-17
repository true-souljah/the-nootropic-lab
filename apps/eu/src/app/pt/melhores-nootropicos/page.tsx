import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable, AffiliateDisclosure } from '@nootropic/ui';
import { productsEU } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Melhores Nootrópicos 2026 Europa: Comparação Completa',
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
  return (
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
        Os Melhores Nootrópicos 2026:
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
          Comparação de Nootrópicos — Europa 2026
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
