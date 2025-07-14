from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import user, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PhytoVigil API",
    description="API backend de l'application PhytoVigil",
    version="1.0.0"
)

app.include_router(user.router, prefix="/api", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/")
def index():
    return {"message": "Welcome to the PhytoVigil API"}