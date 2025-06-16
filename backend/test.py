from sentence_transformers import SentenceTransformer
import numpy as np


model = SentenceTransformer(
    'all-MiniLM-L6-v2',
    cache_folder='./ai_models' 
)


embeddings = model.encode(["tropical beach", "mountain hike"])
similarity = np.dot(embeddings[0], embeddings[1]) / (np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1]))
print(f"Similarity: {similarity:.2f}") 