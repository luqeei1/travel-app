import pandas as pd
import numpy as np
import ast
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Destination
import os

Base.metadata.create_all(bind=engine)

CSV_PATH = '../database/backup/destinations_backup.csv'

def parse_embedding(embedding_str):
    """
    Convert the embedding string from CSV back into a numpy array,
    then to bytes for Postgres bytea storage.
    """
    embedding_list = ast.literal_eval(embedding_str)
    embedding_array = np.array(embedding_list, dtype=np.float32)
    return embedding_array.tobytes()

def seed_database_from_csv():
    db = SessionLocal()
    try:
        df = pd.read_csv(CSV_PATH)

        for _, row in df.iterrows():
            embedding_bytes = parse_embedding(row['embedding'])

            destination = Destination(
                name=str(row['name']),
                details=str(row['details']),
                country=str(row['country']),
                region=str(row['region']),
                average_price=int(row['average_price']),
                similarity_rating=float(row.get('similarity_rating', 0.0)),
                average_temperature=int(row['average_temperature']),
                average_weather=str(row['average_weather']),
                embedding=embedding_bytes
                )

            db.add(destination)

        db.commit()
        print(f"Successfully seeded {len(df)} destinations from CSV")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database_from_csv()
