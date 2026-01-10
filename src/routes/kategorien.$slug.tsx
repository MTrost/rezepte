import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ChefHat } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'

export const Route = createFileRoute('/kategorien/$slug')({ component: CategoryPage })

function CategoryPage() {
  const { slug } = Route.useParams()
  const { t } = useTranslation()

  // Demo category mapping
  const categoryNames: Record<string, string> = {
    hauptgerichte: t('categories.main'),
    desserts: t('categories.dessert'),
    fruehstueck: t('categories.breakfast'),
    suppen: t('categories.soups'),
    salate: t('categories.salads'),
    snacks: t('categories.snacks'),
    getraenke: t('categories.drinks'),
    beilagen: t('categories.sides'),
    vegan: t('categories.vegan'),
    backen: t('categories.baking'),
  }

  const categoryName = categoryNames[slug] || slug

  // Demo recipes for category
  const recipes = [
    {
      id: '1',
      userId: 'demo',
      categoryId: slug,
      title: 'Beispielrezept 1',
      slug: 'beispielrezept-1',
      description: 'Ein köstliches Rezept aus dieser Kategorie',
      imageUrl: null,
      prepTime: 20,
      cookTime: 30,
      servings: 4,
      difficulty: 'mittel' as const,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'demo',
      categoryId: slug,
      title: 'Beispielrezept 2',
      slug: 'beispielrezept-2',
      description: 'Noch ein tolles Rezept zum Ausprobieren',
      imageUrl: null,
      prepTime: 15,
      cookTime: 25,
      servings: 2,
      difficulty: 'einfach' as const,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          to="/kategorien"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Alle Kategorien
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-gray-500 mt-1">{recipes.length} Rezepte in dieser Kategorie</p>
        </div>

        {/* Recipe Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('common.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
