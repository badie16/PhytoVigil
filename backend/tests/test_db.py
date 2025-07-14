from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT version();"))
    print("Connected to:", result.fetchone()[0])
