import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, useCaseListPageEsStrings, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsLatam, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Mejores Nootrópicos para Memoria ${CURRENT_YEAR}: Selección Independiente Basada en Evidencia Clínica`,
  description:
    'Ranking independiente de los mejores nootrópicos para memoria y recordación disponibles en Latinoamérica. Cada selección contiene al menos un ingrediente con evidencia clínica revisada por pares en dosis adecuada.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/best-nootropics-for-memory/' }),
  openGraph: {
    title: 'Mejores Nootrópicos para Memoria — Basados en Evidencia',
    description:
      'Bacopa, Melena de León, Fosfatidilserina — qué dice la ciencia y qué productos realmente las entregan en dosis clínica para compradores en Latam.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    evidence:
      'El ingrediente para memoria más replicado en nootrópicos. Múltiples ensayos clínicos doble ciego en adultos muestran mejor consolidación y recuerdo de la memoria tras 8–12 semanas a 300mg estandarizado al 50% de bacósidos. El inicio es lento — diario por 8+ semanas. No es un ingrediente de efecto agudo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Melena de León (Hericium erinaceus)',
    evidence:
      'Modula el Factor de Crecimiento Nervioso (NGF) y puede apoyar la neurogénesis. Pequeños ensayos clínicos (Mori et al. 2009 en adultos mayores con deterioro cognitivo leve) mostraron mejoras en memoria con 1g/día de extracto del cuerpo fructífero durante 16 semanas. La evidencia es prometedora pero menor que para Bacopa. Busca extracto del cuerpo fructífero, no micelio sobre grano.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Fosfatidilserina (PS)',
    evidence:
      'Componente fosfolípido de las membranas neuronales. La FDA permite una declaración de salud calificada para PS en función cognitiva en adultos mayores. La mayor parte de la evidencia clínica está en personas de 50–80 años a 100–300mg/día. Evidencia más débil en adultos jóvenes sanos.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicolina (CDP-Colina)',
    evidence:
      'Donante de colina y fuente de uridina. Ensayos clínicos en adultos mayores con quejas de memoria asociadas a la edad muestran mejoras en memoria verbal y velocidad de procesamiento a 250–500mg/día durante 12+ semanas.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsLatam.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Incluye Bacopa, citicolina (250mg de Cognizin en dosis clínica) Y fosfatidilserina (100mg en dosis clínica) — tres de los cuatro ingredientes con evidencia para memoria en una sola fórmula abierta. La dosis de Bacopa es de 150mg (por debajo del ancla clínica de 300mg) por lo que conviene complementar con un suplemento separado de Bacopa para el efecto completo. Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú.',
  },
  {
    product: productsLatam.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 2,
    whyItsHere:
      'Extracto de Melena de León del cuerpo fructífero, ingrediente único, de una marca con sólida reputación en pruebas de terceros (publica Certificado de Análisis por lote — útil para presentar ante aduanas en Latam si se solicita). La opción correcta si quieres probar Melena de León de forma aislada. No es un "nootrópico diario" — combínalo con Bacopa o Mind Lab Pro para una cobertura completa de memoria. Bajo costo de envío ($25 USD) reduce riesgo de retención aduanera.',
  },
  {
    product: productsLatam.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Incluye Bacopa, citicolina, fosfatidilserina Y Melena de León — el stack más completo para memoria en un solo producto. Pierde puntos por cantidad de cápsulas (7+/día) y precio ($139 USD/mes). Para memoria específicamente, la amplitud justifica el compromiso si toleras la fricción diaria. Compradores en Brasil deben prever mayor probabilidad de retenciones de ANVISA por la cantidad alta de cápsulas por envío.',
  },
  {
    product: productsLatam.find(p => p.slug === 'herbamz-neuromax-review')!,
    rank: 4,
    whyItsHere:
      'Opción brasileña registrada en ANVISA, disponible en Amazon Brasil y MercadoLibre con precio en BRL (~R$110/mes), entrega Prime al día siguiente y sin riesgo aduanero. Contiene Bacopa, Ginkgo, Fosfatidilserina y B12 — pero las dosis están por debajo de las clínicas. Es la opción más accesible para compradores brasileños que prefieren evitar envíos internacionales y tarifas de USD por completo.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: '¿Cuál es el nootrópico para memoria con más evidencia?',
    a: 'Bacopa Monnieri a 300mg estandarizado al 50% de bacósidos tiene la evidencia más replicada en ensayos clínicos para consolidación de memoria en adultos sanos. La fosfatidilserina cuenta con la declaración de salud calificada por la FDA para función cognitiva en adultos mayores. La citicolina tiene buena evidencia en adultos mayores con quejas de memoria asociadas a la edad.',
  },
  {
    q: '¿Cuánto tardan en hacer efecto los nootrópicos para memoria?',
    a: 'Bacopa: 8–12 semanas de uso diario. Melena de León: 8–16 semanas. Fosfatidilserina y citicolina: 4–12 semanas. Ninguno es un ingrediente de efecto agudo. Planifica al menos 8 semanas de dosificación constante antes de juzgar — y considera el tiempo de envío internacional (10–18 días a Latam) en tu cronograma.',
  },
  {
    q: '¿Son seguros estos nootrópicos a largo plazo?',
    a: 'Los ingredientes de esta página tienen perfiles de seguridad favorables en ensayos clínicos en humanos a las dosis indicadas. La fosfatidilserina derivada de soja puede ser una preocupación para quienes tienen alergia a la soja (existe PS derivada de girasol). La Bacopa puede causar molestias gastrointestinales en algunas personas; tómala con comida.',
  },
  {
    q: '¿Estos productos son legales en mi país de Latam?',
    a: 'Los suplementos nootrópicos importados ingresan a Latam bajo exenciones de uso personal. COFEPRIS (México), ANVISA (Brasil), INVIMA (Colombia), ISP (Chile) y DIGEMID (Perú) generalmente permiten un suministro de 1 a 3 meses para uso personal. ANMAT (Argentina) emitió la Disposición 2105/2022 que prohibió el Noopept y otros nootrópicos no registrados — ninguna de las selecciones aquí contiene Noopept ni ingredientes prohibidos por ANMAT, pero verifica la lista vigente antes de pedir desde Argentina. Las opciones locales (Herbamz NeuroMax, Genomma Lab NeuriPlus) están registradas y disponibles sin riesgo aduanero.',
  },
  {
    q: '¿Ayudarán con la pérdida de memoria asociada a la edad?',
    a: 'La evidencia es más fuerte específicamente en adultos mayores con quejas cognitivas subjetivas — no en demencia clínicamente diagnosticada ni Alzheimer. Si tú o un familiar experimentan cambios significativos en la memoria, consulta a un neurólogo. Los suplementos no son tratamiento para la demencia.',
  },
  {
    q: 'Melena de León: ¿cuerpo fructífero o micelio?',
    a: 'Cuerpo fructífero. La mayor parte de la investigación clínica usa extracto del cuerpo fructífero. Los productos de micelio sobre grano contienen un alto porcentaje de grano (avena, arroz integral) por peso y menor contenido de beta-glucanos. Lee las etiquetas con cuidado y prefiere productos que declaren el porcentaje de β-glucanos y usen el cuerpo fructífero.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="memory"
      pageTitle="Mejores Nootrópicos para Memoria"
      pageDescription="Ranking independiente de los mejores nootrópicos para memoria y recordación disponibles en Latinoamérica, basado en evidencia clínica."
      heroParagraph="La memoria es el caso de uso donde los nootrópicos tienen la evidencia más replicada — principalmente de ensayos clínicos con Bacopa Monnieri durante más de 30 años. Esta página clasifica los productos disponibles para compradores en Latam que contienen Bacopa, Melena de León, fosfatidilserina o citicolina en dosis clínica o cercana a ella. Incluimos opciones internacionales (Mind Lab Pro, Qualia Mind, Nootropics Depot) y opciones locales registradas (Herbamz NeuroMax para Brasil)."
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
