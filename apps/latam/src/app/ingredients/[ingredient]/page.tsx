import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaOrg } from '@nootropic/ui';
import { ingredients, productsLatam } from '@nootropic/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return ingredients.map(ing => ({ ingredient: ing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ingredient: string }>;
}): Promise<Metadata> {
  const { ingredient } = await params;
  const ing = ingredients.find(i => i.slug === ingredient);
  if (!ing) return {};
  return {
    title: `${ing.name} — Guía Notrópica Latam, Dosificación, Efectos y Preguntas Frecuentes`,
    description: `${ing.name}: mecanismo de acción, dosis clínica (${ing.clinicalDose}), matriz de efectos en humanos, cómo tomarlo, guía de combinación y preguntas frecuentes — productos disponibles en Latam incluidos.`,
  };
}

const evidenceConfig = {
  strong:      { dots: '●●●', label: 'Fuerte',      className: 'text-green-700 bg-green-50 border-green-200' },
  moderate:    { dots: '●●○', label: 'Moderado',    className: 'text-amber-700 bg-amber-50 border-amber-200' },
  preliminary: { dots: '●○○', label: 'Preliminar', className: 'text-gray-500 bg-gray-50 border-gray-200' },
  mixed:       { dots: '◐◐○', label: 'Mixto',       className: 'text-orange-700 bg-orange-50 border-orange-200' },
};

const magnitudeConfig = {
  large:      { label: 'Grande',      barWidth: 'w-4/4', color: 'bg-green-500' },
  moderate:   { label: 'Moderado',   barWidth: 'w-3/4', color: 'bg-amber-400' },
  small:      { label: 'Pequeño',      barWidth: 'w-2/4', color: 'bg-gray-400' },
  negligible: { label: 'Insignificante', barWidth: 'w-1/4', color: 'bg-gray-300' },
};

const categoryLabels: Record<string, string> = {
  adaptogen: 'Adaptógeno', cholinergic: 'Colinérgico', mushroom: 'Hongo',
  amino: 'Aminoácido', herb: 'Hierba', vitamin: 'Vitamina',
};

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ ingredient: string }>;
}) {
  const { ingredient } = await params;
  const ing = ingredients.find(i => i.slug === ingredient);
  if (!ing) notFound();

  const containingProducts = productsLatam.filter(p =>
    ing.productsContaining.includes(p.slug)
  );

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${ing.name} — Guía de Ingredientes Nootrópicos`,
    description: ing.studySummary,
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://latam.thenootropiclab.com' },
      { '@type': 'ListItem', position: 2, name: 'Ingredients', item: 'https://latam.thenootropiclab.com/ingredients' },
      { '@type': 'ListItem', position: 3, name: ing.name },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ing.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Take ${ing.name}`,
    description: `Dosing, timing, and form guidance for ${ing.name} based on clinical evidence.`,
    step: [
      { '@type': 'HowToStep', name: 'Dosage', text: ing.howToTake.dosage },
      { '@type': 'HowToStep', name: 'Timing', text: ing.howToTake.timing },
      { '@type': 'HowToStep', name: 'With Food', text: ing.howToTake.withFood },
      { '@type': 'Best Form', name: 'Best Form', text: ing.howToTake.forms },
      ...(ing.howToTake.cycling ? [{ '@type': 'HowToStep', name: 'Cycling', text: ing.howToTake.cycling }] : []),
    ],
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={breadcrumbSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={howToSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Inicio</a>
          {' / '}
          <a href="/ingredients" className="hover:text-green-700">Ingredientes</a>
          {' / '}
          <span>{ing.name}</span>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{ing.name}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {categoryLabels[ing.category]}
          </span>
          <span className="text-sm bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
            Dosis clínica: <strong>{ing.clinicalDose}</strong>
          </span>
          <span className="text-sm bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
            Tiempo de efecto: <strong>{ing.timeToEffect}</strong>
          </span>
        </div>

        {/* Mechanism */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Mecanismo de Acción</h2>
          <p className="text-gray-700 leading-relaxed">{ing.mechanism}</p>
        </section>

        {/* Clinical Evidence */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Resumen de Evidencia Clínica</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-blue-900 leading-relaxed">{ing.studySummary}</p>
          </div>
        </section>

        {/* Human Effect Matrix */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Matriz de Efectos en Humanos</h2>
          <p className="text-sm text-gray-500 mb-4">Basado únicamente en ensayos clínicos en humanos. Se excluyen datos en animales e in vitro.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Efecto</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Evidencia</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Magnitud</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200 text-center">Estudios</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200 hidden md:table-cell">Notas</th>
                </tr>
              </thead>
              <tbody>
                {ing.humanEffects.map((effect, i) => {
                  const ev = evidenceConfig[effect.evidenceStrength];
                  const mag = magnitudeConfig[effect.magnitude];
                  return (
                    <tr key={effect.effect} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{effect.effect}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border ${ev.className}`}>
                          {ev.dots} {ev.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${mag.barWidth} ${mag.color}`} />
                          </div>
                          <span className="text-xs text-gray-600">{mag.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">{effect.studies}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{effect.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Clave de evidencia: ●●● Fuerte = múltiples ECAs consistentes &nbsp;|&nbsp; ●●○ Moderado = ECAs más pequeños/escasos &nbsp;|&nbsp; ●○○ Preliminar = ensayos tempranos o muestra pequeña &nbsp;|&nbsp; ◐◐○ Mixto = resultados contradictorios
          </p>
        </section>

        {/* Benefits / Side Effects */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Beneficios Documentados</h2>
            <ul className="space-y-2">
              {ing.benefits.map(b => (
                <li key={b} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Efectos Secundarios y Precauciones</h2>
            <ul className="space-y-2">
              {ing.sideEffects.map(s => (
                <li key={s} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-amber-500 shrink-0 mt-0.5">!</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* How to Take */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cómo Tomar</h2>
          <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200">
            <div className="px-5 py-4 grid grid-cols-[120px_1fr] gap-3 items-start">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5">Dosis</span>
              <span className="text-sm text-gray-800">{ing.howToTake.dosage}</span>
            </div>
            <div className="px-5 py-4 grid grid-cols-[120px_1fr] gap-3 items-start">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5">Momento</span>
              <span className="text-sm text-gray-800">{ing.howToTake.timing}</span>
            </div>
            <div className="px-5 py-4 grid grid-cols-[120px_1fr] gap-3 items-start">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5">Con Alimentos</span>
              <span className="text-sm text-gray-800">{ing.howToTake.withFood}</span>
            </div>
            {ing.howToTake.cycling && (
              <div className="px-5 py-4 grid grid-cols-[120px_1fr] gap-3 items-start">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide pt-0.5">Ciclado</span>
                <span className="text-sm text-gray-800 font-medium">{ing.howToTake.cycling}</span>
              </div>
            )}
            <div className="px-5 py-4 grid grid-cols-[120px_1fr] gap-3 items-start">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5">Formas</span>
              <span className="text-sm text-gray-800">{ing.howToTake.forms}</span>
            </div>
          </div>
        </section>

        {/* Stacking */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Recomendaciones de Combinación</h2>
          <p className="text-sm text-gray-500 mb-4">Ingredientes que combinan bien con {ing.name} y por qué.</p>
          <div className="space-y-3">
            {ing.stacksWith.map(pair => (
              <div key={pair.ingredient} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
                <div className="shrink-0 w-28">
                  <a
                    href={`/ingredients/${pair.slug}`}
                    className="text-sm font-semibold text-green-700 hover:underline leading-tight block"
                  >
                    {pair.ingredient}
                  </a>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{pair.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-2">
            {ing.faqs.map(faq => (
              <details
                key={faq.question}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  <span className="pr-4 text-sm md:text-base">{faq.question}</span>
                  <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200 text-lg">▾</span>
                </summary>
                <div className="px-5 pb-5 pt-1">
                  <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* EU Products */}
        {containingProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Stacks con {ing.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {containingProducts.map(p => (
                <a
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                    <span className="text-green-700 font-black text-sm">{p.score}/10</span>
                  </div>
                  <p className="text-xs text-gray-500">{p.brand}</p>
                  {p.editorChoice && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-2 inline-block">
                      Editor&apos;s Choice
                    </span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related Ingredients */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredientes Relacionados</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {ingredients
              .filter(other => other.slug !== ing.slug)
              .slice(0, 6)
              .map(other => (
                <a
                  key={other.slug}
                  href={`/ingredients/${other.slug}`}
                  className="block border border-gray-200 rounded-lg p-3 hover:border-green-700 hover:shadow-sm transition-all"
                >
                  <div className="font-semibold text-gray-900 text-sm">{other.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{other.category}</div>
                </a>
              ))}
          </div>
        </section>

        <div className="text-sm text-gray-500 mt-8">
          <a href="/ingredients" className="text-green-700 underline">
            ← Volver a la Guía de Ingredientes
          </a>
        </div>
      </article>
    </>
  );
}
