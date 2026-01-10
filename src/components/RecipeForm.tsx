import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { Category } from '../db/schema'

interface Ingredient {
  name: string
  amount?: number
  unit?: string
}

interface Step {
  instruction: string
  imageUrl?: string
}

interface RecipeFormData {
  title: string
  description: string
  categoryId?: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: 'einfach' | 'mittel' | 'schwer'
  isPublic: boolean
  ingredients: Ingredient[]
  steps: Step[]
  tags: string[]
}

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>
  categories: Category[]
  onSubmit: (data: RecipeFormData) => Promise<void>
  isSubmitting?: boolean
}

const UNITS = ['g', 'kg', 'ml', 'l', 'TL', 'EL', 'Tasse', 'Stück', 'Prise', 'Bund', 'Zehe', 'Scheibe']

export default function RecipeForm({
  initialData,
  categories,
  onSubmit,
  isSubmitting = false,
}: RecipeFormProps) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState<RecipeFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId,
    prepTime: initialData?.prepTime,
    cookTime: initialData?.cookTime,
    servings: initialData?.servings || 4,
    difficulty: initialData?.difficulty || 'mittel',
    isPublic: initialData?.isPublic ?? true,
    ingredients: initialData?.ingredients || [{ name: '', amount: undefined, unit: '' }],
    steps: initialData?.steps || [{ instruction: '' }],
    tags: initialData?.tags || [],
  })

  const [tagInput, setTagInput] = useState('')

  const updateField = <K extends keyof RecipeFormData>(
    field: K,
    value: RecipeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addIngredient = () => {
    updateField('ingredients', [...formData.ingredients, { name: '', amount: undefined, unit: '' }])
  }

  const updateIngredient = (index: number, ingredient: Ingredient) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = ingredient
    updateField('ingredients', newIngredients)
  }

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      updateField(
        'ingredients',
        formData.ingredients.filter((_, i) => i !== index)
      )
    }
  }

  const addStep = () => {
    updateField('steps', [...formData.steps, { instruction: '' }])
  }

  const updateStep = (index: number, step: Step) => {
    const newSteps = [...formData.steps]
    newSteps[index] = step
    updateField('steps', newSteps)
  }

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      updateField(
        'steps',
        formData.steps.filter((_, i) => i !== index)
      )
    }
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      updateField('tags', [...formData.tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    updateField(
      'tags',
      formData.tags.filter((t) => t !== tag)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Grundinformationen</h2>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            {t('recipe.title')} *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="z.B. Omas Apfelkuchen"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {t('recipe.description')}
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Eine kurze Beschreibung des Rezepts..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
              {t('recipe.prepTime')}
            </label>
            <div className="relative">
              <input
                id="prepTime"
                type="number"
                min="0"
                value={formData.prepTime || ''}
                onChange={(e) => updateField('prepTime', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                min
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">
              {t('recipe.cookTime')}
            </label>
            <div className="relative">
              <input
                id="cookTime"
                type="number"
                min="0"
                value={formData.cookTime || ''}
                onChange={(e) => updateField('cookTime', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                min
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
              {t('recipe.servings')}
            </label>
            <input
              id="servings"
              type="number"
              min="1"
              value={formData.servings || ''}
              onChange={(e) => updateField('servings', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              {t('recipe.difficulty')}
            </label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => updateField('difficulty', e.target.value as 'einfach' | 'mittel' | 'schwer')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="einfach">{t('recipe.difficulties.easy')}</option>
              <option value="mittel">{t('recipe.difficulties.medium')}</option>
              <option value="schwer">{t('recipe.difficulties.hard')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              {t('recipe.category')}
            </label>
            <select
              id="category"
              value={formData.categoryId || ''}
              onChange={(e) => updateField('categoryId', e.target.value || undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Keine Kategorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => updateField('isPublic', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {t('recipe.public')}
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('recipe.ingredients')}</h2>

        <div className="space-y-3">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move flex-shrink-0" />

              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Menge"
                value={ingredient.amount || ''}
                onChange={(e) =>
                  updateIngredient(index, {
                    ...ingredient,
                    amount: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />

              <select
                value={ingredient.unit || ''}
                onChange={(e) =>
                  updateIngredient(index, { ...ingredient, unit: e.target.value })
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Einheit</option>
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>

              <input
                type="text"
                required
                placeholder="Zutat"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, { ...ingredient, name: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />

              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={t('recipe.removeIngredient')}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          {t('recipe.addIngredient')}
        </button>
      </section>

      {/* Steps */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('recipe.steps')}</h2>

        <div className="space-y-4">
          {formData.steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>

              <div className="flex-1">
                <textarea
                  required
                  rows={3}
                  placeholder={`${t('recipe.step')} ${index + 1}...`}
                  value={step.instruction}
                  onChange={(e) => updateStep(index, { ...step, instruction: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                type="button"
                onClick={() => removeStep(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors self-start"
                aria-label={t('recipe.removeStep')}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          {t('recipe.addStep')}
        </button>
      </section>

      {/* Tags */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('recipe.tags')}</h2>

        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-orange-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder="Tag hinzufügen..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hinzufügen
          </button>
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('common.loading') : t('common.save')}
        </button>
      </div>
    </form>
  )
}
