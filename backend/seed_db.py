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
    "name": "Valparaiso",
    "details": "Chilean port city famous for colorful hillside houses, street art, and vibrant cultural scene.",
    "country": "Chile",
    "region": "South America",
    "average_price": 1500,
    "average_temperature": 16,
    "average_weather": "Mild"
  },
  {
    "name": "Fes",
    "details": "Ancient Moroccan city with sprawling medinas, traditional tanneries, and historic madrasas.",
    "country": "Morocco",
    "region": "Africa",
    "average_price": 1300,
    "average_temperature": 21,
    "average_weather": "Mild"
  },
  {
    "name": "Luanda",
    "details": "Capital of Angola with Atlantic coastline, vibrant markets, and rich cultural heritage.",
    "country": "Angola",
    "region": "Africa",
    "average_price": 1400,
    "average_temperature": 26,
    "average_weather": "Hot"
  },
  {
    "name": "Maputo",
    "details": "Mozambican capital with Portuguese colonial architecture, lively markets, and coastal vibes.",
    "country": "Mozambique",
    "region": "Africa",
    "average_price": 1200,
    "average_temperature": 25,
    "average_weather": "Hot"
  },
  {
    "name": "Lusaka",
    "details": "Capital of Zambia with urban parks, museums, and proximity to wildlife reserves.",
    "country": "Zambia",
    "region": "Africa",
    "average_price": 1100,
    "average_temperature": 20,
    "average_weather": "Mild"
  },
  {
    "name": "Qingdao",
    "details": "Chinese coastal city known for beaches, Tsingtao beer brewery, and German colonial architecture.",
    "country": "China",
    "region": "Asia",
    "average_price": 1700,
    "average_temperature": 16,
    "average_weather": "Mild"
  },
  {
    "name": "Da Nang",
    "details": "Vietnamese coastal city with sandy beaches, the Marble Mountains, and a lively food scene.",
    "country": "Vietnam",
    "region": "Asia",
    "average_price": 1400,
    "average_temperature": 28,
    "average_weather": "Hot"
  },
  {
    "name": "Penang",
    "details": "Malaysian island known for heritage George Town, street food, and colonial architecture.",
    "country": "Malaysia",
    "region": "Asia",
    "average_price": 1300,
    "average_temperature": 27,
    "average_weather": "Hot"
  },
  {
    "name": "Manila",
    "details": "Capital of the Philippines with historic Intramuros, busy markets, and vibrant nightlife.",
    "country": "Philippines",
    "region": "Asia",
    "average_price": 1300,
    "average_temperature": 30,
    "average_weather": "Hot"
  },
  {
    "name": "Cochabamba",
    "details": "Bolivian city in a fertile valley, known for pleasant weather and colonial architecture.",
    "country": "Bolivia",
    "region": "South America",
    "average_price": 1200,
    "average_temperature": 18,
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