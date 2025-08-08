from pydantic import BaseModel, Field
from typing import Optional

class DestinationBase(BaseModel):
    average_temperature: int = Field(..., description="Temperature in Celsius")
    average_weather: str = Field(..., max_length=50)
    name: str = Field(..., max_length=100)
    details: str = Field(..., description="Used for AI semantic search")
    country: str = Field(..., max_length=50)
    region: str = Field(..., max_length=50)

class DestinationCreate(DestinationBase):
    pass

class Destination(DestinationBase):
 
    id: int = Field(..., description="Database ID")

    ai_similarity: Optional[float] = Field(
        None,
        ge=0,
        le=1,
        description="AI-generated match score (0-1)."
    )

class DestinationDetail(Destination):
    class Config:
        from_attributes = True


class DestinationSearchResult(Destination):
    ai_similarity: float = Field(..., ge=0, le=1, description="Match confidence")