from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import (
    get_ai_destinations,
    get_info_by_id,
    get_all_destinations,
    add_destination_to_mongodb2,
    get_all_destinations_from_db,
    add_destination_to_wishlist as crud_add_to_wishlist,
    get_wishlist as crud_get_wishlist,
    delete_from_wishlist,
    local_journal_fetch,
    UpdateJournal,
    get_destination_by_name,
    delete_from_previous
)
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel

router = APIRouter(prefix="/travel", tags=["travel"])
model = SentenceTransformer('all-MiniLM-L6-v2')

class SearchQuery(BaseModel):
    query: str
    top_k: int = 3

class JournalUpdate(BaseModel):
    name: str
    journal: str

def infer_temperature_range_from_query(query: str):
    query = query.lower()
    min_temp, max_temp = None, None
    if any(word in query for word in ['hot', 'warm', 'tropical']):
        min_temp = 20
    if any(word in query for word in ['cold', 'chilly', 'freezing', 'snow', 'arctic']):
        max_temp = 10
    if 'mild' in query or 'temperate' in query:
        min_temp, max_temp = 10, 20
    if 'cool' in query:
        max_temp = 15
    return min_temp, max_temp

@router.post("/ai-search")
async def search_route(search: SearchQuery, db: Session = Depends(get_db)):
    query_embedding = model.encode(search.query)
    min_temp, max_temp = infer_temperature_range_from_query(search.query)
    results = get_ai_destinations(db, query_embedding, search.top_k, min_temp, max_temp)
    return results

@router.get("/visited")
async def get_destinations(db: Session = Depends(get_db)):
    destinations = get_all_destinations(db)
    if not destinations:
        raise HTTPException(status_code=404, detail="No destination found")
    return destinations

@router.get("/previous")
async def get_previous_destinations_from_mongo():
    destinations = get_all_destinations_from_db()
    if not destinations:
        raise HTTPException(status_code=404, detail="No previous destinations found")
    return destinations

@router.delete("/previous/{destination_name}")
async def delete_previous_destination(destination_name: str):
    delete_from_previous(destination_name)
    return {"message": "Deleted previous destination successfully"}

@router.put("/update_journal")
async def update_journal(updated_journal: JournalUpdate):
    if not updated_journal.name or not updated_journal.journal:
        raise HTTPException(status_code=400, detail="Name and journal content are required")
    UpdateJournal(updated_journal.name, updated_journal.journal)
    return {"message": "Journal updated successfully"}

@router.get("/wishlist")
async def get_wishlist_route():
    destinations = crud_get_wishlist()
    if not destinations:
        raise HTTPException(status_code=404, detail="No destination found")
    return destinations

@router.post("/wishlist/{destination}")
def add_destination_to_wishlist_route(destination: str):
    if not destination:
        raise HTTPException(status_code=400, detail="Destination name is required")
    crud_add_to_wishlist(destination)
    return {"message": "Destination added to wishlist successfully"}

@router.delete("/wishlist/{destination}")
def delete_destination_from_wishlist(destination: str):
    if not destination:
        raise HTTPException(status_code=400, detail="Destination name is required")
    delete_from_wishlist(destination)
    return {"message": "Destination removed from wishlist successfully"}

@router.get("/local-journal/{name}")
async def local_journal_route(name: str):
    entries = local_journal_fetch(name)
    if not entries:
        raise HTTPException(status_code=404, detail="No journal entries found for this destination")
    return entries

@router.get("/search-by-name/{destination_name}")
async def search_destination_by_name(destination_name: str, db: Session = Depends(get_db)):
    destination = get_destination_by_name(db, destination_name)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return {
        "id": destination.id,
        "name": destination.name,
        "details": destination.details,
        "country": destination.country,
        "average_temperature": destination.average_temperature,
        "average_weather": destination.average_weather,
    }

@router.get("/{destination_id}")
async def info(destination_id: int, db: Session = Depends(get_db)):
    destination = get_info_by_id(db, destination_id)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return {
        "name": destination.name,
        "details": destination.details,
        "country": destination.country,
        "average_temperature": destination.average_temperature,
        "average_weather": destination.average_weather,
        "id": destination.id,
    }

@router.post("/add")
def add_destination_to_mongodb(destination: dict):
    name = destination.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Destination name is required")
    add_destination_to_mongodb2(name, "")
    return {"message": "Destination added successfully"}