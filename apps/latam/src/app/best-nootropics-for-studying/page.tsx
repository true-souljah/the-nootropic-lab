import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, useCaseListPageEsStrings, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsLatam, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Mejores Nootrópicos para Estudiar ${CURRENT_YEAR}: Selección Independiente para Estudiantes en Latam`,
  description:
    'Ranking independiente de nootrópicos para sesiones de estudio prolongadas para estudiantes en Latinoamérica. Selecciones evaluadas por concentración + consolidación de memoria + perfil de seguridad para uso diario.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/best-nootropics-for-studying/' }),
  openGraph: {
    title: 'Mejores Nootrópicos para Estudiar — Basados en Evidencia',
    description:
      'Concentración sostenida + consolidación de memoria. Qué deben tomar realmente los estudiantes en Latam y qué evitar.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Teanina + Cafeína — concentración sostenida',
    evidence:
      'Para sesiones de estudio prolongadas, la combinación L-teanina + cafeína es la base. Reduce el nerviosismo de la cafeína y la caída posterior, y suaviza el cambio de atención. 100–200mg de L-teanina + 100mg de cafeína, repetidos 4–6 horas después si es necesario. La cafeína se obtiene fácilmente de un café o mate local en cualquier país de Latam.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Bacopa Monnieri — consolidación de memoria a largo plazo',
    evidence:
      'Crítica para la retención de material estudiado. La Bacopa mejora la consolidación de memoria — lo que tu cerebro hace durante el sueño con el material que estudiaste ese día. 300mg estandarizado al 50% de bacósidos diariamente durante 8+ semanas. Empieza al inicio del cuatrimestre, no la noche antes del examen.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Citicolina — colina para alta demanda cognitiva',
    evidence:
      'La demanda cognitiva intensa agota la colina. La citicolina a 250–500mg/día apoya la síntesis de fosfolípidos y la disponibilidad de acetilcolina — el neurotransmisor más asociado con atención y aprendizaje. Cognizin es la forma estandarizada.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'L-Tirosina — rendimiento bajo estrés',
    evidence:
      'El estrés agudo de exámenes y la falta de sueño agotan las catecolaminas. La suplementación con tirosina tiene beneficio documentado para el rendimiento cognitivo específicamente bajo estrés, pérdida de sueño o frío. 300–500mg como NALT para uso puntual; no para uso continuo diario.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsLatam.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'El diseño sin cafeína se combina perfectamente con cualquier fuente de cafeína que uses durante tus sesiones de estudio (café, mate, bebidas energéticas). Incluye L-teanina, Bacopa, citicolina y L-tirosina — cubre los cuatro mecanismos relevantes para el estudio en una sola fórmula abierta. Toma diariamente durante el cuatrimestre para el efecto acumulativo de Bacopa. Importante para estudiantes universitarios en Latam: planifica el envío internacional (10–18 días) con anticipación al inicio del semestre.',
  },
  {
    product: productsLatam.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Stack más completo para estudio: incluye todo lo de Mind Lab Pro más Alfa-GPC, Rhodiola y cofactores que apoyan la colina. Las 7+ cápsulas/día son una fricción durante semana de exámenes; los $139 USD/mes en suscripción son una fricción para presupuestos estudiantiles. Estudiantes en Argentina deben confirmar que su tarjeta procese cargos recurrentes en USD bajo controles cambiarios.',
  },
  {
    product: productsLatam.find(p => p.slug === 'thesis-nootropics-review')!,
    rank: 3,
    whyItsHere:
      'La personalización puede adaptarse a estudiantes con patrones específicos (la fórmula "Clarity" para concentración o "Logic" para trabajo analítico). Modelo de suscripción con costo mensual que se acumula durante el semestre. Cada envío mensual es un evento aduanero separado — los compradores en Brasil deben considerar la exposición acumulada a retenciones de ANVISA.',
  },
  {
    product: productsLatam.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Lutemax 2020 es relevante para estudiantes que pasan muchas horas frente a la pantalla — reduce la fatiga visual asociada a la luz azul. Buen valor a $59 USD/mes con 60 días de garantía. Atención: Trustpilot 1.9/5 por reclamos de cancelación de suscripción; verifica la política antes de pedir. Algunos ingredientes están subdosificados (Alfa-GPC, Huperzina A).',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: '¿Cuándo debería empezar a tomar nootrópicos para estudiar?',
    a: 'Para ingredientes de efecto agudo (L-teanina + cafeína), 30 minutos antes de una sesión de estudio. Para Bacopa y citicolina (consolidación de memoria), empieza al inicio del cuatrimestre — necesitan 4–8 semanas de uso diario para mostrar efecto. La noche antes del examen es demasiado tarde para Bacopa. Considera además 10–18 días de envío internacional si pides desde EE.UU. o Reino Unido.',
  },
  {
    q: '¿Los nootrópicos me harán más inteligente?',
    a: 'No. Los nootrópicos no aumentan el coeficiente intelectual ni cambian la capacidad cognitiva subyacente. Apoyan mecanismos específicos — resistencia de la concentración, consolidación de memoria, resistencia al estrés — que te permiten estudiar de forma más eficaz por más tiempo con la capacidad cognitiva que ya tienes.',
  },
  {
    q: '¿Son seguros para estudiantes universitarios?',
    a: 'Los ingredientes de esta página son generalmente seguros para adultos sanos. Los estudiantes que toman medicación para TDAH, antidepresivos o tienen diagnóstico bipolar deben consultar a su médico antes de empezar — particularmente la L-tirosina y la Bacopa, que pueden interactuar con varias clases de medicamentos.',
  },
  {
    q: '¿Debería tomar Adderall o Ritalina en su lugar?',
    a: 'El Adderall y la Ritalina son medicamentos recetados solo para TDAH o narcolepsia. En Argentina están regulados por ANMAT como psicotrópicos; en Brasil y México requieren receta archivada con farmacia autorizada. Usar Adderall o Ritalina derivada (la receta de otra persona) es ilegal y se asocia con riesgos cardiovasculares y de dependencia. Si sospechas TDAH, consulta a un médico universitario o particular. Los suplementos nootrópicos no son equivalentes y no deben venderse como tales.',
  },
  {
    q: '¿Cómo interactúa el sueño con los suplementos para estudiar?',
    a: 'El sueño es cuando ocurre realmente la consolidación de la memoria. Ningún suplemento compensa la privación crónica de sueño. Si pasas noches en vela regularmente, optimiza primero el sueño; los suplementos son secundarios. La L-tirosina tiene beneficio documentado específicamente para el rendimiento cognitivo durante pérdida aguda de sueño, pero no debe usarse como licencia para no dormir.',
  },
  {
    q: '¿Es suficiente el café solo para estudiar?',
    a: 'Para la mayoría de los estudiantes en Latam, café (o mate) + L-teanina (proporción 1:2) es la combinación de concentración más rentable y respaldada por evidencia. Los suplementos de esta página añaden ingredientes para consolidación de memoria (Bacopa, citicolina) por encima, lo que se traduce en mejor retención del material estudiado durante el cuatrimestre.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="studying"
      pageTitle="Mejores Nootrópicos para Estudiar"
      pageDescription="Ranking independiente de nootrópicos para sesiones de estudio prolongadas para estudiantes en Latinoamérica. Concentración + consolidación de memoria + seguridad para uso diario."
      heroParagraph="Estudiar combina dos demandas cognitivas distintas: concentración sostenida durante las sesiones de estudio y consolidación de memoria entre ellas. El mejor stack de estudio cubre ambas — ingredientes de efecto agudo para concentración (L-teanina + cafeína) más ingredientes de uso diario para memoria (Bacopa, citicolina). Esta página clasifica los productos disponibles para estudiantes en Latam que incluyen ambos. Considera el tiempo de envío internacional (10–18 días) al planificar para el inicio del cuatrimestre."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      strings={useCaseListPageEsStrings}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'Nootrópicos prohibidos por ANMAT (Argentina)', href: '/anmat-disposicion-2105-2022-prohibidos/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('latam')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
