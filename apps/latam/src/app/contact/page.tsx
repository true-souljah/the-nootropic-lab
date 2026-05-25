import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

const SITE_URL = 'https://latam.thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Contacta a The Nootropic Lab Latam',
  description:
    'Correcciones editoriales, consultas de asociación, comentarios de lectores. Contacta al equipo editorial de The Nootropic Lab Latam.',
  alternates: { canonical: `${SITE_URL}/contact/` },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: `${SITE_URL}/contact/`,
  name: 'Contacta a The Nootropic Lab Latam',
};

export default function ContactPage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={contactSchema} />

      <article className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contáctanos</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Leemos cada correo. Elige la dirección correcta a continuación para que tu mensaje llegue a la
          persona adecuada.
        </p>

        <div className="space-y-6">
          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Correcciones editoriales</h2>
            <p className="text-sm text-gray-700 mb-2">
              ¿Detectaste un error factual en una reseña? ¿Encontraste un precio desactualizado o un SKU
              descontinuado? Actualizamos el contenido con base en correcciones documentadas.
            </p>
            <a
              href="mailto:editorial@thenootropiclab.com?subject=Solicitud%20de%20correcci%C3%B3n"
              className="inline-block text-green-700 underline text-sm font-medium"
            >
              editorial@thenootropiclab.com
            </a>
          </section>

          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Comentarios de lectores y datos de campo</h2>
            <p className="text-sm text-gray-700 mb-2">
              ¿Tuviste una experiencia con una marca que cubrimos? ¿Quieres compartir una historia sobre
              cancelación de suscripción o un problema con la aduana al importar? Usamos los datos de
              encuestas de lectores en nuestra puntuación de confianza de marca.
            </p>
            <a
              href="mailto:readers@thenootropiclab.com?subject=Comentarios%20de%20lector"
              className="inline-block text-green-700 underline text-sm font-medium"
            >
              readers@thenootropiclab.com
            </a>
          </section>

          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Consultas de asociación y afiliados</h2>
            <p className="text-sm text-gray-700 mb-2">
              Contacto de marcas o redes de afiliados. Nota: no aceptamos colocaciones pagadas, y las
              relaciones de afiliado no afectan nuestras puntuaciones editoriales.
            </p>
            <a
              href="mailto:partnerships@thenootropiclab.com?subject=Consulta%20de%20asociaci%C3%B3n"
              className="inline-block text-green-700 underline text-sm font-medium"
            >
              partnerships@thenootropiclab.com
            </a>
          </section>
        </div>

        <section className="mt-10 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Operador</h2>
          <p className="text-sm text-gray-700">
            The Nootropic Lab es operado por <strong></strong>, una sociedad alemana de
            responsabilidad limitada. Para correspondencia legal, contacta a{' '}
            <a href="mailto:legal@thenootropiclab.com" className="text-green-700 underline">
              legal@thenootropiclab.com
            </a>.
          </p>
        </section>
      </article>
    </PublicShell>
  );
}
