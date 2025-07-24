# 🌍 Travel Recommendation App

A full-stack AI-powered travel recommendation application that helps users discover, save, and journal about travel destinations. Built with **React (TypeScript)**, **FastAPI**, **PostgreSQL**, and **MongoDB**.

---

## ✨ Features

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

## 🚀 Getting Started

### ⚙️ Backend Setup

```bash
cd backend
venv\Scripts\Activate
pip install ... # I will update this soon
uvicorn main:app --reload
```

### 🚀 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

