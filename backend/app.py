import os
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from src.components.preprocess import hf_embeds
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI, HarmBlockThreshold, HarmCategory
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate
from src.utils.prompts import *

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

PINECONE_API_KEY = os.getenv('PINECONE_DB_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
SYSTEM_PROMPT = os.getenv('SYSTEM_PROMPT')

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
os.environ["SYSTEM_PROMPT"] = SYSTEM_PROMPT

embeds =hf_embeds()

index_name = "niramaya"
doc_search = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeds
)

retriever = doc_search.as_retriever(search_type="similarity", search_kwargs={"k":5})
llm = ChatGoogleGenerativeAI(
    model = "gemini-2.0-flash", 
    google_api_key = GEMINI_API_KEY,
    temperature=0.2,
    max_tokens=1000,   
    safety_settings={
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE
    },
    )

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}")
    ]
)

qa_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, qa_chain)

@app.route("/")
def index():
    return render_template("chat.html")

@app.route("/get", methods = ["GET", "POST"])
def medic_chat():
    try:
        data = request.json
        message = data.get("msg", "")
        language = data.get("language", "en")
        if not message:
            return jsonify({"error": "Message is required"}), 400
        input = message
        print(input, "\nLanguage:", language)
        response = rag_chain.invoke({"input": input, "language": language})
        print("Response :", response["answer"])
        return jsonify({"response": response["answer"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)