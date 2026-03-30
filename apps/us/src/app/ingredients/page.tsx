import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';
import { ingredients } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Nootropic Ingredients Guide 2026 — Clinical Doses & Evidence',
  description:
    'Compare 10 evidence-backed nootropic ingredients. Clinical doses, mechanisms, time to effect, and which products contain them.',
};

const categoryLabels: Record<string, string> = {
  adaptogen: 'Adaptogen',
  cholinergic: 'Cholinergic',
  mushroom: 'Mushroom',
  amino: 'Amino Acid',
  herb: 'Herb',
  vitamin: 'Vitamin',
};

const categoryColors: Record<string, string> = {
  adaptogen: 'bg-amber-100 text-amber-800',
  cholinergic: 'bg-blue-100 text-blue-800',
  mushroom: 'bg-purple-100 text-purple-800',
  amino: 'bg-teal-100 text-teal-800',
  herb: 'bg-green-100 text-green-800',
  vitamin: 'bg-orange-100 text-orange-800',
};

export default function IngredientsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Nootropic Ingredients Comparison',
    numberOfItems: ingredients.length,
    itemListElement: ingredients.map((ing, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ing.name,
      url: `https://thenootropiclab.com/ingredients/${ing.slug}`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Home</a>
          {' / '}
          <span>Ingredients</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Nootropic Ingredients Guide 2026
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          Evidence-based breakdown of the most studied nootropic compounds. Clinical doses, mechanisms of action,
          and which top-rated stacks contain each ingredient.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Ingredient</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Clinical dose</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Time to effect</th>
                <th className="px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Evidence summary</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Products</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => (
                <tr key={ing.slug} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors`}>
                  <td className="px-4 py-3">
                    <a
                      href={`/ingredients/${ing.slug}`}
                      className="font-semibold text-green-700 hover:text-green-900 hover:underline"
                    >
                      {ing.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[ing.category]}`}>
                      {categoryLabels[ing.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{ing.clinicalDose}</td>
                  <td className="px-4 py-3 text-gray-700">{ing.timeToEffect}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell max-w-xs">
                    <span className="line-clamp-2">{ing.studySummary}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {ing.productsContaining.map(pid => (
                        <a
                          key={pid}
                          href={`/${pid}`}
                          className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded transition-colors"
                        >
                          {pid.replace(/-/g, ' ')}
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map(ing => (
            <a
              key={ing.slug}
              href={`/ingredients/${ing.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-bold text-gray-900">{ing.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[ing.category]}`}>
                  {categoryLabels[ing.category]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ing.studySummary}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Dose: <strong className="text-gray-700">{ing.clinicalDose}</strong></span>
                <span>Effect: <strong className="text-gray-700">{ing.timeToEffect}</strong></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
