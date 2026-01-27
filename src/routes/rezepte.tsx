import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ChefHat, Filter } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'

export const Route = createFileRoute('/rezepte')({ component: RecipesPage })

function RecipesPage() {
  const { t } = useTranslation()

  // Demo data - in real app this would come from server function
  const recipes = [
    {
      id: '1',
      userId: 'demo',
      categoryId: null,
      title: 'Klassische Käsespätzle',
      slug: 'klassische-kaesespaetzle',
      description: 'Cremige Spätzle mit würzigem Bergkäse und knusprigen Röstzwiebeln',
      imageUrl: null,
      prepTime: 15,
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
      categoryId: null,
      title: 'Wiener Schnitzel',
      slug: 'wiener-schnitzel',
      description: 'Zartes Kalbsschnitzel in goldener Panade mit Zitrone',
      imageUrl: null,
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      difficulty: 'mittel' as const,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: 'demo',
      categoryId: null,
      title: 'Apfelstrudel',
      slug: 'apfelstrudel',
      description: 'Traditioneller Strudel mit saftiger Apfelfüllung und Vanillesauce',
      imageUrl: null,
      prepTime: 30,
      cookTime: 30,
      servings: 8,
      difficulty: 'schwer' as const,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      userId: 'demo',
      categoryId: null,
      title: 'Kartoffelsuppe',
      slug: 'kartoffelsuppe',
      description: 'Herzhafte Suppe mit cremigen Kartoffeln und frischen Kräutern',
      imageUrl: null,
      prepTime: 15,
      cookTime: 25,
      servings: 6,
      difficulty: 'einfach' as const,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      userId: 'demo',
      categoryId: null,
      title: 'Schwarzwälder Kirschtorte',
      slug: 'schwarzwaelder-kirschtorte',
      description: 'Klassische Torte mit Schokolade, Sahne und Kirschen',
      imageUrl: null,
      prepTime: 45,
      cookTime: 30,
      servings: 12,
      difficulty: 'schwer' as const,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      userId: 'demo',
      categoryId: null,
      title: 'Bauernfrühstück',
      slug: 'bauernfruehstueck',
      description: 'Deftige Pfanne mit Bratkartoffeln, Speck und Ei',
      imageUrl: null,
      prepTime: 10,
      cookTime: 20,
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('nav.recipes')}</h1>
            <p className="text-gray-500 mt-1">{recipes.length} Rezepte gefunden</p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
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
