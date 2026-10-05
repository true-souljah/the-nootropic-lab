import { NotFound } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';

export const metadata = {
  title: 'Página no encontrada',
  robots: { index: false },
};

// Region 404 inside the public chrome (header, footer, "Cookie settings"
// consent control) instead of Next's bare built-in 404.
export default function NotFoundPage() {
  return (
    <NotFound
      title={'Página no encontrada'}
      body={'La página que buscabas no existe o se ha movido. Usa la búsqueda o vuelve a la página de inicio.'}
      homeLabel={'Volver a la página de inicio'}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
