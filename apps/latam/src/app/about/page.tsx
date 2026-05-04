import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg } from '@nootropic/ui';

const SITE_URL = 'https://latam.thenootropiclab.com';

export const metadata: Metadata = {
  title: 'Acerca de The Nootropic Lab Latam',
  description:
    'The Nootropic Lab Latam es un sitio independiente de comparación de suplementos cognitivos para América Latina, operado por Kulik Media UG. Reseñas basadas en evidencia, auditorías de dosificación clínica y divulgación transparente de afiliados.',
  alternates: { canonical: `${SITE_URL}/about/` },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about/`,
  name: 'Acerca de The Nootropic Lab Latam',
  publisher: {
    '@type': 'Organization',
    name: 'The Nootropic Lab',
    legalName: 'Kulik Media UG',
    url: SITE_URL,
  },
};

export default function AboutPage() {
  return (
    <>
      <SchemaOrg schema={aboutSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Acerca de The Nootropic Lab Latam</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Somos un sitio independiente de comparación de suplementos cognitivos para compradores en América
          Latina. Puntuamos cada producto con la misma metodología de 5 pilares. Divulgamos cada relación
          comercial. Publicamos contenido bilingüe en español y português brasileño para servir a los
          lectores en toda la región.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Lo que hacemos</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Reseñamos suplementos nootrópicos para compradores en México, Brasil, Argentina, Colombia, Chile
            y Perú. Cada reseña incluye una auditoría de dosificación clínica que compara cada ingrediente
            con la dosis mínima efectiva de ensayos revisados por pares. Puntuamos las marcas en calidad de
            ingredientes, dosis vs. evidencia, transparencia de la fórmula, relación calidad-precio y
            confianza en la marca. Cubrimos canales de compra transfronterizos como Mercado Libre e iHerb,
            que dominan la distribución de nootrópicos en América Latina.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <Link href="/methodology" className="text-green-700 underline">Lee la metodología completa →</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Panorama regulatorio en América Latina</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Cada país de América Latina tiene su propia agencia regulatoria de suplementos. Verificamos el
            estado regulatorio de cada producto que reseñamos contra los reglamentos vigentes en los
            mercados principales:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>ANVISA (Brasil)</strong> — Agência Nacional de Vigilância Sanitária. Regula los
              suplementos como alimentos. Aplica el impuesto de importación más alto de la región (hasta
              60%).
            </li>
            <li>
              <strong>COFEPRIS (México)</strong> — Comisión Federal para la Protección contra Riesgos
              Sanitarios. Mercado más amigable para importaciones; aranceles bajos en compras menores a 50
              dólares.
            </li>
            <li>
              <strong>ANMAT (Argentina)</strong> — Administración Nacional de Medicamentos, Alimentos y
              Tecnología Médica. <strong>Disposición 2105/2022 prohíbe el Noopept</strong> como
              ingrediente — los productos que contienen Noopept no se importan legalmente a Argentina.
            </li>
            <li>
              <strong>ISP (Chile)</strong> — Instituto de Salud Pública. Regula los suplementos como
              alimentos funcionales.
            </li>
            <li>
              <strong>INVIMA (Colombia)</strong> — Instituto Nacional de Vigilancia de Medicamentos y
              Alimentos.
            </li>
            <li>
              <strong>DIGEMID (Perú)</strong> — Dirección General de Medicamentos, Insumos y Drogas.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Quiénes somos</h2>
          <p className="text-gray-700 leading-relaxed">
            The Nootropic Lab es operado por <strong>Kulik Media UG</strong>, una sociedad alemana de
            responsabilidad limitada que construye sitios de comparación basados en evidencia en verticales
            regulados (servicios financieros, suplementos, mercados de predicción). La línea editorial está
            dirigida por Stephan Kulik. Cada reseña lleva la firma de un autor con nombre — sin contenido
            anónimo.{' '}
            <Link href="/authors/stephan-kulik/" className="text-green-700 underline">Conoce al editor</Link>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Independencia editorial</h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>Sin colocaciones pagadas.</strong> No aceptamos pagos a cambio de reseñas, rankings o
              puntuaciones favorables.
            </li>
            <li>
              <strong>Los enlaces de afiliado se divulgan.</strong> Cuando compras un producto a través de
              nuestros enlaces salientes, podemos ganar una comisión sin costo extra para ti. Las relaciones
              de afiliado no afectan nuestras puntuaciones editoriales ni los rankings.
            </li>
            <li>
              <strong>Puntuamos lo bueno y lo malo.</strong> Las marcas con quejas documentadas (fricción de
              suscripción, cargos ocultos, acciones de agencias de protección al consumidor) se señalan en
              sus reseñas incluso cuando pagan comisiones de afiliado competitivas.
            </li>
            <li>
              <strong>Canales de compra reales para Latam.</strong> Cubrimos Mercado Libre, iHerb y otras
              rutas de importación transfronteriza que la mayoría de los compradores en la región usan en la
              práctica — no solo enlaces directos del fabricante que generan altos aranceles aduaneros.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Aviso de salud</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            La información de este sitio web es solo con fines educativos y no constituye asesoramiento
            médico. Los suplementos nootrópicos no están aprobados por las autoridades sanitarias regionales
            (ANVISA, COFEPRIS, ANMAT, ISP, INVIMA, DIGEMID) para diagnosticar, tratar, curar o prevenir
            ninguna enfermedad. Siempre consulta a un profesional de la salud calificado antes de comenzar
            cualquier régimen de suplementos, particularmente si estás embarazada, en período de lactancia,
            tomando medicamentos o tienes alguna condición médica. Los resultados individuales pueden
            variar.
          </p>
        </section>

        <section className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">¿Quieres contactarnos?</h2>
          <p className="text-sm text-gray-700 mb-3">
            Las correcciones editoriales, consultas de asociación y comentarios de lectores se gestionan
            mediante <Link href="/contact/" className="text-green-700 underline">nuestra página de
            contacto</Link>.
          </p>
        </section>
      </article>
    </>
  );
}
