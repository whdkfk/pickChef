export interface Ingredient {
  id: number;
  name: string;
  category: string;
  unit: string;
  created_at: string;
}

export interface RecipeIngredient {
  id: number;
  ingredient_id: number;
  quantity: number;
  unit: string;
  ingredient?: Ingredient;
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  instructions: string;
  cooking_time?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  image_url?: string;
  created_at: string;
  ingredients: RecipeIngredient[];
  average_rating: number;
}

export interface Rating {
  id: number;
  recipe_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  instructions: string;
  cooking_time?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  image_url?: string;
  ingredients: {
    ingredient_id: number;
    quantity: number;
    unit: string;
  }[];
}