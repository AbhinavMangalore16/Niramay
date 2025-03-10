# Niramaya Assistant - Backend

## 📌 Overview
**Niramaya** is a AI vernacular diagnostic RAG-based chatbot that retrieves and generates responses based on clinical knowledge from evidence and documents. It uses **Pinecone as a Vector Database** for efficient similarity search.

## 🔥 Features
✅ **Interactive Chat Interface**  
✅ **Real-time Medical Query Resolution**  
✅ **Pinecone Vector Search for Faster Information Retrieval**  
✅ **Multilingual Support**  
✅ **Optimized UX with Smooth Auto-scroll**  

## 🏗️ Architecture

This frontend interacts with the backend, which follows an **RAG (Retrieval-Augmented Generation) pipeline**:

### **📕 Indexing Pipeline**
1. PDF documents (Oxford Handbook of Clinical Medicine) are split into **text chunks**.
2. Each chunk is **embedded** using an embedding model.
3. These embeddings are stored in a **Pinecone Vector Database**.

### **🔍 Retrieval & Generation**
1. User queries are **converted to embeddings**.
2. **Top-k similar matches** are retrieved from Pinecone.
3. A **LLM (Large Language Model)** generates a response using these matches.

## 🖥️ Tech Stack
- **Frontend**: React (Next.js), Tailwind CSS, TypeScript
- **Backend**: Python (FastAPI), LangChain, Pinecone
- **Embedding Model**: `text-embedding-ada-002`
- **LLM**: GPT-4 / OpenAI API