import os
from google import genai
from PIL import Image
from app.config import settings

def extract_text_from_image(file_path: str) -> str:
    if not settings.GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY is not configured in settings.")
        
    client = genai.Client(api_key=settings.GOOGLE_API_KEY)
    file_ext = os.path.splitext(file_path)[1].lower()
    if file_ext == ".pdf":
        uploaded_file = client.files.upload(file=file_path)
        response = client.models.generate_content(
            model='gemini-3.5-flash-lite',
            contents=[uploaded_file, "Transcribe all text from this medical report PDF file. Return only the raw transcribed text. Do not add markdown formatting or extra commentary."]
        )
        client.files.delete(name=uploaded_file.name)
        return response.text
    else:
        image = Image.open(file_path)
        response = client.models.generate_content(
            model='gemini-3.5-flash-lite',
            contents=[image, "Transcribe the handwritten or printed text from this medical document image. Return only the raw transcribed text. Do not add markdown formatting or extra commentary."]
        )
        return response.text
