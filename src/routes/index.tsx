import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  ChefHat,
  Clock,
  Users,
  Heart,
  Search,
  ArrowRight,
  Utensils,
  Cake,
  Coffee,
  Soup,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { t } = useTranslation()

  const categories = [
    { name: t('categories.main'), icon: Utensils, slug: 'hauptgerichte', color: 'bg-orange-500' },
    { name: t('categories.dessert'), icon: Cake, slug: 'desserts', color: 'bg-pink-500' },
    { name: t('categories.breakfast'), icon: Coffee, slug: 'fruehstueck', color: 'bg-amber-500' },
    { name: t('categories.soups'), icon: Soup, slug: 'suppen', color: 'bg-emerald-500' },
  ]

  const featuredRecipes = [
    {
      id: '1',
      title: 'Klassische Käsespätzle',
      description: 'Cremige Spätzle mit würzigem Bergkäse und knusprigen Röstzwiebeln',
      time: 45,
      servings: 4,
      image: null,
      slug: 'klassische-kaesespaetzle',
    },
    {
      id: '2',
      title: 'Wiener Schnitzel',
      description: 'Zartes Kalbsschnitzel in goldener Panade mit Zitrone',
      time: 30,
      servings: 2,
      image: null,
      slug: 'wiener-schnitzel',
    },
    {
      id: '3',
      title: 'Apfelstrudel',
      description: 'Traditioneller Strudel mit saftiger Apfelfüllung und Vanillesauce',
      time: 60,
      servings: 8,
      image: null,
      slug: 'apfelstrudel',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <ChefHat className="w-20 h-20" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('home.welcome')}
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <Link
              to="/suche"
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-4 text-left hover:bg-white/20 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="text-orange-100">{t('home.findRecipes')}...</span>
            </Link>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('home.browseCategories')}
            </h2>
            <Link
              to="/kategorien"
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
            >
              Alle anzeigen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to="/kategorien/$slug"
                params={{ slug: category.slug }}
                className="group relative overflow-hidden rounded-2xl aspect-square"
              >
                <div className={`absolute inset-0 ${category.color} group-hover:scale-105 transition-transform duration-300`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <category.icon className="w-12 h-12 mb-2" />
                  <span className="font-semibold text-lg">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('home.featuredRecipes')}
            </h2>
            <Link
              to="/rezepte"
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
            >
              Alle Rezepte
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <article
                key={recipe.id}
                className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to="/rezept/$slug" params={{ slug: recipe.slug }}>
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                    <ChefHat className="w-16 h-16 text-orange-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.time} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings} Portionen</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 text-red-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Teile deine Lieblingsrezepte
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Erstelle ein kostenloses Konto und teile deine besten Rezepte mit der Community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registrieren"
              className="px-8 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors"
            >
              Jetzt registrieren
            </Link>
            <Link
              to="/rezepte"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
            >
              Rezepte entdecken
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
