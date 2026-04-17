import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de The Nootropic Lab. Qué cookies usamos y cómo controlarlas.',
};

export default function CookiePolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Cookies</h1>
      <p className="text-sm text-gray-500 mb-8">Última actualización: 15 de enero de 2026</p>

      <div className="prose prose-gray prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">¿Qué Son las Cookies?</h2>
          <p className="text-gray-700 leading-relaxed">
            Las cookies son pequeños archivos de texto almacenados en tu dispositivo cuando visitas
            un sitio web. Ayudan al sitio a recordar tus preferencias y a entender cómo usas el
            sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies que Usamos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Cookie</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Tipo</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Propósito</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-3 py-2 text-gray-900 font-medium">cookie-consent</td>
                  <td className="px-3 py-2 text-gray-700">Necesario</td>
                  <td className="px-3 py-2 text-gray-700">Almacena tu preferencia de consentimiento de cookies (aceptado/rechazado)</td>
                  <td className="px-3 py-2 text-gray-700">Persistente (localStorage)</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-3 py-2 text-gray-900 font-medium">Cookies analíticas</td>
                  <td className="px-3 py-2 text-gray-700">Opcional</td>
                  <td className="px-3 py-2 text-gray-700">Seguimiento anónimo de páginas vistas, fuente de referencia, tipo de dispositivo</td>
                  <td className="px-3 py-2 text-gray-700">Sesión / 30 días</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies de Terceros</h2>
          <p className="text-gray-700 leading-relaxed">
            Cuando haces clic en un enlace de afiliado en nuestro sitio, eres redirigido al sitio
            web del fabricante del producto. Ese sitio puede instalar sus propias cookies para
            rastrear referencias y compras de afiliados. No controlamos estas cookies de terceros.
            Las redes de afiliados más comunes utilizadas en este sitio incluyen programas directos
            de marcas y Amazon Associates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cómo Controlar las Cookies</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>En nuestro sitio:</strong> Usa el banner de cookies en la parte inferior de la página para aceptar o rechazar las cookies analíticas. Tu elección se guarda y se respeta en todas las visitas futuras.</li>
            <li><strong>En tu navegador:</strong> Puedes eliminar las cookies o bloquearlas completamente en la configuración de tu navegador. Esto no afectará la funcionalidad del sitio, ya que nuestro sitio funciona sin cookies de JavaScript.</li>
            <li><strong>Para restablecer tu preferencia:</strong> Borra el localStorage de tu navegador para este dominio y el banner de cookies volverá a aparecer en tu próxima visita.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">No Utilizamos</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Cookies publicitarias ni píxeles de retargeting</li>
            <li>Google Analytics (usamos alternativas enfocadas en la privacidad)</li>
            <li>Facebook Pixel ni seguimiento de redes sociales</li>
            <li>Seguimiento entre sitios de ningún tipo</li>
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
  );
}
