import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Printer,
  ArrowLeft,
  Check,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/rezept/$slug')({ component: RecipeDetailPage })

function RecipeDetailPage() {
  const { slug } = Route.useParams()
  const { t } = useTranslation()
  const [servingsMultiplier, setServingsMultiplier] = useState(1)
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())

  // Demo data - in real app this would come from server function
  const recipe = {
    id: '1',
    title: 'Klassische Käsespätzle',
    slug: 'klassische-kaesespaetzle',
    description: 'Cremige Spätzle mit würzigem Bergkäse und knusprigen Röstzwiebeln. Ein traditionelles schwäbisches Gericht, das die ganze Familie lieben wird.',
    imageUrl: null,
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'mittel' as const,
    createdAt: new Date(),
    author: {
      name: 'Maria Schmidt',
      image: null,
    },
    ingredients: [
      { id: '1', name: 'Mehl', amount: 400, unit: 'g' },
      { id: '2', name: 'Eier', amount: 4, unit: 'Stück' },
      { id: '3', name: 'Wasser', amount: 150, unit: 'ml' },
      { id: '4', name: 'Salz', amount: 1, unit: 'TL' },
      { id: '5', name: 'Bergkäse (gerieben)', amount: 300, unit: 'g' },
      { id: '6', name: 'Zwiebeln', amount: 3, unit: 'Stück' },
      { id: '7', name: 'Butter', amount: 50, unit: 'g' },
      { id: '8', name: 'Schnittlauch', amount: null, unit: 'etwas' },
    ],
    steps: [
      { id: '1', stepNumber: 1, instruction: 'Mehl in eine große Schüssel geben und eine Mulde in der Mitte formen. Eier, Wasser und Salz hinzufügen.' },
      { id: '2', stepNumber: 2, instruction: 'Den Teig mit einem Holzlöffel kräftig schlagen, bis er Blasen wirft und sich vom Schüsselrand löst. Der Teig sollte zähflüssig sein.' },
      { id: '3', stepNumber: 3, instruction: 'Einen großen Topf mit Salzwasser zum Kochen bringen. Den Spätzleteig portionsweise durch eine Spätzlepresse oder über ein Spätzlebrett ins kochende Wasser schaben.' },
      { id: '4', stepNumber: 4, instruction: 'Die Spätzle sind fertig, wenn sie an der Oberfläche schwimmen. Mit einem Schaumlöffel herausnehmen und warm halten.' },
      { id: '5', stepNumber: 5, instruction: 'Während die Spätzle kochen, die Zwiebeln in feine Ringe schneiden und in der Butter goldbraun rösten.' },
      { id: '6', stepNumber: 6, instruction: 'Die Spätzle schichtweise mit dem geriebenen Käse in eine ofenfeste Form geben. Im vorgeheizten Ofen bei 180°C kurz überbacken, bis der Käse schmilzt.' },
      { id: '7', stepNumber: 7, instruction: 'Mit den Röstzwiebeln und frischem Schnittlauch garnieren. Sofort servieren.' },
    ],
    tags: ['Vegetarisch', 'Schwäbisch', 'Comfort Food'],
  }

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

  const toggleStep = (stepNumber: number) => {
    const newChecked = new Set(checkedSteps)
    if (newChecked.has(stepNumber)) {
      newChecked.delete(stepNumber)
    } else {
      newChecked.add(stepNumber)
    }
    setCheckedSteps(newChecked)
  }

  const adjustedServings = recipe.servings * servingsMultiplier

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          to="/rezepte"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Link>

        {/* Header */}
        <header className="mb-8">
          {/* Image */}
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 mb-6 flex items-center justify-center">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ChefHat className="w-24 h-24 text-orange-300" />
            )}
          </div>

          {/* Title and actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {recipe.title}
              </h1>
              <p className="text-gray-500 text-lg">{recipe.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{totalTime} {t('recipe.minutes')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>{recipe.servings} {t('recipe.portions')}</span>
            </div>
            {recipe.difficulty && (
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColor[recipe.difficulty]}`}>
                {difficultyLabel[recipe.difficulty]}
              </span>
            )}
          </div>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('recipe.ingredients')}
                </h2>
              </div>

              {/* Servings adjuster */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{t('recipe.servings')}:</span>
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    onClick={() => setServingsMultiplier(Math.max(0.5, servingsMultiplier - 0.5))}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{adjustedServings}</span>
                  <button
                    onClick={() => setServingsMultiplier(servingsMultiplier + 0.5)}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-center gap-3 text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                    <span>
                      {ingredient.amount && (
                        <span className="font-medium">
                          {(ingredient.amount * servingsMultiplier).toFixed(ingredient.amount * servingsMultiplier % 1 === 0 ? 0 : 1)}{' '}
                          {ingredient.unit}{' '}
                        </span>
                      )}
                      {!ingredient.amount && ingredient.unit && (
                        <span className="font-medium">{ingredient.unit} </span>
                      )}
                      {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Steps */}
          <main className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('recipe.steps')}
            </h2>

            <ol className="space-y-6">
              {recipe.steps.map((step) => (
                <li key={step.id} className="flex gap-4">
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      checkedSteps.has(step.stepNumber)
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                  >
                    {checkedSteps.has(step.stepNumber) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.stepNumber
                    )}
                  </button>
                  <div className="flex-1 pt-2">
                    <p className={`text-gray-700 leading-relaxed ${checkedSteps.has(step.stepNumber) ? 'line-through text-gray-400' : ''}`}>
                      {step.instruction}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </main>
        </div>
      </div>
    </div>
  )
}
