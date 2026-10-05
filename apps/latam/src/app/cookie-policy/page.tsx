import type { Metadata } from 'next';

import { PublicShell, buildAlternates, buildOpenGraph, buildTwitter} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

const GA_COOKIE_DOC = 'https://support.google.com/analytics/answer/11397207';
const IMPACT_COOKIE_DOC =
  'https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/tracking/tracking-explained/impactcom-cookies-explained';

const TH = 'px-3 py-2 font-semibold text-gray-700';
const TD = 'px-3 py-2 text-gray-700 align-top';
const TD_NAME = 'px-3 py-2 text-gray-900 font-medium align-top';

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
      <p className="text-sm text-gray-500 mb-8">Última actualización: 5 de octubre de 2026</p>

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
            En tu primera visita, un banner de consentimiento ofrece <strong>Aceptar todo</strong> y{' '}
            <strong>Rechazar todo</strong> uno al lado del otro. Hasta que hagas clic en Aceptar, no
            se carga ningún script de análisis ni de seguimiento de afiliados y no se envía ninguna
            solicitud a Google ni a Impact.com. Si rechazas, no se carga nada opcional y recordamos
            tu rechazo exactamente el mismo tiempo que recordaríamos una aceptación (365 días).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies que Usamos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className={TH}>Cookie</th>
                  <th className={TH}>Categoría</th>
                  <th className={TH}>Instalada por</th>
                  <th className={TH}>Finalidad</th>
                  <th className={TH}>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className={TD_NAME}>klaro</td>
                  <td className={TD}>Estrictamente necesaria</td>
                  <td className={TD}>Este sitio (gestor de consentimiento)</td>
                  <td className={TD}>Guarda tu elección de consentimiento: qué servicios aceptaste o rechazaste.</td>
                  <td className={TD}>365 días</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className={TD_NAME}>_ga</td>
                  <td className={TD}>Análisis (solo después de Aceptar)</td>
                  <td className={TD}>Google Analytics 4 (Google), cookie propia</td>
                  <td className={TD}>Distingue a los visitantes para contar cuántas personas leen cada página.</td>
                  <td className={TD}>2 años</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className={TD_NAME}>_ga_&lt;container-id&gt;</td>
                  <td className={TD}>Análisis (solo después de Aceptar)</td>
                  <td className={TD}>Google Analytics 4 (Google), cookie propia</td>
                  <td className={TD}>Mantiene el estado de la visita actual (sesión).</td>
                  <td className={TD}>2 años</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className={TD_NAME}>IR_MPI</td>
                  <td className={TD}>Atribución de afiliados (solo después de Aceptar)</td>
                  <td className={TD}>Impact.com, cookie propia</td>
                  <td className={TD}>Identificador aleatorio de visitante que usa la etiqueta de seguimiento de Impact.com para que una compra en un sitio socio se atribuya a este sitio.</td>
                  <td className={TD}>Persistente (400 días en Chrome, el máximo del navegador)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className={TD_NAME}>IR_MPS</td>
                  <td className={TD}>Atribución de afiliados (solo después de Aceptar)</td>
                  <td className={TD}>Impact.com, cookie propia</td>
                  <td className={TD}>Registro de la visita actual que usa la etiqueta de seguimiento de Impact.com.</td>
                  <td className={TD}>Sesión</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className={TD_NAME}>IR_gbd</td>
                  <td className={TD}>Atribución de afiliados (solo después de Aceptar)</td>
                  <td className={TD}>Impact.com, cookie propia</td>
                  <td className={TD}>Registra el dominio base para la etiqueta de seguimiento de Impact.com.</td>
                  <td className={TD}>Sesión</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className={TD_NAME}>IR_PI, IR_&lt;campaign-id&gt;</td>
                  <td className={TD}>Atribución de afiliados (solo después de Aceptar)</td>
                  <td className={TD}>Impact.com, cookies propias</td>
                  <td className={TD}>Otras cookies de atribución que Impact.com documenta para su etiqueta; pueden instalarse cuando sigues un enlace de un socio.</td>
                  <td className={TD}>365 días / Sesión</td>
                </tr>
              </tbody>
            </table>
          </div>
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
              al final de cada página para volver a abrir el gestor de consentimiento y activar o
              desactivar cualquier servicio en cualquier momento. Al retirar el consentimiento,
              Google Analytics se detiene en la página y sus cookies (y las de Impact.com) se
              eliminan de este sitio.
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
