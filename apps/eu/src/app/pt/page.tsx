import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';
import { productsEU } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'The Nootropic Lab UE — Avaliações Independentes de Suplementos Cognitivos na Europa',
  description:
    'A plataforma independente de comparação de nootrópicos para compradores europeus. Preços em EUR, produtos com conformidade UE e orientação regulamentar completa.',
  alternates: {
    languages: {
      en: '/',
      'pt-PT': '/pt',
    },
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab UE',
  url: 'https://eu.thenootropiclab.com/pt',
  description: 'Avaliações independentes de suplementos cognitivos para compradores europeus.',
  inLanguage: 'pt-PT',
};

const features = [
  {
    icon: '🔬',
    title: 'Auditorias de dosagem clínica',
    desc: 'Cada avaliação inclui uma tabela comparativa entre a dosagem utilizada e as doses mínimas eficazes encontradas em estudos clínicos revistos por pares.',
  },
  {
    icon: '🇪🇺',
    title: 'Conformidade UE verificada',
    desc: 'Verificamos cada produto em função da Directiva UE 2002/46/CE e do Regulamento (CE) n.º 1924/2006 da EFSA sobre alegações de saúde. Não recomendamos fórmulas disponíveis apenas nos EUA.',
  },
  {
    icon: '💶',
    title: 'Preços em EUR e envio na UE',
    desc: 'Apenas produtos com lojas UE dedicadas são apresentados — sem direitos aduaneiros, com preços em EUR e envio local.',
  },
];

const quickLinks = [
  {
    href: '/pt/melhores-nootropicos',
    title: 'Os Melhores Nootrópicos 2026 (UE)',
    desc: 'Comparação completa para a UE com auditoria de dosagem clínica e preços em EUR.',
  },
  {
    href: '/nootropic-comparison',
    title: 'Ferramenta de Comparação Interactiva',
    desc: 'Ordene e filtre todas as marcas disponíveis na UE lado a lado.',
  },
  {
    href: '/methodology',
    title: 'A Nossa Metodologia',
    desc: 'Como avaliamos os nootrópicos.',
  },
];

export default function PTHomePage() {
  return (
    <>
      <SchemaOrg schema={websiteSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4" lang="pt-PT">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Mercado UE · Preços em EUR · Produtos com Conformidade UE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            O Guia Independente da UE para
            <br />
            <span className="text-green-700">Suplementos Cognitivos</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Avaliamos nootrópicos especificamente para compradores europeus. Preços em EUR,
            conformidade regulamentar da UE e sem custos ocultos de importação.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pt/melhores-nootropicos"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Os Melhores Nootrópicos na Europa 2026 →
            </Link>
            <Link
              href="/nootropic-comparison"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Comparar Todas as Marcas UE
            </Link>
          </div>
          <div className="mt-4 flex gap-4 justify-center text-sm text-gray-500">
            <Link href="/" className="text-green-700 underline">
              🇬🇧 English
            </Link>
            <Link href="/de/beste-nootropika" className="text-green-700 underline">
              🇩🇪 Deutsch
            </Link>
            <Link href="/fr/meilleurs-nootropiques" className="text-green-700 underline">
              🇫🇷 Français
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-4 py-16" lang="pt-PT">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Concebido para compradores europeus
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

      {/* Quick links */}
      <section className="max-w-5xl mx-auto px-4 pb-16" lang="pt-PT">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inicie a sua pesquisa</h2>
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
    </>
  );
}
