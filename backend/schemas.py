from pydantic import BaseModel, Field
from typing import Optional

class DestinationBase(BaseModel):
    average_price: int = Field(..., ge=0, description="Daily cost in USD")
    average_temperature: int = Field(..., description="Temperature in Celsius")
    average_weather: str = Field(..., max_length=50)
    name: str = Field(..., max_length=100)
    details: str = Field(..., description="Used for AI semantic search")
    country: str = Field(..., max_length=50)
    region: str = Field(..., max_length=50)
    similarity_rating: Optional[int] = Field(
        None, ge=0, le=100, 
        description="Legacy rating (0-100). Not used for AI search."
    )

class DestinationCreate(DestinationBase):
    pass

class Destination(DestinationBase):
 
    id: int = Field(..., description="Database ID")

    ai_similarity_score: Optional[float] = Field(
        None,
        ge=0,
        le=1,
        description="AI-generated match score (0-1). Only appears in search results."
    )

class DestinationDetail(Destination):
    class Config:
        from_attributes = True


class DestinationSearchResult(Destination):
    ai_similarity_score: float = Field(..., ge=0, le=1, description="Match confidence")