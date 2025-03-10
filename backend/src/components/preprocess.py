from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter 
from langchain.embeddings import HuggingFaceEmbeddings

def pdf_loader(pdf):
    loader = DirectoryLoader(pdf, glob='*.pdf', loader_cls=PyPDFLoader)
    return loader.load()

def text_chunking(extracted):
    chunker = RecursiveCharacterTextSplitter(chunk_size = 500, chunk_overlap = 20)
    text_chunks = chunker.split_documents(extracted)
    return text_chunks

def hf_embeds():
    embeddings = HuggingFaceEmbeddings(model_name = 'sentence-transformers/all-mpnet-base-v2')
    return embeddings