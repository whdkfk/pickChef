from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/recipes",
    tags=["recipes"]
)

@router.get("/", response_model=List[schemas.Recipe])
def read_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    recipes = crud.get_recipes(db, skip=skip, limit=limit)
    for recipe in recipes:
        recipe.average_rating = recipe.average_rating
    return recipes

@router.post("/", response_model=schemas.Recipe, status_code=status.HTTP_201_CREATED)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    for ingredient_data in recipe.ingredients:
        db_ingredient = crud.get_ingredient(db, ingredient_data.ingredient_id)
        if not db_ingredient:
            raise HTTPException(
                status_code=400,
                detail=f"Ingredient with id {ingredient_data.ingredient_id} not found"
            )
    
    return crud.create_recipe(db=db, recipe=recipe)

@router.get("/{recipe_id}", response_model=schemas.Recipe)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    db_recipe.average_rating = db_recipe.average_rating
    return db_recipe

@router.put("/{recipe_id}", response_model=schemas.Recipe)
def update_recipe(
    recipe_id: int,
    recipe: schemas.RecipeUpdate,
    db: Session = Depends(get_db)
):
    db_recipe = crud.update_recipe(db, recipe_id=recipe_id, recipe=recipe)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    success = crud.delete_recipe(db, recipe_id=recipe_id)
    if not success:
        raise HTTPException(status_code=404, detail="Recipe not found")

@router.get("/{recipe_id}/ratings", response_model=List[schemas.Rating])
def read_recipe_ratings(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    return crud.get_recipe_ratings(db, recipe_id=recipe_id)

@router.post("/{recipe_id}/ratings", response_model=schemas.Rating, status_code=status.HTTP_201_CREATED)
def create_recipe_rating(
    recipe_id: int,
    rating: schemas.RatingCreate,
    db: Session = Depends(get_db)
):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    return crud.create_rating(db=db, recipe_id=recipe_id, rating=rating)