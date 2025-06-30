from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import ingredients, recipes

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PickChef API",
    description="Recipe and Ingredient Management API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ingredients.router, prefix="/api")
app.include_router(recipes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to PickChef API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}