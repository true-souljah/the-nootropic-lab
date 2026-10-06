import type { Metadata } from 'next';

import { CookieTable, PublicShell, buildAlternates, buildOpenGraph, buildTwitter, type CookieTableLabels } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

const GA_COOKIE_DOC = 'https://support.google.com/analytics/answer/11397207';
const IMPACT_COOKIE_DOC =
  'https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/tracking/tracking-explained/impactcom-cookies-explained';

const LABELS: CookieTableLabels = {
  cookie: 'Cookie',
  setBy: 'Instalada por',
  role: 'Para qué sirve',
  duration: 'Duración',
};

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de The Nootropic Lab. Qué cookies usamos y cómo controlarlas.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/cookie-policy/' }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/cookie-policy/', title: 'Política de Cookies', description: 'Política de cookies de The Nootropic Lab. Qué cookies usamos y cómo controlarlas.' }),
  twitter: buildTwitter({ title: 'Política de Cookies', description: 'Política de cookies de The Nootropic Lab. Qué cookies usamos y cómo controlarlas.' }),
};

export default function CookiePolicyPage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Cookies</h1>
      <p className="text-sm text-gray-500 mb-8">Última actualización: 6 de octubre de 2026</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">¿Qué Son las Cookies?</h2>
          <p className="text-gray-700 leading-relaxed">
            Las cookies son pequeños archivos de texto almacenados en tu dispositivo cuando visitas
            un sitio web. El almacenamiento similar del navegador (localStorage) funciona igual.
            Esta página enumera cada cookie y entrada de almacenamiento que usa este sitio, para qué
            sirve, quién la instala y cuánto dura.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Nada Opcional se Ejecuta Antes de que Elijas</h2>
          <p className="text-gray-700 leading-relaxed">
            Las cookies opcionales tienen dos finalidades separadas y decides sobre cada una por
            separado: <strong>Análisis</strong> (Google Analytics 4) y{' '}
            <strong>Atribución de afiliados</strong> (Impact.com). En tu primera visita, un banner
            de consentimiento ofrece <strong>Aceptar todo</strong> y <strong>Rechazar todo</strong>{' '}
            uno al lado del otro, además de <strong>Configurar</strong>, donde cada finalidad tiene
            su propio interruptor (ambos desactivados hasta que los actives). El script de una
            finalidad se carga, y sus cookies se instalan, solo si permites esa finalidad: permitir
            Análisis nunca carga Impact.com y permitir Atribución de afiliados nunca carga Google
            Analytics. Hasta que elijas, no se envía ninguna solicitud a Google ni a Impact.com. Si
            rechazas, no se carga nada opcional y recordamos tu rechazo exactamente el mismo tiempo
            que recordaríamos una aceptación (365 días).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies que Usamos, por Finalidad</h2>
          <CookieTable
            heading="Estrictamente necesarias (siempre activas)"
            labels={LABELS}
            rows={[
              ['klaro', 'Este sitio (gestor de consentimiento)', 'Guarda tu elección de consentimiento para cada finalidad: qué servicios permitiste o rechazaste.', '365 días'],
            ]}
          />
          <CookieTable
            heading="Análisis: Google Analytics 4 (solo si permites Análisis)"
            labels={LABELS}
            rows={[
              ['_ga', 'Google Analytics 4 (Google), cookie propia', 'Distingue a los visitantes para contar cuántas personas leen cada página.', '2 años'],
              ['_ga_<container-id>', 'Google Analytics 4 (Google), cookie propia', 'Mantiene el estado de la visita actual (sesión).', '2 años'],
            ]}
          />
          <CookieTable
            heading="Atribución de afiliados: Impact.com (solo si permites Atribución de afiliados)"
            labels={LABELS}
            rows={[
              ['IR_MPI', 'Impact.com, cookie propia', 'Identificador aleatorio de visitante que usa la etiqueta de seguimiento de Impact.com para que una compra en un sitio socio se atribuya a este sitio.', 'Persistente (400 días en Chrome, el máximo del navegador)'],
              ['IR_MPS', 'Impact.com, cookie propia', 'Registro de la visita actual que usa la etiqueta de seguimiento de Impact.com.', 'Sesión'],
              ['IR_gbd', 'Impact.com, cookie propia', 'Registra el dominio base para la etiqueta de seguimiento de Impact.com.', 'Sesión'],
              ['IR_PI, IR_<campaign-id>', 'Impact.com, cookies propias', 'Otras cookies de atribución que Impact.com documenta para su etiqueta; pueden instalarse cuando sigues un enlace de un socio.', '365 días / Sesión'],
            ]}
          />
          <p className="text-gray-700 leading-relaxed">
            Las duraciones son las predeterminadas de cada proveedor; los navegadores pueden
            acortarlas (Google indica un máximo de 400 días en Chrome y 7 días en Safari).
            Documentación en inglés:{' '}
            <a href={GA_COOKIE_DOC} className="text-emerald-700 underline" rel="noopener noreferrer" hrefLang="en">
              uso de cookies de Google Analytics 4
            </a>{' '}
            y{' '}
            <a href={IMPACT_COOKIE_DOC} className="text-emerald-700 underline" rel="noopener noreferrer" hrefLang="en">
              cookies de impact.com
            </a>
            . Google Analytics funciona con las funciones publicitarias desactivadas: sin cookies
            publicitarias, sin anuncios personalizados y sin venta de datos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Almacenamiento del Navegador para Funciones que Usas</h2>
          <p className="text-gray-700 leading-relaxed">
            Estas entradas solo se escriben cuando usas la función, nunca se comparten y se
            conservan hasta que las borres: <strong>nootropic-shortlist</strong> y{' '}
            <strong>nootropic-shortlist-note:&lt;producto&gt;</strong> (tu lista corta y tus notas
            guardadas) y <strong>nootropic-command-recent</strong> (tus búsquedas recientes en la
            paleta de búsqueda).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Alojamiento y Sitios Socios</h2>
          <p className="text-gray-700 leading-relaxed">
            El sitio está alojado en Cloudflare, que procesa datos técnicos estándar de las
            solicitudes (como la dirección IP y el tipo de navegador) para entregar y proteger el
            sitio. No usamos Cloudflare Web Analytics. Cuando haces clic en un enlace de afiliado
            sales de este sitio; el comercio o la red de afiliados a la que llegas instala sus
            propias cookies según su propia política, que no controlamos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cómo Cambiar o Retirar tu Consentimiento</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>En nuestro sitio:</strong> usa el enlace <strong>Configuración de cookies</strong>{' '}
              al final de cada página para volver a abrir el banner de consentimiento:{' '}
              <strong>Rechazar todo</strong> retira ambas finalidades y <strong>Configurar</strong>{' '}
              te permite desactivar solo una. Al retirar Análisis, Google Analytics se detiene en la
              página y sus cookies (<code>_ga</code>, <code>_ga_&lt;container-id&gt;</code>) se
              eliminan; al retirar Atribución de afiliados, se eliminan las cookies de Impact.com
              (<code>IR_*</code>). La otra finalidad se mantiene como la elegiste.
            </li>
            <li>
              <strong>En tu navegador:</strong> puedes eliminar o bloquear cookies en la
              configuración de tu navegador. Si eliminas la cookie <strong>klaro</strong>, el banner
              de consentimiento volverá a aparecer en tu próxima visita.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">No Utilizamos</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Cookies publicitarias ni píxeles de retargeting</li>
            <li>Facebook Pixel ni seguimiento de redes sociales</li>
            <li>Publicidad personalizada ni venta de datos a terceros</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contacto</h2>
          <p className="text-gray-700 leading-relaxed">
            Para preguntas sobre nuestras prácticas de cookies: <strong>privacy@thenootropiclab.com</strong>
          </p>
        </section>
      </div>
    </article>
    </PublicShell>
  );
}
