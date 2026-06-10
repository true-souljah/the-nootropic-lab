import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, useCaseListPageEsStrings, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsLatam, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Mejores Nootrópicos para el Cerebro Adulto Mayor ${CURRENT_YEAR}: Selección Basada en Evidencia`,
  description:
    'Ranking independiente de nootrópicos para adultos en Latinoamérica preocupados por cambios cognitivos asociados a la edad. Fosfatidilserina, Bacopa, citicolina. NO es un tratamiento para demencia ni Alzheimer.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/best-nootropics-for-aging/' }),
  openGraph: {
    title: 'Mejores Nootrópicos para el Cerebro Adulto Mayor — Basados en Evidencia',
    description:
      'La fosfatidilserina cuenta con la declaración calificada de la FDA. Más Bacopa, citicolina, Melena de León. Qué dice la evidencia sobre apoyo cognitivo en la edad adulta para compradores en Latam.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Fosfatidilserina (PS) — declaración calificada de la FDA',
    evidence:
      'La FDA permite una declaración calificada de salud que indica que la PS puede reducir el riesgo de demencia y disfunción cognitiva en personas mayores. Múltiples ensayos clínicos en personas de 50–80 años a 100–300mg/día muestran mejoras en memoria, velocidad de procesamiento y quejas cognitivas. La evidencia más fuerte sobre apoyo cognitivo asociado a la edad en esta categoría.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicolina (CDP-Colina) — memoria en adultos mayores',
    evidence:
      'Ensayos clínicos en adultos mayores con quejas cognitivas subjetivas muestran mejoras en memoria verbal y velocidad de procesamiento a 250–500mg/día durante 12+ semanas. Cognizin es la forma estandarizada que usan la mayoría de los productos importados.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'Melena de León (Hericium erinaceus)',
    evidence:
      'Mori et al. 2009 — pequeño ensayo clínico en adultos mayores japoneses con deterioro cognitivo leve. 1g/día de extracto del cuerpo fructífero durante 16 semanas mejoró las puntuaciones de función cognitiva. Evidencia prometedora para cambios tempranos asociados a la edad; no evaluada para tratamiento de demencia.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri',
    evidence:
      'Múltiples ensayos clínicos en distintos grupos de edad muestran beneficios en consolidación de memoria. Estudios específicamente en adultos mayores (Stough et al., Calabrese et al.) muestran mejoras en retención y recuerdo tras 8–12 semanas a 300mg estandarizado al 50% de bacósidos.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsLatam.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Incluye fosfatidilserina (100mg de Sharp-PS en dosis clínica), citicolina (250mg de Cognizin en dosis clínica), Bacopa y Melena de León. Cuatro de los ingredientes más relevantes para la edad en un solo producto de fórmula abierta. Sin cafeína — no representa carga cardiovascular para adultos mayores sensibles a estimulantes. Envío internacional confirmado a México, Brasil, Argentina, Colombia, Chile y Perú; planifica 10–18 días para entrega.',
  },
  {
    product: productsLatam.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Incluye fosfatidilserina, citicolina, Bacopa y Melena de León más ingredientes adicionales. La cobertura más completa, pero el protocolo diario de 7 cápsulas puede ser difícil de mantener para adultos mayores — considera si la amplitud justifica esa fricción. Contiene cafeína, lo que puede ser un problema para quienes tienen presión arterial elevada o medicación cardiovascular.',
  },
  {
    product: productsLatam.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 3,
    whyItsHere:
      'Extracto de Melena de León del cuerpo fructífero de un solo ingrediente, de una marca con sólida trayectoria en pruebas de terceros (Certificado de Análisis publicado por lote). La opción correcta si quieres probar Melena de León de forma aislada, posiblemente combinada con un suplemento separado de fosfatidilserina. Bajo costo de envío ($25 USD) reduce riesgo de retención aduanera, relevante para compradores adultos mayores en Brasil y Argentina.',
  },
  {
    product: productsLatam.find(p => p.slug === 'genomma-lab-neuriplus-review')!,
    rank: 4,
    whyItsHere:
      'Opción local registrada en COFEPRIS con DHA, Ginkgo Biloba y vitaminas B6/B12 — una fórmula de mantenimiento conservadora especialmente orientada a adultos mayores. Disponible en farmacias mexicanas (Farmacias del Ahorro, Guadalajara, Benavides) y en cadenas regionales como Cruz Verde (Chile), además de MercadoLibre en toda Latam. Precio en moneda local (~$18 USD/mes), sin riesgo aduanero ni necesidad de tarjeta en USD — la opción más accesible y de menor fricción para adultos mayores en la región. Las dosis están por debajo de las clínicas, así que los efectos serán modestos.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: '¿Estos productos previenen la demencia o el Alzheimer?',
    a: 'No. Ningún suplemento está aprobado para prevenir o tratar demencia o Alzheimer. Los ingredientes de esta página tienen evidencia de apoyo cognitivo asociado a la edad en adultos mayores sanos — distinto de la prevención de enfermedades. Si tú o un familiar experimentan cambios significativos en la memoria, consulta a un neurólogo para una evaluación.',
  },
  {
    q: '¿Qué significa la declaración calificada de la FDA para la PS?',
    a: 'La FDA permite que la fosfatidilserina lleve una declaración calificada de que "investigación científica muy limitada y preliminar sugiere que la PS puede reducir el riesgo de demencia o disfunción cognitiva en adultos mayores". Es una declaración más suave que las declaraciones de salud aprobadas por la FDA y refleja la calidad de la evidencia, no una promesa de prevención de enfermedad. En Latam, COFEPRIS, ANVISA y ANMAT no han adoptado declaraciones equivalentes — la PS se vende como suplemento alimenticio.',
  },
  {
    q: '¿Cuándo debería empezar a tomar estos suplementos?',
    a: 'La evidencia es más fuerte en adultos mayores de 50 años con quejas cognitivas subjetivas. No hay beneficio demostrado de empezar en los 30 o 40 años puramente como "prevención". Habla con tu médico de atención primaria sobre las preocupaciones cognitivas antes de iniciar cualquier suplemento, especialmente si tomas medicamentos recetados.',
  },
  {
    q: '¿Son seguros junto con medicamentos para presión arterial o colesterol?',
    a: 'Generalmente sí para los ingredientes de esta página, pero consulta con tu médico tratante. La Bacopa y la Melena de León tienen interacciones farmacológicas mínimas conocidas. La fosfatidilserina derivada de soja podría interactuar con ciertos regímenes de warfarina/anticoagulantes; la PS derivada de girasol es la alternativa.',
  },
  {
    q: 'Tomo un inhibidor de colinesterasa (donepezilo, etc.). ¿Debo evitar ciertos ingredientes?',
    a: 'Sí — consulta con tu neurólogo. La Huperzina A (presente en Onnit Alpha Brain) es ella misma un inhibidor de la acetilcolinesterasa y no se recomienda combinarlas. La citicolina actúa por un mecanismo distinto (donante de colina) y a veces se usa junto con inhibidores de colinesterasa bajo supervisión médica, pero combina solo con indicación médica.',
  },
  {
    q: '¿Estos productos son legales en mi país de Latam?',
    a: 'Los suplementos nootrópicos importados ingresan a Latam bajo exenciones de uso personal. COFEPRIS (México), ANVISA (Brasil), INVIMA (Colombia), ISP (Chile) y DIGEMID (Perú) generalmente permiten un suministro de 1 a 3 meses para uso personal. ANMAT (Argentina) emitió la Disposición 2105/2022 que prohibió el Noopept y otros nootrópicos no registrados — ninguna de las selecciones aquí contiene Noopept ni ingredientes prohibidos por ANMAT. Las opciones locales registradas (Genomma Lab NeuriPlus en cadenas como Farmacias del Ahorro y Cruz Verde) son la ruta sin fricción aduanera.',
  },
  {
    q: '¿En cuánto tiempo notaré algo?',
    a: 'Fosfatidilserina: 4–12 semanas. Citicolina: 4–12 semanas. Bacopa: 8–12 semanas. Melena de León: 8–16 semanas. Ninguno es un ingrediente de efecto agudo. Haz seguimiento de los cambios durante 12 semanas de dosificación constante — idealmente con una medida cognitiva basal (los tests en línea son crudos pero mejores que el recuerdo subjetivo).',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Mejores Nootrópicos para el Cerebro Adulto Mayor"
      pageDescription="Ranking independiente de nootrópicos para adultos en Latinoamérica preocupados por cambios cognitivos asociados a la edad."
      heroParagraph="El cambio cognitivo asociado a la edad es normal — el recuerdo de la memoria se vuelve más lento, la velocidad de procesamiento disminuye. Los suplementos de esta página tienen evidencia específicamente en adultos mayores con quejas cognitivas subjetivas. NO son tratamientos para demencia, Alzheimer ni ninguna enfermedad cognitiva clínica. Para esos casos, consulta a un neurólogo. Incluimos opciones internacionales de fórmula abierta y opciones locales registradas en COFEPRIS, accesibles en farmacias regionales sin fricción aduanera."
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
