import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, useCaseListPageEsStrings, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsLatam, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Mejores Nootrópicos para Concentración ${CURRENT_YEAR}: Selección Independiente Basada en Evidencia Clínica`,
  description:
    'Ranking independiente de los mejores nootrópicos para concentración y atención disponibles en Latinoamérica. Cada selección debe contener un ingrediente para concentración con dosis clínica (L-teanina + cafeína, citicolina o L-tirosina).',
  alternates: buildAlternates({ regionCode: 'latam', path: '/best-nootropics-for-focus/' }),
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
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
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
      'Fórmula abierta con 100mg de L-teanina + 250mg de citicolina Cognizin a dosis clínicamente validadas. El diseño sin cafeína permite combinarlo con tu café o mate local para lograr el efecto sinérgico. Confirma en el checkout si la marca envía a tu país. Los aranceles de importación y el despacho aduanero corren por cuenta del comprador; los argentinos deben verificar que su tarjeta procese cargos en USD pese al control cambiario.',
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
      'Incluye colina (VitaCholine), L-teanina y Lutemax 2020 (útil para fatiga visual frente a pantallas, frecuente en trabajo remoto en Latam). Fórmula abierta — las dosis se declaran. Atención: el perfil de noocube.com en Trustpilot aún no tiene reseñas; verifica la política de cancelación antes de comprar.',
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
    a: 'La Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil, el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia, el Instituto de Salud Pública (ISP) en Chile y la Dirección General de Medicamentos, Insumos y Drogas (DIGEMID) en Perú son las autoridades sanitarias que regulan los suplementos en sus países. Las reglas de cantidad para la importación de suplementos para uso personal no pudieron confirmarse en una página oficial en nuestra revisión del 5 de octubre de 2026: confirma con la aduana de tu país antes de hacer un pedido. En Argentina, la Disposición 2105/2022 de la ANMAT prohibió siete productos concretos no registrados (Noopept, F-Phenibut y Bacopa de las marcas Newmind y PURENOOTROPICS) — ninguno de los productos recomendados aquí es uno de esos productos ni contiene Noopept o F-Phenibut.',
  },
  {
    q: '¿Dónde puedo comprar nootrópicos en Latam?',
    a: 'Dos canales principales: (1) marcas internacionales con envío directo desde EE.UU./Reino Unido (Mind Lab Pro, NooCube, Qualia Mind) — pago en USD, 10–18 días de envío; (2) iHerb cross-border, Amazon Brasil y Amazon México con catálogo limitado. MercadoLibre también lista varias opciones con envío regional.',
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
      heroParagraph="Si quieres tomar un suplemento para apoyar la concentración, la pregunta no es '¿qué marca?' sino '¿qué ingrediente y a qué dosis?'. Esta página clasifica los productos disponibles para compradores en Latam que contienen al menos uno de los cuatro ingredientes validados para concentración (L-teanina + cafeína, citicolina, L-tirosina, Alfa-GPC) en dosis clínica. Incluimos opciones internacionales (Mind Lab Pro, Qualia Mind, NooCube)."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      strings={useCaseListPageEsStrings}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'ANMAT Disposición 2105/2022: los siete productos prohibidos (Argentina)', href: '/anmat-disposicion-2105-2022-prohibidos/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('latam')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
