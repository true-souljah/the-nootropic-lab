import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de The Nootropic Lab. Cómo recopilamos, usamos y protegemos tus datos.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
      <p className="text-sm text-gray-500 mb-8">Última actualización: 15 de enero de 2026</p>

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
            <li><strong>Datos analíticos</strong> (solo tras aceptar las cookies): páginas vistas, referente, tipo de dispositivo, país. Usamos análisis enfocados en la privacidad. No se recopila información de identificación personal.</li>
            <li><strong>Preferencia de consentimiento de cookies:</strong> almacenada en el localStorage de tu navegador para recordar tu elección.</li>
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
            Usamos dos tipos de cookies: <strong>cookies necesarias</strong> (preferencia de
            consentimiento de cookies, almacenadas en localStorage) que siempre están activas, y{' '}
            <strong>cookies analíticas</strong> que solo se activan cuando haces clic en
            &quot;Aceptar Analíticas&quot; en nuestro banner de cookies. Puedes rechazar las cookies
            analíticas sin afectar la funcionalidad del sitio. Consulta nuestra{' '}
            <a href="/cookie-policy" className="text-green-700 underline">Política de Cookies</a> para
            más detalles.
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
            de su infraestructura. Consulta la política de privacidad de Cloudflare para más
            detalles. No usamos Google Analytics, Facebook Pixel ni ningún servicio de seguimiento
            publicitario.
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
  );
}
