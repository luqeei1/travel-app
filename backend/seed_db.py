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
    {"name": "Kyoto", "details": "Historic temples and beautiful cherry blossoms", "country": "Japan", "region": "East Asia", "average_price": 2100, "average_temperature": 17, "average_weather": "Mild"},
    {"name": "Bali", "details": "Tropical paradise with beaches and vibrant culture", "country": "Indonesia", "region": "Southeast Asia", "average_price": 1300, "average_temperature": 29, "average_weather": "Tropical"},
    {"name": "Sydney", "details": "Iconic harbor, beaches, and vibrant city life", "country": "Australia", "region": "Oceania", "average_price": 2200, "average_temperature": 21, "average_weather": "Mild"},
    {"name": "Moscow", "details": "Capital of Russia with rich history and architecture", "country": "Russia", "region": "Eastern Europe", "average_price": 1600, "average_temperature": 7, "average_weather": "Cold"},
    {"name": "Buenos Aires", "details": "Known for tango, European-style architecture, and vibrant nightlife", "country": "Argentina", "region": "South America", "average_price": 1400, "average_temperature": 19, "average_weather": "Mild"},
    {"name": "Dubai Desert", "details": "Vast sandy deserts with luxury resorts", "country": "United Arab Emirates", "region": "Middle East", "average_price": 2600, "average_temperature": 38, "average_weather": "Hot"},
    {"name": "San Francisco", "details": "Famous for the Golden Gate Bridge and tech scene", "country": "USA", "region": "North America", "average_price": 2500, "average_temperature": 15, "average_weather": "Mild"},
    {"name": "Lisbon", "details": "Coastal city with historic neighborhoods and vibrant culture", "country": "Portugal", "region": "Southern Europe", "average_price": 1600, "average_temperature": 18, "average_weather": "Sunny"},
    {"name": "Berlin", "details": "Capital of Germany with modern art and history", "country": "Germany", "region": "Central Europe", "average_price": 1700, "average_temperature": 14, "average_weather": "Variable"},
    {"name": "Hanoi", "details": "Vietnamese capital with centuries-old architecture", "country": "Vietnam", "region": "Southeast Asia", "average_price": 1100, "average_temperature": 28, "average_weather": "Humid"},
    {
        "name": "Kyoto",
        "details": "Ancient temples, traditional tea houses, and beautiful gardens",
        "country": "Japan",
        "region": "East Asia",
        "average_price": 2000,
        "average_temperature": 17,
        "average_weather": "Mild"
    },
    {
        "name": "Bali",
        "details": "Tropical island with beaches, rice terraces, and vibrant culture",
        "country": "Indonesia",
        "region": "Southeast Asia",
        "average_price": 1500,
        "average_temperature": 29,
        "average_weather": "Tropical"
    },
    {
        "name": "Marrakech",
        "details": "Historic city with colorful souks and desert excursions",
        "country": "Morocco",
        "region": "North Africa",
        "average_price": 1300,
        "average_temperature": 25,
        "average_weather": "Warm"
    },
    {
        "name": "Sydney",
        "details": "Harbor city with iconic opera house and beaches",
        "country": "Australia",
        "region": "Oceania",
        "average_price": 2300,
        "average_temperature": 21,
        "average_weather": "Mild"
    },
    {
        "name": "Buenos Aires",
        "details": "Vibrant city known for tango and European architecture",
        "country": "Argentina",
        "region": "South America",
        "average_price": 1400,
        "average_temperature": 18,
        "average_weather": "Mild"
    },
    {
        "name": "Edinburgh",
        "details": "Historic capital with castles and festivals",
        "country": "United Kingdom",
        "region": "Northern Europe",
        "average_price": 1800,
        "average_temperature": 11,
        "average_weather": "Cool"
    },
    {
        "name": "Hanoi",
        "details": "Capital city with lakes, street food, and colonial architecture",
        "country": "Vietnam",
        "region": "Southeast Asia",
        "average_price": 1200,
        "average_temperature": 24,
        "average_weather": "Humid"
    },
    {
        "name": "Lisbon",
        "details": "Coastal city with historic neighborhoods and tram rides",
        "country": "Portugal",
        "region": "Southern Europe",
        "average_price": 1600,
        "average_temperature": 18,
        "average_weather": "Mild"
    },
    {
        "name": "Zurich",
        "details": "Swiss city with lakes, mountains, and financial hubs",
        "country": "Switzerland",
        "region": "Central Europe",
        "average_price": 2800,
        "average_temperature": 10,
        "average_weather": "Cool"
    },
    {
        "name": "San Francisco",
        "details": "Famous for the Golden Gate Bridge and tech scene",
        "country": "USA",
        "region": "North America",
        "average_price": 2600,
        "average_temperature": 15,
        "average_weather": "Mild"
    },
    {
        "name": "Cusco",
        "details": "Historic city near Machu Picchu with rich Incan heritage",
        "country": "Peru",
        "region": "South America",
        "average_price": 1300,
        "average_temperature": 16,
        "average_weather": "Mild"
    },
    {
        "name": "Seoul",
        "details": "Modern metropolis with historic palaces and vibrant nightlife",
        "country": "South Korea",
        "region": "East Asia",
        "average_price": 2100,
        "average_temperature": 14,
        "average_weather": "Variable"
    },
    {
        "name": "Athens",
        "details": "Ancient city with iconic ruins and Mediterranean vibes",
        "country": "Greece",
        "region": "Southern Europe",
        "average_price": 1700,
        "average_temperature": 20,
        "average_weather": "Sunny"
    },
    {
        "name": "Mexico City",
        "details": "Cultural hub with museums, markets, and historic centers",
        "country": "Mexico",
        "region": "North America",
        "average_price": 1300,
        "average_temperature": 18,
        "average_weather": "Mild"
    },
    {
        "name": "Dubrovnik",
        "details": "Historic walled city on the Adriatic coast",
        "country": "Croatia",
        "region": "Southern Europe",
        "average_price": 1800,
        "average_temperature": 22,
        "average_weather": "Sunny"
    },
    {
        "name": "Helsinki",
        "details": "Capital of Finland with design scene and seaside views",
        "country": "Finland",
        "region": "Northern Europe",
        "average_price": 2400,
        "average_temperature": 7,
        "average_weather": "Cool"
    },
    {
        "name": "Kuala Lumpur",
        "details": "Modern city with skyscrapers and cultural diversity",
        "country": "Malaysia",
        "region": "Southeast Asia",
        "average_price": 1500,
        "average_temperature": 30,
        "average_weather": "Humid"
    },
    {
        "name": "Lima",
        "details": "Coastal capital known for food and colonial architecture",
        "country": "Peru",
        "region": "South America",
        "average_price": 1300,
        "average_temperature": 19,
        "average_weather": "Mild"
    },
    {
        "name": "Milan",
        "details": "Fashion capital with historic sites and modern flair",
        "country": "Italy",
        "region": "Southern Europe",
        "average_price": 2100,
        "average_temperature": 16,
        "average_weather": "Variable"
    },
    {
        "name": "Nairobi",
        "details": "Gateway to safaris with bustling city life",
        "country": "Kenya",
        "region": "East Africa",
        "average_price": 1400,
        "average_temperature": 20,
        "average_weather": "Warm"
    },
    {
        "name": "Oslo",
        "details": "Scandinavian city with fjords and museums",
        "country": "Norway",
        "region": "Northern Europe",
        "average_price": 2700,
        "average_temperature": 6,
        "average_weather": "Cool"
    },
    {
        "name": "Petra",
        "details": "Ancient rock-cut city and archaeological wonder",
        "country": "Jordan",
        "region": "Middle East",
        "average_price": 1600,
        "average_temperature": 25,
        "average_weather": "Warm"
    },
    {
        "name": "Phuket",
        "details": "Popular island with beaches and nightlife",
        "country": "Thailand",
        "region": "Southeast Asia",
        "average_price": 1400,
        "average_temperature": 30,
        "average_weather": "Tropical"
    },
    {
        "name": "Prague",
        "details": "Medieval old town with castles and cobblestone streets",
        "country": "Czech Republic",
        "region": "Central Europe",
        "average_price": 1500,
        "average_temperature": 15,
        "average_weather": "Mild"
    },
    {
        "name": "Riga",
        "details": "Baltic city with art nouveau architecture",
        "country": "Latvia",
        "region": "Northern Europe",
        "average_price": 1300,
        "average_temperature": 10,
        "average_weather": "Cool"
    },
    {
        "name": "San Diego",
        "details": "Coastal city known for beaches and zoo",
        "country": "USA",
        "region": "North America",
        "average_price": 2400,
        "average_temperature": 18,
        "average_weather": "Mild"
    },
    {
        "name": "Santorini",
        "details": "Greek island with whitewashed buildings and stunning sunsets",
        "country": "Greece",
        "region": "Southern Europe",
        "average_price": 1800,
        "average_temperature": 26,
        "average_weather": "Sunny"
    },
    {
        "name": "Santiago",
        "details": "Capital city surrounded by Andes Mountains",
        "country": "Chile",
        "region": "South America",
        "average_price": 1400,
        "average_temperature": 20,
        "average_weather": "Mild"
    },
    {
        "name": "Stockholm",
        "details": "Scandinavian capital spread across islands",
        "country": "Sweden",
        "region": "Northern Europe",
        "average_price": 2600,
        "average_temperature": 10,
        "average_weather": "Cool"
    },
    {
        "name": "Tallinn",
        "details": "Medieval old town with cobblestone streets",
        "country": "Estonia",
        "region": "Northern Europe",
        "average_price": 1400,
        "average_temperature": 9,
        "average_weather": "Cool"
    },
    {
        "name": "Tokyo",
        "details": "Vibrant metropolis with temples, technology, and fashion",
        "country": "Japan",
        "region": "East Asia",
        "average_price": 2300,
        "average_temperature": 16,
        "average_weather": "Variable"
    },
    {
        "name": "Toronto",
        "details": "Diverse city with skyscrapers and cultural events",
        "country": "Canada",
        "region": "North America",
        "average_price": 2100,
        "average_temperature": 12,
        "average_weather": "Cool"
    },
    {
        "name": "Vancouver",
        "details": "Coastal city with mountains and outdoor activities",
        "country": "Canada",
        "region": "North America",
        "average_price": 1900,
        "average_temperature": 14,
        "average_weather": "Mild"
    },
    {
        "name": "Venice",
        "details": "Romantic city of canals and historic architecture",
        "country": "Italy",
        "region": "Southern Europe",
        "average_price": 2100,
        "average_temperature": 18,
        "average_weather": "Mild"
    },
    {
        "name": "Vienna",
        "details": "City of music with grand palaces and coffeehouses",
        "country": "Austria",
        "region": "Central Europe",
        "average_price": 2000,
        "average_temperature": 13,
        "average_weather": "Mild"
    },
    {
        "name": "Warsaw",
        "details": "Capital with mix of modern and historic architecture",
        "country": "Poland",
        "region": "Central Europe",
        "average_price": 1400,
        "average_temperature": 12,
        "average_weather": "Cool"
    },
    {
        "name": "Zanzibar",
        "details": "Tropical island with pristine beaches and spice tours",
        "country": "Tanzania",
        "region": "East Africa",
        "average_price": 1700,
        "average_temperature": 28,
        "average_weather": "Tropical"
    },
    {
        "name": "Zurich",
        "details": "Swiss city with lakes, mountains, and financial hubs",
        "country": "Switzerland",
        "region": "Central Europe",
        "average_price": 2800,
        "average_temperature": 10,
        "average_weather": "Cool"
    },
    {
        "name": "Luang Prabang",
        "details": "UNESCO town with Buddhist temples and French colonial buildings",
        "country": "Laos",
        "region": "Southeast Asia",
        "average_price": 1400,
        "average_temperature": 25,
        "average_weather": "Warm"
    },
    {
        "name": "Cartagena",
        "details": "Colonial walled city on the Caribbean coast",
        "country": "Colombia",
        "region": "South America",
        "average_price": 1400,
        "average_temperature": 28,
        "average_weather": "Tropical"
    },
    {
        "name": "Casablanca",
        "details": "Largest city in Morocco with modern and historic areas",
        "country": "Morocco",
        "region": "North Africa",
        "average_price": 1400,
        "average_temperature": 22,
        "average_weather": "Warm"
    },
    {
        "name": "Galápagos Islands",
        "details": "Unique wildlife and volcanic landscapes",
        "country": "Ecuador",
        "region": "South America",
        "average_price": 3000,
        "average_temperature": 25,
        "average_weather": "Tropical"
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