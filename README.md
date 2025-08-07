# 🌍 Travel Recommendation App

A full-stack AI-powered travel recommendation application that helps users discover, save, and journal about travel destinations. Built with **React (TypeScript)**, **FastAPI**, **PostgreSQL**, and **MongoDB**. Please note that due to storage issues, deployement was not possible. The semantic analysis in this project uses the 'all-MiniLM-L6-v2' model, chosen after thorough comparison with the 'paraphrase-MiniLM-L3-v2' model. Testing demonstrated that 'all-MiniLM-L6-v2' consistently provides more accurate and relevant results. 

---

## ✨ Features

Note: Since no existing free travel APIs matched my vision for this travel app, I decided to create my own data, tailoring it to fit a mid/high mid holiday lifestyle excluding flights. Due to this fact, at times the average price may be slightly off but should have a match rate of ~80%. 

### 🔍 **AI-Powered Search**
- Semantic search using Sentence Transformers for intelligent destination matching  
- Smart query understanding with natural language processing  

### 🗺️ **Interactive Map**
- Real-time location search with geocoding  
- Save visited locations to personal collection  
- Browse previous destinations  


### 💾 **Personal Collections**
- **Wishlist**: Save interesting destinations for future travel  
- **Visited Locations**: Track places you've been  
- **Travel Journal**: Document experiences and memories  

### 📖 **Travel Journal**
- Rich text editor for documenting travel experiences  
- Persistent storage with MongoDB  
- Beautiful amber-themed UI for a warm, nostalgic feel   

### 🎯 **Destination Details**
- Comprehensive destination information from database  
- Average prices, weather, and temperature data  
- Clean, database-focused display without unnecessary clutter  
- Direct navigation from search results and wishlist  


---

## 🛠️ Tech Stack

### 🧑‍💻 **Frontend**
- **React** with TypeScript for type-safe development  
- **Tailwind CSS** for responsive, utility-first styling  
- **React Router** for client-side navigation  
- **Framer Motion** for smooth animations  

### ⚙️ **Backend**
- **FastAPI** for high-performance Python API  
- **SQLAlchemy** for PostgreSQL database ORM  
- **Sentence Transformers** for AI-powered semantic search  
- **Pydantic** for data validation and serialization  

### 🗃️ **Databases**
- **PostgreSQL** for structured destination data with vector embeddings  
- **MongoDB** for flexible user-generated content (wishlist, journal entries)  

### 🌐 **External APIs**
- **Nominatim OpenStreetMap** for geocoding and location search  
---

## 📷 Demos

### 🔍 Search Functionality  
[![Search](https://img.youtube.com/vi/ZaKiqpYi-Fg/0.jpg)](https://www.youtube.com/watch?v=ZaKiqpYi-Fg)

### 🌍 Map and Journal  
[![Map](https://img.youtube.com/vi/RQkjUzeZE-8/0.jpg)](https://www.youtube.com/watch?v=RQkjUzeZE-8)

### ⭐ Wishlist  
[![Wishlist](https://img.youtube.com/vi/JW839q65w9s/0.jpg)](https://www.youtube.com/watch?v=JW839q65w9s)


## 🚀 Getting Started

## 🗄️ PostgreSQL Setup & Environment Configuration

This project uses a PostgreSQL database to store destination metadata and sentence embeddings for semantic search.

---

### 🔧 Step 1: Install PostgreSQL

Make sure PostgreSQL is installed and running locally.  
Download from: https://www.postgresql.org/download/

---

### 🛠️ Step 2: Create the Database

1. Ensure you have:  
   - PostgreSQL running.  
   - A database
   - Downloaded travel_clean.sql
     
2. Run :
   ```bash
   
   psql -U your_user -d your_database_name -f travel_clean.sql

   ```

You should see 210 rows in the table. 

I have added a CSV file for those interested in looking at the data used within the app. 


### ⚙️ .env

Please set up the required settings in the .env file before then creating a .env file with the required information. 

---

### ✅ Running

On 2 different terminals, please run the following commands : 

### ⚙️ Backend Setup


```bash
cd backend
python -m venv venv
venv\Scripts\Activate
uvicorn main:app --reload
```

### 🚀 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

