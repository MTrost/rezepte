import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Search, ChefHat, X } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'

export const Route = createFileRoute('/suche')({ component: SearchPage })

function SearchPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  // Demo search results
  const allRecipes = [
    {
      id: '1',
      userId: 'demo',
      categoryId: null,
      title: 'Klassische Käsespätzle',
      slug: 'klassische-kaesespaetzle',
      description: 'Cremige Spätzle mit würzigem Bergkäse',
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
      description: 'Zartes Kalbsschnitzel in goldener Panade',
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
      description: 'Traditioneller Strudel mit Apfelfüllung',
      imageUrl: null,
      prepTime: 30,
      cookTime: 30,
      servings: 8,
      difficulty: 'schwer' as const,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const results = query.trim()
    ? allRecipes.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.description?.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
  }

  const popularSearches = ['Pasta', 'Kuchen', 'Salat', 'Suppe', 'Vegetarisch', 'Schnell']

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setHasSearched(true)
              }}
              placeholder={`${t('common.search')}...`}
              className="w-full pl-14 pr-12 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setHasSearched(false)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        {/* Popular Searches */}
        {!hasSearched && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Beliebte Suchbegriffe</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term)
                    setHasSearched(true)
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {results.length > 0
                ? `${results.length} Ergebnis${results.length !== 1 ? 'se' : ''} für "${query}"`
                : query
                ? `Keine Ergebnisse für "${query}"`
                : 'Gib einen Suchbegriff ein'}
            </h2>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-16">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">{t('common.noResults')}</p>
                <p className="text-gray-400 text-sm">
                  Versuche einen anderen Suchbegriff oder{' '}
                  <button
                    onClick={() => {
                      setQuery('')
                      setHasSearched(false)
                    }}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    durchsuche unsere Kategorien
                  </button>
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
