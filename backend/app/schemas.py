from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class DifficultyEnum(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

# Ingredient Schemas
class IngredientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    unit: str = Field(..., min_length=1, max_length=20)

class IngredientCreate(IngredientBase):
    pass

class IngredientUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    unit: Optional[str] = Field(None, min_length=1, max_length=20)

class Ingredient(IngredientBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Recipe Ingredient Schemas
class RecipeIngredientBase(BaseModel):
    ingredient_id: int = Field(..., gt=0)
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., min_length=1, max_length=20)

class RecipeIngredientCreate(RecipeIngredientBase):
    pass

class RecipeIngredient(RecipeIngredientBase):
    id: int
    ingredient: Optional[Ingredient] = None
    
    class Config:
        from_attributes = True

# Recipe Schemas
class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    instructions: str = Field(..., min_length=1)
    cooking_time: Optional[int] = Field(None, gt=0)
    difficulty: DifficultyEnum = DifficultyEnum.medium
    servings: int = Field(default=1, gt=0)
    image_url: Optional[str] = Field(None, max_length=500)

class RecipeCreate(RecipeBase):
    ingredients: List[RecipeIngredientCreate] = []

class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    instructions: Optional[str] = Field(None, min_length=1)
    cooking_time: Optional[int] = Field(None, gt=0)
    difficulty: Optional[DifficultyEnum] = None
    servings: Optional[int] = Field(None, gt=0)
    image_url: Optional[str] = Field(None, max_length=500)

class Recipe(RecipeBase):
    id: int
    created_at: datetime
    ingredients: List[RecipeIngredient] = []
    average_rating: float = Field(default=0.0)
    
    class Config:
        from_attributes = True

# Rating Schemas
class RatingBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class RatingCreate(RatingBase):
    pass

class Rating(RatingBase):
    id: int
    recipe_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True