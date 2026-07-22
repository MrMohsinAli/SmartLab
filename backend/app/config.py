import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # Google API Key (for OCR / Gemini)
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    
    # OpenAI API
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

settings = Settings()
