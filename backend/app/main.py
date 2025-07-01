from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import ingredients, recipes

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PickChef API",
    description="Recipe and Ingredient Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingredients.router, prefix="/api")
app.include_router(recipes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to PickChef API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}