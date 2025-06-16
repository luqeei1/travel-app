from sqlalchemy.orm import Session
import models
import numpy as np
from sentence_transformers import SentenceTransformer

# Initialize model globally (384-dim)
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_ai_destinations(db: Session, query_embedding, top_k: int = 5):
    """
    Get top_k destinations most similar to the query
    Args:
        db: Database session
        query: Search query string
        top_k: Number of results to return
    """
    
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


    
    # Return top_k most similar results
    return sorted(results, key=lambda x: x["ai_similarity"], reverse=True)[:top_k]

def get_info_by_id(db: Session, destination_id: int):
    """
    Get destination info by ID
    Args:
        db: Database session
        destination_id: ID of the destination
    """
    if not db.query(models.Destination).filter(models.Destination.id == destination_id).first():
        print("This destination does not exist")
    else:
        print("This destination exists")
        
    return db.query(models.Destination).filter(models.Destination.id == destination_id).first()