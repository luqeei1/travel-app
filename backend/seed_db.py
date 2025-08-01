import numpy as np
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Destination
from sentence_transformers import SentenceTransformer
import os

# 1. Initialize database
Base.metadata.create_all(bind=engine)

# 2. Initialize embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')
print(f"Model embedding dimension: {model.get_sentence_embedding_dimension()}")

DESTINATIONS = [
  {
  "name": "Mostar",
  "details": "Bosnian town famous for its iconic Stari Most bridge and Ottoman architecture.",
  "country": "Bosnia and Herzegovina",
  "region": "Europe",
  "average_price": 850,
  "average_temperature": 18,
  "average_weather": "Mild"
},
{
  "name": "Lucca",
  "details": "Tuscan city in Italy known for its Renaissance walls and charming old town.",
  "country": "Italy",
  "region": "Europe",
  "average_price": 1400,
  "average_temperature": 19,
  "average_weather": "Mild"
},
{
  "name": "Puebla",
  "details": "Mexican city famous for colonial architecture, culinary heritage, and volcano views.",
  "country": "Mexico",
  "region": "North America",
  "average_price": 1100,
  "average_temperature": 17,
  "average_weather": "Mild"
}

]


    




   

def seed_database():
    db = SessionLocal()
    try:
        for dest_data in DESTINATIONS:
            # Generate embedding from name + details
            text = f"{dest_data['name']} {dest_data['details']}"
            embedding = model.encode(text)
            
            # Create destination with all fields
            destination = Destination(
                name=dest_data['name'],
                details=dest_data['details'],
                country=dest_data['country'],
                region=dest_data['region'],
                average_price=dest_data['average_price'],
                average_temperature=dest_data['average_temperature'],
                average_weather=dest_data['average_weather'],
                similarity_rating=0.0,  # Initialize rating
                embedding=embedding.tobytes()  # Store as bytes
            )
            
            db.add(destination)
        
        db.commit()
        print(f"Successfully seeded {len(DESTINATIONS)} destinations")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()