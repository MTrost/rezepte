import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Utensils,
  Cake,
  Coffee,
  Soup,
  Salad,
  Cookie,
  Wine,
  Beef,
  Leaf,
  Croissant,
} from 'lucide-react'

export const Route = createFileRoute('/kategorien')({ component: CategoriesPage })

function CategoriesPage() {
  const { t } = useTranslation()

  const categories = [
    { name: t('categories.main'), icon: Utensils, slug: 'hauptgerichte', color: 'bg-orange-500', count: 42 },
    { name: t('categories.dessert'), icon: Cake, slug: 'desserts', color: 'bg-pink-500', count: 28 },
    { name: t('categories.breakfast'), icon: Coffee, slug: 'fruehstueck', color: 'bg-amber-500', count: 15 },
    { name: t('categories.soups'), icon: Soup, slug: 'suppen', color: 'bg-emerald-500', count: 19 },
    { name: t('categories.salads'), icon: Salad, slug: 'salate', color: 'bg-green-500', count: 23 },
    { name: t('categories.snacks'), icon: Cookie, slug: 'snacks', color: 'bg-yellow-500', count: 31 },
    { name: t('categories.drinks'), icon: Wine, slug: 'getraenke', color: 'bg-purple-500', count: 12 },
    { name: t('categories.sides'), icon: Beef, slug: 'beilagen', color: 'bg-red-500', count: 17 },
    { name: t('categories.vegan'), icon: Leaf, slug: 'vegan', color: 'bg-lime-500', count: 25 },
    { name: t('categories.baking'), icon: Croissant, slug: 'backen', color: 'bg-amber-600', count: 34 },
  ]

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.categories')}</h1>
          <p className="text-gray-500 mt-1">Entdecke Rezepte nach Kategorie</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to="/kategorien/$slug"
              params={{ slug: category.slug }}
              className="group relative overflow-hidden rounded-2xl aspect-square hover:shadow-lg transition-shadow"
            >
              <div className={`absolute inset-0 ${category.color} group-hover:scale-105 transition-transform duration-300`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <category.icon className="w-10 h-10 mb-2" />
                <span className="font-semibold text-center">{category.name}</span>
                <span className="text-sm text-white/80 mt-1">{category.count} Rezepte</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
