import os
from src.components.preprocess import pdf_loader, text_chunking, hf_embeds
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from langchain_pinecone import PineconeVectorStore

from dotenv import load_dotenv
load_dotenv()

PINECONE_API_KEY = os.environ.get('PINECONE_DB_KEY')
os.environ['PINECONE_API_KEY'] = PINECONE_API_KEY

extracted = pdf_loader(pdf='data/raw/')
chunks = text_chunking(extracted=extracted)
embeddings = hf_embeds()

pc = Pinecone(api_key=PINECONE_API_KEY)
index_name = "niramaya"
pc.create_index(
    name = index_name,
    dimension = 768, 
    metric = 'cosine', 
    spec=ServerlessSpec(
        cloud='aws', 
        region = "us-east-1"
    )
)

doc_search = PineconeVectorStore.from_documents(
    documents = chunks, 
    index_name = index_name, 
    embedding= embeddings
)
