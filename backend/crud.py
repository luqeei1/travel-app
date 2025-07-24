from sqlalchemy.orm import Session
import models
import numpy as np
from sentence_transformers import SentenceTransformer
from fastapi import HTTPException
import os 
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

model = SentenceTransformer('all-MiniLM-L6-v2')
mongodb = os.getenv("MONGODB_URL")
collection_name = os.getenv("MONGODB_COLLECTION")
database_name = os.getenv("MONGODB_DATABASE")
wishlist_collection = os.getenv("MONGODB_WISHLIST_COLLECTION")

client = MongoClient(mongodb)
mongo_db = client[database_name]
local_journal = []

def get_ai_destinations(db: Session, query_embedding, top_k: int = 3, min_temperature: int = None, max_temperature: int = None):
    destinations = db.query(models.Destination).all()
    results = []

    for dest in destinations:
        dest_embedding = np.frombuffer(dest.embedding, dtype=np.float32)

        if len(dest_embedding) != len(query_embedding):
            raise ValueError(
                f"Embedding dimension mismatch! "
                f"Model expects {len(query_embedding)}D, "
                f"but found {len(dest_embedding)}D in database. "
                "You need to re-embed all destinations with the current model."
            )

        similarity = np.dot(query_embedding, dest_embedding) / (
            np.linalg.norm(query_embedding) * np.linalg.norm(dest_embedding)
        )

        if min_temperature is not None and dest.average_temperature < min_temperature:
            continue
        if max_temperature is not None and dest.average_temperature > max_temperature:
            continue

        results.append({
            "name": dest.name,
            "ai_similarity": float(similarity),
            "details": dest.details,
            "country": dest.country,
            "average_price": dest.average_price,
            "average_temperature": dest.average_temperature,
            "average_weather": dest.average_weather,
            'id': dest.id,
        })

    return sorted(results, key=lambda x: x["ai_similarity"], reverse=True)[:top_k]


def get_info_by_id(db: Session, destination_id: int):
    if not db.query(models.Destination).filter(models.Destination.id == destination_id).first():
        print("This destination does not exist")
    else:
        print("This destination exists")

    return db.query(models.Destination).filter(models.Destination.id == destination_id).first()

def get_all_destinations(db: Session):
    destinations = db.query(models.Destination).all()
    if not destinations:
        print("no destinations found")
    else:
        print("destinations found") 
    return destinations

def add_destination_to_mongodb2(destination: str, journal: str):
    try:
        mongo_db[collection_name].insert_one({"name": destination, "journal": journal})
        print("sent to mongodb")
    except Exception as e:

        raise HTTPException(status_code=400, detail=str(e))

def get_all_destinations_from_db():
    try:
        destinations = mongo_db[collection_name].find()
        result = []
        for destination in destinations:
            destination['name'] = str(destination['name'])
            destination['journal'] = str(destination['journal']) if 'journal' in destination else ''
            if destination['name'] not in [d[0] for d in local_journal]:
                local_journal.append([destination['name'], destination['journal']])
            result.append([destination['name'], destination['journal']])
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



def local_journal_fetch(name : str):
    return [entry for entry in local_journal if entry[0] == name]

def UpdateJournal(name: str, journal: str):
    try:
        for i, entry in enumerate(local_journal):
            if entry[0] == name:
                local_journal[i][1] = journal
                break
        else:
            raise HTTPException(status_code=404, detail="Destination not found in local journal")
        
        
        mongo_db[collection_name].update_one({"name": name}, {"$set": {"journal": journal}})
        print(f"Updated journal for {name} in MongoDB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



def add_destination_to_wishlist(destination: str):
    try:
        mongo_db[wishlist_collection].insert_one({
            "name": destination,
        })
        print(f"Destination '{destination}' added to wishlist")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def get_wishlist():
    try:
        print(f"Fetching from collection: {wishlist_collection}")
        wishlist = mongo_db[wishlist_collection].find()
        result = []
        for item in wishlist:
            item['name'] = str(item['name'])
            result.append(item['name'])
        print(f"Found {len(result)} wishlist items: {result}")
        return result
    except Exception as e:
        print(f"Error in get_wishlist: {e}")
        raise HTTPException(status_code=400, detail=str(e))

def delete_from_wishlist(destination: str):
    try:
        result = mongo_db[wishlist_collection].delete_one({"name": destination})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Destination not found in wishlist")
        print(f"Destination '{destination}' removed from wishlist")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

