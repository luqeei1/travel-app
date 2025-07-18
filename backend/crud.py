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


client = MongoClient(mongodb)
mongo_db = client[database_name]

def get_ai_destinations(db: Session, query_embedding, top_k: int = 5):
   
    
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
        
        dest_dict = dest.__dict__.copy()
        dest_dict.pop("embedding", None)
        dest_dict["ai_similarity"] = float(similarity)
        results.append({
            "name": dest.name,
            "ai_similarity": float(similarity),
            "details": dest.details,
            "country": dest.country,
            "average_price": dest.average_price,
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
    result = []
    if not destinations:
        print("no destinations found")
    else:
        print("destinations found") 
    
    return destinations

def add_destination_to_mongodb2(destination: str):
    try:
        mongo_db[collection_name].insert_one({"name": destination})
        print("sent to mongodb")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def get_all_destinations_from_db():
    try:
        destinations = mongo_db[collection_name].find()
        result = []
        for destination in destinations:
            destination['name'] = str(destination['name'])
            result.append(destination['name'])
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))