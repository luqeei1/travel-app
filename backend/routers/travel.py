# travel.py (pure router)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import get_ai_destinations
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crud import get_info_by_id



router = APIRouter(prefix="/travel", tags=["travel"])
model = SentenceTransformer('all-MiniLM-L6-v2')

class SearchQuery(BaseModel):
    query: str
    top_k: int = 5 

@router.post("/ai-search")
async def search_route(
    search: SearchQuery, 
    db: Session = Depends(get_db)
):
    try:
        query_embedding = model.encode(search.query)
        print(get_ai_destinations(db, query_embedding, search.top_k))
        
        return get_ai_destinations(db, query_embedding, search.top_k)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{destination_id}")
async def info(destination_id: int, db: Session = Depends(get_db)):
    try:
        destination = get_info_by_id(db, destination_id)
        if not destination:
            print("this destintation does not exist")
            raise HTTPException(status_code=404, detail="Destination not found")
        return {
            "average_price": destination.average_price,
            "name": destination.name,
            "details": destination.details,
            "country": destination.country,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))