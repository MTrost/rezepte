import { createServerFn } from '@tanstack/react-start'
import { eq, desc, and, like, or } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import * as schema from '../db/schema'

// Validation schemas
export const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  servings: z.number().optional(),
  difficulty: z.enum(['einfach', 'mittel', 'schwer']).optional(),
  isPublic: z.boolean().default(true),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.number().optional(),
    unit: z.string().optional(),
  })),
  steps: z.array(z.object({
    instruction: z.string().min(1),
    imageUrl: z.string().optional(),
  })),
  tags: z.array(z.string()).optional(),
})

export const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.string(),
})

// Helper to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Get all recipes
export const getRecipes = createServerFn({
  method: 'GET',
}).handler(async ({ context }) => {
  const { db } = context as { db: ReturnType<typeof import('../lib/db').createDb> }

  const recipes = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.isPublic, true))
    .orderBy(desc(schema.recipes.createdAt))
    .limit(50)

  return recipes
})

// Get recipe by ID or slug
export const getRecipe = createServerFn({
  method: 'GET',
})
  .validator(z.object({ idOrSlug: z.string() }))
  .handler(async ({ data, context }) => {
    const { db } = context as { db: ReturnType<typeof import('../lib/db').createDb> }

    const recipe = await db
      .select()
      .from(schema.recipes)
      .where(
        or(
          eq(schema.recipes.id, data.idOrSlug),
          eq(schema.recipes.slug, data.idOrSlug)
        )
      )
      .get()

    if (!recipe) {
      throw new Error('Rezept nicht gefunden')
    }

    // Get ingredients
    const ingredients = await db
      .select()
      .from(schema.ingredients)
      .where(eq(schema.ingredients.recipeId, recipe.id))
      .orderBy(schema.ingredients.sortOrder)

    // Get steps
    const steps = await db
      .select()
      .from(schema.steps)
      .where(eq(schema.steps.recipeId, recipe.id))
      .orderBy(schema.steps.stepNumber)

    // Get tags
    const recipeTags = await db
      .select({
        id: schema.tags.id,
        name: schema.tags.name,
        slug: schema.tags.slug,
      })
      .from(schema.recipeTags)
      .innerJoin(schema.tags, eq(schema.recipeTags.tagId, schema.tags.id))
      .where(eq(schema.recipeTags.recipeId, recipe.id))

    return {
      ...recipe,
      ingredients,
      steps,
      tags: recipeTags,
    }
  })

// Create recipe
export const createRecipe = createServerFn({
  method: 'POST',
})
  .validator(createRecipeSchema)
  .handler(async ({ data, context }) => {
    const { db, user } = context as {
      db: ReturnType<typeof import('../lib/db').createDb>
      user: { id: string } | null
    }

    if (!user) {
      throw new Error('Nicht autorisiert')
    }

    const recipeId = nanoid()
    const slug = createSlug(data.title) + '-' + nanoid(6)

    // Insert recipe
    await db.insert(schema.recipes).values({
      id: recipeId,
      userId: user.id,
      categoryId: data.categoryId,
      title: data.title,
      slug,
      description: data.description,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      difficulty: data.difficulty,
      isPublic: data.isPublic,
    })

    // Insert ingredients
    if (data.ingredients.length > 0) {
      await db.insert(schema.ingredients).values(
        data.ingredients.map((ing, index) => ({
          id: nanoid(),
          recipeId,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          sortOrder: index,
        }))
      )
    }

    // Insert steps
    if (data.steps.length > 0) {
      await db.insert(schema.steps).values(
        data.steps.map((step, index) => ({
          id: nanoid(),
          recipeId,
          stepNumber: index + 1,
          instruction: step.instruction,
          imageUrl: step.imageUrl,
        }))
      )
    }

    // Handle tags
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tagSlug = createSlug(tagName)
        let tag = await db
          .select()
          .from(schema.tags)
          .where(eq(schema.tags.slug, tagSlug))
          .get()

        if (!tag) {
          const tagId = nanoid()
          await db.insert(schema.tags).values({
            id: tagId,
            name: tagName,
            slug: tagSlug,
          })
          tag = { id: tagId, name: tagName, slug: tagSlug }
        }

        await db.insert(schema.recipeTags).values({
          recipeId,
          tagId: tag.id,
        })
      }
    }

    return { id: recipeId, slug }
  })

// Update recipe
export const updateRecipe = createServerFn({
  method: 'POST',
})
  .validator(updateRecipeSchema)
  .handler(async ({ data, context }) => {
    const { db, user } = context as {
      db: ReturnType<typeof import('../lib/db').createDb>
      user: { id: string } | null
    }

    if (!user) {
      throw new Error('Nicht autorisiert')
    }

    const recipe = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, data.id))
      .get()

    if (!recipe) {
      throw new Error('Rezept nicht gefunden')
    }

    if (recipe.userId !== user.id) {
      throw new Error('Nicht autorisiert')
    }

    // Update recipe
    await db
      .update(schema.recipes)
      .set({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        difficulty: data.difficulty,
        isPublic: data.isPublic,
        updatedAt: new Date(),
      })
      .where(eq(schema.recipes.id, data.id))

    // Update ingredients (delete and re-insert)
    if (data.ingredients) {
      await db.delete(schema.ingredients).where(eq(schema.ingredients.recipeId, data.id))

      if (data.ingredients.length > 0) {
        await db.insert(schema.ingredients).values(
          data.ingredients.map((ing, index) => ({
            id: nanoid(),
            recipeId: data.id,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            sortOrder: index,
          }))
        )
      }
    }

    // Update steps (delete and re-insert)
    if (data.steps) {
      await db.delete(schema.steps).where(eq(schema.steps.recipeId, data.id))

      if (data.steps.length > 0) {
        await db.insert(schema.steps).values(
          data.steps.map((step, index) => ({
            id: nanoid(),
            recipeId: data.id,
            stepNumber: index + 1,
            instruction: step.instruction,
            imageUrl: step.imageUrl,
          }))
        )
      }
    }

    return { success: true }
  })

// Delete recipe
export const deleteRecipe = createServerFn({
  method: 'POST',
})
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const { db, user } = context as {
      db: ReturnType<typeof import('../lib/db').createDb>
      user: { id: string } | null
    }

    if (!user) {
      throw new Error('Nicht autorisiert')
    }

    const recipe = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, data.id))
      .get()

    if (!recipe) {
      throw new Error('Rezept nicht gefunden')
    }

    if (recipe.userId !== user.id) {
      throw new Error('Nicht autorisiert')
    }

    await db.delete(schema.recipes).where(eq(schema.recipes.id, data.id))

    return { success: true }
  })

// Search recipes
export const searchRecipes = createServerFn({
  method: 'GET',
})
  .validator(z.object({ query: z.string() }))
  .handler(async ({ data, context }) => {
    const { db } = context as { db: ReturnType<typeof import('../lib/db').createDb> }

    const recipes = await db
      .select()
      .from(schema.recipes)
      .where(
        and(
          eq(schema.recipes.isPublic, true),
          or(
            like(schema.recipes.title, `%${data.query}%`),
            like(schema.recipes.description, `%${data.query}%`)
          )
        )
      )
      .orderBy(desc(schema.recipes.createdAt))
      .limit(20)

    return recipes
  })

// Get recipes by category
export const getRecipesByCategory = createServerFn({
  method: 'GET',
})
  .validator(z.object({ categorySlug: z.string() }))
  .handler(async ({ data, context }) => {
    const { db } = context as { db: ReturnType<typeof import('../lib/db').createDb> }

    const category = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, data.categorySlug))
      .get()

    if (!category) {
      throw new Error('Kategorie nicht gefunden')
    }

    const recipes = await db
      .select()
      .from(schema.recipes)
      .where(
        and(
          eq(schema.recipes.categoryId, category.id),
          eq(schema.recipes.isPublic, true)
        )
      )
      .orderBy(desc(schema.recipes.createdAt))

    return { category, recipes }
  })

// Get user's recipes
export const getMyRecipes = createServerFn({
  method: 'GET',
}).handler(async ({ context }) => {
  const { db, user } = context as {
    db: ReturnType<typeof import('../lib/db').createDb>
    user: { id: string } | null
  }

  if (!user) {
    throw new Error('Nicht autorisiert')
  }

  const recipes = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.userId, user.id))
    .orderBy(desc(schema.recipes.createdAt))

  return recipes
})

// Toggle favorite
export const toggleFavorite = createServerFn({
  method: 'POST',
})
  .validator(z.object({ recipeId: z.string() }))
  .handler(async ({ data, context }) => {
    const { db, user } = context as {
      db: ReturnType<typeof import('../lib/db').createDb>
      user: { id: string } | null
    }

    if (!user) {
      throw new Error('Nicht autorisiert')
    }

    const existing = await db
      .select()
      .from(schema.favorites)
      .where(
        and(
          eq(schema.favorites.userId, user.id),
          eq(schema.favorites.recipeId, data.recipeId)
        )
      )
      .get()

    if (existing) {
      await db.delete(schema.favorites).where(eq(schema.favorites.id, existing.id))
      return { isFavorite: false }
    } else {
      await db.insert(schema.favorites).values({
        id: nanoid(),
        userId: user.id,
        recipeId: data.recipeId,
      })
      return { isFavorite: true }
    }
  })

// Get favorites
export const getFavorites = createServerFn({
  method: 'GET',
}).handler(async ({ context }) => {
  const { db, user } = context as {
    db: ReturnType<typeof import('../lib/db').createDb>
    user: { id: string } | null
  }

  if (!user) {
    throw new Error('Nicht autorisiert')
  }

  const favorites = await db
    .select({
      recipe: schema.recipes,
    })
    .from(schema.favorites)
    .innerJoin(schema.recipes, eq(schema.favorites.recipeId, schema.recipes.id))
    .where(eq(schema.favorites.userId, user.id))
    .orderBy(desc(schema.favorites.createdAt))

  return favorites.map(f => f.recipe)
})

// Get categories
export const getCategories = createServerFn({
  method: 'GET',
}).handler(async ({ context }) => {
  const { db } = context as { db: ReturnType<typeof import('../lib/db').createDb> }

  const categories = await db
    .select()
    .from(schema.categories)
    .orderBy(schema.categories.name)

  return categories
})
