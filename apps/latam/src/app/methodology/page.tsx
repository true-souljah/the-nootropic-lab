import type { Metadata } from 'next';
import { SchemaOrg, EditorialStandardsSection, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { buildPersonAuthorReference, pillarWeightPercent } from '@nootropic/data';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'Cómo Evaluamos los Nootrópicos — Nuestra Metodología',
  description:
    'Metodología de puntuación de The Nootropic Lab: marco de 5 pilares, proceso de auditoría de dosificación clínica y divulgación completa de afiliados.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/methodology/' }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/methodology/', title: 'Cómo Evaluamos los Nootrópicos — Nuestra Metodología', description: 'Metodología de puntuación de The Nootropic Lab: marco de 5 pilares, proceso de auditoría de dosificación clínica y divulgación completa de afiliados.' }),
  twitter: buildTwitter({ title: 'Cómo Evaluamos los Nootrópicos — Nuestra Metodología', description: 'Metodología de puntuación de The Nootropic Lab: marco de 5 pilares, proceso de auditoría de dosificación clínica y divulgación completa de afiliados.' }),
};

const pillars = [
  { num: '01', title: `Calidad de los ingredientes (${pillarWeightPercent('ingredients')}%)`, desc: 'Evaluamos si cada ingrediente cuenta con evidencia de ensayos clínicos humanos revisados por pares que demuestren beneficios cognitivos. Las mezclas patentadas con dosis ocultas son penalizadas.' },
  { num: '02', title: `Dosis vs. evidencia clínica (${pillarWeightPercent('dosing')}%)`, desc: 'La dosificación es la proporción de los ingredientes con una dosis de referencia en nuestras páginas de ingredientes cuya cantidad diaria declarada en la etiqueta alcanza el mínimo de esa página. Una cantidad que la etiqueta oculta (una parte de una mezcla patentada) o declara sobre otra base (como un equivalente de planta seca en lugar del extracto) cuenta como no alcanzada. Los ingredientes sin página de referencia se muestran, pero no se puntúan.' },
  { num: '03', title: `Transparencia de la fórmula (${pillarWeightPercent('transparency')}%)`, desc: 'La divulgación completa de todas las dosis de ingredientes recibe la puntuación más alta. Las mezclas tipo "matriz" o los ingredientes sin datos de estandarización reducen la puntuación.' },
  { num: '04', title: `Relación calidad-precio (${pillarWeightPercent('value')}%)`, desc: 'Precio por porción dividido entre el número de ingredientes con dosis clínica.' },
  { num: '05', title: `Confianza en la marca (${pillarWeightPercent('trust')}%)`, desc: 'Compuesto por la puntuación en Trustpilot (50%), volumen de quejas, transparencia en la cancelación de suscripciones y documentación de pruebas por terceros.' },
];

export default function MethodologyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cómo Evaluamos los Nootrópicos — Metodología',
    author: buildPersonAuthorReference(undefined, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  };

  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={schema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Metodología</h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          The Nootropic Lab utiliza un marco de puntuación de 5 pilares aplicado de forma consistente a cada producto.
          Ninguna marca paga por una reseña ni influye en nuestras puntuaciones.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Marco de Puntuación de 5 Pilares</h2>
          <div className="space-y-4">
            {pillars.map(p => (
              <div key={p.num} className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                <div className="text-3xl font-black text-green-200 shrink-0 leading-none pt-1">{p.num}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mt-4">
            Nuestras guías de mejores nootrópicos clasifican solo productos con una puntuación de 7.0/10 o más;
            el umbral era 7.5 hasta el 9 de octubre de 2026 y se fijó en 7.0 cuando el pilar de dosificación
            pasó a calcularse a partir de las dosis de la etiqueta, lo que redujo las puntuaciones en
            aproximadamente un punto en general.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Divulgación de afiliados</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Nootropic Lab gana comisiones de afiliado cuando los lectores compran productos a través de nuestros
            enlaces. Esto no influye en nuestras puntuaciones editoriales ni en los rankings. Todas las
            relaciones de afiliado se divulgan en cada página donde apliquen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aviso médico</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            El contenido de The Nootropic Lab es únicamente con fines informativos y no constituye
            asesoramiento médico. Siempre consulta a un profesional de la salud calificado antes de tomar cualquier
            suplemento.
          </p>
        </section>
        <EditorialStandardsSection />
      </article>
    </PublicShell>
  );
}
