import os
from dotenv import load_dotenv

load_dotenv()
SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT")
system_prompt = (
    str(SYSTEM_PROMPT)+ "CONTEXT : {context}"+"LANGUAGE: {language}"
)