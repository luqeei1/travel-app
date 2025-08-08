from sqlalchemy import Column, Integer, String, Float, LargeBinary
from database import Base

class Destination(Base):
    __tablename__ = 'destinations'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    details = Column(String)
    country = Column(String)
    region = Column(String)
    average_temperature = Column(Integer)
    average_weather = Column(String)
    embedding = Column(LargeBinary)