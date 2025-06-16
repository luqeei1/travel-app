from functools import lru_cache
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from routers import travel
import config
from fastapi import Depends, HTTPException
from dotenv import load_dotenv
import os 

load_dotenv()

app = FastAPI(title="Travel Recommendation API")    


app.include_router(travel.router) 


origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@lru_cache()
def get_settings() -> config.Settings:
    return config.Settings()

@app.get("/")
def read_root(settings: config.Settings = Depends(get_settings)):
    return {"message": "Welcome to the Travel Recommendation API!"}

@app.get("/api")
async def geocode(address: str): 
    url = f"https://api.geoapify.com/v1/geocode/search?text={address}&apiKey={os.environ["API_KEY"]}"



@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)