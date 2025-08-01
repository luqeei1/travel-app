from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Destination  # your ORM models
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()



# Your connection strings (replace with your actual URIs or load from env)
LOCAL_DATABASE_URL = os.getenv("LOCAL_DATABASE_URL")
SUPABASE_DATABASE_URL = os.getenv("SUPABASE_DATABASE_URL")

# Create engines and sessions for local and supabase DBs
local_engine = create_engine(LOCAL_DATABASE_URL)
LocalSession = sessionmaker(bind=local_engine)
local_session = LocalSession()

supabase_engine = create_engine(SUPABASE_DATABASE_URL)
SupabaseSession = sessionmaker(bind=supabase_engine)
supabase_session = SupabaseSession()

# Create tables in Supabase if they don't exist
Base.metadata.create_all(bind=supabase_engine)

try:
    # Query all destinations from local DB
    local_destinations = local_session.query(Destination).all()
    print(f"Found {len(local_destinations)} destinations in local DB.")

    # Insert each destination into Supabase DB
    for dest in local_destinations:
        new_dest = Destination(
            name=dest.name,
            details=dest.details,
            country=dest.country,
            region=dest.region,
            average_price=dest.average_price,
            average_temperature=dest.average_temperature,
            average_weather=dest.average_weather,
            similarity_rating=dest.similarity_rating,
            embedding=dest.embedding,
        )
        supabase_session.add(new_dest)

    supabase_session.commit()
    print(f"Copied {len(local_destinations)} destinations to Supabase.")

except Exception as e:
    supabase_session.rollback()
    print(f"Error copying destinations: {e}")

finally:
    local_session.close()
    supabase_session.close()
