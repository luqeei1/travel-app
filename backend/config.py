from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_HOST: str
    DATABASE_NAME: str
    DATABASE_PORT: str
    
    class Config:
        env_file = ".env"
        # Remove or comment out if you want strict validation
        # extra = "forbid"  # This was causing your error