# travel.py (pure router)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import get_ai_destinations
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crud import get_info_by_id
from crud import get_all_destinations
from crud import add_destination_to_mongodb2
from crud import get_all_destinations_from_db



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

@router.get("/visited")
async def get_destinations(db : Session = Depends(get_db)):
    try:
        destinations = get_all_destinations(db)
        if not destinations:
            raise HTTPException(status_code=404, detail="No destination found")
        return destinations
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/previous")
async def get_previous_destinations_from_mongo():
    try:
        print("Fetching previous destinations from MongoDB")
        destinations = get_all_destinations_from_db()
        if not destinations:
            raise HTTPException(status_code=404, detail="No previous destinations found")
        return destinations
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

@router.post("/add")
def add_destination_to_mongodb(destination: dict, db: Session = Depends(get_db)):
    try:
        destination_name = destination.get("name")
        if not destination_name:
            raise HTTPException(status_code=400, detail="Destination name is required")
        add_destination_to_mongodb2(destination_name)
        return {"message": "Destination added successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



