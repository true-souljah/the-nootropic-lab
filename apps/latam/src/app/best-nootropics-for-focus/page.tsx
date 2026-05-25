import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, useCaseListPageEsStrings } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsLatam, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://latam.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Mejores Nootrópicos para Concentración ${CURRENT_YEAR}: Selección Independiente Basada en Evidencia Clínica`,
  description:
    'Ranking independiente de los mejores nootrópicos para concentración y atención disponibles en Latinoamérica. Cada selección debe contener un ingrediente para concentración con dosis clínica (L-teanina + cafeína, citicolina o L-tirosina).',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-focus/` },
  openGraph: {
    title: 'Mejores Nootrópicos para Concentración — Selección Basada en Evidencia',
    description:
      'Auditoría de dosis clínica de cada selección para Latam. Sin mezclas patentadas, sin firmas anónimas. ANVISA, COFEPRIS, ANMAT, ISP e INVIMA en consideración.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Teanina + Cafeína (proporción 1:2 a 2:1)',
    evidence:
      'Uno de los hallazgos cognitivos mejor replicados: la L-teanina combinada con cafeína mejora la atención y reduce la fatiga mental, con una sensación subjetiva de concentración más estable que la cafeína sola. Eficaz a 100–200mg de L-teanina + 100mg de cafeína. En Latam la cafeína proviene fácilmente de un café local, por lo que basta con un suplemento sin cafeína que aporte L-teanina.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Citicolina (CDP-Colina)',
    evidence:
      'Donante de colina y fuente de uridina que apoya la síntesis de fosfolípidos y la producción de acetilcolina. Múltiples ensayos clínicos muestran beneficios en atención y esfuerzo cognitivo en adultos sanos a 250–500mg/día. Cognizin es la forma estandarizada que usan la mayoría de los productos importados.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'L-Tirosina (o NALT)',
    evidence:
      'Precursor de la dopamina y noradrenalina. Especialmente útil bajo carga cognitiva o estrés — mejora el rendimiento en tareas de atención durante la falta de sueño, multitarea o exposición al frío. Dosis clínicas de 300–500mg como N-acetil-L-tirosina.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
  {
    name: 'Alfa-GPC',
    evidence:
      'Colinérgico — beneficios agudos de concentración y tiempo de reacción en ensayos clínicos en humanos a 300–600mg, con un efecto más fuerte que el bitartrato de colina. Suele combinarse con L-teanina para una "concentración tranquila".',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18834505/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsLatam.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Fórmula abierta con 100mg de L-teanina + 250mg de citicolina Cognizin a dosis clínicamente validadas. El diseño sin cafeína permite combinarlo con tu café o mate local para lograr el efecto sinérgico. Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú. Compradores en Brasil deben prever posibles retenciones de ANVISA; los argentinos deben verificar que su tarjeta procese cargos en USD pese al control cambiario.',
  },
  {
    product: productsLatam.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Incluye citicolina, Alfa-GPC, L-teanina y L-tirosina — cubre casi todos los mecanismos de concentración respaldados por evidencia. Pierde puntos frente a Mind Lab Pro por la cantidad de cápsulas (7+/día) y precio ($139 USD/mes en suscripción), pero gana en amplitud de ingredientes. Contiene cafeína, lo que puede ser un factor para quienes ya consumen café fuerte.',
  },
  {
    product: productsLatam.find(p => p.slug === 'noocube-review')!,
    rank: 3,
    whyItsHere:
      'Incluye Alfa-GPC, L-teanina y Lutemax 2020 (útil para fatiga visual frente a pantallas, frecuente en trabajo remoto en Latam). Fórmula abierta — las dosis se declaran. Atención: el puntaje en Trustpilot es muy bajo (1.9/5) por reclamos de cancelación de suscripción; verifica la política antes de comprar.',
  },
  {
    product: productsLatam.find(p => p.slug === 'genomma-lab-neuriplus-review')!,
    rank: 4,
    whyItsHere:
      'Opción local registrada en COFEPRIS (México) y disponible en Farmacias del Ahorro, Guadalajara, Benavides y Cruz Verde, además de MercadoLibre en toda la región. Precio en moneda local (~$18 USD/mes), sin riesgo aduanero. Las dosis están por debajo de las clínicas — la concentración será modesta — pero es la opción más accesible para quienes prefieren evitar importaciones desde EE.UU. o Reino Unido.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: '¿Cuál es el nootrópico para concentración con más evidencia?',
    a: 'L-teanina combinada con cafeína (proporción 1:2 a 2:1) tiene la evidencia más replicada en adultos sanos — Owen et al. 2008 y múltiples seguimientos. Citicolina a 250–500mg también cuenta con varios ensayos clínicos. Los suplementos de un solo ingrediente que prometen "concentración potente" sin estos componentes suelen estar sobrevalorados por marketing.',
  },
  {
    q: '¿Cuánto tarda en hacer efecto un nootrópico de concentración?',
    a: 'Los ingredientes de efecto agudo (L-teanina, cafeína, Alfa-GPC, L-tirosina) actúan en 30–60 minutos. Los de inicio más lento (Bacopa, Melena de León) requieren de 4 a 12 semanas. Para un efecto inmediato busca L-teanina + cafeína; para beneficio acumulativo, planifica 8 semanas de uso constante.',
  },
  {
    q: '¿Son seguros los nootrópicos de concentración para uso diario?',
    a: 'Los ingredientes de esta página (L-teanina, citicolina, Alfa-GPC, L-tirosina) son generalmente seguros para adultos sanos en las dosis clínicas indicadas. Quienes toman medicación para presión arterial, estimulantes, medicación tiroidea o tienen diagnóstico bipolar deben consultar a un médico — la L-tirosina interactúa con varias clases de fármacos.',
  },
  {
    q: '¿Estos productos son legales en mi país de Latam?',
    a: 'Los suplementos nootrópicos importados ingresan a Latam bajo las exenciones de uso personal. COFEPRIS (México), ANVISA (Brasil), INVIMA (Colombia), ISP (Chile) y DIGEMID (Perú) generalmente permiten un suministro de 1 a 3 meses para uso personal. ANMAT (Argentina) emitió la Disposición 2105/2022 que prohibió el Noopept y varios otros nootrópicos no registrados — ninguno de los productos recomendados aquí contiene Noopept ni ingredientes prohibidos por ANMAT, pero verifica la lista actualizada antes de pedir desde Argentina.',
  },
  {
    q: '¿Dónde puedo comprar nootrópicos en Latam?',
    a: 'Tres canales principales: (1) marcas internacionales con envío directo desde EE.UU./Reino Unido (Mind Lab Pro, NooCube, Qualia Mind) — pago en USD, 10–18 días de envío; (2) iHerb cross-border, Amazon Brasil y Amazon México con catálogo limitado; (3) marcas locales registradas en pharmacy chains como Drogaria São Paulo, Farmacias del Ahorro y Cruz Verde (ej. Genomma Lab NeuriPlus, Herbamz NeuroMax). MercadoLibre también lista varias opciones con envío regional.',
  },
  {
    q: '¿Estos nootrópicos son alternativas al Adderall o Ritalina?',
    a: 'No. El Adderall y la Ritalina son estimulantes recetados para TDAH (regulados en Argentina por ANMAT como psicotrópicos). Los suplementos nootrópicos no son farmacológicamente equivalentes y no deben comercializarse como sustitutos. Si sospechas TDAH, consulta a un médico — los suplementos pueden ayudar marginalmente con la concentración, pero no reemplazan un diagnóstico ni tratamiento adecuado.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="focus"
      pageTitle="Mejores Nootrópicos para Concentración"
      pageDescription="Ranking independiente de los mejores nootrópicos para concentración y atención disponibles en Latinoamérica. Cada selección contiene un ingrediente con dosis clínica."
      heroParagraph="Si quieres tomar un suplemento para apoyar la concentración, la pregunta no es '¿qué marca?' sino '¿qué ingrediente y a qué dosis?'. Esta página clasifica los productos disponibles para compradores en Latam que contienen al menos uno de los cuatro ingredientes validados para concentración (L-teanina + cafeína, citicolina, L-tirosina, Alfa-GPC) en dosis clínica. Incluimos opciones internacionales (Mind Lab Pro, Qualia Mind, NooCube) y opciones locales registradas en COFEPRIS / ANVISA disponibles en farmacias regionales."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      strings={useCaseListPageEsStrings}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('latam')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
