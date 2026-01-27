import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Clock, Users, ChefHat, Heart } from 'lucide-react'
import type { Recipe } from '../db/schema'

interface RecipeCardProps {
  recipe: Recipe
  showFavorite?: boolean
  onToggleFavorite?: () => void
  isFavorite?: boolean
}

export default function RecipeCard({
  recipe,
  showFavorite = false,
  onToggleFavorite,
  isFavorite = false,
}: RecipeCardProps) {
  const { t } = useTranslation()

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  const difficultyLabel = {
    einfach: t('recipe.difficulties.easy'),
    mittel: t('recipe.difficulties.medium'),
    schwer: t('recipe.difficulties.hard'),
  }

  const difficultyColor = {
    einfach: 'bg-green-100 text-green-700',
    mittel: 'bg-yellow-100 text-yellow-700',
    schwer: 'bg-red-100 text-red-700',
  }

  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      <Link to="/rezept/$slug" params={{ slug: recipe.slug }} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
              <ChefHat className="w-16 h-16 text-orange-300" />
            </div>
          )}

          {showFavorite && onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite()
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label={isFavorite ? t('recipe.removeFromFavorites') : t('recipe.addToFavorites')}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          )}

          {recipe.difficulty && (
            <span
              className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-medium rounded-full ${
                difficultyColor[recipe.difficulty]
              }`}
            >
              {difficultyLabel[recipe.difficulty]}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
          )}

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {totalTime} {t('recipe.minutes')}
                </span>
              </div>
            )}

            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {recipe.servings} {recipe.servings === 1 ? t('recipe.portion') : t('recipe.portions')}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
