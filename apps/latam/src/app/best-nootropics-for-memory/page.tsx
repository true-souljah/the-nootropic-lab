import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsLatam, getRegionalHealthDisclaimer, sitemapDate } from '@nootropic/data';
import sitemap from '@/app/sitemap';
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
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'En una revisión sistemática de seis ensayos aleatorizados (Pase 2012, PubMed 22747190), todos de 12 semanas con 300–450mg de extracto al día, la Bacopa mejoró 9 de 17 pruebas de recuerdo libre de memoria. El inicio es lento — diario por 8+ semanas. No es un ingrediente de efecto agudo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
  {
    name: 'Melena de León (Hericium erinaceus)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Modula el Factor de Crecimiento Nervioso (NGF) y puede apoyar la neurogénesis. Pequeños ensayos clínicos (Mori et al. 2009 en adultos de 50 a 80 años con deterioro cognitivo leve) mostraron puntuaciones de función cognitiva más altas que con placebo con 3g/día durante 16 semanas. La evidencia es prometedora pero menor que para Bacopa. Busca extracto del cuerpo fructífero, no micelio sobre grano.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Fosfatidilserina (PS)',
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'Componente fosfolípido de las membranas neuronales. La FDA solo permite para la fosfatidilserina declaraciones calificadas de que "may reduce the risk of dementia" o "cognitive dysfunction in the elderly", cada una seguida de "FDA concludes that there is little scientific evidence supporting this claim" (carta de la FDA, 13 de mayo de 2003): es decir, que puede reducir el riesgo de demencia o de disfunción cognitiva en personas mayores, y que la FDA concluye que hay poca evidencia científica que respalde esa declaración. Los ensayos clínicos en adultos mayores a 100–300mg al día reportan beneficios en la memoria, aunque a menudo solo en subgrupos (ver nuestra página sobre la fosfatidilserina). Evidencia más débil en adultos jóvenes sanos. El ensayo enlazado abajo (Vakhapova et al. 2010) no es la base de la declaración de la FDA: en un ensayo clínico exploratorio de 15 semanas con 157 adultos mayores sin demencia y con quejas de memoria, la PS-DHA mejoró el recuerdo verbal inmediato frente a placebo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicolina (CDP-Colina)',
    ingredientSlugs: ['citicoline'],
    evidence:
      'Donante de colina y fuente de uridina. En un ensayo con adultos de 50 a 85 años (Spiers 1996, PubMed 8624220), 1000mg al día durante 3 meses mejoraron el recuerdo diferido solo en quienes tenían una memoria relativamente ineficiente, y en un ensayo cruzado posterior con 32 de esos participantes, 2000mg al día durante 2 meses mejoraron el recuerdo inmediato y diferido.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsLatam.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Incluye Bacopa, citicolina (250mg de Cognizin en dosis clínica) Y fosfatidilserina (100mg en dosis clínica) — tres de los cuatro ingredientes con evidencia para memoria en una sola fórmula abierta. La dosis de Bacopa es de 150mg (por debajo del ancla clínica de 300mg) por lo que conviene complementar con un suplemento separado de Bacopa para el efecto completo. Confirma en el checkout si la marca envía a tu país.',
  },
  {
    product: productsLatam.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 2,
    whyItsHere:
      'Extracto de Melena de León del cuerpo fructífero, ingrediente único, de una marca con sólida reputación en pruebas de terceros (publica Certificado de Análisis por lote — útil para presentar ante aduanas en Latam si se solicita). Aporta 500mg de Melena de León, la mitad del mínimo de 1g al día de nuestra dosis de referencia.',
  },
  {
    product: productsLatam.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Incluye citicolina, fosfatidilserina Y Melena de León, con 31 ingredientes en total: la fórmula con más ingredientes de esta página. Pierde puntos por cantidad de cápsulas (6/día) y precio (US$139 por envío de suscripción cada 4 semanas). Para memoria específicamente, la amplitud justifica el compromiso si toleras la fricción diaria. Los aranceles de importación y el despacho aduanero corren por cuenta del comprador.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: '¿Qué ingredientes nootrópicos tienen evidencia de ensayos para la memoria?',
    a: 'Bacopa Monnieri: en una revisión sistemática de seis ensayos aleatorizados de 12 semanas con 300–450mg de extracto al día (Pase 2012, PubMed 22747190), mejoró 9 de 17 pruebas de recuerdo libre de memoria, y los autores escriben que la investigación "is in its infancy", es decir, que está en sus inicios. Para la fosfatidilserina, la FDA solo permite declaraciones calificadas, como que "may reduce the risk of cognitive dysfunction in the elderly", seguida de "FDA concludes that there is little scientific evidence supporting this claim" (carta de la FDA, 13 de mayo de 2003): es decir, que puede reducir el riesgo de disfunción cognitiva en personas mayores, aunque la FDA concluye que hay poca evidencia científica que la respalde. La citicolina mejoró la memoria verbal en adultos mayores con memoria ineficiente en un ensayo (Spiers 1996, PubMed 8624220).',
  },
  {
    q: '¿Cuánto tardan en hacer efecto los nootrópicos para memoria?',
    a: 'Bacopa: 8–12 semanas de uso diario; la mayoría de los ensayos positivos duraron 12 semanas. Melena de León: en adultos con deterioro cognitivo leve, el beneficio se fue acumulando a lo largo de 8–16 semanas. Fosfatidilserina: sus ensayos sobre la memoria duraron de 15 semanas a 12 meses. Citicolina: sus efectos sobre la memoria se midieron después de 2–3 meses. Aparte de los pequeños efectos agudos de la Melena de León en ensayos piloto, ninguno es un ingrediente de efecto agudo. Planifica al menos 12 semanas de dosificación constante antes de juzgar, y más tiempo para la fosfatidilserina (15 semanas o más) — y considera el tiempo de envío internacional (10–18 días a Latam) en tu cronograma.',
  },
  {
    q: '¿Son seguros estos nootrópicos a largo plazo?',
    a: 'Los ingredientes de esta página tienen perfiles de seguridad favorables en ensayos clínicos en humanos a las dosis indicadas. La fosfatidilserina derivada de soja puede ser una preocupación para quienes tienen alergia a la soja (existe PS derivada de girasol). La Bacopa puede causar molestias gastrointestinales en algunas personas; tómala con comida.',
  },
  {
    q: '¿Estos productos son legales en mi país de Latam?',
    a: 'La Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil, el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia, el Instituto de Salud Pública (ISP) en Chile y la Dirección General de Medicamentos, Insumos y Drogas (DIGEMID) en Perú son las autoridades sanitarias que regulan los suplementos en sus países. Las reglas de cantidad para la importación de suplementos para uso personal no pudieron confirmarse en una página oficial en nuestra revisión del 5 de octubre de 2026: confirma con la aduana de tu país antes de hacer un pedido. En Argentina, la Disposición 2105/2022 de la ANMAT prohibió siete productos concretos no registrados (Noopept, F-Phenibut y Bacopa de las marcas Newmind y PURENOOTROPICS) — ninguna de las selecciones aquí es uno de esos productos ni contiene Noopept o F-Phenibut.',
  },
  {
    q: '¿Ayudarán con la pérdida de memoria asociada a la edad?',
    a: 'Algunos de los suplementos de esta página tienen evidencia de ensayos en adultos mayores, a menudo solo en subgrupos: la PS-DHA en adultos mayores con quejas de memoria, la citicolina en quienes tienen una memoria relativamente ineficiente y la Melena de León en el deterioro cognitivo leve. Si tú o un familiar experimentan cambios significativos en la memoria, consulta a un neurólogo. Los suplementos no son tratamiento para la demencia.',
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
      heroParagraph="Para la memoria, la evidencia sobre Bacopa Monnieri que citamos es una revisión sistemática de seis ensayos aleatorizados de 12 semanas (Pase 2012). Esta página clasifica los productos disponibles para compradores en Latam que contienen Bacopa, Melena de León, fosfatidilserina o citicolina en dosis clínica o cercana a ella. Incluimos opciones internacionales (Mind Lab Pro, Qualia Mind, Nootropics Depot)."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'ANMAT Disposición 2105/2022: los siete productos prohibidos (Argentina)', href: '/anmat-disposicion-2105-2022-prohibidos/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('latam')}
      searchItems={searchItems}
      uiStrings={uiStrings}
      updated={sitemapDate(sitemap(), '/best-nootropics-for-memory/')}
    />
  );
}
