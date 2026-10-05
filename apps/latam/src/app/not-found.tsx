import { NotFound } from '@nootropic/ui';
import { getStrings } from '@nootropic/data';

export const metadata = {
  title: 'Página no encontrada',
  robots: { index: false },
};

// Region 404 with the persistent "Cookie settings" consent control (Next's
// bare built-in 404 has none). Kept minimal: this tree is serialized into
// every page's RSC payload.
export default function NotFoundPage() {
  return (
    <NotFound
      title={'Página no encontrada'}
      body={'La página que buscabas no existe o se ha movido.'}
      homeLabel={'Volver a la página de inicio'}
      cookieSettingsLabel={getStrings('es').cookie.settings}
      privacyLabel={getStrings('es').footer.about.privacy}
      cookiePolicyLabel={getStrings('es').footer.about.cookies}
    />
  );
}
