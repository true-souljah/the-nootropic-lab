import type { Metadata } from 'next';

import { PublicShell, buildAlternates, buildOpenGraph, buildTwitter} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de The Nootropic Lab. Cómo recopilamos, usamos y protegemos tus datos.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/privacy-policy/' }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/privacy-policy/', title: 'Política de Privacidad', description: 'Política de privacidad de The Nootropic Lab. Cómo recopilamos, usamos y protegemos tus datos.' }),
  twitter: buildTwitter({ title: 'Política de Privacidad', description: 'Política de privacidad de The Nootropic Lab. Cómo recopilamos, usamos y protegemos tus datos.' }),
};

export default function PrivacyPolicyPage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
      <p className="text-sm text-gray-500 mb-8">Última actualización: 6 de octubre de 2026</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Quiénes Somos</h2>
          <p className="text-gray-700 leading-relaxed">
            The Nootropic Lab es una plataforma independiente de reseñas de suplementos cognitivos.
            Ofrecemos reseñas con evidencia clínica, auditorías de dosificación y comparaciones de
            productos. Somos un sitio afiliado — ganamos comisiones cuando realizas compras a través
            de nuestros enlaces. Esta política explica cómo manejamos tus datos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Datos que Recopilamos</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Recopilamos datos mínimos:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Datos analíticos</strong> (solo si permites la finalidad Análisis en el banner de consentimiento): páginas vistas, referente, tipo de dispositivo, país. Se recopilan con Google Analytics 4, con las funciones publicitarias desactivadas. No se recopila información de identificación personal.</li>
            <li><strong>Datos de atribución de afiliados</strong> (solo si permites la finalidad Atribución de afiliados, separada de Análisis): la etiqueta de seguimiento de Impact.com guarda un identificador aleatorio para que una compra realizada en un sitio socio tras hacer clic en nuestro enlace se nos atribuya.</li>
            <li><strong>Preferencia de consentimiento de cookies:</strong> almacenada en la cookie <code className="bg-gray-100 px-1 rounded text-xs">klaro</code> durante 365 días para recordar tu elección (la aceptación y el rechazo se conservan el mismo tiempo).</li>
            <li><strong>Datos de clics en enlaces de afiliados:</strong> cuando haces clic en un enlace de afiliado, el sitio de destino puede instalar cookies de seguimiento. No controlamos las cookies de terceros.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Datos que NO Recopilamos</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>No recopilamos nombres, direcciones de correo electrónico ni información personal</li>
            <li>No requerimos la creación de una cuenta</li>
            <li>No vendemos ni compartimos datos con terceros para publicidad</li>
            <li>No usamos cookies publicitarias ni píxeles de retargeting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Usamos una <strong>cookie necesaria</strong> (<code className="bg-gray-100 px-1 rounded text-xs">klaro</code>,
            tu elección de consentimiento, 365 días) que siempre está activa, y cookies opcionales
            para dos finalidades separadas que eliges por separado: <strong>Análisis</strong> (Google
            Analytics 4: <code className="bg-gray-100 px-1 rounded text-xs">_ga</code>,{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">_ga_&lt;container-id&gt;</code>) y{' '}
            <strong>Atribución de afiliados</strong> (Impact.com:{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">IR_*</code>). Cada una se instala solo
            después de que permitas su finalidad en nuestro banner de consentimiento (&quot;Aceptar
            todo&quot;, o esa finalidad en &quot;Configurar&quot;). Nada opcional se carga antes de que
            elijas. Puedes rechazarlas sin afectar la funcionalidad del sitio y cambiar o retirar tu
            elección para cada finalidad en cualquier momento con el enlace &quot;Configuración de
            cookies&quot; al final de cada página. Consulta nuestra{' '}
            <a href="/cookie-policy/" className="text-green-700 underline">Política de Cookies</a> para
            ver nombres, finalidades y duraciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Enlaces de Afiliados</h2>
          <p className="text-gray-700 leading-relaxed">
            Este sitio contiene enlaces de afiliados. Cuando haces clic en estos enlaces y realizas
            una compra, podemos ganar una comisión sin costo adicional para ti. Las relaciones de
            afiliado no influyen en nuestras puntuaciones editoriales ni recomendaciones. Todos los
            enlaces de afiliado están claramente marcados con los atributos{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">rel=&quot;nofollow sponsored&quot;</code>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Servicios de Terceros</h2>
          <p className="text-gray-700 leading-relaxed">
            Este sitio está alojado en Cloudflare Pages. Cloudflare puede recopilar registros
            estándar de servidor web (dirección IP, agente de usuario, marcas de tiempo) como parte
            de su infraestructura; no usamos Cloudflare Web Analytics. Solo para las finalidades que
            permitas en nuestro banner de consentimiento, usamos <strong>Google Analytics 4</strong>{' '}
            para medir el uso del sitio (Análisis; sin funciones de publicidad personalizada) y la
            etiqueta de seguimiento de <strong>Impact.com</strong> para atribuir compras de afiliados
            (Atribución de afiliados). No usamos Facebook
            Pixel ni ningún servicio de seguimiento publicitario. Consulta las políticas de
            privacidad de Cloudflare, Google e Impact.com para más detalles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Sus Derechos</h2>
          <p className="text-gray-700 leading-relaxed">
            Según el RGPD (UE), la CCPA (California) y leyes de privacidad equivalentes, tienes
            derecho a acceder, corregir, eliminar o restringir el procesamiento de tus datos
            personales. Dado que recopilamos datos mínimos sin sistema de cuentas, generalmente no
            hay datos personales que solicitar. Para cualquier consulta relacionada con la
            privacidad, contáctanos al correo electrónico indicado a continuación.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contacto</h2>
          <p className="text-gray-700 leading-relaxed">
            Para consultas sobre privacidad: <strong>privacy@thenootropiclab.com</strong>
          </p>
        </section>
      </div>
    </article>
    </PublicShell>
  );
}
