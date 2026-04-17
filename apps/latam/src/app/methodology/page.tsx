import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'How We Review Nootropics — Our Methodology',
  description:
    'The Nootropic Lab scoring methodology: 5-pillar framework, clinical dosing audit process, and full affiliate disclosure.',
};

const pillars = [
  { num: '01', title: 'Calidad de los ingredientes (20%)', desc: 'Evaluamos si cada ingrediente cuenta con evidencia de ensayos clínicos humanos revisados por pares que demuestren beneficios cognitivos. Las mezclas patentadas con dosis ocultas son penalizadas.' },
  { num: '02', title: 'Dosis vs. evidencia clínica (20%)', desc: 'Para cada ingrediente activo, comparamos la dosis del producto con la dosis mínima efectiva de ensayos clínicos publicados (obtenidos de PubMed). Los ingredientes subdosificados son señalados.' },
  { num: '03', title: 'Transparencia de la fórmula (20%)', desc: 'La divulgación completa de todas las dosis de ingredientes recibe la puntuación más alta. Las mezclas tipo "matriz" o los ingredientes sin datos de estandarización reducen la puntuación.' },
  { num: '04', title: 'Relación calidad-precio (20%)', desc: 'Precio por porción dividido entre el número de ingredientes con dosis clínica.' },
  { num: '05', title: 'Confianza en la marca (20%)', desc: 'Compuesto por la puntuación en Trustpilot (50%), volumen de quejas, transparencia en la cancelación de suscripciones y documentación de pruebas por terceros.' },
];

export default function MethodologyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How We Review Nootropics — Methodology',
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab' },
  };

  return (
    <>
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
      </article>
    </>
  );
}
