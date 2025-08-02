import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import psycopg2

load_dotenv()

try:
    SQLALCHEMY_DATABASE_URL = os.environ["LOCAL_DATABASE_URL"]
except KeyError as e:   
    missing_key = e.args[0]
    raise RuntimeError(f"Missing environment variable: {missing_key}")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Dependency function that yields database sessions
    Usage in FastAPI: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()