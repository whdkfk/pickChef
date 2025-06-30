from sqlalchemy import func
from . import models, schemas
from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.engine import Row

def get_ingredient(db, ingredient_id: int):
    sql = text("SELECT * FROM ingredients WHERE id = :id")
    result = db.execute(sql, {"id": ingredient_id})
    row = result.fetchone()
    if row is not None:
        return dict(row._mapping)

def get_ingredient_by_name(db, name: str):
    sql = text("SELECT * FROM ingredients WHERE name = :name")
    result = db.execute(sql, {"name": name})
    row = result.fetchone()
    if row is not None:
        return dict(row._mapping)

def get_ingredients(db, skip: int = 0, limit: int = 100):
    sql = text("SELECT * FROM ingredients LIMIT :limit OFFSET :skip")
    result = db.execute(sql, {"limit": limit, "skip": skip})
    rows = result.fetchall()
    return [dict(row._mapping) for row in rows]

def create_ingredient(db, ingredient: schemas.IngredientCreate):
    sql = text("""
        INSERT INTO ingredients (name, category, unit, created_at)
        VALUES (:name, :category, :unit, NOW())
    """)
    db.execute(sql, ingredient.dict())
    db.commit()

    last_id = db.execute(text("SELECT LAST_INSERT_ID()")).scalar()
    return get_ingredient(db, last_id)

def update_ingredient(db, ingredient_id: int, ingredient: schemas.IngredientUpdate):
    update_data = ingredient.dict(exclude_unset=True)
    if not update_data:
        return get_ingredient(db, ingredient_id)

    set_clause = ", ".join(f"{key} = :{key}" for key in update_data.keys())
    params = update_data.copy()
    params["id"] = ingredient_id

    sql = text(f"UPDATE ingredients SET {set_clause} WHERE id = :id")
    db.execute(sql, params)
    db.commit()
    return get_ingredient(db, ingredient_id)

def delete_ingredient(db, ingredient_id: int):
    sql = text("DELETE FROM ingredients WHERE id = :id")
    result = db.execute(sql, {"id": ingredient_id})
    db.commit()
    return result.rowcount > 0

def get_recipe_ratings(db, recipe_id: int):
    sql = text("SELECT * FROM ratings WHERE recipe_id = :recipe_id")
    result = db.execute(sql, {"recipe_id": recipe_id})
    rows = result.fetchall()
    return [dict(row._mapping) for row in rows]

def create_rating(db, recipe_id: int, rating: schemas.RatingCreate):
    sql = text("""
        INSERT INTO ratings (recipe_id, rating, comment, created_at)
        VALUES (:recipe_id, :rating, :comment, NOW())
    """)
    params = {
        "recipe_id": recipe_id,
        "rating": rating.rating,
        "comment": rating.comment
    }
    db.execute(sql, params)
    db.commit()

    rating_id = db.execute(text("SELECT LAST_INSERT_ID()")).scalar()
    sql_get = text("SELECT * FROM ratings WHERE id = :id")
    result = db.execute(sql_get, {"id": rating_id})
    row = result.fetchone()
    return dict(row._mapping) if row else None

def get_rating(db, rating_id: int):
    sql = text("SELECT * FROM ratings WHERE id = :id")
    result = db.execute(sql, {"id": rating_id})
    row = result.fetchone()
    return dict(row._mapping) if row else None
